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

  const mockId = "68730bb6ffbffeea6daaf227";

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, userInfo]);

  if (!userInfo) return <GeneralLoading />;

  return (
    <>
      <div className="container mt-4">
        
      </div>
      <div className="container mt-4">
        <h2 className="mb-4">Personal Information</h2>
        <ProfileNameSection userInfo={userInfo} userId={mockId} />

        <h2 className="mt-4 mb-4">Address</h2>
        <ProfileAddressSection userInfo={userInfo} userId={mockId} />

        <h2 className="mt-4 mb-4">Contact Info</h2>
        <ProfileContactInfoSection userInfo={userInfo} userId={mockId} />

        <h2 className="my-4">Employment</h2>
        <ProfileEmploymentSection userInfo={userInfo} userId={mockId} />

        <h2 className="my-4">Emergency contact</h2>
        <ProfileEmergencyContactSection userInfo={userInfo} userId={mockId} />

        <h2 className="my-4">Documents</h2>
        <ProfileDocumentSection userInfo={userInfo} userId={mockId} />
      </div>
    </>
  );
}
