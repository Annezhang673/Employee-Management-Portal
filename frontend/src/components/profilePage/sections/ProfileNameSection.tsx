// components/profilePage/sections/NameSection.tsx
import EditableSection from "../EditableSection";
import { UserInfo } from "../../../pages/OnboardingPage";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface NameSectionProps {
  form: Partial<UserInfo>;
  setForm: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>;
  userInfo: UserInfo | null;
  userId: string;
}

export default function ProfileNameSection({
  form,
  setForm,
  userInfo,
  userId,
}: NameSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/me?userId=${userId}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        preferredName: form.preferredName,
        email: form.email,
      });
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
      title="Name"
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="row">
        <div className="col-md-6 mb-2">
          <label>First Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.firstName || ""}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label>Middle Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.middleName || ""}
            onChange={(e) => setForm({ ...form, middleName: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label>Last Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.lastName || ""}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label>Preferred Name</label>
          <input
            className="form-control"
            disabled={!isEditing}
            value={form.preferredName || ""}
            onChange={(e) =>
              setForm({ ...form, preferredName: e.target.value })
            }
          />
        </div>
      </div>
    </EditableSection>
  );
}
