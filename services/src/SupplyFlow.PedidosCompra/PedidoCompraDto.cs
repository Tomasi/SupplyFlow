using System.ComponentModel.DataAnnotations;
using SupplyFlow.Service.Entities;

namespace SupplyFlow.Service.Dtos;

public record ItemPedidoDto([Required] Guid Id, [Required] string? CodigoProduto, string? DescricaoProduto, [Required] int Quantidade, [Required] decimal PrecoUnitario);
public record PedidoDto(Guid Id, long NumeroPedido, List<ItemPedidoDto>? Itens, DateTimeOffset DataPedido, string? Fornecedor, EnumSituacao Situacao, string? Observacao, DateTimeOffset DataAprovacao, DateTimeOffset DataEntrega);
public record CreatePedidoCompraDto([Required] List<ItemPedidoDto> Itens, [Required] string Fornecedor, string Observacao);
public record UpdatePedidoCompraDto([Required] Guid Id, [Required] List<ItemPedidoDto> Itens, [Required] string Fornecedor, [Required] string Observacao, [Required] EnumSituacao Situacao);
public record AlterarSituacaoDto([Required] EnumSituacao Situacao);