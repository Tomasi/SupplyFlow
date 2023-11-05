
namespace SupplyFlow.Contracts;

public record PedidoCompraCreated(Guid Id, string Fornecedor, decimal ValorPedido, DateOnly Data);
public record PedidoCompraUpdate(Guid Id, string Fornecedor, decimal ValorPedido, DateOnly Data);
public record MovimentoCreated(Guid Id);