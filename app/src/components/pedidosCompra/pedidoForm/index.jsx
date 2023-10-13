import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { DataGrid, gridColumnsTotalWidthSelector } from '@mui/x-data-grid';
import { Grid, TextField, Autocomplete } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoForm({ open, onClose, pedidoCompra })
{

    const [itensPedido, setItemData] = useState([]);
    const [fornecedores, setFornecedor] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const formatMoeda = (preco) =>
    {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

        return formatter.format(preco);
    }
    const [formData, setFormData] = useState({
        fornecedor: '',
        dataEntrega: '',
        situacao: '',
        observacao: '',
    });

    const situacaoMap = {
        1: 'Pendente',
        2: 'Aprovado',
        3: 'Em Trânsito',
        4: 'Entregue',
        5: 'Reprovado',
    };

    useEffect(() =>
    {
        fetch("http://localhost:5285/fornecedores", {
            method: 'GET'
        }).then((response) =>
        {
            if (!response.ok)
            {
                console.error('Erro ao buscar dados dos fornecedores:', error);
            }
            return response.json();
        }).then((data) =>
        {
            if (!data.length === 0)
            {
                const fornecedores = data.map(fornecedor => ({
                    id: fornecedor.id,
                    descricao: fornecedor.NomeFornecedor
                }));
                setFornecedor(fornecedores);
            }
        }).catch((error) =>
        {
            console.error('Erro ao buscar dados dos fornecedores:', error);
        });

        if (pedidoCompra)
        {
            const pedidoCompraWithDefaults = {
                ...pedidoCompra,
                fornecedor: pedidoCompra.fornecedor || '',
                dataEntrega: pedidoCompra.dataEntrega || '',
                situacao: situacaoMap[pedidoCompra.situacao] || '',
                observacao: pedidoCompra.observacao || '',
            };
            setFormData(pedidoCompraWithDefaults);
            if (pedidoCompra.itens && pedidoCompra.itens.length > 0)
            {
                setItemData(pedidoCompra.itens);
            }
        }
    }, [pedidoCompra]);

    function criaPedido()
    {
        const url = "http://localhost:5050"
        const pedido = {
            fornecedor: formData.fornecedor,
            dataEntrega: formData.dataEntrega,
            situacao: formData.situacao,
            observacao: formData.observacao,
            itens: itensPedido,
        }
        console.log(pedido)
    }

    function atualizaPedido()
    {

    }

    const OnFormChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const OnItemChange = (params) =>
    {
        console.log(params)
        const itemId = params.id;
        const itemIndex = itensPedido.findIndex((item) => item.id === itemId);
        const updatedItem = {
            ...itensPedido[itemIndex],
            [params.field]: params.props.value,
        };

        // Calcula o preço total com base na quantidade e no preço unitário
        if (params.field === 'quantidade')
        {
            const quantidade = parseFloat(updatedItem.quantidade);
            const precoUnitario = parseFloat(updatedItem.precoUnitario);
            updatedItem.precoTotal = quantidade * precoUnitario;
        }

        const updatedItemData = [...itensPedido];
        updatedItemData[itemIndex] = updatedItem;
        setItemData(updatedItemData);
    };

    const OnAddItem = () =>
    {
        const newItem = {
            id: uuidv4(),
            codigoProduto: '',
            descricaoProduto: '',
            quantidade: 0,
            precoUnitario: 0,
            precoTotal: 0,
        };
        setItemData([...itensPedido, newItem]);
    };

    const OnDeleteSelectedItems = () =>
    {
        const updatedItemData = itensPedido.filter((item) =>
        {
            return !rowSelectionModel.includes(item.id);
        });
        setItemData(updatedItemData);
        setRowSelectionModel([]);
    };

    const OnFornecedorChange = (newValue) =>
    {
        setItemData([]);
        setFornecedor(newValue);
        OnFormChange({ target: { name: 'Fornecedor', value: newValue } });
    };

    const OnClose = () =>
    {
        onClose();
    };

    const OnSubmit = () =>
    {
        if (!pedidoCompra)
        {
            criaPedido();
        } else
        {
            atualizaPedido();
        }
        onClose();
    };

    const columns = [
        {
            field: 'codigoProduto',
            headerName: 'Código do Produto',
            width: 500,
            editable: true
        },
        {
            field: 'descricaoProduto',
            headerName: 'Descrição Produto',
            width: 200,
        },
        {
            field: 'quantidade',
            headerName: 'Quantidade',
            width: 150,
            type: 'number',
            editable: true,
        },
        {
            field: 'precoUnitario',
            headerName: 'Preço Unitário',
            width: 150,
            editable: true,
            type: 'number',
            renderCell: (params) =>
            {
                return formatMoeda(params.value);
            },
        },
        {
            field: 'precoTotal',
            headerName: 'Preço Total',
            width: 150,
            type: 'number',
            renderCell: (params) =>
            {
                return formatMoeda(params.value);
            },
        },
    ];

    const situacoes = ['Pendente', 'Aprovado', 'Em trânsito', 'Entregue'];

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={OnClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={OnClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Formulário de Pedido
                    </Typography>
                    <Button autoFocus color="inherit" onClick={OnSubmit}>
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={fornecedores}
                        value={formData.fornecedor || null}
                        onChange={OnFornecedorChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Fornecedor"
                                name="Fornecedor"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={4} sm={4}>
                    <TextField
                        fullWidth
                        label="Entrega"
                        name="DataEntrega"
                        type="date"
                        value={formData.dataEntrega}
                        onChange={OnFormChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={situacoes}
                        value={formData.situacao || null}
                        onChange={(event, newValue) =>
                        {
                            OnFormChange({ target: { name: 'Situacao', value: newValue } });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Situação"
                                name="Situacao"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Observações"
                        name="Observacao"
                        multiline
                        rows={4}
                        value={formData.observacao}
                        onChange={OnFormChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={OnAddItem}>
                        Adicionar Item
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={OnDeleteSelectedItems}
                        sx={{ ml: 1 }}
                    >
                        Excluir Item(s)
                    </Button>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%', marginTop: '16px' }}>
                <DataGrid
                    rows={itensPedido}
                    editMode="row"
                    columns={columns}
                    pageSize={5}
                    onEditCellChangeCommitted={(params) =>
                    {
                        OnItemChange(params);
                    }}
                    checkboxSelection={true}
                    onRowSelectionModelChange={(newRowSelectionModel) =>
                    {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    disableRowSelectionOnClick={true}
                />
            </div>
        </Dialog>
    );
}
