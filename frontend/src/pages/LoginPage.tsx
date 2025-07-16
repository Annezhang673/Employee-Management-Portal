import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosApi from "../lib/axiosApi";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"HR" | "Employee" | null>(
    null
  );

  const submitted = useSelector(
    (state: RootState) => state.onboarding.submitted
  );

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "Employee" && submitted) navigate("/app/profile");
    if (token && role === "HR") navigate("/app/employeemanagement");
  }, [navigate, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosApi.post("/api/login", {
        userName,
        password,
      });

      const { token, userName: name, role, applicationStatus } = res.data;

      if (role !== selectedRole) {
        setError(`This user is not registered as ${selectedRole}`);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("role", role);

      if (role === "HR") {
        navigate("/app/employeemanagement");
      } else if (role === "Employee") {
        if (
          !applicationStatus ||
          !submitted ||
          applicationStatus.toLowerCase() === "rejected"
        ) {
          navigate("/app/onboarding");
        } else {
          navigate("/app/profile");
        }
      }
    } catch (err: any) {
      console.log("Login error: ", err);
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
    }
  };

  return (
    <div className="container p-4 text-primary">
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

      {/* <button className="btn btn-info me-2">
        <Link
          to={"/app/onboarding"}
          className="text-white text-decoration-none"
        >
          Temp entry for Onboarding
        </Link>
      </button> */}

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
