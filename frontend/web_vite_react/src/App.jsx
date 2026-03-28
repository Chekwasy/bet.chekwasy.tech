import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Nav from './Nav.jsx';
import Side_bar from './Side_bar.jsx';


function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home', {replace: true});
  }, []);
  return (
    <div className='all'>
      <Nav />
      <div className='container'>
        <Outlet />
        <Side_bar />
      </div>
    </div>
  )
}

export default App;
