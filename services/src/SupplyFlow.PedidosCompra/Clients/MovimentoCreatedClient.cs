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

        if (movimento == null || movimento.TipoMovimento == TipoMovimento.Entrada)
            return;

        CalculaPontoRessuprimento(movimento);
    }

    public async void CalculaPontoRessuprimento(Movimento movimento)
    {
        var produtoMovimento = movimento.Produto;
        var estoqueProduto = await _repositoryEstoque.GetAsync(estoque => estoque.Produto.Id == produtoMovimento.Id);
        var saidasProduto = await _repositoryMovimento.GetAllAsync(movimento => movimento.Produto.Id == produtoMovimento.Id && movimento.TipoMovimento == TipoMovimento.Saida && movimento.DataMovimento >= DateTime.Now.AddDays(-30));
        var comprasProdutos = await _repositoryMovimento.GetAllAsync(movimento => movimento.Produto.Id == produtoMovimento.Id && movimento.TipoMovimento == TipoMovimento.Entrada && movimento.DataMovimento >= DateTime.Now.AddDays(-30));

        if (estoqueProduto == null || !saidasProduto.Any() || !comprasProdutos.Any())
            return;

        var mediaSaidas = RetornaMediaSaidasMes(saidasProduto);
        var tempoEntreCompras = RetornaTempoEntreComprasMes(comprasProdutos);
        var estoqueSeguranca = mediaSaidas * produtoMovimento.Fornecedor?.PrazoEntrega;

        var pontoRessuprimento = (mediaSaidas * tempoEntreCompras) + estoqueSeguranca;
        if (estoqueProduto.Quantidade <= pontoRessuprimento)
        {
            await GeraNovoPedido(produtoMovimento, pontoRessuprimento.GetValueOrDefault(), estoqueSeguranca.GetValueOrDefault());
        }
    }

    private async Task GeraNovoPedido(Produto produto, int pontoRessuprimento, int estoqueSeguranca)
    {
        var pedidos = await _repositoryPedidoCompra.GetAllAsync();
        long ultimoPedido = !pedidos.Any() ? 0 : pedidos.Max(pedido => pedido.NumeroPedido);
        var novoPedido = new PedidoCompra
        {
            Id = Guid.NewGuid(),
            NumeroPedido = ultimoPedido + 1,
            DataEntrega = DateOnly.FromDateTime(DateTimeOffset.Now.AddDays((produto.Fornecedor?.PrazoEntrega).GetValueOrDefault()).DateTime),
            DataPedido = DateOnly.FromDateTime(DateTimeOffset.Now.DateTime),
            Observacao = "Pedido gerado de forma automática",
            SituacaoPedido = SituacaoPedidoCompra.Pendente,
            Fornecedor = produto.Fornecedor,
            Itens = new List<ItemPedido> {new() {
                Id = Guid.NewGuid(),
                Produto = produto,
                Quantidade = pontoRessuprimento + estoqueSeguranca,
                PrecoUnitario = produto.PrecoUnitario
            }}
        };

        await _repositoryPedidoCompra.CreateAsync(novoPedido);
    }

    private int RetornaMediaSaidasMes(IEnumerable<Movimento> saidas)
    {
        var totalVendas = saidas.Sum(saida => saida.Quantidade);
        var mediaVendas = Convert.ToInt32(totalVendas / 30);
        return mediaVendas;
    }

    private int RetornaTempoEntreComprasMes(IEnumerable<Movimento> compras)
    {
        int totalDiasEntreCompras = 0;
        Movimento? ultimoMovimento = null;
        foreach (var compra in compras)
        {
            if (ultimoMovimento != null)
            {
                var diferencaEntreEntregas = (compra.DataMovimento - ultimoMovimento.DataMovimento).Days;
                totalDiasEntreCompras += diferencaEntreEntregas;
            }
            ultimoMovimento = compra;
        }

        var tempoEntreCompras = Convert.ToInt32(totalDiasEntreCompras / compras.Count());
        if (tempoEntreCompras == 0)
            tempoEntreCompras = 1;
        return tempoEntreCompras;
    }
}