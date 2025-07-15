import EmergencyContactFormList from "../../onBoardingApplication/EmergencyContactFormList";
import EditableSection from "../EditableSection";

import type { EmergencyContact, UserInfo } from "../../../pages/OnboardingPage";
import { useState } from "react";
import axiosApi from "../../../lib/axiosApi";
import toast from "react-hot-toast";

// firstName, lastName, middleName, phone, email, relationship
interface EmergencyContactSectionProps {
  form: Partial<UserInfo>;
  setForm: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>;
  userInfo: UserInfo | null;
  userId: string;
}

export default function ProfileEmergencyContactSection({
  form,
  setForm,
  userInfo,
  userId,
}: EmergencyContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const emergencyContact: EmergencyContact[] = form.emergencyContact ?? [
    {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      email: "",
      relationship: "",
    },
  ];

  const handleSave = async () => {
    try {
      await axiosApi.put(`/api/users/me?userId=${userId}`, {
        emergencyContact,
      });
      toast.success("Emergency contact saved successfully!");
      setIsEditing(false);
    } catch (error) {}
  };

  return (
    <EditableSection
      title="Emergency Contact"
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      setIsEditing={setIsEditing}
      isEditing={isEditing}
    >
      <EmergencyContactFormList
        showLegend={false}
        contacts={emergencyContact}
        setContacts={(updatted) =>
          setForm({ ...form, emergencyContact: updatted })
        }
        isEditing={!isEditing}
      />
    </EditableSection>
  );
}
