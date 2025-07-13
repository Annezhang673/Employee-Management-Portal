// using bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation } from "react-router-dom";

export default function LandingNavigation() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg bg-secondary navbar-dark shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">
          Portal Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#landingNavbar"
          aria-controls="landingNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="landingNavbar"
        >
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive("/")}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/features"
                className={`nav-link ${isActive("/features")}`}
              >
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive("/about")}`}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="btn btn-outline-primary">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
