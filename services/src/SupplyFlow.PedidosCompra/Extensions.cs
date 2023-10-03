using SupplyFlow.Service.Dtos;
using SupplyFlow.Service.Entities;

namespace SupplyFlow.PedidosCompra;

public static class Extensios
{
    public static PedidoDto AsDto(this PedidoCompra pedido)
    {
        return new PedidoDto(pedido.Id, pedido.NumeroPedido, pedido.Itens?.Select(item => item.AsDto()).ToList(), pedido.DataPedido, pedido.Fornecedor, pedido.SituacaoPedido, pedido.Observacao, pedido.DataAprovacao, pedido.DataEntrega);
    }

    public static ItemPedidoDto AsDto(this ItemPedido itemPedido)
    {
        return new ItemPedidoDto(itemPedido.Id, itemPedido.CodigoProduto, itemPedido.DescricaoProduto, itemPedido.Quantidade, itemPedido.PrecoUnitario);
    }

    public static ItemPedido AsItemPedido(this ItemPedidoDto itemPedidoDto)
    {
        return new ItemPedido()
        {
            Id = itemPedidoDto.Id,
            CodigoProduto = itemPedidoDto.CodigoProduto,
            DescricaoProduto = itemPedidoDto.DescricaoProduto,
            PrecoUnitario = itemPedidoDto.PrecoUnitario,
            Quantidade = itemPedidoDto.Quantidade
        };
    }
}