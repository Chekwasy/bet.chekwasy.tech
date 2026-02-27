import { useState, useEffect } from 'react';
import $ from 'jquery';
import Cookie from 'js-cookie';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {

  const [loginemail, setLoginemail] = useState('');
  const [loginpwd, setLoginpwd] = useState('');
  const [loginvalidation1, setLoginvalidation1] = useState(false);
  const [loginvalidation2, setLoginvalidation2] = useState(false);
  const [logininvalid, setLogininvalid] = useState(false);
  const [loginposterror, setLoginposterror] = useState(false);

  const isASCII = (str) => /^[\x00-\x7F]*$/.test(str);


  useEffect(() => {
    const handler = (evt) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        loginsubmit();
      }
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [loginvalidation1, loginvalidation2, loginemail, loginpwd]);

  const handleloginemail = (evt) => {
    const nwval = evt.target.value;
    setLoginemail(nwval);

    const valid =
      nwval.includes('@') &&
      nwval.includes('.') &&
      isASCII(nwval) &&
      !nwval.includes(':');

    if (!valid && nwval !== '') {
      evt.target.classList.add('errorshade');
      setLoginvalidation1(false);
    } else {
      evt.target.classList.remove('errorshade');
      setLoginvalidation1(nwval !== '');
    }
  };

  const handleloginpwd = (evt) => {
    const nwval = evt.target.value;
    setLoginpwd(nwval);

    const valid =
      nwval.length > 5 &&
      /\d/.test(nwval) &&
      /[A-Z]/.test(nwval) &&
      /[a-z]/.test(nwval) &&
      isASCII(nwval) &&
      !nwval.includes(':');

    if (!valid && nwval !== '') {
      evt.target.classList.add('errorshade');
      setLoginvalidation2(false);
    } else {
      evt.target.classList.remove('errorshade');
      setLoginvalidation2(nwval !== '');
    }
  };

  const loginposterrfunc = () => {
    setLoginposterror(true);
    setTimeout(() => {
      setLoginposterror(false);
    }, 5000);
  };

  const loginsubmit = () => {

    if (!loginvalidation1 || !loginvalidation2) {
      setLogininvalid(true);
      setTimeout(() => setLogininvalid(false), 5000);
      return;
    }

    const email = loginemail.trim();
    const pwd = loginpwd.trim();

    const encodestr = btoa(email + ':' + pwd);

    $.ajax({
      type: 'GET',
      url: `${BASE_URL}/connect`,
      contentType: 'application/json',
      headers: {
        authorization: `encoded ${encodestr}`,
      },
      success: function(res) {

        Cookie.set('x-token', res.token, {
          expires: 7,
          sameSite: 'strict'
        });

        window.location.href = '/';
      },
      error: function() {
        loginposterrfunc();
      }
    });
  };

  return (
    <div className='login_comp'>
      <div className='login_container'>
        <form className='login_form' onSubmit={(e) => e.preventDefault()}>

          <div className='login_form_item'><h3>Login</h3></div>

          {logininvalid && (
            <div className='logininvalid'>
              Enter a valid email or password (Avoid using ':')
            </div>
          )}

          {loginposterror && (
            <div className='loginposterror'>
              An error occurred ... <br />
              No such user found
            </div>
          )}

          <div className='login_form_item'>
            <input
              type="email"
              placeholder='Email'
              id='loginemail'
              required
              onChange={handleloginemail}
            />
          </div>

          <div className='login_form_item'>
            <input
              type="password"
              placeholder='Password'
              id='loginpwd'
              required
              onChange={handleloginpwd}
            />
          </div>

          <div className='login_form_item'>
            <a href="fpwd">Forgot Password</a>
          </div>

          <div className='login_form_item'>
            <div className='loginbtn' onClick={loginsubmit}>
              Login
            </div>
          </div>

          <div className='login_form_item'>
            Don't have an account? <a href="reg">Signup</a>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;