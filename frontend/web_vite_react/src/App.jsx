import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import Side_bar from './Side_bar.jsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Detect page reload
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (isReload && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    // Redirect root to /home
    if (location.pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [location.pathname]);

  return (
    <div className='all'>
      <Nav />
      <div className='container'>
        <Outlet />
        <Side_bar />
      </div>
    </div>
  );
}

export default App;