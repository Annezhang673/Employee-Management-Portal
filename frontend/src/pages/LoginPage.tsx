import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"HR" | "Employee" | null>(null);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        if (data.role !== selectedRole) {
          setError(`This user is not registered as ${selectedRole}`);
          return;
        }

        localStorage.setItem("token", "demo-token"); // Replace with real token
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("role", data.role);

        if (data.role === "Employee") {
          navigate("/app/profile");
        } else {
          navigate("/app/employeemanagement");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
    }
    console.log()
  };

  return (
    <div className="container p-4">
      <h2>Login Page</h2>

      <button
        className="btn btn-primary me-2"
        onClick={() => setSelectedRole("HR")}
      >
        Login as HR
      </button>
      <button
        className="btn btn-success me-2"
        onClick={() => setSelectedRole("Employee")}
      >
        Login as Employee
      </button>

      <button className="btn btn-info me-2">
        <Link
          to={"/app/onboarding"}
          className="text-white text-decoration-none"
        >
          Temp entry for Onboarding
        </Link>
      </button>

      {selectedRole && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h4>{`Logging in as ${selectedRole.toUpperCase()}`}</h4>

          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
