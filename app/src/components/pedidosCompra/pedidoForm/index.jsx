import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ProdutoSelect from '../produtos';
import { v4 as uuidv4 } from 'uuid';
import { getFornecedores, createPedidoCompra, atualizaPedidoCompra } from '../../../services/supplyFlowApi'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { formatMoeda } from '../../../helper/numberHelper'
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import
{
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons
} from '@mui/x-data-grid';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoForm({ open, onClose: onClose, pedidoCompra })
{
    const [isFormProdutosOpen, setIsFormProdutosOpen] = useState(false);
    const [fornecedores, setFornecedores] = useState([]);
    const [itensPedido, setItemData] = useState([]);
    const [rowModesModel, setItemModesModel] = useState({});
    const [formData, setFormData] = useState({
        fornecedor: {},
        dataEntrega: dayjs(),
        situacao: 'Pendente',
        observacao: '',
    });

    const situacoes = ['Pendente', 'Aprovado'];
    const situacaoMap = {
        1: 'Pendente',
        2: 'Aprovado',
        3: 'Reprovado',
    };

    const situacaoMapDescricao = {
        'Pendente': 1,
        'Aprovado': 2,
        'Reprovado': 3,
    };

    const onCancelFormProdutos = () =>
    {
        setIsFormProdutosOpen(false)
    }

    const onCloseFormProdutos = (novoProduto) =>
    {
        setIsFormProdutosOpen(false);
        if (!novoProduto || Object.keys(novoProduto).length === 0)
        {
            return;
        }

        const newItem = {
            id: uuidv4(),
            produtoId: novoProduto.id,
            codigoProduto: novoProduto.codigoProduto,
            descricaoProduto: novoProduto.descricaoProduto,
            precoUnitario: novoProduto.precoUnitario,
            quantidade: 0,
            precoTotal: 0,
            isNew: true,
        };
        setItemData([...itensPedido, newItem]);
    };

    async function consultaFornecedores()
    {
        var fornecedores = await getFornecedores();
        setFornecedores(fornecedores);
    }

    function alimentaInformacoesPedidoCompra()
    {
        if (pedidoCompra)
        {
            var pedido = {
                ...pedidoCompra,
                fornecedor: pedidoCompra.fornecedor,
                dataEntrega: pedidoCompra.dataEntrega || '',
                observacao: pedidoCompra.observacao || '',
                situacao: situacaoMap[pedidoCompra.situacao] || ''
            };

            setFormData(pedido);
            if (pedido.itens.length > 0)
            {
                setItemData(pedido.itens);
            }
        }
    }

    useEffect(() =>
    {
        console.log("Pedido", pedidoCompra)
        consultaFornecedores();
        alimentaInformacoesPedidoCompra();
    }, []);

    function criaPedido()
    {
        const dataEntregaString = formData.dataEntrega.format("YYYY-MM-DD");
        const dataEntregaDateOnly = dayjs(dataEntregaString).format("YYYY-MM-DD");
        var pedido = {
            itens: itensPedido.map(item =>
            ({
                produtoId: item.produtoId,
                quantidade: item.quantidade
            })),
            dataEntrega: dataEntregaDateOnly,
            fornecedor: formData.fornecedor.id,
            observacao: formData.observacao
        };
        createPedidoCompra(pedido);
    }

    function atualizaPedido()
    {
        const itens = [];
        itensPedido.forEach((item) =>
        {
            itens.push({ produtoId: item.produtoId, quantidade: item.quantidade });
        });

        const dataEntregaDateOnly = dayjs(formData.dataEntrega).format("YYYY-MM-DD");
        const pedido = {
            itens: itens,
            fornecedor: formData.fornecedor.id,
            observacao: formData.observacao,
            dataEntrega: dataEntregaDateOnly,
            situacao: situacaoMapDescricao[formData.situacao],
        }
        atualizaPedidoCompra(pedido, pedidoCompra.id);
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

    const onAddItem = () =>
    {
        setIsFormProdutosOpen(true);
    };

    const onSaveClick = (id) => () =>
    {
        setItemModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const onEditClick = (id) => () =>
    {
        setItemModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const onDeleteClick = (id) => () =>
    {
        setItemData(itensPedido.filter((row) => row.id !== id));
    };

    const onRowModesModelChange = (newRowModesModel) =>
    {
        setItemModesModel(newRowModesModel);
    };

    const onRowEditStop = (params, event) =>
    {
        if (params.reason === GridRowEditStopReasons.rowFocusOut)
        {
            event.defaultMuiPrevented = true;
        }
    };

    const onProcessRowUpdate = (newRow) =>
    {
        const updatedRow = { ...newRow, isNew: false };
        updatedRow.precoTotal = updatedRow.precoUnitario * updatedRow.quantidade
        setItemData(itensPedido.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const onCancelClick = (id) => () =>
    {
        setItemModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = itensPedido.find((row) => row.id === id);
        if (editedRow.isNew)
        {
            setItemData(itensPedido.filter((row) => row.id !== id));
        }
    };

    const columns = [
        {
            field: 'codigoProduto',
            headerName: 'Código do Produto',
            width: 500,
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
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
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
                        getOptionLabel={(option) => option.nomeFornecedor || ''}
                        value={formData.fornecedor}
                        onChange={(event, newValue) =>
                        {
                            console.log("Novo fornecedor", newValue)
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
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="pt-br">
                        <DatePicker
                            label="Entrega"
                            name="dataEntrega"
                            valueType="date"
                            value={dayjs(formData.dataEntrega)}
                            sx={{ width: '100%' }}
                            onChange={(value) =>
                            {
                                setFormData({
                                    ...formData,
                                    dataEntrega: value
                                });
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={situacoes}
                        readOnly={true}
                        value={formData.situacao || null}
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
                        onChange={(event) =>
                        {
                            setFormData({
                                ...formData,
                                observacao: event.target.value
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
                    rowModesModel={rowModesModel}
                    editMode="row"
                    pageSize={5}
                    onRowModesModelChange={onRowModesModelChange}
                    onRowEditStop={onRowEditStop}
                    processRowUpdate={onProcessRowUpdate}
                />
            </div>
            {isFormProdutosOpen && (
                <ProdutoSelect open={isFormProdutosOpen} onClose={onCloseFormProdutos} onCancel={onCancelFormProdutos} />
            )}
        </Dialog>
    );
}