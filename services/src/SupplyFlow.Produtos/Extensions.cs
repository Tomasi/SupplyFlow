using SupplyFlow.Common.Entities;
using SupplyFlow.Services.Dtos;

namespace SupplyFlow.PedidosCompra;

public static class Extensions
{
    public static ProdutoDto AsDto(this Produto produto)
    {
        return new ProdutoDto(
            produto.Id,
            produto.CodigoProduto,
            produto.Descricao,
            produto.Fornecedor?.NomeFornecedor,
            produto.PrecoUnitario,
            produto.Situacao,
            produto.Validade
        );
    }
}