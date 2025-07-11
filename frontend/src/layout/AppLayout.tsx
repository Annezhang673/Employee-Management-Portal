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
    <>
      {user.role === "hr" ? <HRNavigation /> : <EmployeeNavigation />}
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
}
