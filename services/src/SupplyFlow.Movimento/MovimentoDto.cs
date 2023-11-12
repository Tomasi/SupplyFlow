using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record CreateMovimentoDto([Required] Guid Produto, [Required] int Quantidade, [Required] TipoMovimento TipoMovimento);