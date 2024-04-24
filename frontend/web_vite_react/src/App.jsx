import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';
import Side_bar from './Side_bar.jsx';



function App() {
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
