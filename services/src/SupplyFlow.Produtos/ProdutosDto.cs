using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Services.Dtos;

public record ProdutoDto(Guid Id, string? CodigoProduto, string? DescricaoProduto, string? NomeFornecedor, decimal PrecoUnitario, SituacaoProduto SituacaoProduto, DateOnly? Validade);
public record CreateProdutoDto([Required] string? CodigoProduto, [Required] string? DescricaoProduto, [Required] Guid FornecedorId, [Required] decimal PrecoUnitario, DateOnly? Validade);
public record UpdateProdutoDto(string? CodigoProduto, string? DescricaoProduto, Guid FornecedorId, decimal PrecoUnitario, DateOnly? Validade, SituacaoProduto SituacaoProduto);