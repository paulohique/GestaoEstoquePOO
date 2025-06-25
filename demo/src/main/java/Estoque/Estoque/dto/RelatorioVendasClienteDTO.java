package Estoque.Estoque.dto;

import java.util.List;

public class RelatorioVendasClienteDTO {
    private Long clienteId;
    private String nomeCliente;
    private String cpfCliente;
    private List<VendaMensalDTO> vendasMensais;
    private double valorTotalGeral;
    private long totalVendasGeral;

    public RelatorioVendasClienteDTO(Long clienteId, String nomeCliente, String cpfCliente) {
        this.clienteId = clienteId;
        this.nomeCliente = nomeCliente;
        this.cpfCliente = cpfCliente;
    }

    // Getters e Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getCpfCliente() {
        return cpfCliente;
    }

    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }

    public List<VendaMensalDTO> getVendasMensais() {
        return vendasMensais;
    }

    public void setVendasMensais(List<VendaMensalDTO> vendasMensais) {
        this.vendasMensais = vendasMensais;
    }

    public double getValorTotalGeral() {
        return valorTotalGeral;
    }

    public void setValorTotalGeral(double valorTotalGeral) {
        this.valorTotalGeral = valorTotalGeral;
    }

    public long getTotalVendasGeral() {
        return totalVendasGeral;
    }

    public void setTotalVendasGeral(long totalVendasGeral) {
        this.totalVendasGeral = totalVendasGeral;
    }

    public static class VendaMensalDTO {
        private int mes;
        private int ano;
        private long quantidadeVendas;
        private double valorTotal;

        public VendaMensalDTO(int mes, int ano, long quantidadeVendas, double valorTotal) {
            this.mes = mes;
            this.ano = ano;
            this.quantidadeVendas = quantidadeVendas;
            this.valorTotal = valorTotal;
        }

        // Getters e Setters
        public int getMes() {
            return mes;
        }

        public void setMes(int mes) {
            this.mes = mes;
        }

        public int getAno() {
            return ano;
        }

        public void setAno(int ano) {
            this.ano = ano;
        }

        public long getQuantidadeVendas() {
            return quantidadeVendas;
        }

        public void setQuantidadeVendas(long quantidadeVendas) {
            this.quantidadeVendas = quantidadeVendas;
        }

        public double getValorTotal() {
            return valorTotal;
        }

        public void setValorTotal(double valorTotal) {
            this.valorTotal = valorTotal;
        }
    }
}
