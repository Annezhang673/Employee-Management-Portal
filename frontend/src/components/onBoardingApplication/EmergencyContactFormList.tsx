import React from "react";

type EmergencyContact = {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  relationship: string;
};

type Props = {
  contacts: EmergencyContact[];
  setContacts: (contacts: EmergencyContact[]) => void;
};

export default function EmergencyContactFormList({
  contacts,
  setContacts,
}: Props) {
  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ]);
  };

  const handleChange = (
    idx: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    const updated = contacts.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    );
    setContacts(updated);
  };

  const handleDelete = (idx: number) => {
    setContacts(contacts.filter((_, i) => i !== idx));
  };

  return (
    <fieldset>
      <legend className="fw-bold">Emergency Contact</legend>
      {contacts.map((contact, idx) => (
        <div className="border rounded p-3 mb-3" key={idx}>
          <div className="row mb-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={contact.firstName}
                required
                onChange={(e) => handleChange(idx, "firstName", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Middle Name"
                value={contact.middleName}
                onChange={(e) =>
                  handleChange(idx, "middleName", e.target.value)
                }
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={contact.lastName}
                required
                onChange={(e) => handleChange(idx, "lastName", e.target.value)}
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
                pattern="^\d{3}-\d{3}-\d{4}$"
                title="Please enter a valid phone number in the format XXX-XXX-XXXX"
                onChange={(e) => handleChange(idx, "phone", e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                value={contact.email}
                onChange={(e) => handleChange(idx, "email", e.target.value)}
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="Relationship"
              value={contact.relationship}
              required
              onChange={(e) =>
                handleChange(idx, "relationship", e.target.value)
              }
            />
          </div>

          {contacts.length > 1 && (
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-danger mt-3"
                onClick={() => handleDelete(idx)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={handleAddContact}
        >
          + Add Emergency Contact
        </button>
      </div>
    </fieldset>
  );
}
