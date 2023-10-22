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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Grid } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import
{
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoForm({ open, onClose: onClose, pedidoCompra })
{

    const [itensPedido, setItemData] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [itemModesModel, setItemModesModel] = React.useState({});
    const [produtosFornecedor, setProdutosFornecedor] = useState([]);
    const [formData, setFormData] = useState({
        fornecedor: '',
        dataEntrega: '',
        situacao: '',
        observacao: '',
    });
    const situacoes = ['Pendente', 'Aprovado', 'Em trânsito', 'Entregue', 'Reprovado'];
    const situacaoMap = {
        1: 'Pendente',
        2: 'Aprovado',
        3: 'Em Trânsito',
        4: 'Entregue',
        5: 'Reprovado',
    };
    const formatMoeda = (preco) =>
    {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

        return formatter.format(preco);
    }

    useEffect(() =>
    {
        fetch("http://localhost:5285/fornecedores", {
            method: 'GET'
        }).then((response) =>
        {
            if (!response.ok)
            {
                console.error('Falha na requisição de fornecedores', error);
            }
            return response.json();
        }).then((data) =>
        {
            if (!data.length == 0)
            {
                const fornecedoresMapeados = data.map(fornecedor => ({
                    id: fornecedor.id,
                    descricao: fornecedor.nomeFornecedor
                }));
                setFornecedores(fornecedoresMapeados);
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

            fetch("http://localhost:5118/produtos", {
                method: 'GET'
            }).then((response) =>
            {
                if (!response.ok)
                {
                    console.error("Falha na requisição dos produtos", error)
                }

                return response.json();
            }).then((data) =>
            {
                if (!data.length == 0)
                {
                    const produtos = data.map()
                    setProdutosFornecedor(produtos);
                }
            }).catch((error) =>
            {
                console.error("Erro ao buscar os produtos do fornecedor", error)
            });
        }
    }, [pedidoCompra]);

    function criaPedido()
    {
        const url = "http://localhost:5050/pedidosCompra";
        const pedido = {
            itens: [
                {
                    produtoId: "3d43e4aa-0fe4-4f61-81b0-01911cdde5d7",
                    quantidade: "2"
                }
            ],
            fornecedor: "3c802510-4c3f-4df5-9a5d-d9df281e53f8",
            observacao: "teste"
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        }).then((response) =>
        {
            console.log(response)
            if (!response.ok)
            {
                throw new Error("Erro na requisição POST");
            }
            return response.json();
        }).then((data) =>
        {
            console.log("Pedido criado com sucesso:", data);
        }).catch((error) =>
        {
            console.error("Erro na requisição POST:", error);
        });
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
    };

    const onSaveClick = (id) => () =>
    {
        setItemModesModel({ ...itemModesModel, [id]: { mode: GridRowModes.View } });
    };

    const onEditClick = (id) => () =>
    {
        setItemModesModel({ ...itemModesModel, [id]: { mode: GridRowModes.Edit } });
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
            <Grid container spacing={1} sx={{ p: 2 }}>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={fornecedores}
                        getOptionLabel={(option) => option.descricao}
                        value={formData.fornecedor || null}
                        onChange={(event, newValue) =>
                        {
                            setItemData([]);
                            setFormData({
                                ...formData,
                                fornecedor: newValue,
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Fornecedor"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={4} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker
                            label="Entrega"
                            name="dataEntrega"
                            valueType="date"
                            value={dayjs(formData.dataEntrega)}
                            onChange={(value) =>
                            {
                                const formattedDate = value.format("DD/MM/YYYY");
                                setFormData({
                                    ...formData,
                                    dataEntrega: formattedDate,
                                });
                                console.log(formData)
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={situacoes}
                        value={formData.situacao || null}
                        onChange={(event, newValue) =>
                        {
                            setFormData({
                                ...formData,
                                situacao: newValue
                            })
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Situação"
                                name="situacao"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="observacao"
                        multiline
                        rows={4}
                        value={formData.observacao}
                        variant="outlined"
                        onChange={(event, newValue) =>
                        {
                            setFormData({
                                ...formData,
                                observacao: newValue
                            });
                        }}
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
