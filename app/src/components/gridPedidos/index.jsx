import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import PedidoForm from '../pedidoCompra/pedidoForm';

const columns = [
    {
        field: 'Pedido',
        headerName: 'Pedido',
        width: 150,
        editable: false,
    },
    {
        field: 'Produto',
        headerName: 'Produto',
        width: 300,
        editable: false,
    },
    {
        field: 'Quantidade',
        headerName: 'Quantidade',
        type: 'number',
        width: 150,
        editable: false,
    },
    {
        field: 'Fornecedor',
        headerName: 'Fornecedor',
        width: 300,
    }, {
        field: "Cadastro",
        headerName: "Cadastro",
        with: 150
    },
    {
        field: "Aprovacao",
        headerName: "Aprovação",
        with: 150
    },
    {
        field: "Finalizacao",
        headerName: "Finalização",
        with: 150
    },
];

const rows = [
    { id: 1, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 2, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 3, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 4, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 5, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 6, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 7, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 8, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 9, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 10, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 11, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 12, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 13, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 14, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 15, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 16, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 17, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 18, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
    { id: 19, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023", Situacao: "Ativo" },
];

export default function GridPedidos()
{

    const [isFormOpen, setIsFormOpen] = useState(false);

    /**
    * @param {GridRowParams} params
    */
    const HandleOpenDialog = () =>
    {
        setIsFormOpen(true);
    };

    const HandleCloseDialog = () =>
    {
        setIsFormOpen(false);
    }

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
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
                onRowDoubleClick={HandleOpenDialog}
            />
            {isFormOpen && (
                <PedidoForm open={isFormOpen} onClose={HandleCloseDialog} />
            )}
        </Box>
    );
}