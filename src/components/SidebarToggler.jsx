import React, { useEffect } from 'react'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { IconButton } from '@mui/material';
import { useSidebarContext } from "../hooks/useSidebarContext";
import { useToggleSidebar } from '../hooks/useToggleSidebar';


const SidebarToggler = () => {
    const {isSidebarOpen} = useSidebarContext()
    const {toggleSidebar} = useToggleSidebar()

    console.log(isSidebarOpen);

    return (
        <div className='sidebar-toggler-wrapper'>
            <IconButton
                id="sidebar-toggler-btn"
                onClick={()=>{toggleSidebar()}}
            >
                <MenuOpenIcon fontSize='inherit' color='inherit' />
            </IconButton>
        </div>
    )
}

export default SidebarToggler