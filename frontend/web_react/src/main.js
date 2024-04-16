

function Main() {

	return (
		<div className="container" id="Home">
    <div className="p-5 text-center bg-body-tertiary rounded-3" id="to_del">
      <svg className="bi mt-4 mb-3" style={{color: "var(--bs-indigo);"}} width="100" height="100"><use href="https://cdn.jsdelivr.net"></use></svg>
      <h1 className="text-body-emphasis">Convert Your PDF to Voice With Ease</h1>
      <p class="col-lg-8 mx-auto fs-5 text-muted">
        Convert file.
      </p>
      <div className="mb-3">
        <label for="formFile" class="form-label">Upload pdf file to covert</label>
        <input className="form-control" type="file" id="formFile"></input>
      </div>

      <div class="d-inline-flex gap-2 mb-5">
        <button className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill" type="button">
          Convert
          <svg className="bi ms-2" width="24" height="24"><use ></use></svg>
        </button>
      </div>
    </div>
  </div>
		);
}


export default Main;