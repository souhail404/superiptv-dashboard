import React, { useEffect, useState } from 'react'
import HeaderLogo from './HeaderLogo'
import { useSidebarContext } from '../hooks/useSidebarContext'
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

const Sidenav = () => {
  const {isSidebarOpen} = useSidebarContext()
  // const [location , setLocation] = useState()
  let currentLocationn = useLocation();
  const {user} = useAuthContext()

  const [location , setLocation] = useState(currentLocationn.pathname.split('/')[1] || '')
  const [ordersLength , setOrdersLength ] = useState({
    server:'',
    code:'',
    panel:'',
    total:''
  })

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
        setOrdersLength({
          server:serverOrdersLength,
          code:codeOrdersLength,
          panel:panelOrdersLength,
          total:totalOrdersLength
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
    <nav id='sidenav' className={isSidebarOpen ? 'open': 'close'}>
        <div className="sidebar-container">
            <div className="sidebar-header">
              <HeaderLogo />
            </div>
            <div className="sidebar-nav">
              <div className="sidebar-nav-wrapper">
                <Link to={'/'} onClick={()=>{setLocation('')}} className={`side-bar-elem ${location==='' ?"active" : ''}`} >
                  <div className="elem-link2">
                    <DashboardOutlinedIcon className='mean-icon' />
                    <p>Dashboard</p>
                  </div>
                </Link>
                <div onClick={()=>{setLocation('orders')}} className={`side-bar-elem ${location==='orders' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <ShoppingCartOutlinedIcon className='mean-icon' />
                    <p>orders</p>
                    {ordersLength.total? <div className='right-badge'>{ordersLength.total}</div> : ''}
                    {location==='orders' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    location==='orders' ? 
                    <div className="elem-menu">
                      <Link to={`orders/servers`} className="elem-link2 in-menu">
                        <p>servers</p>
                        {ordersLength.server? <div className='right-badge'>{ordersLength.server}</div> : ''}
                      </Link>
                      <Link to={`orders/codes`} className="elem-link2 in-menu">
                        <p>codes </p>
                        {ordersLength.code? <div className='right-badge'>{ordersLength.code}</div> : ''}
                      </Link>
                      <Link to={`orders/panels`} className="elem-link2 in-menu">
                        <p>panels</p>
                        {ordersLength.panel? <div className='right-badge'>{ordersLength.panel}</div> : ''}
                      </Link>
                    </div> : null
                  }
                </div>
                <div onClick={()=>{setLocation('servers')}} className={`side-bar-elem ${location==='servers' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <DvrOutlinedIcon className='mean-icon' />
                    <p>servers</p>
                    {location==='servers' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    location==='servers' ? 
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
                <div onClick={()=>{setLocation('codes')}} className={`side-bar-elem ${location==='codes' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <ConnectedTvIcon className='mean-icon' />
                    <p>codes</p>
                    {location==='codes' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    location==='codes' ? 
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
                <div onClick={()=>{setLocation('panels')}} className={`side-bar-elem ${location==='panels' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <LiveTvOutlinedIcon className='mean-icon' />
                    <p>panels</p>
                    {location==='panels' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    location==='panels' ? 
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
                <div onClick={()=>{setLocation('client')}} className={`side-bar-elem ${location==='client' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <PeopleAltOutlinedIcon className='mean-icon' />
                    <p>Client</p>
                    {location==='client' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    location==='client' ? 
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
                <div onClick={()=>{setLocation('link')}} className={`side-bar-elem ${location==='link' ?"active" : ''}`}>
                  <div className="elem-link2">
                    <LinkIcon className='mean-icon' />
                    <p>links</p>
                    {location==='link' ? <KeyboardArrowUpOutlinedIcon className='dd-icon' /> : <KeyboardArrowDownIcon className='dd-icon' />}
                  </div>
                  {
                    location==='link' ? 
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