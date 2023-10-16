using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record PedidoDto(Guid Id, long Pedido, List<ItemPedidoDto>? Itens, DateOnly DataPedido, string? Fornecedor, EnumSituacaoPedido Situacao, string? Observacao, DateOnly DataAprovacao, DateOnly DataEntrega, decimal PrecoTotal);
public record ItemPedidoDto(Guid Id, string? CodigoProduto, string? DescricaoProduto, int Quantidade, decimal PrecoUnitario, decimal PrecoTotal);
public record CreatePedidoCompraDto([Required] List<CreateItemPedidoDto> Itens, [Required] Guid Fornecedor, string Observacao);
public record CreateItemPedidoDto([Required] Guid ProdutoId, [Required] int Quantidade);
public record UpdatePedidoCompraDto([Required] List<CreateItemPedidoDto> Itens, [Required] Guid Fornecedor, [Required] string Observacao, [Required] EnumSituacaoPedido Situacao);
public record AlterarSituacaoDto([Required] EnumSituacaoPedido Situacao);