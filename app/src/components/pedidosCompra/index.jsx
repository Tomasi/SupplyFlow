import GridPedidos from '../gridPedidos'
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';

function NavigatorButtons()
{
    var onAprovacaoClick = () =>
    {
        alert("aprove")
    }

    var onReprovacaoClick = () =>
    {
        alert("reprove")
    }

    var OnNovoPedidoClick = () =>
    {
        alert("novo pedido")
    }

    return (
        <ButtonGroup size="small" aria-label="small button group">
            <Button onClick={OnNovoPedidoClick} className='novoPedidoButton' variant="outlined">Novo Pedido</Button>
            <Button onClick={onAprovacaoClick} className='aprovacaoButton' variant="outlined">Aprovar Pedido</Button>
            <Button onClick={onReprovacaoClick} className='reprovacaoButton' variant="outlined">Reprovar Pedido</Button>
        </ButtonGroup>
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