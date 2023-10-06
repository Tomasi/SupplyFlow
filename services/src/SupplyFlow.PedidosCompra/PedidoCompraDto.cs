using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record PedidoDto(Guid Id, long Pedido, List<ItemPedidoDto>? Itens, DateTimeOffset DataPedido, string? Fornecedor, EnumSituacao Situacao, string? Observacao, DateTimeOffset DataAprovacao, DateTimeOffset DataEntrega, decimal PrecoTotal);
public record ItemPedidoDto(Guid Id, string? CodigoProduto, string? DescricaoProduto, int Quantidade, decimal PrecoUnitario, decimal PrecoTotal);
public record CreatePedidoCompraDto([Required] List<CreateItemPedidoDto> Itens, [Required] Guid Fornecedor, string Observacao);
public record CreateItemPedidoDto([Required] Guid Id, [Required] int Quantidade);
public record UpdatePedidoCompraDto([Required] Guid Id, [Required] List<CreateItemPedidoDto> Itens, [Required] Guid Fornecedor, [Required] string Observacao, [Required] EnumSituacao Situacao);
public record AlterarSituacaoDto([Required] EnumSituacao Situacao);