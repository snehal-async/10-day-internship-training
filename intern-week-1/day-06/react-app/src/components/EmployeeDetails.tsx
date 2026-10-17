import React from "react";
import { Employee } from "../types/employee";
import {
  formatCurrency,
  formatDate,
  getInitials,
  getAvatarColor,
  getStatusBadgeConfig
} from "../utils/formatters";

interface EmployeeDetailsProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen || !employee) return null;

  const avatar = getAvatarColor(`${employee.firstName} ${employee.lastName}`);
  const statusConfig = getStatusBadgeConfig(employee.status);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-details-title"
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h3 id="modal-details-title">Employee Profile Overview</h3>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
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
          {/* Profile Hero */}
          <div className="detail-profile-hero">
            <div
              className="avatar-circle detail-avatar"
              style={{ background: avatar.bg, color: avatar.text }}
            >
              {getInitials(employee.firstName, employee.lastName)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                  {employee.firstName} {employee.lastName}
                </h2>
                <span className="emp-id-badge">{employee.id}</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.125rem" }}>
                {employee.designation} • {employee.department}
              </p>
              <div style={{ marginTop: "0.5rem" }}>
                <span className={`badge-status ${statusConfig.className}`}>
                  <span
                    className="badge-dot"
                    style={{ backgroundColor: statusConfig.dotColor }}
                  ></span>
                  <span>{statusConfig.label}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Grid Info */}
          <div className="detail-info-grid">
            <div className="detail-item">
              <span className="detail-item-label">Work Email</span>
              <span className="detail-item-val" style={{ wordBreak: "break-all" }}>
                {employee.email}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Phone Contact</span>
              <span className="detail-item-val">{employee.phone}</span>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Department</span>
              <span className="detail-item-val">{employee.department}</span>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Job Designation</span>
              <span className="detail-item-val">{employee.designation}</span>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Annual Salary</span>
              <span className="detail-item-val salary-text">
                {formatCurrency(employee.salary)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Joining Date</span>
              <span className="detail-item-val">{formatDate(employee.joiningDate)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};
