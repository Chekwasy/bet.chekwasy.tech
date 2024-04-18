import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Nav from './Nav.jsx';
import Side_bar from './Side_bar.jsx';
import Main_bar from './Main_bar.jsx';


function App() {

  return (
    <div>
      <Switch>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/reg" Component={Register} />
      </Switch>
      {/* <Nav />
      <div className='container'>
        <Side_bar />
        <Main_bar />
      </div> */}
    </div>
  )
}

export default App
