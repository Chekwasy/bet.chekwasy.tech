import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import Cookie from 'js-cookie';
let cookietoken = Cookie.get('x-token') || '';
const urlNS = 'http://'; //for making change to https easy

function Profile() {
  const [getme, setGetme] = useState({email: '', first_name: '', last_name: '', phone: '', account_balance: ''});
  useEffect(() => {
    $.ajax({
      type: 'GET',
      url: urlNS + 'localhost:5000/api/v1/users/me',
      contentType: 'application/json',
      headers: {
        'x-token': cookietoken,
      },
      success: function(res) {
        setGetme({...res});
      },
    });
  }, []);
  return (
    <div className='profile_comp'>
        <div className='p_pic_display'>
          <div className='profile_pic'></div>
          <div className='p_user_email'>{getme.email}</div>
        </div>
        <div className='p_user'>
          <div className='p_user_info'>
            Account balance<div className='user_'>{`NGN ${Intl.NumberFormat('en-US').format(getme.account_balance)}`}</div>
            First name<div className='user_'>{getme.first_name}</div>
            Last name<div className='user_'>{getme.last_name}</div>
            Phone<div className='user_'>{getme.phone}</div>
          </div>
          <div className='p_user_update'> <button>Update</button></div>
        </div>
    </div>
  );
}

export default Profile;