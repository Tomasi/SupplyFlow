using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Estoque;

public record EstoqueDto(Guid Id, Produto Produto, decimal Quantidade);