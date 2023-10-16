using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record FornecedorDto(Guid Id, string? NomeFornecedor, EnumSituacaoFornecedor Situacao, int PrazoEntrega);
public record CreateFornecedorDto([Required] string? NomeFornecedor, [Required] int PrazoEntrega);
public record UpdateFornecedorDto([Required] string? NomeFornecedor, [Required] EnumSituacaoFornecedor Situacao, [Required] int PrazoEntrega);