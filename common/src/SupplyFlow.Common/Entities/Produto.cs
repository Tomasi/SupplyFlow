
using Microsoft.VisualBasic;

namespace SupplyFlow.Common.Entities;

public class Produto : IEntity
{
    public Guid Id { get; set; }
    public string? CodigoProduto { get; set; }
    public string? Descricao { get; set; }
    public decimal Custo { get; set; }
    public EnumSituacaoProduto Situacao { get; set; }
    public DateAndTime? Validade { get; set; }
}
public enum EnumSituacaoProduto
{
    Ativo = 1,
    Cancelado = 2
}