using System.ComponentModel.DataAnnotations;
using SupplyFlow.Service.Entities;

namespace SupplyFlow.Service.Dtos;

public record ItemPedidoDto([Required] Guid Id, [Required] int Quantidade, [Required] decimal PrecoUnitario);
public record PedidoDto(Guid Id, List<ItemPedidoDto>? Itens, DateTimeOffset DatePedido, Guid Forncedor, eStatusPedido StatusPedido, string? Observacao);
public record CreatePedidoCompraDto([Required] List<ItemPedidoDto> Itens, [Required] Guid Fornecedor, string Observacao);
public record UpdatePedidoCompraDto([Required] Guid Id, [Required] List<ItemPedidoDto> Itens, [Required] Guid Fornecedor, [Required] string Observacao, [Required] eStatusPedido StatusPedido);
public record AlterarStatusDto([Required] eStatusPedido StatusPedido);