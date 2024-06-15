import { useState } from 'react';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';

function Token() {
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

  return (
    <div className='token_comp'>
      <div className='token_container'>
        <form action="token" className='token_form'>
          <div className='token_form_item'><h3>Reset Password</h3></div>
          <div className='token_form_item'>
            <input type="email" placeholder='Email' />
          </div>
          <div className='token_form_item'>
            <input type="password" placeholder='New password' />
          </div>
          <div className='token_form_item'>
            <input type="password" placeholder='Re-enter password' />
          </div>
          <div className='token_form_item'>
            <a href="token">Resend token</a>
          </div>
          <div className='token_form_item'>
            <button>Reset</button>
          </div>
        </form>  
      </div>  
    </div>
  );
}

export default Token;