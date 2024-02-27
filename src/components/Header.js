import React from 'react'

import ProfileDropDown from './ProfileDropDown'
import NotificationsDropDown from './NotificationsDropDown'
import HeaderLogo from './HeaderLogo'
import SidebarToggler from './SidebarToggler'


const Header = () => {
  return (
    <header id='main-header'>
      <div className='left-container'>
        <HeaderLogo />
      </div>
      <div className='right-container'>
        <NotificationsDropDown/>
        <ProfileDropDown />
        <SidebarToggler />
      </div>
    </header>
  )
}

export default Header