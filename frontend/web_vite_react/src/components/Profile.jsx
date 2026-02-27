import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import Cookie from 'js-cookie';
import { useSelector } from 'react-redux';
let cookietoken = Cookie.get('x-token') || '';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const urlNS = ''; //for making change to https easy

function Profile() {
  const navbar = useSelector(state => state.navbarState);
  const navv = {usr: {email: '', first_name: '', last_name: '', phone: '', account_balance: '' }};
  return (
    <div className='profile_comp'>
        <div className='p_pic_display'>
          <div className='profile_pic'></div>
          <div className='p_user_email'>{navbar.usr.email}</div>
        </div>
        <div className='p_user'>
          <div className='p_user_info'>
            Account balance<div className='user_'>{`NGN ${Intl.NumberFormat('en-US').format(navbar.usr.account_balance)}`}</div>
            First name<div className='user_'>{navbar.usr.first_name}</div>
            Last name<div className='user_'>{navbar.usr.last_name}</div>
            Phone<div className='user_'>{navbar.usr.phone}</div>
          </div>
          <div className='p_user_update'> <button>Update</button></div>
        </div>
    </div>
  );
}

export default Profile;
