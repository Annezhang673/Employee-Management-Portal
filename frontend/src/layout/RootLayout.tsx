import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LandingNavigation from "../components/navigation/LandingNavigation";
import { useEffect, useState } from "react";
import HRNavigation from "../components/navigation/HRNavigation";
import EmployeeNavigation from "../components/navigation/EmployeeNavigation";
import { getStoredUser } from "../lib/auth";

export default function RootLayout() {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);

    if (stored && location.pathname === "/" && stored.role === "hr") {
      navigate("/app/employeemanagement");
    }

    if (stored && location.pathname === "/" && stored.role === "employee") {
      navigate("/app/profile");
    }
  }, [location.pathname, navigate]);

  const renderNavigation = () => {
    if (!user) return <LandingNavigation />;
    if (user.role === "hr") return <HRNavigation />;
    if (user.role === "employee") return <EmployeeNavigation />;
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-primary text-dark">
      {renderNavigation()}
      <main
        className="flex-grow-1"
        style={{
          background: "linear-gradient(to bottom, #021024, #5483b3)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
