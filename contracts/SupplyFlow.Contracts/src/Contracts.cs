
namespace SupplyFlow.Contracts;

public record PedidoCompraCreated(Guid Id, string Forncedor, decimal ValorPedido, DateOnly Data);
public record PedidoCompraUpdate(Guid Id, string Forncedor, decimal ValorPedido, DateOnly Data);