import { useState } from 'react';
import $ from 'jquery';

const urlNS = 'http://'; //for making change to https easy
const local = '167.99.194.130';

function Fpwd() {
  const [fpwdemail, setFpwdemail] = useState('');
  const [fpwdvalidation, setFpwdvalidation] = useState(false);
  const [fpwderr, setFpwderr] = useState(false);
  const [fpwdsuccess, setFpwdsuccess] = useState(false);
  const [fpwdtoken, setFpwdtoken] = useState(false);
  const [fpwdtokentxt, setFpwdtokentxt] = useState('');
  const [fpwdtxt, setFpwdtxt] = useState('Get email token');

  const [fpwd1, setFpwd1] = useState('');
  const [fpwd2, setFpwd2] = useState('');
  const [fpwdvalidation1, setFpwdvalidation1] = useState(false);
  const [fpwdvalidation2, setFpwdvalidation2] = useState(false);


  const isASCII = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  };

  document.addEventListener('keypress', (evt) => {
    if (evt.key === 'Enter') {
    }
  });

  const fpwderrfunc = async () => {
    setFpwderr(true);
    await new Promise(resolve => setTimeout(resolve, 6 * 1000));
    setFpwderr(false);
  };

  const handlefpwdemail = (evt) => {
    const nwval = evt.target.value;
    setFpwdemail(nwval);
    if (!nwval.includes('@') || !nwval.includes('.') || !(isASCII(nwval)) || (nwval.includes(':'))) {
      evt.target.classList.add('errorshade');
      setFpwdvalidation(false);
    }
    else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setFpwdvalidation(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setFpwdvalidation(false);
    }
  };
  const handlefpwdtoken = (evt) => {
    const nwval = evt.target.value;
    setFpwdtokentxt(nwval);
  };

  const fpwdsuccessfunc = async () => {
    setFpwdsuccess(true);
    await new Promise(resolve => setTimeout(resolve, 10 * 1000));
    setFpwdsuccess(false);
  };

  const handlesendtok = () => {
    if (fpwdvalidation) {
      if (!fpwdtoken) { 
        $.ajax({
          type: 'POST',
          url: urlNS + `${local}/api/v1/send_tok`,
          contentType: 'application/json',
          data: JSON.stringify({'email': fpwdemail}),
          success: function(res) {
            setFpwdtoken(true);
            setFpwdtxt('Verify token');
            //window.location.href = '/token';
          },
          error: function(err) {
            fpwderrfunc();
          }
        });
      }
      if (fpwdtoken && fpwdtxt === 'Verify token') {
        $.ajax({
          type: 'POST',
          url: urlNS + `${local}/api/v1/checktoken`,
          contentType: 'application/json',
          data: JSON.stringify({'email': fpwdemail, 'token': fpwdtokentxt}),
          success: function(res) {
            setFpwdtxt('Reset password');
          },
          error: function(err) {
            fpwderrfunc();
          }
        });
      }
      if (fpwdtoken && fpwdtxt === 'Reset password' && fpwdvalidation && fpwdvalidation1 && fpwdvalidation2) {
        const email = fpwdemail.trimEnd();
        const pwd = fpwd1.trimEnd();
        const encodestr = btoa(email + ':' + pwd);
        $.ajax({
          type: 'POST',
          url: urlNS + `${local}/api/v1/pwdreset`,
          contentType: 'application/json',
          data: JSON.stringify({'token': fpwdtokentxt.trimEnd()}),
          headers: {
            authorization: `encoded ${encodestr}`,
          },
          success: function(res) {
            setFpwdtxt('Get email token');
            setFpwdemail('');
            setFpwd1('');
            setFpwd2('');
            setFpwdtokentxt('');
            setFpwdtoken(false);
            setFpwdvalidation(false);
            setFpwdvalidation1(false);
            setFpwdvalidation2(false);
            fpwdsuccessfunc();
          },
          error: function(err) {
            fpwderrfunc();
          }
        });
      }
    }
  };

  const handlefpwd1 = (evt) => {
    const nwval = evt.target.value;
    setFpwd1(nwval);
    if (!(nwval.length > 5) || !(/\d/.test(nwval)) || !(/[A-Z]/.test(nwval)) || !(/[a-z]/.test(nwval)) || !(isASCII(nwval)) || (nwval.includes(':'))) {
      evt.target.classList.add('errorshade');
      setFpwdvalidation1(false);
    } else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setFpwdvalidation1(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setFpwdvalidation1(false);
    }
  };

  const handlefpwd2 = async (evt) => {
    const nwval = evt.target.value;
    setFpwd2(nwval);
    if (fpwd1 !== nwval) {
      evt.target.classList.add('errorshade');
      setFpwdvalidation2(false);
    } else {
      evt.target.classList.remove('errorshade');
      if (nwval !== '') {
        setFpwdvalidation2(true);
      }
    }
    if (nwval === '') {
      evt.target.classList.remove('errorshade');
      setFpwdvalidation2(false);
    }
  };

  const handleresendtoken = () => {
    if (fpwdtoken) {
      $.ajax({
        type: 'POST',
        url: urlNS + 'localhost:5000/api/v1/send_tok',
        contentType: 'application/json',
        data: JSON.stringify({'email': fpwdemail}),
        error: function(err) {
          fpwderrfunc();
        }
      });
    }
  }

  return (
    <div className='fpwd_comp'>
      <div className='fpwd_container'>
        <form action="fpwd" className='fpwd_form'>
          <div className='fpwd_form_item'><h3>Forgot password</h3></div>
          <div>{(fpwderr && (
            <div className='fpwderror'>
              <div className='fpwderror1'>
                An error occured ... <br />
                Try again or reach out to our support team
              </div>
            </div>
          ))}</div>
          <div>{(fpwdsuccess && (
            <div className='fpwdsuccess'>
              <div className='fpwdsuccess1'>
                Your password have been changed<br />
                You can now login
              </div>
            </div>
          ))}</div>
          <div className='fpwd_form_item'>
            <input type="email" placeholder='Email' onChange={handlefpwdemail} />
          </div>
          {
            fpwdtoken && (
              <div className='fpwd_form_item'>
                <input type="text" placeholder='Token' onChange={handlefpwdtoken} />
              </div>
            )
          }
          {
            fpwdtoken && (fpwdtxt === 'Reset password') && (<div className='token_form_item'>
            <input type="password" placeholder='Create new password' onChange={handlefpwd1} />
            </div>)
          }
          {
            fpwdtoken && (fpwdtxt === 'Reset password') && (<div className='token_form_item'>
              <input type="password" placeholder='Re-enter new password' onChange={handlefpwd2} />
            </div>)
          }
          {fpwdtoken && (<div className='reg_form_item'>
            <div className='resendtok' onClick={handleresendtoken}>Resend token</div>
          </div>)}
          <div className='reg_form_item'>
            <div className='fpwdbtn' onClick={handlesendtok}>{fpwdtxt}</div>
          </div>
          <div className='login_form_item'>
            <a href="login">Login</a>
          </div>
        </form>  
      </div>  
    </div>
  );
}

export default Fpwd;
