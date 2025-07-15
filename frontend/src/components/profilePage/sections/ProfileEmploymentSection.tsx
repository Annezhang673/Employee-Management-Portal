import EditableSection from "../EditableSection";
import type { UserInfo, VisaInfo } from "../../../pages/OnboardingPage";
import toast from "react-hot-toast";
import axiosApi from "../../../lib/axiosApi";
import { useState } from "react";

interface EmploymentSectionProps {
  form: Partial<UserInfo>;
  setForm: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>;
  userInfo: UserInfo | null;
  userId: string;
}

export default function ProfileEmploymentSection({
  form,
  setForm,
  userInfo,
  userId,
}: EmploymentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const visa: VisaInfo = form.visa as VisaInfo;

  const handleSave = async () => {
    try {
      await axiosApi.put(`/api/users/me?userId=${userId}`, {
        visa: {
          type: visa?.type,
          startDate: visa?.startDate,
          endDate: visa?.endDate,
        },
      });
      toast.success("Employment section saved successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save employment section");
    }
  };

  return (
    <EditableSection
      title="Employment"
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    >
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Visa Type</label>
          <input
            type="text"
            className="form-control"
            value={form.visa?.type || ""}
            onChange={(e) => {
              setForm({
                ...form,
                visa: {
                  ...form.visa,
                  type: e.target.value,
                },
              });
            }}
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={form.visa?.startDate || ""}
            onChange={(e) => {
              setForm({
                ...form,
                visa: {
                  ...form.visa,
                  startDate: e.target.value,
                },
              });
            }}
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={form.visa?.endDate || ""}
            onChange={(e) => {
              setForm({
                ...form,
                visa: {
                  ...form.visa,
                  endDate: e.target.value,
                },
              });
            }}
            disabled={!isEditing}
          />
        </div>
      </div>
    </EditableSection>
  );
}
