namespace SupplyFlow.Service.Estoque;

public static class Extensions
{
    public static EstoqueDto AsDto(this Common.Entities.Estoque estoque)
    {
        return new EstoqueDto(
            Id: estoque.Id,
            Produto: estoque.Produto,
            Quantidade: estoque.Quantidade
        );
    }
}
