// components/profilePage/sections/NameSection.tsx
import EditableSection from "../EditableSection";
import { UserInfo } from "../../../pages/OnboardingPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  fetchUserInfo,
  updateUserInfo,
} from "../../../store/slices/userInfoSlice";

interface NameSectionProps {
  userInfo: UserInfo | null;
  userId: string;
}

export default function ProfileNameSection({
  userInfo,
  userId,
}: NameSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<Partial<UserInfo>>({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    middleName: userInfo?.middleName,
    preferredName: userInfo?.preferredName,
    email: userInfo?.email,
    ssn: userInfo?.ssn,
    dob: userInfo?.dob,
    gender: userInfo?.gender,
  });

  useEffect(() => {
    if (userInfo) {
      setForm({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        middleName: userInfo.middleName,
        preferredName: userInfo.preferredName,
        email: userInfo.email,
        ssn: userInfo.ssn,
        dob: userInfo.dob,
        gender: userInfo.gender,
      });
    }
  }, [userInfo]);

  const handleSave = async () => {
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        preferredName: form.preferredName,
        email: form.email,
        ssn: form.ssn,
        dob: form.dob,
        gender: form.gender,
      };

      await dispatch(updateUserInfo(payload));
      await dispatch(fetchUserInfo());
      
      toast.success("Name section saved successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save name section");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setForm(userInfo || {});
    setIsEditing(false);
  };

  return (
    <EditableSection
      title="Name Fields"
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="row">
        <div className="col-md-4 mb-2">
          <label className="form-label">First Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.firstName || ""}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div className="col-md-4 mb-2">
          <label className="form-label">Middle Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.middleName || ""}
            onChange={(e) => setForm({ ...form, middleName: e.target.value })}
          />
        </div>
        <div className="col-md-4 mb-2">
          <label className="form-label">Last Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.lastName || ""}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label">Preferred Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.preferredName || ""}
            onChange={(e) =>
              setForm({ ...form, preferredName: e.target.value })
            }
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.email || ""}
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label">SSN</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.ssn || ""}
            onChange={(e) => setForm({ ...form, ssn: e.target.value })}
            pattern="^\d{9}$"
            title="Please enter a valid 9-digit SSN"
            required
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label">Date of Birth</label>
          <input
            className="form-control"
            disabled={!isEditing}
            type="date"
            value={form.dob || ""}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            disabled={!isEditing}
            value={form.gender || ""}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </EditableSection>
  );
}
