using SupplyFlow.Common.Entities;
using SupplyFlow.Service.PedidosCompra.Clients;

namespace SupplyFlow.Testes.PedidosCompra;

public class PontoRessuprimento
{
    [Fact]
    public void CalculoPontoRessuprimentoBemSucedido()
    {
        List<Movimento> movimentosEntrada = new();
        List<Movimento> movimentosSaida = new();

        Fornecedor fornecedor = new()
        {
            Id = Guid.NewGuid(),
            NomeFornecedor = "Teste",
            PrazoEntrega = 7
        };

        Produto produto = new()
        {
            Id = Guid.NewGuid(),
            Codigo = "TESTE",
            Descricao = "TESTE",
            PrecoUnitario = 1M,
            SituacaoProduto = SituacaoProduto.Ativo,
            Fornecedor = fornecedor
        };

        Estoque estoque = new()
        {
            Id = Guid.NewGuid(),
            Produto = produto,
            Quantidade = 20
        };

        movimentosEntrada.Add(new Movimento()
        {
            Id = Guid.NewGuid(),
            DataMovimento = DateTime.Today.AddDays(-21),
            Produto = produto,
            Quantidade = 50,
            TipoMovimento = TipoMovimento.Entrada,
        });

        movimentosEntrada.Add(new Movimento()
        {
            Id = Guid.NewGuid(),
            DataMovimento = DateTime.Today.AddDays(-14),
            Produto = produto,
            Quantidade = 50,
            TipoMovimento = TipoMovimento.Entrada,
        });

        movimentosEntrada.Add(new Movimento()
        {
            Id = Guid.NewGuid(),
            DataMovimento = DateTime.Today,
            Produto = produto,
            Quantidade = 50,
            TipoMovimento = TipoMovimento.Entrada,
        });

        movimentosSaida.Add(new Movimento()
        {
            Id = Guid.NewGuid(),
            DataMovimento = DateTime.Today,
            Produto = produto,
            Quantidade = 130,
            TipoMovimento = TipoMovimento.Saida
        });

        MovimentoCreatedClientPedidosCompra.ParametrosCalculoRessuprimento parametros = new(movimentosSaida, movimentosEntrada, produto, estoque);
        MovimentoCreatedClientPedidosCompra movimentoCreatedClient = new(null, null, null);
        var pontoRessuprimento = movimentoCreatedClient.CalculaPontoRessuprimento(parametros);
        Assert.NotNull(pontoRessuprimento);
        Assert.Equal(56, pontoRessuprimento);
    }
}