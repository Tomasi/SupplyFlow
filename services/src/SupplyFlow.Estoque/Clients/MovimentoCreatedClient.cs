using MassTransit;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Contracts;

namespace SupplyFlow.Service.Estoque.Clients;

public class MovimentoCreatedClientEstoque : IConsumer<MovimentoCreated>
{

    private readonly IRepository<Common.Entities.Estoque> _repositoryEstoque;
    private readonly IRepository<Movimento> _repositoryMovimento;
    private IMovimentoEstoque _movimentaEstoque;

    public MovimentoCreatedClientEstoque(IRepository<Common.Entities.Estoque> repositoryEstoque, IRepository<Movimento> repositoryMovimento)
    {
        this._repositoryEstoque = repositoryEstoque;
        this._repositoryMovimento = repositoryMovimento;
        this._movimentaEstoque = new GeraMovimentacaoEstoque();
    }

    public async Task Consume(ConsumeContext<MovimentoCreated> context)
    {
        var message = context.Message;
        var movimento = await _repositoryMovimento.GetAsync(message.Id);

        if (movimento == null)
            return;

        var estoque = await _repositoryEstoque.GetAsync(estoque => estoque.Produto.Id == movimento.Produto.Id);
        if (estoque == null)
        {
            estoque = new Common.Entities.Estoque
            {
                Id = Guid.NewGuid(),
                Produto = movimento.Produto
            };
            await _repositoryEstoque.CreateAsync(estoque);
        }

        _movimentaEstoque.IncrementaEstoque(movimento, estoque);
        await _repositoryEstoque.UpdateAsync(estoque);
    }
}
