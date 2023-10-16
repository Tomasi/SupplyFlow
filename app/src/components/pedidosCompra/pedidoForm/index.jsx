import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import
{
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Grid, TextField, Autocomplete } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoForm({ open, onClose: onClose, pedidoCompra })
{

    const [itensPedido, setItemData] = useState([]);
    const [itemModesModel, setItemModesModel] = React.useState({});
    const [fornecedores, setFornecedor] = useState([]);
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

    const situacoes = ['Pendente', 'Aprovado', 'Em trânsito', 'Entregue'];
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
        var itens = [];

        itensPedido.forEach((item) =>
        {
            itens.push({ id: item.id, quantidade: item.quantidade });
        });
        const pedido = {
            id: pedidoCompra.id,
            itens: itens,
            fornecedor: uuidv4(),
            observacao: formData.observacao,
            dataEntrega: formData.dataEntrega,
            situacao: 1,
        }

        console.log(pedido)
        fetch("http://localhost:5050/pedidosCompra", {
            method: "PUT",
            body: JSON.stringify(pedido),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) =>
        {
            if (!response.ok)
            {
                throw new Error("Erro na requisição PUT");
            }
            return response.json();
        }).then((data) =>
        {
        }).catch((error) =>
        {
            console.error("Erro na requisição PUT:", error);
        });
    }

    const onFormChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onFornecedorChange = (newValue) =>
    {
        setItemData({});
        setFornecedor(newValue);
        onFormChange({ target: { name: 'Fornecedor', value: newValue } });
    };

    const onSubmit = () =>
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
            editable: false,
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
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) =>
            {
                const isInEditMode = itemModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode)
                {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={onSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CloseIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={onCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={onEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={onDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const onAddItem = () =>
    {
        const newItem = {
            id: uuidv4(),
            codigoProduto: '',
            descricaoProduto: '',
            quantidade: 0,
            precoUnitario: 0,
            precoTotal: 0,
            isNew: true
        };
        setItemData([...itensPedido, newItem]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    const onEditClick = (id) => () =>
    {
        setItemModesModel({ ...itemModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const onSaveClick = (id) => () =>
    {
        setItemModesModel({ ...itemModesModel, [id]: { mode: GridRowModes.View } });
    };

    const onDeleteClick = (id) => () =>
    {
        setItemData(itensPedido.filter((row) => row.id !== id));
    };

    const onCancelClick = (id) => () =>
    {
        setItemModesModel({
            ...itemModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = itensPedido.find((row) => row.id === id);
        if (editedRow.isNew)
        {
            setItemData(itensPedido.filter((row) => row.id !== id));
        }
    };

    const onRowEditStop = (params, event) =>
    {
        if (params.reason === GridRowEditStopReasons.rowFocusOut)
        {
            event.defaultMuiPrevented = true;
        }
    };

    const onRowModesModelChange = (newRowModesModel) =>
    {
        setItemModesModel(newRowModesModel);
    };

    const onProcessRowUpdate = (newRow) =>
    {
        const updatedRow = { ...newRow, isNew: false };
        updatedRow.precoTotal = updatedRow.precoUnitario * updatedRow.quantidade
        setItemData(itensPedido.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const OnProcessRowUpdateError = (error, details) =>
    {
        console.error('Erro ao processar atualização de linha:', error);
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Formulário de Pedido
                    </Typography>
                    <Button autoFocus color="inherit" onClick={onSubmit}>
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={fornecedores}
                        value={formData.fornecedor || null}
                        onChange={onFornecedorChange}
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
                        onChange={onFormChange}
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
                            onFormChange({ target: { name: 'Situacao', value: newValue } });
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
                        onChange={onFormChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={onAddItem}>
                        Adicionar Item
                    </Button>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%', marginTop: '16px' }}>
                <DataGrid
                    rows={itensPedido}
                    columns={columns}
                    rowModesModel={itemModesModel}
                    editMode="row"
                    pageSize={5}
                    onRowModesModelChange={onRowModesModelChange}
                    onRowEditStop={onRowEditStop}
                    processRowUpdate={onProcessRowUpdate}
                    onProcessRowUpdateError={OnProcessRowUpdateError}
                />
            </div>
        </Dialog>
    );
}
