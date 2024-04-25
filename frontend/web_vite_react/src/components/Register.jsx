import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className='register_comp'>
      <div className='reg_container'>
        <form action="register" className='reg_form'>
          <div className='reg_form_item'><h3>Signup</h3></div>
          <div className='reg_form_item'>
            <input type="email" placeholder='Email' />
          </div>
          <div className='reg_form_item'>
            <input type="password" placeholder='Create password' />
          </div>
          <div className='reg_form_item'>
            <input type="password" placeholder='Comfirm password' />
          </div>
          <div className='reg_form_item'>
            <button>Signup</button>
          </div>
          <div className='reg_form_item'>
            Already have an account? <a href="login">Login</a>
          </div>
        </form>  
      </div>  
    </div>
  );
}

export default Register;