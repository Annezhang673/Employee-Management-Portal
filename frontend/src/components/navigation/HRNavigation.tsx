import { Link } from "react-router-dom";
export default function HRNavigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          HR Dashboard
        </Link>
        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/employees">
            Employee Profile
          </Link>
          <Link className="nav-link" to="/visa">
            Visa Status Management
          </Link>
          <Link className="nav-link" to="/housing">
            Housing Management
          </Link>
          <Link className="nav-link" to="/logout">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
