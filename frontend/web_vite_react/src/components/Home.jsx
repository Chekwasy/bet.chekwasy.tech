import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Main_bar from '../Main_bar.jsx';

function Home() {
    const params = useParams();
  return (
    <div>
      <div className='profile'>
        <Main_bar />
      </div>
    </div>
  );
}

export default Home;