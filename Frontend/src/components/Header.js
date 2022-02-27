import React from 'react'
import {ReactComponent as MenuButton} from '../icons/menu.svg';

const Header = ({toggleSidebar}) => {


  return (<>


    <div className="header">
      <span className='menu-button'><MenuButton className='menu-icon' onClick={() =>{toggleSidebar()}} width="40px" height="40px"/></span>
      <p className='title' >Chatbot</p>

    </div>
  </>
  )
}

export default Header