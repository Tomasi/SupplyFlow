using MassTransit;
using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Contracts;
using SupplyFlow.PedidosCompra;
using SupplyFlow.Service.Dtos;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.PedidosCompra.Controllers;

[ApiController]
[Route("pedidosCompra")]
public class PedidosCompraController : ControllerBase
{

    private readonly IRepository<IEntity> _entityRepository;
    private readonly IPublishEndpoint _publishEndpoint;
    public PedidosCompraController(IRepository<IEntity> entityRepository, IPublishEndpoint publishEndpoint)
    {
        this._entityRepository = entityRepository;
        this._publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<ActionResult<PedidoCompra>> PostAsync(CreatePedidoCompraDto pedidoCompraDto)
    {

        var chavesItens = pedidoCompraDto.Itens.Select(item => item.Id);
        var itens = (IEnumerable<ItemPedido>)_entityRepository.GetAllAsync(item => chavesItens.Contains(item.Id));

        PedidoCompra pedido = new()
        {
            Id = Guid.NewGuid(),
            DataPedido = DateTimeOffset.UtcNow,
            Fornecedor = (Fornecedor)await _entityRepository.GetAsync(pedidoCompraDto.Fornecedor),
            Itens = itens.ToList(),
            SituacaoPedido = EnumSituacao.Pendente,
            Observacao = pedidoCompraDto.Observacao
        };

        await _entityRepository.CreateAsync(pedido);
        await _publishEndpoint.Publish(new PedidoCompraCreated(pedido.Id, "", pedido.PrecoTotal, pedido.DataPedido));
        return CreatedAtAction(nameof(GetByIdAsync), new { id = pedido.Id }, pedido);
    }

    [HttpPut]
    public async Task<ActionResult> PutAsync(UpdatePedidoCompraDto pedidoCompraDto)
    {
        var pedido = (PedidoCompra)await _entityRepository.GetAsync(pedidoCompraDto.Id);

        if (pedido == null)
            return BadRequest();

        var chavesItens = pedidoCompraDto.Itens.Select(item => item.Id);
        var itens = (IEnumerable<ItemPedido>)_entityRepository.GetAllAsync(item => chavesItens.Contains(item.Id));

        pedido.Itens = itens.ToList();
        pedido.Fornecedor = (Fornecedor)await _entityRepository.GetAsync(pedidoCompraDto.Fornecedor);
        pedido.SituacaoPedido = pedidoCompraDto.Situacao;
        pedido.Observacao = pedidoCompraDto.Observacao;

        await _entityRepository.UpdateAsync(pedido);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> AlterarStatusAsync(Guid id, AlterarSituacaoDto aprovarPedido)
    {
        var pedido = (PedidoCompra)await _entityRepository.GetAsync(id);

        if (pedido == null)
            return BadRequest();

        pedido.SituacaoPedido = aprovarPedido.Situacao;
        await _entityRepository.UpdateAsync(pedido);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PedidoDto>> GetByIdAsync(Guid? id)
    {
        if (id == null)
        {
            return BadRequest();
        }

        var pedido = (PedidoCompra)await _entityRepository.GetAsync(id.GetValueOrDefault());
        return Ok(pedido.AsDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetAllAsync()
    {
        var pedidos = (IEnumerable<PedidoCompra>)await _entityRepository.GetAllAsync();
        return Ok(pedidos?.Select(pedido => pedido.AsDto()));
    }

}