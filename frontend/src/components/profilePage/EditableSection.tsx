import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type EditableSectionProps = {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
};

export default function EditableSection({
  title,
  children,
  onSave,
  onCancel,
  isEditing,
  setIsEditing,
}: EditableSectionProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="border rounded p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>{title}</h5>
          {!isEditing ? (
            <button
              className="btn btn-outline-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div>
              <button className="btn btn-success me-2" onClick={onSave}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(true)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {children}
      </div>

      <ConfirmDialog
        show={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          onCancel();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
