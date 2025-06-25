package Estoque.Estoque.controller;

import Estoque.Estoque.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/vendas-mes/{ano}")
    public ResponseEntity<byte[]> gerarRelatorioVendasPorMes(@PathVariable int ano) {
        try {
            byte[] pdf = relatorioService.gerarRelatorioVendasPorMes(ano);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "relatorio-vendas-mes-" + ano + ".pdf");
            
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/vendas-cliente/{clienteId}")
    public ResponseEntity<byte[]> gerarRelatorioVendasPorCliente(@PathVariable Long clienteId) {
        try {
            byte[] pdf = relatorioService.gerarRelatorioVendasPorCliente(clienteId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "relatorio-vendas-cliente-" + clienteId + ".pdf");
            
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/estoque")
    public ResponseEntity<byte[]> gerarRelatorioEstoque() {
        try {
            byte[] pdf = relatorioService.gerarRelatorioEstoque();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "relatorio-estoque-" + LocalDate.now() + ".pdf");
            
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
