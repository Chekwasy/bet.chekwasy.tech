import { useState } from 'react';
import $ from 'jquery';
import Cookie from 'js-cookie';

const urlNS = 'http://'; //for making change to https easy

function Login() {
  const [loginemail, setLoginemail] = useState('');
  const [loginpwd, setLoginpwd] = useState('');
  const [loginvalidation1, setLoginvalidation1] = useState(false);
  const [loginvalidation2, setLoginvalidation2] = useState(false);
  const [logininvalid, setLogininvalid] = useState(false);
  const [loginposterror, setLoginposterror] = useState(false);

  const isASCII = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  };

  const handleloginemail = (evt) => {
    const nwval = evt.target.value;
    setLoginemail(nwval);
    if (!nwval.includes('@') || !nwval.includes('.') || !(isASCII(nwval)) || (nwval.includes(':'))) {
      evt.target.classList.add('errorshade');
      setLoginvalidation1(false);
    }
    else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setLoginvalidation1(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setLoginvalidation1(false);
    }
  };

  const handleloginpwd = (evt) => {
    const nwval = evt.target.value;
    setLoginpwd(nwval);
    if (!(nwval.length > 5) || !(/\d/.test(nwval)) || !(/[A-Z]/.test(nwval)) || !(/[a-z]/.test(nwval)) || !(isASCII(nwval)) || (nwval.includes(':'))) {
      evt.target.classList.add('errorshade');
      setLoginvalidation2(false);
    } else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setLoginvalidation2(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setLoginvalidation2(false);
    }
  };

  const loginposterrfunc = async () => {
    setLoginposterror(true);
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    setLoginposterror(false);
  };

  const loginsubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (loginvalidation1 && loginvalidation2) {
      const email = loginemail.trimEnd();
      const pwd = loginpwd.trimEnd();
      const encodestr = btoa(email + ':' + pwd); 
      $.ajax({
        type: 'GET',
        url: urlNS + 'localhost:5000/api/v1/connect',
        contentType: 'application/json',
        headers: {
          authorization: `encoded ${encodestr}`,
        },
        success: function(res) {
          Cookie.set('x-token', res['token'], { expires: 7, path: '', sameSite: 'strict' });
          window.location.href = '/home';
        },
        error: function(err) {
          console.log('login error');
          loginposterrfunc();
        }
      });
    } else {
      setLogininvalid(true);
      await new Promise(resolve => setTimeout(resolve, 5 * 1000));
      setLogininvalid(false);
    }
  };

  return (
    <div className='login_comp'>
      <div className='login_container'>
        <form action="login" className='login_form'>
          <div className='login_form_item'><h3>Login</h3></div>
          <div>{(logininvalid && (
            <div className='logininvalid'>
              Enter a valid email or password (Avoid using ':')
            </div>
          ))}</div>
          <div>{(loginposterror && (
            <div className='loginposterror'>
              An error occured ... <br />
              No such user found
            </div>
          ))}</div>
          <div className='login_form_item'>
            <input type="email" placeholder='Email' id='loginemail' required onChange={handleloginemail} />
          </div>
          <div className='login_form_item'>
            <input type="password" placeholder='Password' id='loginpwd' required onChange={handleloginpwd} />
          </div>
          <div className='login_form_item'>
            <a href="fpwd">Forgot Password</a>
          </div>
          <div className='login_form_item'>
            <div className='loginbtn' onClick={loginsubmit}>Login</div>
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