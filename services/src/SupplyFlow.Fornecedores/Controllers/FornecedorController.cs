using MassTransit;
using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Fornecedores;
using SupplyFlow.Service.Dtos;

namespace SupplyFlow.Service.Fornecedores.Controllers;

[ApiController]
[Route("fornecedores")]
public class FornecedorController : ControllerBase
{
    private readonly IRepository<Fornecedor> _entityRepository;
    private readonly IPublishEndpoint _publishEndpoint;
    public FornecedorController(IRepository<Fornecedor> entityRepository, IPublishEndpoint publishEndpoint)
    {
        this._entityRepository = entityRepository;
        this._publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<ActionResult<Fornecedor>> PostAsync(CreateFornecedorDto fornecedorCompraDto)
    {
        Fornecedor fornecedor = new()
        {
            Id = Guid.NewGuid(),
            NomeFornecedor = fornecedorCompraDto.NomeFornecedor,
            PrazoEntrega = fornecedorCompraDto.PrazoEntrega,
            Situacao = EnumSituacaoFornecedor.Ativo
        };

        await _entityRepository.CreateAsync(fornecedor);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = fornecedor.Id }, fornecedor);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutAsync(Guid id, [FromBody] UpdateFornecedorDto fornecedorDto)
    {
        var fornecedor = await _entityRepository.GetAsync(id);

        if (fornecedor == null)
            return BadRequest();

        fornecedor.NomeFornecedor = fornecedorDto.NomeFornecedor;
        fornecedor.PrazoEntrega = fornecedorDto.PrazoEntrega;
        fornecedor.Situacao = fornecedorDto.Situacao;

        await _entityRepository.UpdateAsync(fornecedor);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FornecedorDto>> GetByIdAsync(Guid? id)
    {
        if (id == null)
        {
            return BadRequest();
        }

        var fornecedor = await _entityRepository.GetAsync(id.GetValueOrDefault());

        if (fornecedor == null)
        {
            return NotFound("Fornecedor não encontrado");
        }
        return Ok(fornecedor.AsDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FornecedorDto>>> GetAllAsync()
    {
        var fornecedores = await _entityRepository.GetAllAsync();
        return Ok(fornecedores.Select(fornecedor => fornecedor.AsDto()));
    }
}