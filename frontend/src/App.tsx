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
import { Toaster } from "react-hot-toast";
import OnboardingPage from "./pages/OnboardingPage";

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
        { path: "dashboard", element: <DashboardPage /> },
        { path: "login", element: <ProfilePage /> },
        { path: "onboarding", element: <OnboardingPage /> },
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
      <Toaster />
    </>
  );
}

export default App;
