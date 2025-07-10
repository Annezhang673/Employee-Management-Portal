import { Link } from "react-router-dom";

export default function HRNavigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          HR Dashboard
        </Link>

        {/* Toggler Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hrNavbar"
          aria-controls="hrNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="hrNavbar">
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
      </div>
    </nav>
  );
}
