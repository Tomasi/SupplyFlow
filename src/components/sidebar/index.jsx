import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function TemporaryDrawer({ state, setState, toggleDrawer })
{
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Home', 'Estoque', 'Pedidos'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton href={`/${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}>
                            <ListItemIcon>
                                {GetImageIcon(text)}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Entrada', 'Saída'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton href={`/${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}>
                            <ListItemIcon>
                                {GetImageIcon(text)}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    function GetImageIcon(text)
    {
        if (text == "Home")
        {
            return <HomeIcon />
        } else if (text == "Estoque")
        {
            return <InventoryIcon />
        } else if (text == "Pedidos")
        {
            return <ShoppingCartIcon />
        } else if (text == "Entrada") 
        {
            return <InboxIcon />
        } else if (text == "Saída")
        {
            return <ShoppingCartCheckoutIcon />
        }
    }

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}