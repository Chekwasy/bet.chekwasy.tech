import { useState } from 'react';
import { Link } from 'react-router-dom';


function Nav() {

  return (
    <div className='nav'>
      <div className='nav_logo'></div>
      <div className='nav_menu'>
        <div className='nav_menu_ctr'>
          <div className='nav_menu_item'><Link className='nav_link' to="/">Home</Link></div>
          <div className='nav_menu_item'><Link className='nav_link' to="/profile">Profile</Link></div>
          <div className='nav_menu_item'><Link className='nav_link' to="/games">Games</Link></div>
        </div>
      </div>
      <div className='nav_info'>
        <div className='nav_info_ctr'>
          <div className='nav_info_item'><Link className='nav_link' to="/login">Login</Link></div>
          <div className='nav_info_item'><Link className='nav_link' to="/reg">Register</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Nav;