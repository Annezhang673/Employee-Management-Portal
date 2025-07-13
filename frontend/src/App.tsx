import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RootLayout from "./layout/RootLayout";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/Employee/ProfilePage";
import FeaturePage from "./pages/featurePage";
import AboutPage from "./pages/AboutPage";
import RegistrationPage from "./pages/Registration";
import OnboardingPage from "./pages/OnboardingPage";
import OnboardingStatus from "./pages/OnboardingStatus";
import { Toaster } from "react-hot-toast";
import VisaStatusPage from "./pages/Employee/VisaStatusPage";
import HousingPage from "./pages/Employee/HousingPage";
import HousingManagementPage from "./pages/HR/HousingManagementPage";
import EmployeeManagementPage from "./pages/HR/EmployeeManagementPage";
import HiringManagementPage from "./pages/HR/HiringManagementPage";
import VisaStatusManagementPage from "./pages/HR/VisaStatusManagementPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
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
      errorElement: <ErrorPage />,
      children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "profile", element: <ProfilePage /> },
        {
          path: "onboarding",
          children: [
            { index: true, element: <OnboardingPage /> },
            { path: "status", element: <OnboardingStatus /> },
          ],
        },
        // Employee routes
        { path: "visa", element: <VisaStatusPage /> },
        { path: "housing", element: <HousingPage /> },

        // HR routes
        { path: "employeemanagement", element: <EmployeeManagementPage /> },
        { path: "visamanagement", element: <VisaStatusManagementPage /> },
        { path: "hiringmanagement", element: <HiringManagementPage /> },
        { path: "housingmanagement", element: <HousingManagementPage /> },
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
