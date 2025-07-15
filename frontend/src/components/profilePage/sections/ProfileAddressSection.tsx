import { useEffect, useState } from "react";
import { Address, UserInfo } from "../../../pages/OnboardingPage";
import EditableSection from "../EditableSection";
import axiosApi from "../../../lib/axiosApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  fetchUserInfo,
  updateUserInfo,
} from "../../../store/slices/userInfoSlice";

interface AddressSectonProps {
  userInfo: UserInfo | null;
  userId: string;
}

// Building/apt#, street name, city, state, zip
export default function ProfileAddressSection({
  userInfo,
  userId,
}: AddressSectonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserInfo>>({
    address: {
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const address: Address = {
    building: form.address?.building || "",
    street: form.address?.street || "",
    city: form.address?.city || "",
    state: form.address?.state || "",
    zip: form.address?.zip || "",
  };

  useEffect(() => {
    if (userInfo) {
      setForm({
        address: {
          building: userInfo.address?.building || "",
          street: userInfo.address?.street || "",
          city: userInfo.address?.city || "",
          state: userInfo.address?.state || "",
          zip: userInfo.address?.zip || "",
        },
      });
    }
  }, [userInfo]);

  const handleSave = async () => {
    try {
      const payload = {
        address: {
          building: form.address?.building || "",
          street: form.address?.street || "",
          city: form.address?.city || "",
          state: form.address?.state || "",
          zip: form.address?.zip || "",
        },
      };

      await dispatch(updateUserInfo(payload as UserInfo));
      await dispatch(fetchUserInfo());
      

      toast.success("Address section saved successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save address section");
    }
  };

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
            value={address?.building || ""}
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
            value={address?.street || ""}
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
            value={address?.city || ""}
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
            value={address?.state || ""}
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
            value={address?.zip || ""}
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
