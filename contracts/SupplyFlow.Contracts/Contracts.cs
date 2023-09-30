
namespace SupplyFlow.Contracts;

public record PedidoCompraCreated(Guid Id, string Forncedor, decimal ValorPedido, DateTimeOffset Data);
public record PedidoCompraUpdate(Guid Id, string Forncedor, decimal ValorPedido, DateTimeOffset Data);