import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("role", role);
    navigate("/app/dashboard");
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button
        className="btn btn-primary me-2"
        onClick={() => handleLogin("hr")}
      >
        Login as HR
      </button>
      <button
        className="btn btn-success"
        onClick={() => handleLogin("employee")}
      >
        Login as Employee
      </button>
    </div>
  );
}
