using SupplyFlow.Common.Entities;
using SupplyFlow.Service.Dtos;

namespace SupplyFlow.Fornecedores;

public static class Extensions
{
    public static FornecedorDto AsDto(this Fornecedor fornecedor)
    {
        return new FornecedorDto(fornecedor.Id, fornecedor.NomeFornecedor);
    }
}
