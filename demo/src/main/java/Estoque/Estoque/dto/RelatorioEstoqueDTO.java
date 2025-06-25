package Estoque.Estoque.dto;

public class RelatorioEstoqueDTO {
    private Long produtoId;
    private String nomeProduto;
    private int quantidadeEstoque;
    private double precoVenda;
    private double precoCompra; // Você pode adicionar este campo ao modelo Produto se necessário
    private double valorTotalEstoque;
    private String status; // "Baixo", "Normal", "Alto"

    public RelatorioEstoqueDTO(Long produtoId, String nomeProduto, int quantidadeEstoque, double precoVenda, double precoCompra) {
        this.produtoId = produtoId;
        this.nomeProduto = nomeProduto;
        this.quantidadeEstoque = quantidadeEstoque;
        this.precoVenda = precoVenda;
        this.precoCompra = precoCompra;
        this.valorTotalEstoque = quantidadeEstoque * precoVenda;
        this.status = determinarStatus(quantidadeEstoque);
    }

    private String determinarStatus(int quantidade) {
        if (quantidade <= 5) return "Baixo";
        if (quantidade <= 20) return "Normal";
        return "Alto";
    }

    // Getters e Setters
    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public int getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(int quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public double getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(double precoVenda) {
        this.precoVenda = precoVenda;
    }

    public double getPrecoCompra() {
        return precoCompra;
    }

    public void setPrecoCompra(double precoCompra) {
        this.precoCompra = precoCompra;
    }

    public double getValorTotalEstoque() {
        return valorTotalEstoque;
    }

    public void setValorTotalEstoque(double valorTotalEstoque) {
        this.valorTotalEstoque = valorTotalEstoque;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
