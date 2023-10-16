
namespace SupplyFlow.Common.Entities;

public class Fornecedor : IEntity
{
    public Guid Id { get; set; }
    public string? NomeFornecedor { get; set; }
    public EnumSituacaoFornecedor Situacao { get; set; }
    public int PrazoEntrega { get; set; }
}

public enum EnumSituacaoFornecedor
{
    Ativo = 1,
    Cancelado = 2
}