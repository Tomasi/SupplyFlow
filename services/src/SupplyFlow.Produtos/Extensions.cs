using SupplyFlow.Common.Entities;
using SupplyFlow.Services.Dtos;

namespace SupplyFlow.Services.Produtos;

public static class Extensions
{
    public static ProdutoDto AsDto(this Produto produto)
    {
        return new ProdutoDto(
            produto.Id,
            produto.Codigo,
            produto.Descricao,
            produto.Fornecedor?.NomeFornecedor,
            produto.PrecoUnitario,
            produto.SituacaoProduto,
            produto.Validade
        );
    }
}