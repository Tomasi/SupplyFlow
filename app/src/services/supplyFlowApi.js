import axios from 'axios';

// const fornecedoresUrl = "http://localhost:5285"
// const pedidosCompraUrl = "http://localhost:5050"
// const produtosUrl = "http://localhost:5118"
// const movimentosUrl = "http://localhost:5048"
// const estoqueUrl = "http://localhost:5119"

const fornecedoresUrl = "https://supplyflowfornecedores.azurewebsites.net"
const pedidosCompraUrl = "https://supplyflowpedidoscompra.azurewebsites.net/"
const produtosUrl = "https://supplyflowprodutos.azurewebsites.net/"
const movimentosUrl = "https://supplyflowmovimento.azurewebsites.net"
const estoqueUrl = "https://supplyflowestoque.azurewebsites.net"

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
});

const estoqueService = axios.create({
    baseURL: estoqueUrl
});

export const postMovimento = async (movimento) =>
{
    try 
    {
        console.log("Movimento", movimento)
        let response = await movimentosService.post('/movimento', movimento)
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
        let response = await fornecedoresService.get('/fornecedores');
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
        let response = await pedidosCompraService.post('/pedidosCompra', pedidoCompra);
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
        let response = await pedidosCompraService.get('/pedidosCompra');
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const getEstoque = async () =>
{
    try
    {
        let response = await estoqueService.get('/estoque')
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const putPedidoCompra = async (pedidoCompra, id) =>
{
    try
    {
        let response = await pedidosCompraService.put(`/pedidosCompra/${id}`, pedidoCompra);
        return response.data;
    } catch (error)
    {
        console.log(error)
        throw error;
    }
}

export const alterarStatus = async (situacao, id) =>
{
    try
    {
        let response = await pedidosCompraService.put(`/pedidosCompra/alterarStatus/${id}`, situacao);
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
        let response = await produtosService.get('/produtos');
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
        let response = await produtosService.get(`/produtos/fornecedor?idFornecedor=${fornecedorId}`);
        return response.data;
    } catch (error)
    {
        console.log(error);
        throw error;
    }
}