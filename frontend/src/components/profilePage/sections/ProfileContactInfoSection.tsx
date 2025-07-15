import { useState } from "react";
import EditableSection from "../EditableSection";
import toast from "react-hot-toast";
import { UserInfo } from "../../../pages/OnboardingPage";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import {
  fetchUserInfo,
  updateUserInfo,
} from "../../../store/slices/userInfoSlice";

export type ContactInfo = {
  cellPhone: string;
  workPhone: string;
};

interface ContactInfoSectionProps {
  userInfo: UserInfo | null;
  userId: string;
}

export default function ProfileContactInfoSection({
  userInfo,
  userId,
}: ContactInfoSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<Partial<ContactInfo>>({
    cellPhone: userInfo?.cellPhone,
    workPhone: userInfo?.workPhone,
  });


  const handleSave = async () => {
    try {
      const payload = {
        cellPhone: form.cellPhone,
        workPhone: form.workPhone,
      };

      await dispatch(updateUserInfo(payload));
      await dispatch(fetchUserInfo());

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
            value={form.cellPhone || ""}
            onChange={(e) => setForm({ ...form, cellPhone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Work Phone</label>
          <input
            type="text"
            className="form-control"
            value={form.workPhone || ""}
            onChange={(e) => setForm({ ...form, workPhone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </EditableSection>
  );
}
