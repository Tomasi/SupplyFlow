using System.ComponentModel.DataAnnotations;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.Dtos;

public record CreateMovimentoDto([Required] Guid Produto, [Required] decimal Quantidade, [Required] TipoMovimento TipoMovimento);