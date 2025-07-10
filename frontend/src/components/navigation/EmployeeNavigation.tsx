import { Link } from "react-router-dom";

export default function EmployeeNavigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Employee Portal
        </Link>

        {/* Toggler for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#employeeNavbar"
          aria-controls="employeeNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="employeeNavbar">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/profile">
              Personal Information
            </Link>
            <Link className="nav-link" to="/visa">
              Visa Status Management
            </Link>
            <Link className="nav-link" to="/housing">
              Housing
            </Link>
            <Link className="nav-link" to="/logout">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
