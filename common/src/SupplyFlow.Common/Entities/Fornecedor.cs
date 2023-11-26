namespace SupplyFlow.Common.Entities;

public class Fornecedor : IEntity
{
    public Guid Id { get; set; }
    public string? NomeFornecedor { get; set; }
    public SituacaoFornecedor Situacao { get; set; }
    public int PrazoEntrega { get; set; }
    public string? Email { get; set; }
}

public enum SituacaoFornecedor
{
    Ativo = 1,
    Cancelado = 2
}