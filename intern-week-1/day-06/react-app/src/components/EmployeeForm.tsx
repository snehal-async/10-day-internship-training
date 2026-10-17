import React, { useState, useEffect } from "react";
import {
  Employee,
  EmployeeFormData,
  FormValidationErrors,
  DEPARTMENTS,
  EMPLOYMENT_STATUSES
} from "../types/employee";
import { validateEmployeeForm } from "../utils/validation";

interface EmployeeFormProps {
  isOpen: boolean;
  initialEmployee?: Employee | null;
  existingEmployees: Employee[];
  onClose: () => void;
  onSubmit: (formData: EmployeeFormData) => Promise<void>;
}

const EMPTY_FORM: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "Engineering",
  designation: "",
  status: "Active",
  joiningDate: new Date().toISOString().split("T")[0],
  salary: 75000
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  initialEmployee,
  existingEmployees,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync state whenever modal opens or editing employee changes
  useEffect(() => {
    if (initialEmployee) {
      setFormData({
        id: initialEmployee.id,
        firstName: initialEmployee.firstName,
        lastName: initialEmployee.lastName,
        email: initialEmployee.email,
        phone: initialEmployee.phone,
        department: initialEmployee.department,
        designation: initialEmployee.designation,
        status: initialEmployee.status,
        joiningDate: initialEmployee.joiningDate,
        salary: initialEmployee.salary
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [initialEmployee, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialEmployee);

  const handleChange = (
    field: keyof EmployeeFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "salary" ? (value === "" ? "" : Number(value)) : value
    }));

    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run client-side validation
    const validation = validateEmployeeForm(
      formData,
      existingEmployees,
      initialEmployee?.id
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      // Error is caught and surfaced via toast notification in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-form-title"
    >
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 id="modal-form-title">
            {isEditing ? `Edit Employee (${initialEmployee?.id})` : "Add New Employee"}
          </h3>
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-first-name">
                  First Name <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="text"
                  id="form-first-name"
                  className={`form-input ${errors.firstName ? "has-error" : ""}`}
                  placeholder="e.g. Aarav"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.firstName && <span className="field-error-msg">{errors.firstName}</span>}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-last-name">
                  Last Name <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="text"
                  id="form-last-name"
                  className={`form-input ${errors.lastName ? "has-error" : ""}`}
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.lastName && <span className="field-error-msg">{errors.lastName}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="form-email">
                  Work Email Address <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="email"
                  id="form-email"
                  className={`form-input ${errors.email ? "has-error" : ""}`}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-phone">
                  Phone Number <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="tel"
                  id="form-phone"
                  className={`form-input ${errors.phone ? "has-error" : ""}`}
                  placeholder="+91-98230-11223"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-department">
                  Department <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <select
                  id="form-department"
                  className={`form-select ${errors.department ? "has-error" : ""}`}
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  disabled={isSubmitting}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <span className="field-error-msg">{errors.department}</span>}
              </div>

              {/* Designation */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-designation">
                  Designation / Role <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="text"
                  id="form-designation"
                  className={`form-input ${errors.designation ? "has-error" : ""}`}
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.designation && <span className="field-error-msg">{errors.designation}</span>}
              </div>

              {/* Employment Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-status">
                  Employment Status <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <select
                  id="form-status"
                  className={`form-select ${errors.status ? "has-error" : ""}`}
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  disabled={isSubmitting}
                >
                  {EMPLOYMENT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.status && <span className="field-error-msg">{errors.status}</span>}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-salary">
                  Annual Salary (USD) <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="number"
                  id="form-salary"
                  min="1"
                  step="1000"
                  className={`form-input ${errors.salary ? "has-error" : ""}`}
                  placeholder="85000"
                  value={formData.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.salary && <span className="field-error-msg">{errors.salary}</span>}
              </div>

              {/* Joining Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="form-joining-date">
                  Joining Date <span style={{ color: "var(--danger-accent)" }}>*</span>
                </label>
                <input
                  type="date"
                  id="form-joining-date"
                  className={`form-input ${errors.joiningDate ? "has-error" : ""}`}
                  value={formData.joiningDate}
                  onChange={(e) => handleChange("joiningDate", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.joiningDate && <span className="field-error-msg">{errors.joiningDate}</span>}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="btn-submit-employee-form"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span>
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                "Update Employee"
              ) : (
                "Save Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
