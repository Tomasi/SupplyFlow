import axios from 'axios';

const fornecedoresUrl = "http://localhost:5285"
const pedidosCompraUrl = "http://localhost:5050"
const produtosUrl = "http://localhost:5118"

const fornecedoresService = axios.create({
    baseURL: fornecedoresUrl
});

const pedidosCompraService = axios.create({
    baseURL: pedidosCompraUrl
});

const produtosService = axios.create({
    baseURL: produtosUrl
});

export const getFornecedores = async () =>
{
    try
    {
        var response = await fornecedoresService.get('/fornecedores');
        return response.data;
    } catch (error)
    {
        throw error;
    }
}

export const createPedidoCompra = async (pedidoCompra) =>
{
    try
    {
        var response = await pedidosCompraService.post('/pedidosCompra', pedidoCompra);
        return response.data;
    } catch (error)
    {
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
        throw error;
    }
}

export const getPedidosCompraAprovados = async (situacao) =>
{
    try
    {
        var response = await pedidosCompraService.get(`/pedidosCompra/${situacao}`);
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const atualizaPedidoCompra = async (pedidoCompra, id) =>
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
        throw error;
    }
}