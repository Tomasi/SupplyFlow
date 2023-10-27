import React, { useState, useEffect } from 'react';
import { DataGrid, GridArrowUpwardIcon } from '@mui/x-data-grid';
import { getFornecedores, getPedidosCompra } from '../../../services/supplyFlowApi';
import PedidoForm from '../pedidoForm/index';

const formatDate = (date) =>
{
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('pt-BR')
};

const formatMoeda = (preco) =>
{
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return formatter.format(preco);
}

const columns = [
    {
        field: 'pedido',
        headerName: 'Pedido',
        width: 150,
        editable: false,
    },
    {
        field: 'fornecedor',
        headerName: 'Fornecedor',
        width: 300,
        renderCell: (params) =>
        {
            return params.value?.nomeFornecedor || params.value;
        }
    },
    {
        field: 'precoTotal',
        headerName: 'Preço Total',
        width: 300,
        renderCell: (params) =>
        {
            return (
                <div>
                    {formatMoeda(params.value)}
                </div>
            )
        }
    },
    {
        field: "dataPedido",
        headerName: "Cadastro",
        width: 150,
        renderCell: (params) =>
        {
            return (
                <div>
                    {formatDate(params.value)}
                </div>
            );
        },
    },
    {
        field: "dataAprovacao",
        headerName: "Aprovação",
        width: 150,
        renderCell: (params) =>
        {
            return (
                <div>
                    {formatDate(params.value)}
                </div>
            );
        },
    },
    {
        field: "dataEntrega",
        headerName: "Entrega",
        width: 150,
        renderCell: (params) =>
        {
            return (
                <div>
                    {formatDate(params.value)}
                </div>
            );
        },
    },
    {
        field: "situacao",
        headerName: "Situação",
        width: 150
    },
];

export default function GridPedidos()
{
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [dicFornecedores, setFornecedores] = useState({})
    const [selectedPedido, setSelectedPedido] = useState(null);

    useEffect(() =>
    {
        consultaFornecedores();
        consultaPedidosCompra();
    }, [isFormOpen]);

    useEffect(() =>
    {
        consultaPedidosCompra();
    }, [dicFornecedores])

    async function consultaFornecedores()
    {
        const fornecedores = await getFornecedores();
        const dicionarioFornecedores = {};

        fornecedores.forEach((fornecedor) =>
        {
            dicionarioFornecedores[fornecedor.id] = fornecedor;
        });
        console.log(dicFornecedores)
        setFornecedores(dicionarioFornecedores);
    }

    async function consultaPedidosCompra()
    {
        const pedidos = await getPedidosCompra();
        setRows(pedidos.map((pedido) => ({
            ...pedido,
            fornecedor: dicFornecedores[pedido.fornecedor],
        })));
    }

    const onCloseDialog = () =>
    {
        setIsFormOpen(false);
    };

    const OnRowDoubleClick = (params) =>
    {
        const pedidoSelecionado = rows.find((row) => row.id === params.row.id);
        setSelectedPedido(pedidoSelecionado);
        console.log("Pedido selecionado", pedidoSelecionado)
        setIsFormOpen(true);
    };

    if (!rows)
    {
        return <div>Consultando pedidos de compra...</div>;
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                onRowDoubleClick={OnRowDoubleClick}
            />
            {isFormOpen && (
                <PedidoForm open={isFormOpen} onClose={onCloseDialog} pedidoCompra={selectedPedido} />
            )}
        </div>
    );
}
