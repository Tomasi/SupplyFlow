using MassTransit;
using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Contracts;
using SupplyFlow.Movimento;
using SupplyFlow.Service.Dtos;

namespace SupplyFlow.Service.Movimento.Controllers;

[ApiController]
[Route("movimento")]
public class MovimentoController : ControllerBase
{
    private readonly IRepository<Common.Entities.Movimento> _entityRepository;
    private readonly IRepository<Produto> _entityRepositoryProduto;
    private readonly IPublishEndpoint _publishEndPoint;

    public MovimentoController(IRepository<Common.Entities.Movimento> entityRepository, IRepository<Produto> entityRepositoryProduto, IPublishEndpoint publishEndpoint)
    {
        this._entityRepository = entityRepository;
        this._entityRepositoryProduto = entityRepositoryProduto;
        this._publishEndPoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<ActionResult> PostAsync(CreateMovimentoDto createMovimentoDto)
    {
        Common.Entities.Movimento movimento = createMovimentoDto.AsMovimento();
        movimento.Produto = await _entityRepositoryProduto.GetAsync(createMovimentoDto.Produto);
        await _entityRepository.CreateAsync(movimento);
        await _publishEndPoint.Publish(new MovimentoCreated(movimento.Id));
        return Ok();
    }
}