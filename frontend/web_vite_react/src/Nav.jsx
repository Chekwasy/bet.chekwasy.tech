import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import Cookie from 'js-cookie';
import { useDispatch } from 'react-redux';
import { navbarUpdate } from './State/navbarState';
import { useSelector } from 'react-redux';

let cookietoken = Cookie.get('x-token') || '';
const urlNS = ''; //for making change to https easy
const local = '';

function Nav() {
  const dispatch = useDispatch();
  const navbar = useSelector(state => state.navbarState);
  const [loggedin, setLoggedin] = useState(false);
  useEffect(() => {
    $.ajax({
      type: 'GET',
      url: urlNS + `${local}/api/v1/users/me`,
      contentType: 'application/json',
      headers: {
        'x-token': cookietoken,
      },
      success: function(res) {
        setLoggedin(true);
        dispatch(navbarUpdate({'usr': {...res}}));
      },
      error: function(err) {
        setLoggedin(false);
      }
    });
  }, []);

  const applybal_res = () => {
    $.ajax({
      type: 'GET',
      url: urlNS + `${local}/api/v1/users/me`,
      contentType: 'application/json',
      headers: {
        'x-token': cookietoken,
      },
      success: function(res) {
        dispatch(navbarUpdate({'usr': {...res}}));
      },
      error: function(err) {
        setLoggedin(false);
      }
    });
  };

  const bal_res = () => {
    $.ajax({
      type: 'PUT',
      url: urlNS + `${local}/api/v1/bal_res`,
      contentType: 'application/json',
      data: JSON.stringify({newbal: 100000}),
      headers: {
        'x-token': cookietoken,
      },
      success: function(res) {
        applybal_res();
      }
    });
    //console.log('from nav');
  };

  const logout = () => {
    $.ajax({
      type: 'GET',
      url: urlNS + `${local}/api/v1/disconnect`,
      contentType: 'application/json',
      headers: {
        'x-token': cookietoken,
      },
      success: function(res) {
        applybal_res();
      }
    });
  };

  
  return (
    <div className='nav'>
      <NavLink className='nav_logo' to="/"></NavLink>
      <div className='nav_menu'>
        <div className='nav_menu_ctr'>
          <div className={'nav_menu_item'}><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active nav_hover' : 'nav_link nav_hover'; }} to="/home">Home</NavLink></div>
          <div className='nav_menu_item'><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active nav_hover' : 'nav_link nav_hover'; }} to="/ocgames">Games</NavLink></div>
          <div className='nav_menu_item'><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active nav_hover' : 'nav_link nav_hover'; }} to="/profile">Profile</NavLink></div>
          <div className='nav_menu_item'><NavLink className={({isActive}) => { return isActive ? 'nav_link nav_active nav_hover' : 'nav_link nav_hover'; }} to="/about">About</NavLink></div>
        </div>
      </div>
      {!loggedin && (
      <div className='nav_info'>
        <div className='nav_info_ctr'>
          <div className='nav_info_item'><NavLink className='nav_link nav_hover' to="/login">Login</NavLink></div>
          <div className='nav_info_item'><NavLink className='nav_link nav_hover' to="/reg">Register</NavLink></div>
        </div>
      </div>
      )}
      <div>
        {loggedin && (
          <div className='nav_loggedin'>
            <div className='nav_profilepic'></div>
            <div className='nav_accountbal'>NGN {Intl.NumberFormat('en-US').format(navbar.usr.account_balance)}</div>
            <div className='nav_reloadaccountbal' onClick={bal_res}>Reload</div>
            <div className='logout' onClick={logout}>Logout</div>
          </div>
        )}
      </div>
    </div>
  )
}
// {({isActive}) => { return isActive ? 'nav_menu_item nav_active' : 'nav_menu_item nav_hover'; }}
export default Nav;
