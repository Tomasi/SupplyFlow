import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, TextField, Autocomplete } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoForm({ open, onClose, pedidoCompra })
{
    const [formData, setFormData] = useState({
        Fornecedor: '',
        DataEntrega: '',
        Situacao: '',
        Observacao: '',
    });

    const [itemData, setItemData] = useState([]);
    const [itemFormData, setItemFormData] = useState({
        CodigoProduto: '',
        DescricaoProduto: '',
        Quantidade: '',
        PrecoUnitario: '',
        PrecoTotal: '',
    });

    const [fornecedorProdutos, setFornecedorProdutos] = useState({});

    useEffect(() =>
    {

        fetch("http://localhost:5050/fornecedores", {
            method: 'GET'
        }).then((response) =>
        {
            if (!response.ok)
            {
                throw new Error('Erro ao buscar dados dos fornecedores');
            }
            return response.json();
        }).then((data) =>
        {
            const nomesFornecedores = data.map(fornecedor => fornecedor.NomeFornecedor);
            setFornecedorProdutos(nomesFornecedores);
        }).catch((error) =>
        {
            throw new Error('Erro ao buscar dados dos fornecedores: ', error);
        });

        if (pedidoCompra)
        {
            setFormData(pedidoCompra);

            if (pedidoCompra.Itens && pedidoCompra.Itens.length > 0)
            {
                setItemData(pedidoCompra.Itens);
            }
        }
    }, [pedidoCompra]);

    const handleChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleItemChange = (params) =>
    {
        const itemId = params.id;
        const itemIndex = itemData.findIndex((item) => item.id === itemId);
        const updatedItem = {
            ...itemData[itemIndex],
            [params.field]: params.props.value,
        };
        const updatedItemData = [...itemData];
        updatedItemData[itemIndex] = updatedItem;
        setItemData(updatedItemData);
    };

    const handleAddItem = () =>
    {
        const newItem = {
            ...itemFormData,
            id: itemData.length + 1,
        };
        setItemData([...itemData, newItem]);
    };

    const handleDeleteSelectedItems = () =>
    {
        const selectedIds = new Set(itemData.map((item) => item.id));
        const updatedItemData = itemData.filter((item) => !selectedIds.has(item.id));
        setItemData(updatedItemData);
    };

    const handleFornecedorChange = (event, newValue) =>
    {
        setItemData([]);
        setFornecedorProdutos((prevState) => ({
            ...prevState,
            [formData.Fornecedor]: itemData,
        }));

        handleChange({ target: { name: 'Fornecedor', value: newValue } });
    };

    const handleClose = () =>
    {
        onClose();
    };

    const handleSubmit = () =>
    {
        onClose();
    };

    const columns = [
        {
            field: 'CodigoProduto',
            headerName: 'Código do Produto',
            width: 500,
            editable: true,
            renderCell: (params) => (
                <Autocomplete
                    options={fornecedorProdutos[formData.Fornecedor] || []}
                    value={params.value || null}
                    onChange={(event, newValue) =>
                    {
                        handleItemChange({
                            id: params.id,
                            field: params.field,
                            props: { value: newValue },
                        });
                    }}
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" fullWidth />
                    )}
                />
            ),
        },
        {
            field: 'DescricaoProduto',
            headerName: 'Descrição Produto',
            width: 200,
        },
        {
            field: 'Quantidade',
            headerName: 'Quantidade',
            width: 150,
            editable: true,
        },
        {
            field: 'PrecoUnitario',
            headerName: 'Preço Unitário',
            width: 150,
            editable: true,
        },
        {
            field: 'PrecoTotal',
            headerName: 'Preço Total',
            width: 150,
        },
    ];

    const situacoes = ['Pendente', 'Aprovado', 'Em trânsito', 'Entregue'];

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Formulário de Pedido
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={fornecedorProdutos}
                        value={formData.Fornecedor || null}
                        onChange={handleFornecedorChange}
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
                        label="Data de Entrega Esperada"
                        name="DataEntrega"
                        type="date"
                        value={formData.DataEntrega}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Autocomplete
                        options={situacoes}
                        value={formData.Situacao || null}
                        onChange={(event, newValue) =>
                        {
                            handleChange({ target: { name: 'Situacao', value: newValue } });
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
                        name="Observacoes"
                        multiline
                        rows={4}
                        value={formData.Observacao}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={handleAddItem}>
                        Adicionar Item
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleDeleteSelectedItems}
                        sx={{ ml: 1 }}
                    >
                        Excluir Item(s)
                    </Button>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%', marginTop: '16px' }}>
                <DataGrid
                    rows={itemData}
                    columns={columns}
                    pageSize={5}
                    onEditCellChangeCommitted={handleItemChange}
                    checkboxSelection={true}
                    disableRowSelectionOnClick={true}
                />
            </div>
        </Dialog>
    );
}
