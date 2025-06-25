package Estoque.Estoque.dto;

import java.time.LocalDate;

public class RelatorioVendasMesDTO {
    private int mes;
    private int ano;
    private long totalVendas;
    private double valorTotal;
    private LocalDate dataInicio;
    private LocalDate dataFim;

    public RelatorioVendasMesDTO(int mes, int ano, long totalVendas, double valorTotal) {
        this.mes = mes;
        this.ano = ano;
        this.totalVendas = totalVendas;
        this.valorTotal = valorTotal;
        this.dataInicio = LocalDate.of(ano, mes, 1);
        this.dataFim = dataInicio.withDayOfMonth(dataInicio.lengthOfMonth());
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

    public long getTotalVendas() {
        return totalVendas;
    }

    public void setTotalVendas(long totalVendas) {
        this.totalVendas = totalVendas;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }
}
