using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;

namespace SupplyFlow.Service.Estoque.Contollers;

[ApiController]
[Route("estoque")]
public class EstoqueController : ControllerBase
{
    private readonly IRepository<Common.Entities.Estoque> _entityEstoque;

    public EstoqueController(IRepository<Common.Entities.Estoque> entitiyRepository)
    {
        this._entityEstoque = entitiyRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EstoqueDto>>> GetAllAsync()
    {

        return Ok();

        var produtosEstoques = await _entityEstoque.GetAllAsync();
        var estoquesDto = new List<EstoqueDto>();
        foreach (var produto in produtosEstoques)
        {
            estoquesDto.Add(produto.AsDto());
        }
        return Ok(estoquesDto);
    }
}