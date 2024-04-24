import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Profile() {
    const params = useParams();
  return (
    <div className='profile_comp'>
        <h1>Profile</h1>
    </div>
  );
}

export default Profile;