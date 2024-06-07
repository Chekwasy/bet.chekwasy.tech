import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store.js';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import Ocgames from './components/Ocgames.jsx';
import About from './components/About.jsx';
import Register from './components/Register.jsx';
import Fpwd from './components/Fpwd.jsx';
import Token from './components/Token.jsx';
import './index.css';
import './Nav.css';
import './Side_bar.css';
import './Main_bar.css';
import './components/Profile.css';
import './components/About.css';
import './components/Register.css';
import './components/Login.css';
import './components/Fpwd.css';
import './components/Token.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/ocgames',
        element: <Ocgames />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/reg',
    element: <Register />,
  },
  {
    path: '/fpwd',
    element: <Fpwd />,
  },
  {
    path: '/token',
    element: <Token />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider store={store} router={router} />
    </Provider>
  </React.StrictMode>,
);
