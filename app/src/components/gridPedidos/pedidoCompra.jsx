export class PedidoCompra
{
    constructor()
    {
        this.Id;
        this.Pedido;
        this.Fornecedor;
        this.ValorTotal;
        this.Quantidade;
        this.Cadastro;
        this.Aprovacao;
        this.DataEntrega
        this.Situacao;
        this.Observacao;
    }
}

export class ItemPedido
{
    constructor()
    {
        this.Codigo;
        this.Quantidade;
        this.Descricao;
        this.PrecoUnitario;
    }
}