import { Link } from "react-router-dom";
export default function EmployeeNavigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Employee Portal
        </Link>
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
    </nav>
  );
}
