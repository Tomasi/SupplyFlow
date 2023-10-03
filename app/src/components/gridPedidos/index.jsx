import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import PedidoForm from '../pedidoForm/index';

const columns = [
    {
        field: 'numeroPedido',
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
        field: 'totalPedido',
        headerName: 'Valor Total',
        width: 300,
    },
    {
        field: "dataPedido",
        headerName: "Cadastro",
        width: 150
    },
    {
        field: "Aprovacao",
        headerName: "Aprovação",
        width: 150
    },
    {
        field: "DataEntrega",
        headerName: "Data Entrega",
        width: 150
    },
    {
        field: "Situacao",
        headerName: "Situação",
        width: 150
    },
];

export default function GridPedidos()
{
    const [rows, setRows] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);

    const handleCloseDialog = () =>
    {
        setIsFormOpen(false);
    };

    const handleRowDoubleClick = (params) =>
    {
        const pedidoSelecionado = rows.find((row) => row.id === params.row.id);
        setSelectedPedido(pedidoSelecionado);
        setIsFormOpen(true);
    };

    useEffect(() =>
    {
        fetch("http://localhost:5050/pedidosCompra", {
            method: 'GET'
        })
            .then((response) =>
            {
                if (!response.ok)
                {
                    throw new Error('Erro ao buscar dados de pedidos');
                }
                return response.json();
            })
            .then((data) =>
            {
                console.log(data)
                setRows(data);
            })
            .catch((error) =>
            {
                console.error('Erro ao buscar dados de pedidos:', error);
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
                onRowDoubleClick={handleRowDoubleClick}
            />
            {isFormOpen && (
                <PedidoForm open={isFormOpen} onClose={handleCloseDialog} pedidoCompra={selectedPedido} />
            )}
        </div>
    );
}
