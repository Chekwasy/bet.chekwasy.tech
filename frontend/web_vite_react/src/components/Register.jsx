import { useState } from 'react';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';

const urlNS = ''; //for making change to https easy
const local = '';

function Register() {
  const [regemail, setRegemail] = useState('');
  const [regpwd1, setRegpwd1] = useState('');
  const [regpwd2, setRegpwd2] = useState('');
  const [aftreg, setAftreg] = useState(false);
  const [regvalidation1, setRegvalidation1] = useState(false);
  const [regvalidation2, setRegvalidation2] = useState(false);
  const [regvalidation3, setRegvalidation3] = useState(false);
  const [reginvalid, setReginvalid] = useState(false);
  const [regvalid, setRegvalid] = useState(false);
  const [reguserexist, setReguserexist] = useState(false);
  const [regposterror, setRegposterror] = useState(false);

  const isASCII = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  };

  document.addEventListener('keypress', (evt) => {
    if (evt.key === 'Enter') {
    }
  });

  const handleregemail = (evt) => {
    const nwval = evt.target.value;
    setRegemail(nwval);
    if (!nwval.includes('@') || !nwval.includes('.') || !(isASCII(nwval)) || (nwval.includes(':'))) {
      evt.target.classList.add('errorshade');
      setRegvalidation1(false);
    }
    else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setRegvalidation1(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setRegvalidation1(false);
    }
  };

  const handleregpwd1 = (evt) => {
    const nwval = evt.target.value;
    setRegpwd1(nwval);
    if (!(nwval.length > 5) || !(/\d/.test(nwval)) || !(/[A-Z]/.test(nwval)) || !(/[a-z]/.test(nwval)) || !(isASCII(nwval)) || (nwval.includes(':'))) {
      evt.target.classList.add('errorshade');
      setRegvalidation2(false);
    } else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setRegvalidation2(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setRegvalidation2(false);
    }
  };

  const handleregpwd2 = async (evt) => {
    const nwval = evt.target.value;
    setRegpwd2(nwval);
    if (regpwd1 !== nwval) {
      evt.target.classList.add('errorshade');
      setRegvalidation3(false);
    } else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setRegvalidation3(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setRegvalidation3(false);
    }
  };

  const regposterrfunc = async () => {
    setRegposterror(true);
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    setRegposterror(false);
  };

  const reguserexistfunc = async () => {
    setReguserexist(true);
    await new Promise(resolve => setTimeout(resolve, 10 * 1000));
    setReguserexist(false);
  };

  const regsubmit = async (evt) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (regvalidation1 && regvalidation2 && regvalidation3) {
      const email = regemail.trimEnd();
      const pwd1 = regpwd1.trimEnd();
      const encodestr = btoa(email + ':' + pwd1);
      $.ajax({
        type: 'POST',
        url: urlNS + `${local}/api/v1/users`,
        contentType: 'application/json',
        data: JSON.stringify({
          emailpwd: `encoded ${encodestr}`,
        }),
        success: function(res) {
          setRegvalid(true);
          setAftreg(true);
        },
        error: function(res, status, err) {
          if (res.status === 401) {
            reguserexistfunc();
          } else {
          regposterrfunc();
          }
        }
      });
    } else {
      setReginvalid(true);
      await new Promise(resolve => setTimeout(resolve, 5 * 1000));
      setReginvalid(false);
    }
  };

  return (
    <div className='register_comp'>
      <div className='reg_container'>
        <div className='reg_form'>
          <div className='reg_form_item'><h3>Signup</h3></div>
          <div>{(reginvalid && (
            <div className='reginvalid'>
              Enter a valid email or password that is equal (Avoid using ':')
            </div>
          ))}</div>
          <div>{(regposterror && (
            <div className='regposterror'>
              An error occured during submission... <br />
              Try again or reach out to our support email
            </div>
          ))}</div>
          <div>{(reguserexist && (
            <div className='reguserexist'>
              User exists. <br /> Try logging in or use forgot password
            </div>
          ))}</div>
          <div>{(regvalid && (
            <div className='regvalid'>
              Account registered. You can now login. <br />Please verify account from email sent to you within 24hrs to avoid your account being deleted
            </div>
          ))}</div>
          <div className='reg_form_item'>
            <input type="email" placeholder='Email' required onChange={handleregemail} />
          </div>
          <div className='reg_form_item'>
            <input type="password" placeholder='Create password' required onChange={handleregpwd1} />
          </div>
          <div className='reg_form_item'>
            <input type="password" placeholder='Comfirm password' required onChange={handleregpwd2} />
          </div>
          <div className='reg_form_item'>
            {!aftreg && (<div onClick={regsubmit} className='signupbtn'>Signup</div>)}
            {aftreg && (<div><NavLink className='signupbtn' to="/login">Switch to login</NavLink></div>)}
          </div>
          <div className='reg_form_item'>
            Already have an account? <a href="login">Login</a>
          </div>
        </div>  
      </div>  
    </div>
  );
}

export default Register;
