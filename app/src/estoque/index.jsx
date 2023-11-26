import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getEstoque } from "../services/supplyFlowApi";

const Estoque = () =>
{
    const [isFormOpen] = useState(false);
    const [rows, setRows] = useState([]);

    useEffect(() =>
    {
        consultaEstoque();
    }, [isFormOpen]);

    async function consultaEstoque()
    {
        let estoque = await getEstoque();

        setRows(estoque.map(estoque => ({
            id: estoque.id,
            produto: `${estoque.produto.codigo} - ${estoque.produto.descricao}`,
            fornecedor: `${estoque.produto.fornecedor.nomeFornecedor}`,
            quantidade: estoque.quantidade
        })));
    }

    if (!rows)
    {
        return <div>Consultando estoque...</div>;
    }

    const columns = [
        {
            field: 'produto',
            headerName: 'Produto',
            width: 600,
            editable: false,
        },
        {
            field: 'fornecedor',
            headerName: 'Fornecedor',
            width: 400,
            editable: false
        },
        {
            field: 'quantidade',
            headerName: 'Quantidade Estoque',
            width: 200,
            editable: false
        },
    ];

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
            />
        </div>
    );
}
export default Estoque