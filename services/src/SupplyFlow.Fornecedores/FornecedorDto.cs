using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record FornecedorDto(Guid Id, string? NomeFornecedor, SituacaoFornecedor Situacao, int PrazoEntrega, string Email);
public record CreateFornecedorDto([Required] string? NomeFornecedor, [Required] int PrazoEntrega);
public record UpdateFornecedorDto(string? NomeFornecedor, SituacaoFornecedor Situacao, int PrazoEntrega, string Email);