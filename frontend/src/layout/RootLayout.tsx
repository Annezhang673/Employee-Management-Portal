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
    <>
      {renderNavigation()}
      <main>
        <Outlet />
      </main>
    </>
  );
}
