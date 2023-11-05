namespace SupplyFlow.Common.Entities;

public class Produto : IEntity
{
    public Guid Id { get; set; }
    public string? CodigoProduto { get; set; }
    public string? Descricao { get; set; }
    public decimal PrecoUnitario { get; set; }
    public Fornecedor? Fornecedor { get; set; }
    public SituacaoProduto Situacao { get; set; }
    public DateOnly? Validade { get; set; }
}
public enum SituacaoProduto
{
    Ativo = 1,
    Cancelado = 2
}