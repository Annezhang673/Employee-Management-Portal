import EmergencyContactFormList from "../../onBoardingApplication/EmergencyContactFormList";
import EditableSection from "../EditableSection";

import type { EmergencyContact, UserInfo } from "../../../pages/OnboardingPage";
import { useState } from "react";
import axiosApi from "../../../lib/axiosApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { fetchUserInfo, updateUserInfo } from "../../../store/slices/userInfoSlice";

// firstName, lastName, middleName, phone, email, relationship
interface EmergencyContactSectionProps {
  userInfo: UserInfo | null;
}

export default function ProfileEmergencyContactSection({
  userInfo,
}: EmergencyContactSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserInfo>>({
    emergencyContact: userInfo?.emergencyContact,
  })

  const emergencyContact = form.emergencyContact ?? [
    {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      relationship: "",
    },
  ];

  const handleSave = async () => {
    try {
      const payload = {
        emergencyContact: form.emergencyContact,
      };
      await dispatch(updateUserInfo(payload));
      await dispatch(fetchUserInfo());
      
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
