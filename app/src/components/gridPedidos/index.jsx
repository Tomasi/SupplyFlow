import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PedidoForm from '../pedidoForm/index';

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
    },
    {
        field: 'precoTotal',
        headerName: 'Valor Total',
        width: 300,
    },
    {
        field: "dataPedido",
        headerName: "Cadastro",
        width: 150
    },
    {
        field: "dataAprovacao",
        headerName: "Aprovação",
        width: 150
    },
    {
        field: "dataEntrega",
        headerName: "Entrega",
        width: 150
    },
    {
        field: "situacao",
        headerName: "Situação",
        width: 150
    },
];

export default function GridPedidos()
{
    const [rows, setRows] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);

    const OnCloseDialog = () =>
    {
        setIsFormOpen(false);
    };

    const OnRowDoubleClick = (params) =>
    {
        const pedidoSelecionado = rows.find((row) => row.id === params.row.id);
        setSelectedPedido(pedidoSelecionado);
        setIsFormOpen(true);
    };

    useEffect(() =>
    {
        fetch("http://localhost:5050/pedidosCompra", {
            method: 'GET'
        }).then((response) =>
        {
            console.log(response)
            if (!response.ok)
            {
                throw new Error('Erro ao buscar dados de pedidos');
            }
            return response.json();
        }).then((data) =>
        {
            setRows(data);
        }).catch((error) =>
        {
            throw new Error('Erro ao buscar dados de pedidos: ', error);
        });
    }, []);

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
                <PedidoForm open={isFormOpen} onClose={OnCloseDialog} pedidoCompra={selectedPedido} />
            )}
        </div>
    );
}
