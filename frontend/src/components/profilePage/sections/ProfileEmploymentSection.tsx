import EditableSection from "../EditableSection";
import type { UserInfo, VisaInfo } from "../../../pages/OnboardingPage";
import toast from "react-hot-toast";
import axiosApi from "../../../lib/axiosApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  fetchUserInfo,
  updateUserInfo,
} from "../../../store/slices/userInfoSlice";

interface EmploymentSectionProps {
  userInfo: UserInfo;
}

export default function ProfileEmploymentSection({
  userInfo,
}: EmploymentSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserInfo>>({
    visa: {
      type: userInfo?.visa?.type,
      startDate: userInfo?.visa?.startDate,
      endDate: userInfo?.visa?.endDate,
    },
  });

  const handleSave = async () => {
    try {
      const payload = {
        visa: {
          type: form.visa?.type,
          startDate: form.visa?.startDate,
          endDate: form.visa?.endDate,
        },
      };

      await dispatch(updateUserInfo(payload as UserInfo));
      await dispatch(fetchUserInfo());
      if (form.visa?.file) {
        const formData = new FormData();
        formData.append("file", form.visa.file);
        await axiosApi.post("/onboarding", formData);
      }

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
