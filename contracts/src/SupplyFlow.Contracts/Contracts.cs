
namespace SupplyFlow.Contracts;

public record MovimentoCreated(Guid Id);
public record EstoqueChanged(Guid IdProduto);
public record SitucaoPedidoChanged(Guid Id);