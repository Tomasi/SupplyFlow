using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record FornecedorDto(Guid Id, string? NomeFornecedor, SituacaoFornecedor Situacao, int PrazoEntrega);
public record CreateFornecedorDto([Required] string? NomeFornecedor, [Required] int PrazoEntrega);
public record UpdateFornecedorDto(string? NomeFornecedor, SituacaoFornecedor Situacao, int PrazoEntrega);