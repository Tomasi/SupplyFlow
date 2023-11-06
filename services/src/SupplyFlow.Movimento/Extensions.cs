using SupplyFlow.Service.Dtos;

namespace SupplyFlow.Movimento;

public static class Extensions
{
    public static Common.Entities.Movimento AsMovimento(this CreateMovimentoDto movimentoDto)
    {
        return new Common.Entities.Movimento
        {
            Id = Guid.NewGuid(),
            Quantidade = movimentoDto.Quantidade,
            DataMovimento = DateTime.Now,
            TipoMovimento = movimentoDto.TipoMovimento
        };
    }
}