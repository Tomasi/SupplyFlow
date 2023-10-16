namespace SupplyFlow.Common.Entities;

public class Produto : IEntity
{
    public Guid Id { get; set; }
    public string? CodigoProduto { get; set; }
    public string? Descricao { get; set; }
    public decimal PrecoUnitario { get; set; }
    public Fornecedor? Fornecedor { get; set; }
    public EnumSituacaoProduto Situacao { get; set; }
    public DateOnly? Validade { get; set; }
}
public enum EnumSituacaoProduto
{
    Ativo = 1,
    Cancelado = 2
}