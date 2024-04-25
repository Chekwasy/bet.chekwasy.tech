import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className='login_comp'>
      <div className='login_container'>
        <form action="login" className='login_form'>
          <div className='login_form_item'><h3>Login</h3></div>
          <div className='login_form_item'>
            <input type="email" placeholder='Email' />
          </div>
          <div className='login_form_item'>
            <input type="password" placeholder='Password' />
          </div>
          <div className='login_form_item'>
            <a href="fpwd">Forgot Password</a>
          </div>
          <div className='login_form_item'>
            <button>Login</button>
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