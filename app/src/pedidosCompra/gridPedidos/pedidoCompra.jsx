export class PedidoCompra
{
    constructor()
    {
        this.id;
        this.pedido;
        this.dataPedido;
        this.fornecedor;
        this.situacao;
        this.observacao;
        this.dataAprovacao;
        this.dataEntrega
        this.precoTotal;
        this.itens = [];
    }
}

export class ItemPedido
{
    constructor()
    {
        this.id;
        this.codigoProduto;
        this.descricaoProduto;
        this.quantidade;
        this.precoUnitario;
        this.precoTotal;
    }
}