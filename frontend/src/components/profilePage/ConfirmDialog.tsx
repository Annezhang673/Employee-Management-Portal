import React from "react";

type ConfirmDialogProps = {
  show: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  show,
  message = "Are you sure you want to discard all changes?",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 10 }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{ minWidth: "300px" }}
      >
        <p className="fw-bold mb-3">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onCancel}>
            No
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
