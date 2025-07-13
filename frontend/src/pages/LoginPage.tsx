import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("role", role);
    navigate("/app/dashboard");
  };

  return (
    <div className="container p-4">
      <h2>Login Page</h2>
      <button
        className="btn btn-primary me-2"
        onClick={() => handleLogin("hr")}
      >
        Login as HR
      </button>
      <button
        className="btn btn-success me-2"
        onClick={() => handleLogin("employee")}
      >
        Login as Employee
      </button>
      {/* Onboarding entry, will delete later */}
      <button className="btn btn-info me-2">
        <Link
          to={"/app/onboarding"}
          className="text-white text-decoration-none"
        >
          Temp entry for Onboarding
        </Link>
      </button>
    </div>
  );
}
