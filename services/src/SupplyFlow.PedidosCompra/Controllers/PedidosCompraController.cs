using MassTransit;
using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Contracts;
using SupplyFlow.Service.Dtos;
using MassTransit.Initializers;
using SupplyFlow.Common.Entities;

namespace SupplyFlow.Service.PedidosCompra.Controllers;

[ApiController]
[Route("pedidosCompra")]
public class PedidosCompraController : ControllerBase
{

    private readonly IRepository<PedidoCompra> _entityRepository;
    private readonly IRepository<Produto> _entityRepositoryProduto;
    private readonly IRepository<Fornecedor> _entityRepositoryFornecedores;
    private readonly IPublishEndpoint _publishEndpoint;
    public PedidosCompraController(IRepository<PedidoCompra> entityRepository, IRepository<Produto> entityRepositoryProdutos, IRepository<Fornecedor> entityRepositoryFornecedores, IPublishEndpoint publishEndpoint)
    {
        this._entityRepository = entityRepository;
        this._entityRepositoryProduto = entityRepositoryProdutos;
        this._entityRepositoryFornecedores = entityRepositoryFornecedores;
        this._publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<ActionResult<PedidoCompra>> PostAsync(CreatePedidoCompraDto pedidoCompraDto)
    {
        var chavesItens = pedidoCompraDto.Itens.Select(item => item.ProdutoId).ToArray();
        var produtos = (await _entityRepositoryProduto.GetAllAsync(produto => chavesItens.Contains(produto.Id)))?.ToDictionary(produto => produto.Id);

        if (produtos == null || !produtos.Any())
            return BadRequest();

        var itensPedido = new List<ItemPedido>();
        foreach (var item in pedidoCompraDto.Itens)
        {
            itensPedido.Add(item.AsItemPedido(produtos[item.ProdutoId]));
        }

        var pedidos = await _entityRepository.GetAllAsync();
        long ultimoPedido = !pedidos.Any() ? 0 : pedidos.Max(pedido => pedido.NumeroPedido);

        PedidoCompra pedido = new()
        {
            Id = Guid.NewGuid(),
            NumeroPedido = ultimoPedido + 1,
            DataPedido = DateOnly.FromDateTime(DateTime.Now),
            DataEntrega = pedidoCompraDto.DataEntrega,
            Fornecedor = await _entityRepositoryFornecedores.GetAsync(pedidoCompraDto.Fornecedor),
            Itens = itensPedido.ToList(),
            SituacaoPedido = SituacaoPedidoCompra.Pendente,
            Observacao = pedidoCompraDto.Observacao
        };

        await _entityRepository.CreateAsync(pedido);
        await _publishEndpoint.Publish(new PedidoCompraCreated(pedido.Id, "", pedido.PrecoTotal, pedido.DataPedido));
        return CreatedAtAction(nameof(GetByIdAsync), new { id = pedido.Id }, pedido);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutAsync(Guid id, [FromBody] UpdatePedidoCompraDto pedidoCompraDto)
    {
        var pedido = await _entityRepository.GetAsync(id);
        var chavesItens = pedidoCompraDto.Itens.Select(item => item.ProdutoId).ToArray();
        var produtos = (await _entityRepositoryProduto.GetAllAsync(produto => chavesItens.Contains(produto.Id)))?.ToDictionary(produto => produto.Id);

        if (pedido == null)
            return BadRequest();

        if (produtos == null || !produtos.Any())
            return BadRequest();

        var itensPedido = new List<ItemPedido>();
        foreach (var item in pedidoCompraDto.Itens)
        {
            itensPedido.Add(item.AsItemPedido(produtos[item.ProdutoId]));
        }

        pedido.Itens = itensPedido;
        pedido.Fornecedor = await _entityRepositoryFornecedores.GetAsync(pedidoCompraDto.Fornecedor);
        pedido.SituacaoPedido = pedidoCompraDto.Situacao;
        pedido.Observacao = pedidoCompraDto.Observacao;
        pedido.DataEntrega = pedidoCompraDto.DataEntrega;

        await _entityRepository.UpdateAsync(pedido);
        return Ok();
    }

    [HttpPut("alterarStatus/{id}")]
    public async Task<ActionResult> AlterarStatusAsync(Guid id, [FromBody] AlterarSituacaoDto aprovarPedido)
    {
        var pedido = await _entityRepository.GetAsync(id);

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

        var pedido = await _entityRepository.GetAsync(id.GetValueOrDefault());
        var chavesItens = pedido.Itens?.Select(item => item.Produto.Id);
        if (pedido.Itens == null || chavesItens == null || !chavesItens.Any())
            return BadRequest();

        var produtos = (await _entityRepositoryProduto.GetAllAsync(produto => chavesItens.Contains(produto.Id))).ToDictionary(produto => produto.Id);
        var itensPedido = new List<ItemPedidoDto>();
        foreach (var itemPedido in pedido.Itens)
        {
            var produto = produtos[itemPedido.Produto.Id];
            var item = itemPedido.AsDto(produto);
            itensPedido.Add(item);
        }

        return Ok(pedido.AsDto(itensPedido));
    }

    [HttpGet("{situacao}")]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetPedidosBySituacao(Common.Entities.SituacaoPedidoCompra situacaoPedido)
    {
        var pedidos = await _entityRepository.GetAllAsync(pedido => pedido.SituacaoPedido == situacaoPedido);
        var produtos = (await _entityRepositoryProduto.GetAllAsync()).ToDictionary(produto => produto.Id);
        return Ok(pedidos?.Select(pedido =>
        {
            var itensPedido = new List<ItemPedidoDto>();
            foreach (var item in pedido.Itens)
            {
                var itemPedido = item.AsDto(produtos[item.Produto.Id]);
                itensPedido.Add(itemPedido);
            }
            return pedido.AsDto(itensPedido);
        }));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetAllAsync()
    {
        var pedidos = await _entityRepository.GetAllAsync();
        var produtos = (await _entityRepositoryProduto.GetAllAsync()).ToDictionary(produto => produto.Id);
        return Ok(pedidos?.Select(pedido =>
        {
            var itensPedido = new List<ItemPedidoDto>();
            foreach (var item in pedido.Itens)
            {
                var itemPedido = item.AsDto(produtos[item.Produto.Id]);
                itensPedido.Add(itemPedido);
            }
            return pedido.AsDto(itensPedido);
        }));
    }
}