import React from "react";
import { Employee } from "../types/employee";

interface ConfirmDialogProps {
  isOpen: boolean;
  employee: Employee | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  employee,
  isDeleting,
  onCancel,
  onConfirm
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="modal-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="modal-card" style={{ maxWidth: 480 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--danger-bg)",
                color: "var(--danger-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <h3 id="confirm-dialog-title" style={{ color: "var(--danger-text)" }}>
              Confirm Employee Deletion
            </h3>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="18" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ color: "var(--text-main)", fontSize: "0.9375rem" }}>
            Are you sure you want to permanently delete record for{" "}
            <strong>
              {employee.firstName} {employee.lastName}
            </strong>{" "}
            (<code>{employee.id}</code>)?
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
            This action will remove the record from the REST database. This operation cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            {isDeleting ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span>
                <span>Deleting...</span>
              </>
            ) : (
              "Yes, Delete Record"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
