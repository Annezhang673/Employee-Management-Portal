import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { fetchOnboarding } from "../store/slices/onboardingSlice";
import GeneralLoading from "../components/skeletons/GeneralLoading";

export default function OnboardingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const onboarding = useSelector((state: RootState) => state.onboarding);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    preferredName: "",
    profilePic: null as File | null,

    address: {
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },

    cellPhone: "",
    workPhone: "",

    car: {
      make: "",
      model: "",
      color: "",
    },

    email: "", // pre-filled
    ssn: "",
    dob: "",
    gender: "",
    isCitizenOrPR: null as null | "yes" | "no",
    citizenstatus: "" as "" | "Green Card" | "Citizen",
    visa: {
      type: "",
      optReceipt: null as File | null,
      otherVisaTitle: "",
      startDate: "",
      endDate: "",
      file: null as File | null,
    },

    hasDriverLicense: false,
    driverLicenseNumber: "",
    driverLicenseExpirationDate: "",
    driverLicenseFile: null as File | null,

    referral: {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      email: "",
      relationship: "",
    },

    emergencyContact: [
      {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ],
  });

  useEffect(() => {
    dispatch(fetchOnboarding());
  }, [dispatch]);

  if (onboarding.status === "loading") {
    return <GeneralLoading />;
  }

  return (
    <div
      className="container-fluid"
      style={{
        maxHeight: "100%",
        overflow: "auto",
        height: "calc(100vh - 80px)",
      }}
    >
      <h2 className="text-center">Onboarding Application</h2>
      <form className="container mt-3">
        <>
          {/* Name Fields */}
          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                className="form-control"
                id="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="middleName" className="form-label">
                Middle Name
              </label>
              <input
                className="form-control"
                id="middleName"
                type="text"
                placeholder="Middle Name"
                value={formData.middleName}
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                className="form-control"
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
              />
            </div>

            <div className="form-group col-md-12 mt-2">
              <label htmlFor="preferredName" className="form-label">
                Preferred Name
              </label>
              <input
                className="form-control"
                id="preferredName"
                type="text"
                placeholder="Preferred Name"
                value={formData.preferredName}
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-control" accept="image/*" />
          </div>

          {/* Address */}
          <div className="row mb-3">
            <label className="col-md-12 form-label">Address</label>
            <div className="col-md-2">
              <input
                className="form-control"
                type="text"
                placeholder="Building"
                value={formData.address.building}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                placeholder="Street"
                value={formData.address.street}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                type="text"
                placeholder="City"
                value={formData.address.city}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                type="text"
                placeholder="State"
                value={formData.address.state}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                type="text"
                placeholder="Zip"
                value={formData.address.zip}
              />
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="row mb-3">
            <label className="col-md-12 form-label">Phone Numbers</label>
            <div className="col-md-6">
              <input
                className="form-control"
                type="tel"
                placeholder="Cell Phone"
                value={formData.cellPhone}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="tel"
                placeholder="Work Phone"
                value={formData.workPhone}
              />
            </div>
          </div>

          {/* Car Info*/}
          <div className="row mb-3">
            <label className="col-md-12 form-label">Car Information</label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                placeholder="Make"
                value={formData.car.make}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                placeholder="Model"
                value={formData.car.model}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                placeholder="Color"
                value={formData.car.color}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              readOnly
            />
          </div>

          {/* SSN, DOB, Gender */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label>SSN</label>
              <input
                type="text"
                className="form-control"
                placeholder="SSN"
                value={formData.ssn}
              />
            </div>
            <div className="col-md-4">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={formData.dob}
              />
            </div>
            <div className="col-md-4">
              <label>Gender</label>
              <select className="form-select" value={formData.gender}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="na">I do not wish to answer</option>
              </select>
            </div>
          </div>

          {/* Citizenship */}
          <div className="mb-3">
            <label>Are you a U.S. Citizen or Permanent Resident?</label>
          </div>
          <select className="form-select" value={formData.isCitizenOrPR || ""}>
            <option value="">-- Select --</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          {formData.isCitizenOrPR === "yes" && (
            <select value={formData.citizenstatus}>
              <option value="">Select Citizenship Status</option>
              <option value="Green Card">Green Card</option>
              <option value="Citizen">Citizen</option>
            </select>
          )}

          {formData.isCitizenOrPR === "no" && (
            <div className="mb-3 border p-3 rounded bg-light">
              <label>Work Authorization Type</label>
              <select className="form-select mb-2" value={formData.visa.type}>
                <option value="">-- Select --</option>
                <option value="H1-B">H1-B</option>
                <option value="L2">L2</option>
                <option value="F1">F1 (CPT/OPT)</option>
                <option value="H4">H4</option>
                <option value="Other">Other</option>
              </select>

              {formData.visa.type === "Other" && (
                <input
                  className="form-control mb-2"
                  type="text"
                  placeholder="Visa Type"
                  value={formData.visa.otherVisaTitle}
                />
              )}

              {formData.visa.type === "F1" && (
                <div className="mb-2">
                  <label>Upload OPT Receipt</label>
                  <input type="file" className="form-control" />
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-2">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.visa.startDate}
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.visa.endDate}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label>Upload Work Authorization</label>
                <input type="file" className="form-control" />
              </div>
            </div>
          )}

          {/* Driver License */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="hasDriverLicense"
              checked={formData.hasDriverLicense}
            />
            <label className="form-check-label" htmlFor="hasDriverLicense">
              I have a driver's license
            </label>
          </div>

          {formData.hasDriverLicense && (
            <div className="mb-3 border p-3 rounded bg-light">
              <div className="mb-2">
                <label>License Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="License Number"
                  value={formData.driverLicenseNumber}
                />
              </div>
              <div className="mb-2">
                <label>Expiration Date</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder="Expiration Date"
                  value={formData.driverLicenseExpirationDate}
                />
              </div>
              <div className="mb-2">
                <label>Upload Driver's License</label>
                <input className="form-control" type="file" />
              </div>
            </div>
          )}

          {/* Referred By */}
          <div className="mb-4">
            <h5>Referrer Information</h5>
            <div className="row mb-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Referrer First Name"
                  value={formData.referral.firstName}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Referrer Last Name"
                  value={formData.referral.lastName}
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Referrer Phone"
                  value={formData.referral.phone}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Referrer Email"
                  value={formData.referral.email}
                />
              </div>
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Relationship"
                value={formData.referral.relationship}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-4">
            <h5>Emergency Contact(s)</h5>
            {formData.emergencyContact.map((contact, idx) => (
              <div className="border rounded p-3 mb-3" key={idx}>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={contact.firstName}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={contact.lastName}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      value={contact.phone}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={contact.email}
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Relationship"
                    value={contact.relationship}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Upload Files Summary */}
          <div className="mb-4">
            <h5>Uploaded Files</h5>
            <ul className="list-group">
              {formData.profilePic && (
                <li className="list-group-item">
                  Profile Picture: {formData.profilePic.name}
                </li>
              )}
              {formData.driverLicenseFile && (
                <li className="list-group-item">
                  Driver License: {formData.driverLicenseFile.name}
                </li>
              )}
              {formData.visa.file && (
                <li className="list-group-item">
                  Work Auth: {formData.visa.file.name}
                </li>
              )}
              {formData.visa.optReceipt && (
                <li className="list-group-item">
                  OPT Receipt: {formData.visa.optReceipt.name}
                </li>
              )}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="text-end my-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </>
      </form>
    </div>
  );
}
