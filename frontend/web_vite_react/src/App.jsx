import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';
import Side_bar from './Side_bar.jsx';
import Main_bar from './Main_bar.jsx';


function App() {

  return (
    <div className='all'>
      <Nav />
      <Outlet />
      <h1>jgjgjg</h1>
      <div className='container'>
        <Side_bar />
        <Main_bar />
      </div>
    </div>
  )
}

export default App
