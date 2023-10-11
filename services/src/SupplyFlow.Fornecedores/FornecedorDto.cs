namespace SupplyFlow.Service.Dtos;

public record FornecedorDto(Guid Id, string? NomeFornecedor);
public record CreateFornecedorDto(string NomeFornecedor);