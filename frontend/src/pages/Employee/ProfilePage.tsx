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

import type { UserInfo } from "../OnboardingPage";
import type { Document } from "../OnboardingPage";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);

  const [form, setForm] = useState<Partial<UserInfo>>({});
  const [documents, setDocuments] = useState<Document[]>([]);

  const mockId = "68730bb6ffbffeea6daaf227";

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      setForm(userInfo);
      setDocuments(userInfo.documents || []);
    }
  }, [userInfo]);

  if (!userInfo) return <GeneralLoading />;

  console.log(userInfo);
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Personal Information</h2>
      <ProfileNameSection
        form={form}
        setForm={setForm}
        userInfo={userInfo}
        userId={mockId}
      />

      <h2 className="mt-4 mb-4">Address</h2>
      <ProfileAddressSection
        form={form}
        setForm={setForm}
        userInfo={userInfo}
        userId={mockId}
      />

      <h2 className="mt-4 mb-4">Contact Info</h2>
      <ProfileContactInfoSection
        form={form}
        setForm={setForm}
        userInfo={userInfo}
        userId={mockId}
      />

      <h2 className="my-4">Employment</h2>
      <ProfileEmploymentSection
        form={form}
        setForm={setForm}
        userInfo={userInfo}
        userId={mockId}
      />

      <h2 className="my-4">Emergency contact</h2>
      <ProfileEmergencyContactSection
        form={form}
        setForm={setForm}
        userInfo={userInfo}
        userId={mockId}
      />

      {/* <h2 className="my-4">Documents</h2>
      <ProfileDocumentSection
        documents={documents}
        setDocuments={setDocuments}
        userInfo={userInfo}
        userId={mockId}
      /> */}
    </div>
  );
}
