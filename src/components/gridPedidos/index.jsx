import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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
    { id: 1, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 2, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 3, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 4, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 5, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 6, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 7, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 8, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 9, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 10, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 11, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 12, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 13, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 14, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 15, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 16, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 17, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 18, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
    { id: 19, Pedido: 1, Produto: '123', Quantidade: 3.2, Fornecedor: "s", Cadastro: '14/09/2023', Aprovacao: "14/09/2023", Finalizacao: "14/09/2023" },
];

function BasicButtons()
{

    var onApproveClick = () =>
    {
        alert("aprove")
    }

    var onReproveClick = () =>
    {
        alert("reprove")
    }

    return (
        <Stack spacing={2} direction="row">
            <Button onClick={onApproveClick} className='approveButton' variant="contained">Aprovar</Button>
            <Button onClick={onReproveClick} className='reproveButton' variant="outlined">Reprovar</Button>
        </Stack>
    );
}

export default function GridPedidos()
{
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
                checkboxSelection
                disableRowSelectionOnClick
            />
            <BasicButtons />
        </Box>
    );
}