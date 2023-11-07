import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ProdutoSelect from '../pedidosCompra/produtos';
import
{
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
} from '@mui/x-data-grid';

export default function Entrada()
{
    const [produtos, setRows] = useState([]);
    const [isFormProdutosOpen, setIsFormProdutosOpen] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [rowModesModel, setItemModesModel] = useState({});

    const addProduto = () =>
    {
        setIsFormProdutosOpen(true);
    };

    const removeProduto = () =>
    {
        const updatedRows = produtos.filter((row) => !rowSelectionModel.includes(row.id));
        setRows(updatedRows);
    };

    const onRowModesModelChange = (newRowModesModel) =>
    {
        setItemModesModel(newRowModesModel);
    };

    const onSaveClick = (id) => () =>
    {
        setItemModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const onEditClick = (id) => () =>
    {
        setItemModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const onCancelClick = (id) => () =>
    {
        setItemModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = produtos.find((row) => row.id === id);
        if (editedRow.isNew)
        {
            setItemData(produtos.filter((row) => row.id !== id));
        }
    };

    const onProcessRowUpdate = (newRow) =>
    {
        const updatedRow = { ...newRow, isNew: false };
        setRows(produtos.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const onSubmit = () =>
    {
        console.log("Submit");
    };

    const onCloseFormProdutos = (novoProduto) =>
    {
        console.log(novoProduto);
        setIsFormProdutosOpen(false);
        if (!novoProduto || Object.keys(novoProduto).length === 0)
        {
            return;
        }

        var newRowId = Math.max(0, ...produtos.map((row) => row.id)) + 1;
        setRows([...produtos, { id: newRowId, Produto: novoProduto, isNew: true }]);
    };

    const onCancelFormProdutos = () =>
    {
        setIsFormProdutosOpen(false)
    }

    const columns = [
        {
            field: 'produto',
            headerName: 'Produto',
            flex: 1,
            editable: false,
            renderCell: (params) =>
            {
                return `${params.row?.Produto?.codigoProduto} - ${params.row?.Produto?.descricaoProduto}`;
            },
        },
        {
            field: 'quantidade',
            headerName: 'Quantidade',
            flex: 1,
            editable: true
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
                ];
            },
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                />
                <Box sx={{ flexGrow: 1 }} />
                <Button autoFocus color="inherit" onClick={onSubmit}>
                    Salvar
                </Button>
            </Toolbar>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button size="large" onClick={addProduto}>
                    Adicionar
                </Button>
                {produtos.length >= 1 && (
                    <Button size="large" onClick={() => removeProduto()}>
                        Remover
                    </Button>
                )}
            </Stack>
            <DataGrid
                autoHeight
                disableRowSelectionOnClick
                rows={produtos}
                columns={columns}
                rowModesModel={rowModesModel}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) =>
                {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onRowModesModelChange={onRowModesModelChange}
                processRowUpdate={onProcessRowUpdate}
            />
            {isFormProdutosOpen && (
                <ProdutoSelect open={isFormProdutosOpen} onClose={onCloseFormProdutos} onCancel={onCancelFormProdutos} />
            )}
        </Box>
    );
}
