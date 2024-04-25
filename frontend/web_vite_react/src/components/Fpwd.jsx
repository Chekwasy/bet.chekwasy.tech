import { Link } from 'react-router-dom';

function Fpwd() {
  return (
    <div className='fpwd_comp'>
      <div className='fpwd_container'>
        <form action="fpwd" className='fpwd_form'>
          <div className='fpwd_form_item'><h3>Forgot password</h3></div>
          <div className='fpwd_form_item'>
            <input type="email" placeholder='Email' />
          </div>
          <div className='reg_form_item'>
            <button>Get email token</button>
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