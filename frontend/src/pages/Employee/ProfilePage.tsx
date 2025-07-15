import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserInfo } from "../../store/slices/userInfoSlice";

import ProfileNameSection from "../../components/profilePage/sections/ProfileNameSection";
import ProfileAddressSection from "../../components/profilePage/sections/ProfileAddressSection";
import ProfileContactInfoSection from "../../components/profilePage/sections/ProfileContactInfoSection";
import ProfileEmploymentSection from "../../components/profilePage/sections/ProfileEmploymentSection";
import ProfileEmergencyContactSection from "../../components/profilePage/sections/ProfileEmergencyContactSection";
import ProfileDocumentSection from "../../components/profilePage/sections/ProfileDocumentSection";
import GeneralLoading from "../../components/skeletons/GeneralLoading";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);

  const [activeSection, setActiveSection] = useState("nameSection");

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, userInfo]);

  if (!userInfo) return <GeneralLoading />;

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex gap-2 align-items-center mb-4">
          <button
            className={`btn btn-outline-primary ${
              activeSection === "nameSection" ? "active" : ""
            }`}
            onClick={() => setActiveSection("nameSection")}
          >
            Name Section
          </button>
          <button
            className={`btn btn-outline-primary ${
              activeSection === "addressSection" ? "active" : ""
            }`}
            onClick={() => setActiveSection("addressSection")}
          >
            Address Section
          </button>
          <button
            className={`btn btn-outline-primary ${
              activeSection === "contactInfoSection" ? "active" : ""
            }`}
            onClick={() => setActiveSection("contactInfoSection")}
          >
            Contact Info Section
          </button>
          <button
            className={`btn btn-outline-primary ${
              activeSection === "employmentSection" ? "active" : ""
            }`}
            onClick={() => setActiveSection("employmentSection")}
          >
            Employment Section
          </button>
          <button
            className={`btn btn-outline-primary ${
              activeSection === "emergencyContactSection" ? "active" : ""
            }`}
            onClick={() => setActiveSection("emergencyContactSection")}
          >
            Emergency Contact Section
          </button>
          <button
            className={`btn btn-outline-primary ${
              activeSection === "documentSection" ? "active" : ""
            }`}
            onClick={() => setActiveSection("documentSection")}
          >
            Document Section
          </button>
        </div>

        {activeSection === "nameSection" && (
          <ProfileNameSection userInfo={userInfo} />
        )}
        {activeSection === "addressSection" && (
          <ProfileAddressSection userInfo={userInfo} />
        )}
        {activeSection === "contactInfoSection" && (
          <ProfileContactInfoSection userInfo={userInfo} />
        )}
        {activeSection === "employmentSection" && (
          <ProfileEmploymentSection userInfo={userInfo} />
        )}
        {activeSection === "emergencyContactSection" && (
          <ProfileEmergencyContactSection userInfo={userInfo} />
        )}
        {activeSection === "documentSection" && (
          <ProfileDocumentSection userInfo={userInfo} />
        )}
      </div>
    </>
  );
}
