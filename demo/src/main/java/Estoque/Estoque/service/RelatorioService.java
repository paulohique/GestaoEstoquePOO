package Estoque.Estoque.service;

import Estoque.Estoque.dto.RelatorioEstoqueDTO;
import Estoque.Estoque.dto.RelatorioVendasClienteDTO;
import Estoque.Estoque.dto.RelatorioVendasMesDTO;
import Estoque.Estoque.model.Aluguel;
import Estoque.Estoque.model.Cliente;
import Estoque.Estoque.model.Produto;
import Estoque.Estoque.repository.AluguelRepository;
import Estoque.Estoque.repository.ClienteRepository;
import Estoque.Estoque.repository.ProdutoRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    @Autowired
    private AluguelRepository aluguelRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public byte[] gerarRelatorioVendasPorMes(int ano) {
        try {
            List<Aluguel> alugueis = aluguelRepository.findAll();
            
            Map<Integer, RelatorioVendasMesDTO> vendasPorMes = new HashMap<>();
            
            for (Aluguel aluguel : alugueis) {
                if (aluguel.getDataAluguel().getYear() == ano) {
                    int mes = aluguel.getDataAluguel().getMonthValue();
                    
                    vendasPorMes.merge(mes, 
                        new RelatorioVendasMesDTO(mes, ano, 1, aluguel.getValorTotal()),
                        (existing, replacement) -> {
                            existing.setTotalVendas(existing.getTotalVendas() + 1);
                            existing.setValorTotal(existing.getValorTotal() + replacement.getValorTotal());
                            return existing;
                        });
                }
            }

            return gerarPDFVendasPorMes(new ArrayList<>(vendasPorMes.values()), ano);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar relatório de vendas por mês", e);
        }
    }

    public byte[] gerarRelatorioVendasPorCliente(Long clienteId) {
        try {
            Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            List<Aluguel> alugueis = aluguelRepository.findAll().stream()
                .filter(a -> a.getCliente() != null && a.getCliente().getId().equals(clienteId))
                .collect(Collectors.toList());

            RelatorioVendasClienteDTO relatorio = new RelatorioVendasClienteDTO(
                cliente.getId(), cliente.getNome(), cliente.getCpf());

            Map<String, RelatorioVendasClienteDTO.VendaMensalDTO> vendasMensais = new HashMap<>();
            
            for (Aluguel aluguel : alugueis) {
                String chave = aluguel.getDataAluguel().getYear() + "-" + aluguel.getDataAluguel().getMonthValue();
                
                vendasMensais.merge(chave,
                    new RelatorioVendasClienteDTO.VendaMensalDTO(
                        aluguel.getDataAluguel().getMonthValue(),
                        aluguel.getDataAluguel().getYear(),
                        1,
                        aluguel.getValorTotal()),
                    (existing, replacement) -> {
                        existing.setQuantidadeVendas(existing.getQuantidadeVendas() + 1);
                        existing.setValorTotal(existing.getValorTotal() + replacement.getValorTotal());
                        return existing;
                    });
            }

            relatorio.setVendasMensais(new ArrayList<>(vendasMensais.values()));
            relatorio.setTotalVendasGeral(alugueis.size());
            relatorio.setValorTotalGeral(alugueis.stream().mapToDouble(Aluguel::getValorTotal).sum());

            return gerarPDFVendasPorCliente(relatorio);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar relatório de vendas por cliente", e);
        }
    }

    public byte[] gerarRelatorioEstoque() {
        try {
            List<Produto> produtos = produtoRepository.findAll();
            
            List<RelatorioEstoqueDTO> relatorioEstoque = produtos.stream()
                .map(p -> new RelatorioEstoqueDTO(
                    p.getId(),
                    p.getNome(),
                    p.getEstoque(),
                    p.getPreco(),
                    p.getPreco() * 0.7 // Assumindo preço de compra como 70% do preço de venda
                ))
                .collect(Collectors.toList());

            return gerarPDFEstoque(relatorioEstoque);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar relatório de estoque", e);
        }
    }

    private byte[] gerarPDFVendasPorMes(List<RelatorioVendasMesDTO> dados, int ano) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Título
        document.add(new Paragraph("RELATÓRIO DE VENDAS POR MÊS - " + ano)
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(16)
            .setBold());

        document.add(new Paragraph("Gerado em: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
            .setTextAlignment(TextAlignment.RIGHT)
            .setFontSize(10));

        // Tabela
        Table table = new Table(4);
        table.addHeaderCell(new Cell().add(new Paragraph("Mês").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Quantidade de Vendas").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Valor Total").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Ticket Médio").setBold()));

        double totalGeral = 0;
        long vendasGeral = 0;

        for (RelatorioVendasMesDTO dado : dados) {
            table.addCell(String.format("%02d/%d", dado.getMes(), dado.getAno()));
            table.addCell(String.valueOf(dado.getTotalVendas()));
            table.addCell(String.format("R$ %.2f", dado.getValorTotal()));
            table.addCell(String.format("R$ %.2f", dado.getValorTotal() / dado.getTotalVendas()));
            
            totalGeral += dado.getValorTotal();
            vendasGeral += dado.getTotalVendas();
        }

        // Linha de total
        table.addCell(new Cell().add(new Paragraph("TOTAL").setBold()));
        table.addCell(new Cell().add(new Paragraph(String.valueOf(vendasGeral)).setBold()));
        table.addCell(new Cell().add(new Paragraph(String.format("R$ %.2f", totalGeral)).setBold()));
        table.addCell(new Cell().add(new Paragraph(String.format("R$ %.2f", totalGeral / vendasGeral)).setBold()));

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    private byte[] gerarPDFVendasPorCliente(RelatorioVendasClienteDTO relatorio) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Título
        document.add(new Paragraph("RELATÓRIO DE VENDAS POR CLIENTE")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(16)
            .setBold());

        document.add(new Paragraph("Cliente: " + relatorio.getNomeCliente())
            .setFontSize(12)
            .setBold());
        
        document.add(new Paragraph("CPF: " + relatorio.getCpfCliente())
            .setFontSize(10));

        document.add(new Paragraph("Gerado em: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
            .setTextAlignment(TextAlignment.RIGHT)
            .setFontSize(10));

        // Tabela
        Table table = new Table(4);
        table.addHeaderCell(new Cell().add(new Paragraph("Mês/Ano").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Quantidade").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Valor Total").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Ticket Médio").setBold()));

        for (RelatorioVendasClienteDTO.VendaMensalDTO venda : relatorio.getVendasMensais()) {
            table.addCell(String.format("%02d/%d", venda.getMes(), venda.getAno()));
            table.addCell(String.valueOf(venda.getQuantidadeVendas()));
            table.addCell(String.format("R$ %.2f", venda.getValorTotal()));
            table.addCell(String.format("R$ %.2f", venda.getValorTotal() / venda.getQuantidadeVendas()));
        }

        // Linha de total
        table.addCell(new Cell().add(new Paragraph("TOTAL GERAL").setBold()));
        table.addCell(new Cell().add(new Paragraph(String.valueOf(relatorio.getTotalVendasGeral())).setBold()));
        table.addCell(new Cell().add(new Paragraph(String.format("R$ %.2f", relatorio.getValorTotalGeral())).setBold()));
        table.addCell(new Cell().add(new Paragraph(String.format("R$ %.2f", relatorio.getValorTotalGeral() / relatorio.getTotalVendasGeral())).setBold()));

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    private byte[] gerarPDFEstoque(List<RelatorioEstoqueDTO> dados) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Título
        document.add(new Paragraph("RELATÓRIO DE GESTÃO DE ESTOQUE")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(16)
            .setBold());

        document.add(new Paragraph("Gerado em: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
            .setTextAlignment(TextAlignment.RIGHT)
            .setFontSize(10));

        // Tabela
        Table table = new Table(6);
        table.addHeaderCell(new Cell().add(new Paragraph("Produto").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Estoque").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Preço Compra").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Preço Venda").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Valor Total").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Status").setBold()));

        double valorTotalGeral = 0;

        for (RelatorioEstoqueDTO dado : dados) {
            table.addCell(dado.getNomeProduto());
            table.addCell(String.valueOf(dado.getQuantidadeEstoque()));
            table.addCell(String.format("R$ %.2f", dado.getPrecoCompra()));
            table.addCell(String.format("R$ %.2f", dado.getPrecoVenda()));
            table.addCell(String.format("R$ %.2f", dado.getValorTotalEstoque()));
            table.addCell(dado.getStatus());
            
            valorTotalGeral += dado.getValorTotalEstoque();
        }

        // Linha de total
        table.addCell(new Cell(1, 4).add(new Paragraph("VALOR TOTAL DO ESTOQUE").setBold()));
        table.addCell(new Cell().add(new Paragraph(String.format("R$ %.2f", valorTotalGeral)).setBold()));
        table.addCell(new Cell().add(new Paragraph("").setBold()));

        document.add(table);
        document.close();

        return baos.toByteArray();
    }
}
