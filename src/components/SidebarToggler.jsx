import React from 'react'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { IconButton } from '@mui/material';
import { useShop } from '../context/ShopContext'


const SidebarToggler = () => {
    const { shopData, updateShopData } = useShop();
    
    return (
        <div className='sidebar-toggler-wrapper'>
            <IconButton
                id="sidebar-toggler-btn"
                onClick={()=>{updateShopData({isNavBarOpen:!shopData.isNavBarOpen})}}
            >
                <MenuOpenIcon fontSize='inherit' color='inherit' />
            </IconButton>
        </div>
    )
}

export default SidebarToggler