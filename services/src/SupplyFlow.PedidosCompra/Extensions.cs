using SupplyFlow.Service.Dtos;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.PedidosCompra;

public static class Extensions
{
    public static PedidoDto AsDto(this PedidoCompra pedido, IEnumerable<ItemPedidoDto> itensPedido)
    {
        return new PedidoDto(
        pedido.Id,
        pedido.NumeroPedido,
        itensPedido.ToList(),
        pedido.DataPedido,
        pedido.Fornecedor,
        pedido.SituacaoPedido,
        pedido.Observacao,
        pedido.DataAprovacao,
        pedido.DataEntrega,
        pedido.PrecoTotal);
    }

    public static ItemPedidoDto AsDto(this ItemPedido itemPedido, Produto produto)
    {
        return new ItemPedidoDto(
        Id: itemPedido.Id,
        ProdutoId: produto.Id,
        CodigoProduto: produto.Codigo,
        DescricaoProduto: produto.Descricao,
        Quantidade: itemPedido.Quantidade,
        PrecoUnitario: produto.PrecoUnitario,
        PrecoTotal: produto.PrecoUnitario * itemPedido.Quantidade);
    }

    public static ItemPedido AsItemPedido(this CreateItemPedidoDto itemPedido, Produto produto)
    {
        return new ItemPedido()
        {
            Id = Guid.NewGuid(),
            Produto = produto,
            Quantidade = itemPedido.Quantidade,
            PrecoUnitario = produto.PrecoUnitario
        };
    }
}