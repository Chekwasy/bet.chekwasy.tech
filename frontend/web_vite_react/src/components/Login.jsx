import { Link } from 'react-router-dom';

function Login() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">login</Link>
        </li>
        <li>
          <Link to="/reg">reg</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Login;