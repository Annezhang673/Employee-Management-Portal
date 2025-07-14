import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setUserInfo } from "../../store/slices/userInfoSlice";
import ProfileNameSection from "../../components/profilePage/sections/ProfileNameSection";
import { UserInfo } from "../OnboardingPage";

export type ApplicationInfo = {
  _id: string;
  user: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  feedback: string;
  documents: any[]; // optionally type this better
  data: UserInfo;
}

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo as ApplicationInfo | null);

  const [form, setForm] = useState<Partial<UserInfo>>({});

  const mockId = "68730bb6ffbffeea6daaf227";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          params: { userId: mockId },
        });

        if (response.data?.application) {
          dispatch(setUserInfo(response.data.application[0]));
          setForm(response.data.application[0].data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    if (userInfo === null) {
      fetchUserInfo();
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (userInfo?.data) {
      setForm(userInfo.data);
    }
  }, [userInfo]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Personal Information</h2>
      <ProfileNameSection
        form={form}
        setForm={setForm}
        userInfo={userInfo ? userInfo.data : null}
        userId={mockId}
      />
    </div>
  );
}
