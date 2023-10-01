import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoForm({ open, onClose })
{
    const [formData, setFormData] = useState({
        fornecedor: '',
        dataEntrega: '',
        statusPedido: '',
        observacoes: '',
    });

    const [itemData, setItemData] = useState([]);
    const [itemFormData, setItemFormData] = useState({
        codigoProduto: '',
        quantidade: '',
        precoUnitario: '',
        precoTotal: '',
    });

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
            id: itemData.length + 1
        };
        setItemData([...itemData, newItem]);
    };

    const handleDeleteSelectedItems = () =>
    {
        const selectedIds = new Set(itemData.map((item) => item.id));
        console.log("Deletar item " + selectedIds)
        const updatedItemData = itemData.filter((item) => !selectedIds.has(item.id));
        setItemData(updatedItemData);
    };

    const handleClose = () =>
    {
        onClose();
    };

    const handleSubmit = () =>
    {
        console.log('Dados do Pedido:', formData);
        console.log('Itens do Pedido:', itemData);
        onClose();
    };

    const columns = [
        {
            field: 'codigoProduto',
            headerName: 'Código do Produto',
            width: 200,
            editable: true,
        },
        {
            field: 'quantidade',
            headerName: 'Quantidade',
            width: 150,
            editable: true,
        },
        {
            field: 'precoUnitario',
            headerName: 'Preço Unitário',
            width: 150,
            editable: true,
        },
        {
            field: 'precoTotal',
            headerName: 'Preço Total',
            width: 150,
        },
    ];

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
                {/* Campos do formulário */}
                <Grid item xs={4} sm={4}>
                    <TextField
                        fullWidth
                        label="Fornecedor"
                        name="fornecedor"
                        value={formData.fornecedor}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={4} sm={4}>
                    <TextField
                        fullWidth
                        label="Data de Entrega Esperada"
                        name="dataEntrega"
                        type='date'
                        value={formData.dataEntrega}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4} sm={4}>
                    <TextField
                        fullWidth
                        label="Status do Pedido"
                        name="statusPedido"
                        value={formData.statusPedido}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Observações"
                        name="observacoes"
                        multiline
                        rows={4}
                        value={formData.observacoes}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        onClick={handleAddItem}
                    >
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
                    checkboxSelection
                />
            </div>
        </Dialog>
    );
}
