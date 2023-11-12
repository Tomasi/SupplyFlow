namespace SupplyFlow.Common.Entities;

public class Estoque : IEntity
{
    public Guid Id { get; set; }
    public Produto Produto { get; set; }
    public int Quantidade { get; set; }
}