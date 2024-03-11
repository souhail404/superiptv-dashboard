import React, { useEffect, useRef, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';

import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, IconButton, Skeleton } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NotificationsMenu from './NotificationsMenu';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 260,
    bgcolor:"#081124",  
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {user} = useAuthContext()

  const [page, setPage] =useState(1);
  const [pageSize, setPageSize] =useState(6);
  const [totalPages, setTotalPages] =useState(0);

  const [isFetching, setIsFetching] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]); 
  const [notifsCount, setNotifsCount] = useState(0);
  const [unseenNotifsCount, setUnseenNotifsCount] = useState(0);


  const getNotifications = async()=>{
    try{
        setIsFetching(true)
        const res = await fetch(`/api/admin-notification?page=${page}&pageSize=${pageSize}`,{
            headers: {
                Authorization: `Bearer ${JSON.parse(user).token}`,
            },
        })
        const response = await res.json();
        if(res.ok){
            const {notifications, totalPages , unSeenCount} = response;
            setNotificationsData((prevNotifs) => [...prevNotifs,  ...notifications]);
            setUnseenNotifsCount(unSeenCount);    
            setTotalPages(totalPages)          
        }
        else{
          toast.error(`error fetching notificatons :${response.message}`)
        }
        setIsFetching(false)
    }catch(err){
        console.log(err);
        setIsFetching(false)
    } 
  }

  useEffect(()=>{
    getNotifications();
  },[page])

  return (
    <div>
      <IconButton
        id="notif-dd-btn"
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
      >
        <Badge badgeContent={unseenNotifsCount} overlap="circular" color="error" max={9} showZero>
            <NotificationsIcon color="inherit" fontSize='inherit' />
        </Badge>
      </IconButton>
      <StyledMenu
        id="notifications-menu"
        MenuListProps={{
          'aria-labelledby': 'notif-dd-btn',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      > 
        <div className="menu-container">
          <NotificationsMenu page={page} setPage={setPage} totalPages={totalPages} open={open} notificationsData={notificationsData} isFetching={isFetching}/> 
          {/* <div className="action">
              <button>see All</button>
          </div> */}
        </div> 
        
      </StyledMenu>
    </div>
  );
}


