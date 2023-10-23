import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ProdutoSelect({ open, onClose: onClose, onCancel: onCancel, fornecedor, onProdutoSelect: onProdutoSelect })
{
    const [produtos, setProdutosFornecedor] = React.useState([])
    const [produto, setProduto] = React.useState({});

    const onProdutoChanged = (event) =>
    {
        const selectedProdutoId = event.target.value;
        const selectedProduto = produtos.find((produto) => produto.id === selectedProdutoId);
        console.log("Produto selecionado", selectedProduto);
        setProduto(selectedProduto)
        onProdutoSelect(selectedProduto);
    };

    useEffect(() =>
    {
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
                setProdutosFornecedor(data);
            }
        }).catch((error) =>
        {
            console.error("Erro ao buscar os produtos do fornecedor", error)
        });
    })

    const handleClose = (reason) =>
    {
        if (reason !== 'backdropClick')
        {
            onClose();
        }
    };

    const handleCancel = () =>
    {
        onCancel();
    }

    return (
        <div>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Seleção de Produtos</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel htmlFor="demo-dialog-native">Produtos</InputLabel>
                            <Select
                                native
                                getOptionLabel={(option) => option.descricaoProduto}
                                value={produto}
                                onChange={onProdutoChanged}
                                input={<OutlinedInput label="Produtos" id="demo-dialog-native" />}
                            >
                                {produtos.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.descricaoProduto}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}