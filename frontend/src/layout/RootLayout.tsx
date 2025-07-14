import { Outlet } from "react-router-dom";
import LandingNavigation from "../components/navigation/LandingNavigation";
import { useState } from "react";
import HRNavigation from "../components/navigation/HRNavigation";
import EmployeeNavigation from "../components/navigation/EmployeeNavigation";

export default function RootLayout() {
  type User = {
    role: string;
  };

  const [user, setUser] = useState<User | null>(null);

  const renderNavigation = () => {
    if (!user) return <LandingNavigation />;
    if (user.role === "hr") return <HRNavigation />;
    if (user.role === "employee") return <EmployeeNavigation />;
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-primary text-dark">
      {renderNavigation()}
      <main className="flex-grow-1" style={{
        background: "linear-gradient(to bottom, #021024, #5483b3)"
      }}>
        <Outlet />
      </main>
    </div>
  );
}
