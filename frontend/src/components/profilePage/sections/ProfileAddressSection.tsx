import { useState } from "react";
import { Address, UserInfo } from "../../../pages/OnboardingPage";
import EditableSection from "../EditableSection";
import axios from "axios";
import toast from "react-hot-toast";

interface AddressSectonProps {
  form: Partial<UserInfo>;
  setForm: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>;
  userInfo: UserInfo | null;
  userId: string;
}

// Building/apt#, street name, city, state, zip
export default function ProfileAddressSection({
  form,
  setForm,
  userInfo,
  userId,
}: AddressSectonProps) {
  const [isEditing, setIsEditing] = useState(false);

  const address: Address = form.address as Address;

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/me?userId=${userId}`, {
        address: {
          building: address?.building,
          street: address?.street,
          city: address?.city,
          state: address?.state,
          zip: address?.zip,
        },
      });

      toast.success("Address section saved successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save address section");
    }
  };

  console.log("form:", form);
  return (
    <EditableSection
      title="Address Field"
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
    >
      <div className="row">
        <div className="col-md-2 mb-2">
          <label className="form-label">Building#</label>
          <input
            className="form-control"
            type="text"
            placeholder="Building/Apt #"
            value={address?.building}
            onChange={(e) =>
              setForm({
                ...form,
                address: {
                  ...address,
                  building: e.target.value,
                },
              })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-5 mb-2">
          <label className="form-label">Street</label>
          <input
            className="form-control"
            type="text"
            placeholder="Street"
            value={address?.street}
            onChange={(e) =>
              setForm({
                ...form,
                address: {
                  ...address,
                  street: e.target.value,
                },
              })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-2 mb-2">
          <label className="form-label">City</label>
          <input
            className="form-control"
            type="text"
            placeholder="City"
            value={address?.city}
            onChange={(e) =>
              setForm({
                ...form,
                address: {
                  ...address,
                  city: e.target.value,
                },
              })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-1 mb-2">
          <label className="form-label">State</label>
          <input
            className="form-control"
            type="text"
            placeholder="State"
            value={address?.state}
            onChange={(e) =>
              setForm({
                ...form,
                address: {
                  ...address,
                  state: e.target.value,
                },
              })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-2 mb-2">
          <label className="form-label">Zip</label>
          <input
            className="form-control"
            type="text"
            placeholder="Zip"
            value={address?.zip}
            onChange={(e) =>
              setForm({
                ...form,
                address: {
                  ...address,
                  zip: e.target.value,
                },
              })
            }
            disabled={!isEditing}
          />
        </div>
      </div>
    </EditableSection>
  );
}
