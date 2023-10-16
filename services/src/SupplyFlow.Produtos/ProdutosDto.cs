using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Services.Dtos;

public record ProdutoDto(Guid Id, string? CodigoProduto, string? DescricaoProduto, string? NomeFornecedor, decimal PrecoUnitario, EnumSituacaoProduto SituacaoProduto, DateOnly? Validade);
public record CreateProdutoDto([Required] string? CodigoProduto, [Required] string? DescricaoProduto, [Required] Guid FornecedorId, [Required] decimal PrecoUnitario, DateOnly? Validade);
public record UpdateProdutoDto([Required] string? CodigoProduto, [Required] string? DescricaoProduto, [Required] Guid FornecedorId, [Required] decimal PrecoUnitario, [Required] DateOnly? Validade, [Required] EnumSituacaoProduto SituacaoProduto);