import React, { useState, useEffect } from 'react';
import GridPedidos from './gridPedidos/index'
import PedidoForm from './pedidoForm';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';

function NavigatorButtons()
{

    const [isFormOpen, setIsFormOpen] = useState(false);


    var OnNovoPedidoClick = () =>
    {
        setIsFormOpen(true);
    }

    const OnCloseDialog = () =>
    {
        setIsFormOpen(false);
    };

    var onAprovacaoClick = () =>
    {
        alert("aprovar")
    }

    var onReprovacaoClick = () =>
    {
        alert("reprovar")
    }

    return (
        <div>
            <ButtonGroup size="small" aria-label="small button group">
                <Button onClick={OnNovoPedidoClick} className='novoPedidoButton' variant="outlined">Novo</Button>
                <Button onClick={onAprovacaoClick} className='aprovacaoButton' variant="outlined">Aprovar</Button>
                <Button onClick={onReprovacaoClick} className='reprovacaoButton' variant="outlined">Reprovar</Button>
            </ButtonGroup>
            {isFormOpen && (
                <PedidoForm open={isFormOpen} onClose={OnCloseDialog} />
            )}
        </div>
    );
}

const PedidosCompra = () =>
{
    return (
        <div>
            <div><GridPedidos /></div>
            <br />
            <div><NavigatorButtons /></div>
        </div>
    )
}
export default PedidosCompra