import axios from 'axios';

// const fornecedoresUrl = "http://localhost:5285"
// const pedidosCompraUrl = "http://localhost:5050"
// const produtosUrl = "http://localhost:5118"
// const movimentosUrl = "http://localhost:5048"

const fornecedoresUrl = "supplyflowfornecedores.azurewebsites.net"
const pedidosCompraUrl = "supplyflowpedidoscompra.azurewebsites.net"
const produtosUrl = "supplyflowprodutos.azurewebsites.net"
const movimentosUrl = "supplyflowmovimento.azurewebsites.net"

const fornecedoresService = axios.create({
    baseURL: fornecedoresUrl
});

const pedidosCompraService = axios.create({
    baseURL: pedidosCompraUrl
});

const produtosService = axios.create({
    baseURL: produtosUrl
});

const movimentosService = axios.create({
    baseURL: movimentosUrl
})

export const postMovimento = async (movimento) =>
{
    try 
    {
        console.log("Movimento", movimento)
        var response = await movimentosService.post('/movimento', movimento)
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const getFornecedores = async () =>
{
    try
    {
        var response = await fornecedoresService.get('/fornecedores');
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const postPedidoCompra = async (pedidoCompra) =>
{
    try
    {
        var response = await pedidosCompraService.post('/pedidosCompra', pedidoCompra);
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const getPedidosCompra = async () =>
{
    try
    {
        var response = await pedidosCompraService.get('/pedidosCompra');
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const putPedidoCompra = async (pedidoCompra, id) =>
{
    console.log("Pedido compra", pedidoCompra)
    console.log("ID", id)
    try
    {
        var response = await pedidosCompraService.put(`/pedidosCompra/${id}`, pedidoCompra);
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const getProdutos = async (produto) =>
{
    try
    {
        var response = await produtosService.get('/produtos');
        return response.data;
    } catch (error)
    {
        console.log(error);
        throw error;
    }
}

export const getProdutosByFornecedor = async (fornecedorId) =>
{
    try
    {
        var response = await produtosService.get(`/produtos/fornecedor?idFornecedor=${fornecedorId}`);
        return response.data;
    } catch (error)
    {
        console.log(error);
        throw error;
    }
}