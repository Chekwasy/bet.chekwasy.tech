import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Profile() {
    const params = useParams();
  return (
    <div className='profile_comp'>
        <div className='p_pic_display'>
          <div className='profile_pic'></div>
          <div className='p_user_email'>richardchekwas@gmail.com</div>
        </div>
        <div className='p_user'>
          <div className='p_user_info'>
            Account balance<div className='user_'>NGN 100000</div>
            First name<div className='user_'>Richard</div>
            Last name<div className='user_'>Chukwuchekwa</div>
            Phone<div className='user_'>+2348168732525</div>
          </div>
          <div className='p_user_update'> <button>Update</button></div>
        </div>
    </div>
  );
}

export default Profile;