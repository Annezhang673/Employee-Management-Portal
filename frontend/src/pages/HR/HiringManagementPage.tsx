import { useState } from "react";
import RegistrationTokenTab from "../../components/onBoardingApplication/RegistrationTokenTab";
import OnboardingReviewTab from "../../components/onBoardingApplication/OnboardingReviewTab";

export default function HiringManagementPage() {
  // decide which tab is active
  const [activeTab, setActiveTab] = useState<"tokens" | "review">("tokens");

  // Render tab buttons and the selected tab component
  return (
    <div className="container p-4">
      <h1>Hiring Management</h1>
      <nav className="mb-4">
        <button
          className={`btn me-2 ${
            activeTab === "tokens" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("tokens")}
        >
          Registration Tokens
        </button>

        <button
          className={`btn ${
            activeTab === "review" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("review")}
        >
          Onboarding Application Review
        </button>
      </nav>

      {activeTab === "tokens" ? (
        <RegistrationTokenTab />
      ) : (
        <OnboardingReviewTab />
      )}
    </div>
  );
}
