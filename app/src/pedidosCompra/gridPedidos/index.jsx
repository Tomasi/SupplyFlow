import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getPedidosCompra } from '../../services/supplyFlowApi';
import PedidoForm from '../pedidoForm/index';
import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import { alterarStatus } from '../../services/supplyFlowApi';

const formatDate = (date) =>
{
    if (!date)
    {
        return date
    }
    const parsedDate = new Date(date);
    const year = parsedDate.getUTCFullYear();
    const month = parsedDate.getUTCMonth() + 1;
    const day = parsedDate.getUTCDate();
    const formattedDate = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    return formattedDate;
};

const situacaoMap = {
    1: 'Pendente',
    2: 'Aprovado',
    3: 'Reprovado',
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
        field: "situacao",
        headerName: "Situação",
        width: 150,
        renderCell: (params) =>
        {
            return (<div>
                {situacaoMap[params.value] || ''}
            </div>)
        }
    },
];

export default function GridPedidos()
{
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    useEffect(() =>
    {
        consultaPedidosCompra();
    }, [isFormOpen]);

    async function consultaPedidosCompra()
    {
        let pedidos = await getPedidosCompra();
        setRows(pedidos);
    }

    const onCloseDialog = () =>
    {
        setIsFormOpen(false);
    };

    const OnNovoPedidoClick = () =>
    {
        setPedidoSelecionado(null)
        setIsFormOpen(true);
    }

    const OnRowDoubleClick = (params) =>
    {
        let pedidoSelecionado = rows.find((row) => row.id === params.row.id);
        setPedidoSelecionado(pedidoSelecionado);
        console.log("Pedido selecionado", pedidoSelecionado)
        setIsFormOpen(true);
    };

    const onAprovacaoClick = () =>
    {
        if (!rowSelectionModel) return
        for (let id of rowSelectionModel)
        {
            alterarStatus({ situacao: 2 }, id);
        }
    }

    const onReprovacaoClick = () =>
    {
        if (!rowSelectionModel) return
        for (let id of rowSelectionModel)
        {
            alterarStatus({ situacao: 3 }, id);
        }
    }

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
                checkboxSelection
                onRowDoubleClick={OnRowDoubleClick}
                onRowSelectionModelChange={(newRowSelectionModel) =>
                {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
            />
            {isFormOpen && (
                <PedidoForm open={isFormOpen} onClose={onCloseDialog} pedidoCompra={pedidoSelecionado} />
            )}
            <ButtonGroup>
                <Button onClick={OnNovoPedidoClick} className='novoPedidoButton' variant="outlined">Novo</Button>
                <Button onClick={onAprovacaoClick} className='aprovacaoButton' variant="outlined">Aprovar</Button>
                <Button onClick={onReprovacaoClick} className='reprovacaoButton' variant="outlined">Reprovar</Button>
            </ButtonGroup>
        </div>
    );
}
