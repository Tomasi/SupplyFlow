using MassTransit;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Contracts;

namespace SupplyFlow.Service.PedidosCompra.Clients;

public class EstoqueChangedClientEstoque : IConsumer<EstoqueChanged>
{

    private readonly IRepository<Estoque> _repositoryEstoque;
    private readonly IRepository<Movimento> _repositoryMovimento;
    private readonly IRepository<PedidoCompra> _repositoryPedidoCompra;
    private readonly IRepository<Produto> _repositoryProduto;

    public EstoqueChangedClientEstoque(IRepository<Estoque> repositoryEstoque, IRepository<Movimento> repositoryMovimento, IRepository<PedidoCompra> repositoryPedidoCompra, IRepository<Produto> repositoryProduto)
    {
        this._repositoryEstoque = repositoryEstoque;
        this._repositoryMovimento = repositoryMovimento;
        this._repositoryPedidoCompra = repositoryPedidoCompra;
        this._repositoryProduto = repositoryProduto;
    }

    public async Task Consume(ConsumeContext<EstoqueChanged> context)
    {
        var message = context.Message;
        var produto = await _repositoryProduto.GetAsync(message.IdProduto);

        if (produto == null)
            return;

        var estoque = await _repositoryEstoque.GetAsync(estoque => estoque.Produto.Id == produto.Id);
        var saidasProduto = await _repositoryMovimento.GetAllAsync(movimento => movimento.Produto.Id == produto.Id && movimento.TipoMovimento == TipoMovimento.Saida && movimento.DataMovimento >= DateTime.Now.AddDays(-30));
        var comprasProdutos = await _repositoryMovimento.GetAllAsync(movimento => movimento.Produto.Id == produto.Id && movimento.TipoMovimento == TipoMovimento.Entrada && movimento.DataMovimento >= DateTime.Now.AddDays(-30));

        if (estoque == null || !saidasProduto.Any() || !comprasProdutos.Any())
            return;

        var pontoRessuprimento = CalculaPontoRessuprimento(new ParametrosCalculoRessuprimento(saidasProduto, comprasProdutos, produto, estoque));
        if (estoque.Quantidade <= pontoRessuprimento)
        {
            await GeraNovoPedido(produto, pontoRessuprimento.GetValueOrDefault());
        }
    }

    public int? CalculaPontoRessuprimento(ParametrosCalculoRessuprimento parametros)
    {
        var mediaSaidas = RetornaMediaSaidasMes(parametros.SaidasProdutos);
        var tempoEntreCompras = RetornaTempoEntreComprasMes(parametros.ComprasProdutos);
        var estoqueSeguranca = mediaSaidas * parametros.Produto.Fornecedor?.PrazoEntrega;

        var pontoRessuprimento = (mediaSaidas * tempoEntreCompras) + estoqueSeguranca;
        return pontoRessuprimento;
    }

    public class ParametrosCalculoRessuprimento
    {
        public ParametrosCalculoRessuprimento(IEnumerable<Movimento> saidasProduto, IEnumerable<Movimento> comprasProdutos, Produto produto, Estoque estoque)
        {
            this.SaidasProdutos = saidasProduto;
            this.ComprasProdutos = comprasProdutos;
            this.Produto = produto;
            this.Estoque = estoque;
        }

        public IEnumerable<Movimento> SaidasProdutos { get; set; }
        public IEnumerable<Movimento> ComprasProdutos { get; set; }
        public Produto Produto { get; set; }
        public Estoque Estoque { get; set; }
    }

    private async Task GeraNovoPedido(Produto produto, int pontoRessuprimento)
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
                Quantidade = pontoRessuprimento,
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
        foreach (var compra in compras.OrderBy(x => x.DataMovimento))
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