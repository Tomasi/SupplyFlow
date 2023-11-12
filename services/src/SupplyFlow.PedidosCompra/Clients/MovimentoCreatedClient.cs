using MassTransit;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Contracts;

namespace SupplyFlow.Service.PedidosCompra.Clients;

public class MovimentoCreatedClientPedidosCompra : IConsumer<MovimentoCreated>
{

    private readonly IRepository<Estoque> _repositoryEstoque;
    private readonly IRepository<Movimento> _repositoryMovimento;
    private readonly IRepository<PedidoCompra> _repositoryPedidoCompra;


    public MovimentoCreatedClientPedidosCompra(IRepository<Estoque> repositoryEstoque, IRepository<Movimento> repositoryMovimento, IRepository<PedidoCompra> repositoryPedidoCompra)
    {
        this._repositoryEstoque = repositoryEstoque;
        this._repositoryMovimento = repositoryMovimento;
        this._repositoryPedidoCompra = repositoryPedidoCompra;
    }

    public async Task Consume(ConsumeContext<MovimentoCreated> context)
    {
        var message = context.Message;
        var movimento = await _repositoryMovimento.GetAsync(message.Id);

        if (movimento == null)
            return;

        CalculaPontoRessuprimento(movimento);
    }

    private async void CalculaPontoRessuprimento(Movimento movimento)
    {
        var produtoMovimento = movimento.Produto;
        var estoqueProduto = await _repositoryEstoque.GetAsync(estoque => estoque.Produto.Id == produtoMovimento.Id);
        var saidasProduto = await _repositoryMovimento.GetAllAsync(movimento => movimento.Produto.Id == produtoMovimento.Id && movimento.TipoMovimento == TipoMovimento.Saida && movimento.DataMovimento >= DateTime.Now.AddDays(-30));
        var comprasProdutos = await _repositoryMovimento.GetAllAsync(movimento => movimento.Produto.Id == produtoMovimento.Id && movimento.TipoMovimento == TipoMovimento.Entrada && movimento.DataMovimento >= DateTime.Now.AddDays(-60));

        if (estoqueProduto == null || saidasProduto == null)
            return;

        var mediaVendas = RetornaMediaVendas(saidasProduto);
        var tempoEntreCompras = RetornaTempoEntreCompras(comprasProdutos);
        var estoqueSeguranca = (int)mediaVendas * produtoMovimento.Fornecedor?.PrazoEntrega;

        var pontoRessuprimento = (mediaVendas * tempoEntreCompras) + estoqueSeguranca;
        if (estoqueProduto.Quantidade <= pontoRessuprimento)
        {
            GeraNovoPedido(produtoMovimento, pontoRessuprimento.GetValueOrDefault(), estoqueSeguranca.GetValueOrDefault(), estoqueSeguranca.GetValueOrDefault());
        }

    }

    private async void GeraNovoPedido(Produto produto, int estoque, int pontoRessuprimento, int estoqueSeguranca)
    {
        var pedidos = await _repositoryPedidoCompra.GetAllAsync();
        long ultimoPedido = !pedidos.Any() ? 0 : pedidos.Max(pedido => pedido.NumeroPedido);
        var novoPedido = new PedidoCompra
        {
            Id = Guid.NewGuid(),
            NumeroPedido = ultimoPedido + 1,
            DataEntrega = DateOnly.FromDateTime(DateTimeOffset.Now.AddDays((double)(produto.Fornecedor?.PrazoEntrega)).DateTime),
            DataPedido = DateOnly.FromDateTime(DateTimeOffset.Now.DateTime),
            Observacao = "Pedido gerado de forma automática",
            SituacaoPedido = SituacaoPedidoCompra.Pendente,
            Fornecedor = produto.Fornecedor,
            Itens = new List<ItemPedido> {new() {
                Id = Guid.NewGuid(),
                Produto = produto,
                Quantidade = pontoRessuprimento + (estoqueSeguranca - estoque),
                PrecoUnitario = produto.PrecoUnitario
            }}
        };

        await _repositoryPedidoCompra.CreateAsync(novoPedido);
    }

    private int RetornaMediaVendas(IEnumerable<Movimento> saidas)
    {
        var totalVendas = saidas.Sum(saida => saida.Quantidade);
        var mediaVendas = totalVendas / 30;
        return (int)mediaVendas;
    }

    private int RetornaTempoEntreCompras(IEnumerable<Movimento> compras)
    {
        int totalDiasEntreCompras = 0;
        Movimento ultimoMovimento = null;
        foreach (var compra in compras)
        {
            if (ultimoMovimento != null)
            {
                totalDiasEntreCompras += compra.DataMovimento.Day - ultimoMovimento.DataMovimento.Day;
            }

            ultimoMovimento = compra;
        }

        var tempoEntreCompras = totalDiasEntreCompras / compras.Count();
        return tempoEntreCompras;
    }
}