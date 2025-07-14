import { Navigate, Outlet } from "react-router-dom";
import HRNavigation from "../components/navigation/HRNavigation";
import EmployeeNavigation from "../components/navigation/EmployeeNavigation";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const getUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return token ? { role } : null;
};

export default function AppLayout() {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="d-flex flex-column min-vh-100 bg-primary">
      {user.role === "hr" ? <HRNavigation /> : <EmployeeNavigation />}
      <main
        className="flex-grow-1 text-dark"
        // style={{ background: "linear-gradient(to bottom, #021024, #5483b3)" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
