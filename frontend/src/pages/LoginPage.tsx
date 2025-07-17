import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="container-fluid mt-5 d-flex flex-column justify-content-center align-items-center text-primary">
      <div>
        <button
          className={`btn btn-outline-primary me-2 ${
            selectedRole === "HR" && "active"
          }`}
          onClick={() => setSelectedRole("HR")}
        >
          Login as HR
        </button>
        <button
          className={`btn btn-outline-primary ${
            selectedRole === "Employee" && "active"
          }`}
          onClick={() => setSelectedRole("Employee")}
        >
          Login as Employee
        </button>
      </div>

      {selectedRole && (
        <div
          className="mt-4 p-4 shadow-sm rounded text-primary"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            minWidth: "400px",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmit} className="mt-2">
            <h4 className="text-center">Login as <strong>{selectedRole}</strong></h4>

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

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
