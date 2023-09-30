using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SupplyFlow.Service.Dtos;
using SupplyFlow.Service.Entities;

namespace SupplyFlow.PedidosCompra;

public static class Extensios
{
    public static PedidoDto AsDto(this PedidoCompra pedido)
    {
        return new PedidoDto(pedido.Id, pedido.Itens?.Select(item => item.AsDto()).ToList(), pedido.DataPedido, pedido.Fornecedor, pedido.StatusPedido, pedido.Observacao);
    }

    public static ItemPedidoDto AsDto(this ItemPedido itemPedido)
    {
        return new ItemPedidoDto(itemPedido.Id, itemPedido.Quantidade, itemPedido.PrecoUnitario);
    }

    public static ItemPedido AsItemPedido(this ItemPedidoDto itemPedidoDto)
    {
        return new ItemPedido()
        {
            Id = itemPedidoDto.Id,
            PrecoUnitario = itemPedidoDto.PrecoUnitario,
            Quantidade = itemPedidoDto.Quantidade
        };
    }
}