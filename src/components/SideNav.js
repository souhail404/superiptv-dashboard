import React, { useEffect, useState } from 'react'
import HeaderLogo from './HeaderLogo'
import { useShop } from '../context/ShopContext'
import { Link, useLocation } from 'react-router-dom'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LinkIcon from '@mui/icons-material/Link';
import { useAuthContext } from '../hooks/useAuthContext';
// import { useSidebarContext } from '../hooks/useSidebarContext';

const Sidenav = () => {
  // const {isSidebarOpen} = useSidebarContext();
  const { shopData, updateShopData } = useShop();

  let currentLocation = useLocation();
  const {user} = useAuthContext()

  const getOrdersLength = async() =>{
    try{
      const res = await fetch(`/api/general`,{
          headers: {
              Authorization: `Bearer ${JSON.parse(user).token}`,
          },
      })
      const response = await res.json();
      if(res.ok){
        const {serverOrdersLength, codeOrdersLength , panelOrdersLength, totalOrdersLength} = response;
        updateShopData({ 
          codeOrdersCount:codeOrdersLength,
          serverOrdersCount:serverOrdersLength,
          panelOrdersCount:panelOrdersLength,
          totalOrdersCount:totalOrdersLength,
          activeTab:currentLocation.pathname.split('/')[1] || '',
        });
      }
    }catch(err){
        console.log(err);
    } 
  }

  useEffect(()=>{
    getOrdersLength()
  },[])

  return (
    <nav id='sidenav' className={shopData.isNavBarOpen ? 'open' : 'close'} >
        <div className="sidebar-container">
            <div className="sidebar-header">
              <HeaderLogo />
            </div>
            <div className="sidebar-nav">
              <div className="sidebar-nav-wrapper">
                <Link to={'/'} onClick={()=>{updateShopData({activeTab:''})}} className={`side-bar-elem ${shopData.activeTab==='' ?"active" : ''}`} >
                  <div className="elem-link2">
                    <DashboardOutlinedIcon className='mean-icon' />
                    <p>Dashboard</p>
                  </div>
                </Link>
                <div onClick={()=>{updateShopData({activeTab:'orders'})}} className={`side-bar-elem ${shopData.activeTab==='orders' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <ShoppingCartOutlinedIcon className='mean-icon' />
                    <p>orders</p>
                    {shopData.totalOrdersCount? <div className='right-badge'>{shopData.totalOrdersCount}</div> : ''}
                    {shopData.activeTab==='orders' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    shopData.activeTab==='orders' ? 
                    <div className="elem-menu">
                      <Link to={`orders/servers`} className="elem-link2 in-menu">
                        <p>servers</p>
                        {shopData.serverOrdersCount? <div className='right-badge'>{shopData.serverOrdersCount}</div> : ''}
                      </Link>
                      <Link to={`orders/codes`} className="elem-link2 in-menu">
                        <p>codes </p>
                        {shopData.codeOrdersCount? <div className='right-badge'>{shopData.codeOrdersCount}</div> : ''}
                      </Link>
                      <Link to={`orders/panels`} className="elem-link2 in-menu">
                        <p>panels</p>
                        {shopData.panelOrdersCount? <div className='right-badge'>{shopData.panelOrdersCount}</div> : ''}
                      </Link>
                    </div> : null
                  }
                </div>
                <div onClick={()=>{updateShopData({activeTab:'servers'})}} className={`side-bar-elem ${shopData.activeTab==='servers' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <DvrOutlinedIcon className='mean-icon' />
                    <p>servers</p>
                    {shopData.activeTab==='servers' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    shopData.activeTab==='servers' ? 
                    <div className="elem-menu">
                      <Link to={`servers`} className="elem-link2 in-menu">
                        <p>All servers</p>
                      </Link>
                      <Link to={`servers/add`} className="elem-link2 in-menu">
                        <p>Add server</p>
                      </Link>
                    </div> : null
                  }
                </div>
                <div onClick={()=>{updateShopData({activeTab:'codes'})}} className={`side-bar-elem ${shopData.activeTab==='codes' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <ConnectedTvIcon className='mean-icon' />
                    <p>codes</p>
                    {shopData.activeTab==='codes' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    shopData.activeTab==='codes' ? 
                    <div className="elem-menu">
                      <Link to={`codes`} className="elem-link2 in-menu">
                        <p>All codes</p>
                      </Link>
                      <Link to={`codes/add`} className="elem-link2 in-menu">
                        <p>Add code</p>
                      </Link>
                    </div> : null
                  }
                </div>
                <div onClick={()=>{updateShopData({activeTab:'panels'})}} className={`side-bar-elem ${shopData.activeTab==='panels' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <LiveTvOutlinedIcon className='mean-icon' />
                    <p>panels</p>
                    {shopData.activeTab==='panels' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    shopData.activeTab==='panels' ? 
                    <div className="elem-menu">
                      <Link to={`panels`} className="elem-link2 in-menu">
                        <p>All panels</p>
                      </Link>
                      <Link to={`panels/add`} className="elem-link2 in-menu">
                        <p>Add panel</p>
                      </Link>
                    </div> : null
                  }
                </div>
                <div onClick={()=>{updateShopData({activeTab:'client'})}} className={`side-bar-elem ${shopData.activeTab==='client' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <PeopleAltOutlinedIcon className='mean-icon' />
                    <p>Client</p>
                    {shopData.activeTab==='client' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    shopData.activeTab==='client' ? 
                    <div className="elem-menu">
                      <Link to={`client`} className="elem-link2 in-menu">
                        <p>All Clients</p>
                      </Link>
                      <Link to={`client/add`} className="elem-link2 in-menu">
                        <p>Add client</p>
                      </Link>
                    </div> : null
                  }
      
                </div>
                <div onClick={()=>{updateShopData({activeTab:'link'})}} className={`side-bar-elem ${shopData.activeTab==='link' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <LinkIcon className='mean-icon' />
                    <p>links</p>
                    {shopData.activeTab==='link' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    shopData.activeTab==='link' ? 
                    <div className="elem-menu">
                      <Link to={`link`} className="elem-link2 in-menu">
                        <p>All links</p>
                      </Link>
                      <Link to={`link/add`} className="elem-link2 in-menu">
                        <p>Add link</p>
                      </Link>
                    </div> : null
                  }
      
                </div>
              </div>  
            </div>
            <div className="sidebar-footer">

            </div>
        </div>
    </nav>
  )
}

export default Sidenav