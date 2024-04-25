import { Link } from 'react-router-dom';

function Token() {
  return (
    <div className='token_comp'>
      <div className='token_container'>
        <form action="token" className='token_form'>
          <div className='token_form_item'><h3>Token</h3></div>
          <div className='token_form_item'>
            <input type="text" placeholder='Token' />
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