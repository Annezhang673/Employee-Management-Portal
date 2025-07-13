import { Link, useLocation } from "react-router-dom";

export default function EmployeeNavigation() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg bg-secondary navbar-dark">
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
            <Link
              className={`nav-link ${isActive("/app/profile")}`}
              to="/app/profile"
            >
              Personal Information
            </Link>
            <Link
              className={`nav-link ${isActive("/app/visa")}`}
              to="/app/visa"
            >
              Visa Status Management
            </Link>
            <Link
              className={`nav-link ${isActive("/app/housing")}`}
              to="/app/housing"
            >
              Housing
            </Link>
            <button className=" btn btn-outline-primary me-2">logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
