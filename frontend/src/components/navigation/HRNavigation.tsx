import { Link, useLocation } from "react-router-dom";

export default function HRNavigation() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  const isLoggedIn = () => localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-secondary navbar-dark">
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
            <Link
              className={`nav-link ${isActive("/app/employeemanagement")}`}
              to="/app/employeemanagement"
            >
              Employee Profile
            </Link>
            <Link
              to={"/app/hiringmanagement"}
              className={`nav-link ${isActive("/app/hiringmanagement")}`}
            >
              Hiring Management
            </Link>
            <Link
              className={`nav-link ${isActive("/app/visamanagement")}`}
              to="/app/visamanagement"
            >
              Visa Status Management
            </Link>
            <Link
              className={`nav-link ${isActive("/app/housingmanagement")}`}
              to="/app/housingmanagement"
            >
              Housing Management
            </Link>
            <button className="btn btn-outline-primary" onClick={handleLogout}>
              {isLoggedIn() ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
