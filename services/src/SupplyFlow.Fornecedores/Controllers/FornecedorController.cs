using MassTransit;
using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Fornecedores;
using SupplyFlow.Service.Dtos;

namespace SupplyFlow.Service.Fornecedores.Controllers;

public class FornecedorController : ControllerBase
{
    private readonly IRepository<IEntity> _entityRepository;
    private readonly IPublishEndpoint _publishEndpoint;
    public FornecedorController(IRepository<IEntity> entityRepository, IPublishEndpoint publishEndpoint)
    {
        this._entityRepository = entityRepository;
        this._publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<ActionResult<Fornecedor>> PostAsync(CreateFornecedorDto fornecedorCompraDto)
    {
        Fornecedor fornecedor = new()
        {
            Id = Guid.NewGuid()
        };

        await _entityRepository.CreateAsync(fornecedor);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = fornecedor.Id }, fornecedor);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FornecedorDto>> GetByIdAsync(Guid? id)
    {
        if (id == null)
        {
            return BadRequest();
        }

        var fornecedor = await _entityRepository.GetAsync<Fornecedor>(id.GetValueOrDefault());
        return Ok(fornecedor.AsDto());
    }
}