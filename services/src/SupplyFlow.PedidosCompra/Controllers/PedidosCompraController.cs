using MassTransit;
using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Contracts;
using SupplyFlow.PedidosCompra;
using SupplyFlow.Service.Dtos;
using SupplyFlow.Service.Entities;

namespace SupplyFlow.Service.Controllers;

[ApiController]
[Route("pedidosCompra")]
public class PedidosCompraController : ControllerBase
{

    private readonly IRepository<PedidoCompra> _pedidoCompraRepository;
    private readonly IPublishEndpoint _publishEndpoint;
    public PedidosCompraController(IRepository<PedidoCompra> pedidoCompraRepository, IPublishEndpoint publishEndpoint)
    {
        this._pedidoCompraRepository = pedidoCompraRepository;
        this._publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<ActionResult<PedidoCompra>> PostAsync(CreatePedidoCompraDto pedidoCompraDto)
    {
        PedidoCompra pedido = new()
        {
            Id = Guid.NewGuid(),
            DataPedido = DateTimeOffset.UtcNow,
            Fornecedor = pedidoCompraDto.Fornecedor,
            Itens = pedidoCompraDto.Itens.Select(item => item.AsItemPedido()).ToList(),
            StatusPedido = eStatusPedido.Pendente,
            Observacao = pedidoCompraDto.Observacao
        };

        await _pedidoCompraRepository.CreateAsync(pedido);
        await _publishEndpoint.Publish(new PedidoCompraCreated(pedido.Id, "", pedido.TotalPedido, pedido.DataPedido));
        return CreatedAtAction(nameof(GetByIdAsync), new { id = pedido.Id }, pedido);
    }

    [HttpPut]
    public async Task<ActionResult> PutAsync(UpdatePedidoCompraDto pedidoCompraDto)
    {
        var pedido = await _pedidoCompraRepository.GetAsync(pedidoCompraDto.Id);

        if (pedido == null)
            return BadRequest();

        pedido.Itens = pedidoCompraDto.Itens.Select(item => item.AsItemPedido()).ToList();
        pedido.Fornecedor = pedidoCompraDto.Fornecedor;
        pedido.StatusPedido = pedidoCompraDto.StatusPedido;
        pedido.Observacao = pedidoCompraDto.Observacao;

        await _pedidoCompraRepository.UpdateAsync(pedido);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> AlterarStatusAsync(Guid id, AlterarStatusDto aprovarPedido)
    {
        var pedido = await _pedidoCompraRepository.GetAsync(id);

        if (pedido == null)
            return BadRequest();

        pedido.StatusPedido = aprovarPedido.StatusPedido;
        await _pedidoCompraRepository.UpdateAsync(pedido);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PedidoDto>> GetByIdAsync(Guid? id)
    {
        if (id == null)
        {
            return BadRequest();
        }

        var pedido = await _pedidoCompraRepository.GetAsync(id.GetValueOrDefault());
        return Ok(pedido.AsDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetAllAsync()
    {
        var pedidos = await _pedidoCompraRepository.GetAllAsync();
        return Ok(pedidos.Select(pedido => pedido.AsDto()));
    }

}