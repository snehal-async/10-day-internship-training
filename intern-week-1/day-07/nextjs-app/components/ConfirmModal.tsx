"use client";

import React from "react";
import { Employee } from "../types/employee";

interface ConfirmModalProps {
  isOpen: boolean;
  employee: Employee | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  employee,
  isDeleting,
  onCancel,
  onConfirm
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h3 style={{ color: "var(--danger-text)" }}>Confirm Deletion</h3>
          <button type="button" onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer" }}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to permanently delete record for{" "}
            <strong>
              {employee.firstName} {employee.lastName}
            </strong>{" "}
            (<code>{employee.id}</code>)?
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
            This will execute a DELETE request to the Express backend with demo authorization.
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete Record"}
          </button>
        </div>
      </div>
    </div>
  );
};