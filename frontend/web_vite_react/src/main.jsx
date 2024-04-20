import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import About from './components/About.jsx';
import Register from './components/Register.jsx';
import './index.css';
import './Nav.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/games/:id',
        element: <Register />,
      }
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
