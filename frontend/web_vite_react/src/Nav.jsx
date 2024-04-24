import { useState } from 'react';
import { NavLink } from 'react-router-dom';


function Nav() {
  const loggedin = false;
  let logged = (<div></div>);
  if (!loggedin) {logged = (<div className='nav_info_ctr'>
  <div className='nav_info_item nav_hover'><NavLink className='nav_link' to="/login">Login</NavLink></div>
  <div className='nav_info_item nav_hover'><NavLink className='nav_link' to="/reg">Register</NavLink></div>
</div>)} 
  return (
    <div className='nav'>
      <NavLink className='nav_logo' to="/"></NavLink>
      <div className='nav_menu'>
        <div className='nav_menu_ctr'>
          <div className={'nav_menu_item nav_hover'}><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active' : 'nav_link'; }} to="/home">Home</NavLink></div>
          <div className='nav_menu_item nav_hover'><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active' : 'nav_link'; }} to="/profile">Profile</NavLink></div>
          <div className='nav_menu_item nav_hover'><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active' : 'nav_link'; }} to="/games">Games</NavLink></div>
        </div>
      </div>
      <div className='nav_info'>
      {logged}
      </div>
    </div>
  )
}
// {({isActive}) => { return isActive ? 'nav_menu_item nav_active' : 'nav_menu_item nav_hover'; }}
export default Nav;