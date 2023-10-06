
namespace SupplyFlow.Common.Entities;

public class Fornecedor : IEntity
{
    public Guid Id { get; set; }
    public string? NomeFornecedor { get; set; }
}