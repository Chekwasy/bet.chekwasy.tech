import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import Side_bar from './Side_bar.jsx';


function App() {
  const location = useLocation();
  if (location.pathname === '/') {
    return <NavLink to="/home" />;
  }
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
