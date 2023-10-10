using SupplyFlow.Service.Dtos;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.PedidosCompra;

public static class Extensions
{
    public static PedidoDto AsDto(this PedidoCompra pedido)
    {
        return new PedidoDto(
        pedido.Id,
        pedido.NumeroPedido,
        pedido.Itens?.Select(item => item.AsDto()).ToList(),
        pedido.DataPedido,
        pedido.Fornecedor?.NomeFornecedor,
        pedido.SituacaoPedido,
        pedido.Observacao,
        pedido.DataAprovacao,
        pedido.DataEntrega,
        pedido.PrecoTotal);
    }

    public static ItemPedidoDto AsDto(this ItemPedido itemPedido)
    {
        return new ItemPedidoDto(
        itemPedido.Id,
        itemPedido.Produto?.CodigoProduto,
        itemPedido.Produto?.Descricao,
        itemPedido.Quantidade,
        itemPedido.PrecoUnitario,
        itemPedido.PrecoTotal);
    }

    public static ItemPedido AsItemPedido(this CreateItemPedidoDto itemPedido)
    {
        return new ItemPedido()
        {
            Id = Guid.NewGuid(),
            Produto = new Produto() { Id = itemPedido.Id },
            Quantidade = itemPedido.Quantidade
        };
    }
}