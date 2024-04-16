import { useState } from 'react';

function Navbar() {
	const [hh, setHh] = useState("nav-link active"); const [pp, setPp] = useState("nav-link"); const [ll, setLl] = useState("nav-link"); const [rr, setRr] = useState("nav-link");
	const handleRegister = () => {
		const to_del = document.getElementById("to_del");
		if (to_del !== null) {
			const parent = to_del.parentNode;
			parent.removeChild(to_del);
			const newElement = document.createElement(`div`);
			newElement.innerHTML = `<div class="d-flex align-items-center justify-content-center py-4 bg-body-tertiary" id="to_del">
	    <form>
	      <h1 class="h3 mb-3 fw-normal">Create An Account</h1>

	      <div class="form-floating">
	        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
	        <label for="floatingInput">Email address</label>
	      </div>
	      <div class="form-floating">
	        <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
	        <label for="floatingPassword">Password</label>
	      </div>
	      <div class="form-floating">
	        <input type="password" class="form-control" id="floatingPassword2" placeholder="Password">
	        <label for="floatingPassword">Re-enter Password</label>
	      </div>

	      <button class="btn btn-primary w-100 py-2" type="submit">Register</button>
	    </form>
	  </div>`;
	  parent.appendChild(newElement);
	  setHh("nav-link")
	  setPp("nav-link")
	  setLl("nav-link")
	  setRr("nav-link active")
		}
	}
	const handleLogin = () => {
		const to_del = document.getElementById("to_del");
		if (to_del !== null) {
			const parent = to_del.parentNode;
			parent.removeChild(to_del);
			const newElement = document.createElement(`div`);
			newElement.innerHTML = `<div class="d-flex align-items-center justify-content-center py-4 bg-body-tertiary" id="to_del">
    <form>
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>

      <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      <a href="#">Forgot Password</a>
    </form>
  </div>`;
	  parent.appendChild(newElement);
	  setHh("nav-link")
	  setPp("nav-link")
	  setRr("nav-link")
	  setLl("nav-link active")
		}
	}
	const handleProfile = () => {
		const to_del = document.getElementById("to_del");
		if (to_del !== null) {
			const parent = to_del.parentNode;
			parent.removeChild(to_del);
			const newElement = document.createElement(`div`);
			newElement.innerHTML = `<div className="p-5 text-center bg-body-tertiary rounded-3" id="to_del">
      <svg className="bi mt-4 mb-3" style={{color: "var(--bs-indigo);"}} width="100" height="100"><use href="https://cdn.jsdelivr.net"></use></svg>
      <h1 className="text-body-emphasis">Converted files</h1>
      <p class="col-lg-8 mx-auto fs-5 text-muted">
      </p>

      <div class="d-inline-flex gap-2 mb-5">
        <button className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill" type="button">Update Profile Info
        </button>
      </div>
    </div>`;
	  parent.appendChild(newElement);
	  setHh("nav-link")
	  setLl("nav-link")
	  setRr("nav-link")
	  setPp("nav-link active")
		}
	}
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="http://localhost:3000/">Pdf2Voice</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
			  <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ "--bs-scroll-height": "100px" }}>
			    <li className="nav-item">
			      <a className={hh} id="Hm" href="http://localhost:3000/" >Home</a>
			    </li>
			    <li className="nav-item">
			      <button className={pp} id="Prof" onClick={handleProfile} >Profile</button>
			    </li>
			    <li className="nav-item">
			      <button className={ll} onClick={handleLogin} id="Lin" >Login</button>
			    </li>
			    <li className="nav-item">
			      <button className={rr} id="Reg" onClick={handleRegister} >Register</button>
			    </li>
			  </ul>
			  <form className="d-flex" role="search">
			    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
			    <button className="btn btn-outline-success" type="submit">Search</button>
			  </form>
			</div>
		</div>
		</nav>
		);
}


export default Navbar;