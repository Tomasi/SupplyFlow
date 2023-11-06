namespace SupplyFlow.Common.Entities;

public class Movimento : IEntity
{
    public Guid Id { get; set; }
    public Produto Produto { get; set; }
    public decimal Quantidade { get; set; }
    public TipoMovimento TipoMovimento { get; set; }
    public DateTime DataMovimento { get; set; }
}

public enum TipoMovimento
{
    Entrada = 1,
    Saida = 2
}