import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { FormEvent, useEffect, useState } from "react";
import {
  fetchOnboarding,
  submitOnboarding,
} from "../store/slices/onboardingSlice";
import GeneralLoading from "../components/skeletons/GeneralLoading";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function OnboardingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const onboarding = useSelector((state: RootState) => state.onboarding);
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showOptReceipt, setShowOptReceipt] = useState(false);
  const [showWorkAuthorization, setShowWorkAuthorization] = useState(false);
  const [showDriverLicenseFile, setShowDriverLicenseFile] = useState(false);

  const submitted = useSelector((state: RootState) => state.onboarding.submitted);

  


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
    isCitizenOrPR: "" as "" | "yes" | "no",
    citizenstatus: "" as "" | "Green Card" | "Citizen",
    visa: {
      type: "",
      optReceipt: null as File | null,
      otherVisaTitle: "",
      startDate: "",
      endDate: "",
      file: null as File | null,
      workAuthorization: null as File | null,
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submission = new FormData();

    const {
      profilePic,
      visa: { optReceipt, file, workAuthorization, ...visaData },
      driverLicenseFile,
      ...restData
    } = formData;

    const cleanFormData = { ...restData, visa: visaData };

    submission.append("data", JSON.stringify(cleanFormData));

    if (profilePic) submission.append("profilePic", profilePic);
    if (optReceipt) submission.append("optReceipt", optReceipt);
    if (workAuthorization)
      submission.append("workAuthorization", workAuthorization);
    if (driverLicenseFile)
      submission.append("driverLicenseFile", driverLicenseFile);

    dispatch(submitOnboarding(submission));
    toast.success("Onboarding application submitted successfully!");
    // clear the form
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      preferredName: "",
      profilePic: null,

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
      isCitizenOrPR: "" as "" | "yes" | "no",
      citizenstatus: "" as "" | "Green Card" | "Citizen",
      visa: {
        type: "",
        optReceipt: null,
        otherVisaTitle: "",
        startDate: "",
        endDate: "",
        file: null,
        workAuthorization: null,
      },

      hasDriverLicense: false,
      driverLicenseNumber: "",
      driverLicenseExpirationDate: "",
      driverLicenseFile: null,

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
  };

  if (onboarding.status === "loading") {
    return <GeneralLoading />;
  }

  return (
    <>
      {submitted && (
        <div className="container my-3">
          <div className="alert alert-success" role="alert">
            Onboarding application submitted successfully!
          </div>
          {/* View Status */}
          <Link to="/app/onboarding/status">
            <button className="btn btn-primary w-100">View Status</button>
          </Link>
        </div>
      )}
      {!submitted && (
        <div
          className="container-fluid"
          style={{
            maxHeight: "100%",
            overflow: "auto",
            height: "calc(100vh - 80px)",
          }}
        >
          <h2 className="text-center fw-bold">Onboarding Application</h2>
          <hr />

          <form
            className="needs-validation container my-3 bg-light p-3 shadow"
            onSubmit={handleSubmit}
          >
            <>
              {/* Name Fields */}
              <fieldset>
                <legend className="fw-bold">Personal Information</legend>
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
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, middleName: e.target.value })
                      }
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
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {/* Profile Picture */}
                <div className="mb-3">
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profilePic: e.target.files ? e.target.files[0] : null,
                      })
                    }
                  />
                </div>
              </fieldset>

              {/* Address */}
              <div className="row mb-3">
                <label className="col-md-12 form-label">Address</label>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Building"
                    required
                    value={formData.address.building}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          building: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Street"
                    required
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="City"
                    required
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="State"
                    required
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Zip"
                    required
                    value={formData.address.zip}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          zip: e.target.value,
                        },
                      })
                    }
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
                    required
                    value={formData.cellPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, cellPhone: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    type="tel"
                    placeholder="Work Phone"
                    value={formData.workPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, workPhone: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        car: { ...formData.car, make: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Model"
                    value={formData.car.model}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        car: { ...formData.car, model: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Color"
                    value={formData.car.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        car: { ...formData.car, color: e.target.value },
                      })
                    }
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
                    required
                    value={formData.ssn}
                    onChange={(e) =>
                      setFormData({ ...formData, ssn: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dob}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label>Gender</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
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

                <select
                  className="form-select"
                  value={formData.isCitizenOrPR || ""}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCitizenOrPR: e.target.value as "" | "yes" | "no",
                    })
                  }
                >
                  <option value="">-- Select --</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>

                {formData.isCitizenOrPR === "yes" && (
                  <div className="mb-3 border p-3 rounded bg-light">
                    <select
                      className="form-select mb-2"
                      value={formData.citizenstatus}
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          citizenstatus: e.target.value as
                            | ""
                            | "Green Card"
                            | "Citizen",
                        })
                      }
                    >
                      <option value="">Select Citizenship Status</option>
                      <option value="Green Card">Green Card</option>
                      <option value="Citizen">Citizen</option>
                    </select>
                  </div>
                )}

                {formData.isCitizenOrPR === "no" && (
                  <div className="mb-3 border p-3 rounded bg-light">
                    <label>Work Authorization Type</label>
                    <select
                      className="form-select mb-2"
                      value={formData.visa.type}
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visa: { ...formData.visa, type: e.target.value },
                        })
                      }
                    >
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            visa: {
                              ...formData.visa,
                              otherVisaTitle: e.target.value,
                            },
                          })
                        }
                      />
                    )}

                    {formData.visa.type === "F1" && (
                      <div className="mb-2">
                        <label>Upload OPT Receipt</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              visa: {
                                ...formData.visa,
                                optReceipt: e.target.files?.[0] as File,
                              },
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label>Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.visa.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              visa: {
                                ...formData.visa,
                                startDate: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label>End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.visa.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              visa: {
                                ...formData.visa,
                                endDate: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label>Upload Work Authorization</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            visa: {
                              ...formData.visa,
                              workAuthorization: e.target.files?.[0] as File,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Driver License */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hasDriverLicense"
                  checked={formData.hasDriverLicense}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasDriverLicense: e.target.checked,
                    })
                  }
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
                      required
                      value={formData.driverLicenseNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          driverLicenseNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Expiration Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Expiration Date"
                      required
                      value={formData.driverLicenseExpirationDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          driverLicenseExpirationDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Upload Driver's License</label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          driverLicenseFile: e.target.files?.[0] as File,
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              <fieldset>
                <legend className="fw-bold">Emergency Contact</legend>
                {/* Emergency Contact */}
                <div className="mb-4">
                  {formData.emergencyContact.map((contact, idx) => (
                    <div className="border rounded p-3 mb-3" key={idx}>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            value={contact.firstName}
                            onChange={(e) => {
                              const newContacts = [
                                ...formData.emergencyContact,
                              ];
                              newContacts[idx].firstName = e.target.value;
                              setFormData({
                                ...formData,
                                emergencyContact: newContacts,
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            value={contact.lastName}
                            onChange={(e) => {
                              const newContacts = [
                                ...formData.emergencyContact,
                              ];
                              newContacts[idx].lastName = e.target.value;
                              setFormData({
                                ...formData,
                                emergencyContact: newContacts,
                              });
                            }}
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
                            onChange={(e) => {
                              const newContacts = [
                                ...formData.emergencyContact,
                              ];
                              newContacts[idx].phone = e.target.value;
                              setFormData({
                                ...formData,
                                emergencyContact: newContacts,
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={contact.email}
                            onChange={(e) => {
                              const newContacts = [
                                ...formData.emergencyContact,
                              ];
                              newContacts[idx].email = e.target.value;
                              setFormData({
                                ...formData,
                                emergencyContact: newContacts,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Relationship"
                          value={contact.relationship}
                          onChange={(e) => {
                            const newContacts = [...formData.emergencyContact];
                            newContacts[idx].relationship = e.target.value;
                            setFormData({
                              ...formData,
                              emergencyContact: newContacts,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="fw-bold">Additional Information</legend>
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referral: {
                              ...formData.referral,
                              firstName: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Referrer Last Name"
                        value={formData.referral.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referral: {
                              ...formData.referral,
                              lastName: e.target.value,
                            },
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referral: {
                              ...formData.referral,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Referrer Email"
                        value={formData.referral.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referral: {
                              ...formData.referral,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Relationship"
                      value={formData.referral.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referral: {
                            ...formData.referral,
                            relationship: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </fieldset>

              {/* Upload Files Summary */}
              <div className="mb-4">
                <h5>Uploaded Files</h5>
                <ul className="list-group">
                  {formData.profilePic && (
                    <li
                      key={formData.profilePic.name}
                      className="list-group-item cursor-pointer"
                      onClick={() => setShowProfilePic((prev) => !prev)}
                    >
                      Profile Picture: {formData.profilePic.name}
                      <div
                        className={`collapse ${
                          showProfilePic ? "show" : ""
                        } mt-2`}
                      >
                        <img
                          src={URL.createObjectURL(formData.profilePic)}
                          alt="Profile"
                          className="img-thumbnail"
                        />
                      </div>
                    </li>
                  )}
                  {formData.driverLicenseFile && (
                    <li
                      className="list-group-item cursor-pointer"
                      key={formData.driverLicenseFile.name}
                      onClick={() => {
                        setShowDriverLicenseFile((prev) => !prev);
                      }}
                    >
                      Driver License: {formData.driverLicenseFile.name}
                      <div
                        className={`collapse ${
                          showDriverLicenseFile ? "show" : ""
                        } mt-2`}
                      >
                        <img
                          src={URL.createObjectURL(formData.driverLicenseFile)}
                          alt="Driver License"
                          className="img-thumbnail"
                        />
                      </div>
                    </li>
                  )}
                  {formData.visa.workAuthorization && (
                    <li
                      className="list-group-item cursor-pointer"
                      key={formData.visa.workAuthorization.name}
                      onClick={() => setShowWorkAuthorization((prev) => !prev)}
                    >
                      Work Auth: {formData.visa.workAuthorization.name}
                      <div
                        className={`collapse ${
                          showWorkAuthorization ? "show" : ""
                        } mt-2`}
                      >
                        <img
                          src={URL.createObjectURL(
                            formData.visa.workAuthorization
                          )}
                          alt="Work Authorization"
                          className="img-thumbnail"
                        />
                      </div>
                    </li>
                  )}
                  {formData.visa.optReceipt && (
                    <li
                      className="list-group-item cursor-pointer"
                      key={formData.visa.optReceipt.name}
                      onClick={() => setShowOptReceipt((prev) => !prev)}
                    >
                      OPT Receipt: {formData.visa.optReceipt.name}
                      <div
                        className={`collapse ${
                          showOptReceipt ? "show" : ""
                        } mt-2`}
                      >
                        <img
                          src={URL.createObjectURL(formData.visa.optReceipt)}
                          alt="OPT Receipt"
                          className="img-thumbnail"
                        />
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Submit Button */}
              <div className="text-end">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </>
          </form>
        </div>
      )}
    </>
  );
}
