import React from 'react'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';


const Layout = () => {
  const { user } = useAuthContext();

  return (
    <>    
          { user==null ? null : <SideNav />}
          <div id='main-container' className={user==null ? 'guest' : ''}>
            { user==null ? null : <Header />}
            <main id='main-content' className={user==null ? 'guest' : ''}>
              <Outlet />
            </main>
            { user==null ? null : <Footer />}
          </div>        
    </>
  )
}

export default Layout