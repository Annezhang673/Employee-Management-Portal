import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { fetchOnboarding } from "../store/slices/onboardingSlice";
import { Link } from "react-router-dom";

export default function OnboardingStatus() {
  // check current user state
  // check application state
  // if application is approved, redirect to dashboard
  // if application is rejected, redirect to somepage where user able to edit the application, and resubmit

  const dispatch = useDispatch<AppDispatch>();
  const onboarding = useSelector((state: RootState) => state.onboarding);

  const applicationStatus = (onboarding.onboarding as any)?.status;

  useEffect(() => {
    dispatch(fetchOnboarding());
  }, [dispatch]);

  return (
    <>
      {applicationStatus?.toLowerCase() === "pending" && (
        <div className="alert alert-info text-center">
          <h4>Waiting for HR approval</h4>
        </div>
      )}
      {applicationStatus?.toLowerCase() === "rejected" && (
        <>
          <div className="alert alert-danger text-center">
            <h4>Application Rejected</h4>
          </div>
          <div className="d-block">
            <Link to="/app/onboarding">
              <button className="btn btn-primary w-100">
                Edit Application
              </button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
