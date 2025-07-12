import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RootLayout from "./layout/RootLayout";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import FeaturePage from "./pages/featurePage";
import AboutPage from "./pages/AboutPage";
import RegistrationPage from "./pages/Registration";
import HiringManagementPage from './pages/HiringManagementPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "features", element: <FeaturePage /> },
        { path: "about", element: <AboutPage /> },
      ],
    },
    {
      path: "/app",
      element: <AppLayout />,
      children: [
        { path: "dashboard",  element: <DashboardPage /> },
        { path: "login",      element: <ProfilePage /> },
        { path: "hiring",     element: <HiringManagementPage /> },
      ],
    },
    // Register routes when employee click tokenLink
    {
      path: "/registration/:token",
      element: <RegistrationPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
