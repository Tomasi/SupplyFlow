import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { getProdutos, getProdutosByFornecedor } from '../../services/supplyFlowApi';
import { Autocomplete } from '@mui/material';

export default function ProdutoSelect({ open, onClose: onClose, onCancel: onCancel, onProdutoSelect: onProdutoSelect, fornecedor })
{
    const [produtos, setProdutos] = React.useState([])
    const [produto, setProduto] = React.useState({});
    async function consultaProdutos()
    {
        let produtos;
        if (fornecedor)
        {
            produtos = await getProdutosByFornecedor(fornecedor.id);
        } else
        {
            produtos = await getProdutos();
        }

        setProdutos(produtos);
    }

    useEffect(() =>
    {
        consultaProdutos();
    }, [])

    const handleClose = (reason) =>
    {
        if (reason !== 'backdropClick')
        {
            onClose(produto);
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
                            <Autocomplete
                                options={produtos}
                                getOptionLabel={(option) => option.descricaoProduto || ''}
                                value={produto || null}
                                onChange={(event, newValue) =>
                                {
                                    setProduto(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Produto"
                                        name="produto"
                                        variant="outlined"
                                    />
                                )}
                            />
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