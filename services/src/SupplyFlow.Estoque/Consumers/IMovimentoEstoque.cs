using MongoDB.Bson;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Estoque.Consumers;

public interface IMovimentoEstoque
{
    void IncrementaEstoque(Movimento movimento, Common.Entities.Estoque estoque);
}

public class GeraMovimentacaoEstoque : IMovimentoEstoque
{
    public void IncrementaEstoque(Movimento movimento, Common.Entities.Estoque estoque)
    {
        if (movimento.TipoMovimento == TipoMovimento.Entrada)
        {
            estoque.Quantidade += movimento.Quantidade;
        }
        else
        {
            estoque.Quantidade -= movimento.Quantidade;
        }
    }
}
