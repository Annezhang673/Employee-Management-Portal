import { useState } from "react";
import EditableSection from "../EditableSection";
import toast from "react-hot-toast";
import axios from "axios";
import { UserInfo } from "../../../pages/OnboardingPage";

export type ContactInfo = {
  cellPhone: string;
  workPhone: string;
};

interface ContactInfoSectionProps {
  form: Partial<ContactInfo>;
  setForm: React.Dispatch<React.SetStateAction<Partial<ContactInfo>>>;
  userInfo: UserInfo | null;
  userId: string;
}

export default function ProfileContactInfoSection({
  form,
  setForm,
  userInfo,
  userId,
}: ContactInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/me?userId=${userId}`, {
        cellPhone: form.cellPhone,
        workPhone: form.workPhone,
      });
      toast.success("Contact info saved successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save contact info");
      console.error(err);
    }
  };

  return (
    <EditableSection
      title="Contact Info"
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    >
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Cellphone</label>
          <input
            type="text"
            className="form-control"
            value={form.cellPhone}
            onChange={(e) => setForm({ ...form, cellPhone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Work Phone</label>
          <input
            type="text"
            className="form-control"
            value={form.workPhone}
            onChange={(e) => setForm({ ...form, workPhone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </EditableSection>
  );
}
