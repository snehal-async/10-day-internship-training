"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Employee,
  CreateEmployeeInput,
  DEPARTMENTS,
  EMPLOYMENT_STATUSES
} from "../types/employee";
import { api } from "../lib/api";

interface EmployeeFormProps {
  initialData?: Employee;
  isEditing?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  isEditing = false
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateEmployeeInput>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    department: initialData?.department || "Engineering",
    designation: initialData?.designation || "",
    status: initialData?.status || "Active",
    joiningDate: initialData?.joiningDate || new Date().toISOString().split("T")[0],
    salary: initialData?.salary || 85000
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is strictly required";
    else if (formData.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";

    if (!formData.lastName.trim()) errors.lastName = "Last name is strictly required";
    else if (formData.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";

    if (!formData.email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please provide a valid work email address";

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.designation.trim()) errors.designation = "Job designation is required";

    const sal = Number(formData.salary);
    if (isNaN(sal) || sal <= 0) errors.salary = "Salary must be a positive number greater than 0";

    if (!formData.joiningDate) errors.joiningDate = "Joining date is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setServerError(null);

      if (isEditing && initialData) {
        await api.updateEmployee(initialData.id, formData);
      } else {
        await api.createEmployee(formData);
      }

      router.push("/employees");
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || "Failed to save employee record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isEditing ? `Edit Profile: ${initialData?.firstName} ${initialData?.lastName}` : "Add New Team Member"}
      </h3>

      {serverError && (
        <div className="error-banner" style={{ marginBottom: "1.5rem" }}>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="firstName">
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              className="form-input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Aarav"
            />
            {fieldErrors.firstName && <span className="field-error-msg">{fieldErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lastName">
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              className="form-input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Sharma"
            />
            {fieldErrors.lastName && <span className="field-error-msg">{fieldErrors.lastName}</span>}
          </div>

          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="email">
              Work Email Address *
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@company.com"
            />
            {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91-98230-11223"
            />
            {fieldErrors.phone && <span className="field-error-msg">{fieldErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">
              Department *
            </label>
            <select
              id="department"
              className="form-select"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="designation">
              Job Designation *
            </label>
            <input
              id="designation"
              type="text"
              className="form-input"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Lead Architect"
            />
            {fieldErrors.designation && <span className="field-error-msg">{fieldErrors.designation}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Employment Status *
            </label>
            <select
              id="status"
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              {EMPLOYMENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="salary">
              Annual Salary ($) *
            </label>
            <input
              id="salary"
              type="number"
              min="1"
              step="1000"
              className="form-input"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
            />
            {fieldErrors.salary && <span className="field-error-msg">{fieldErrors.salary}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="joiningDate">
              Joining Date *
            </label>
            <input
              id="joiningDate"
              type="date"
              className="form-input"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            />
            {fieldErrors.joiningDate && <span className="field-error-msg">{fieldErrors.joiningDate}</span>}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/employees")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} id="btn-submit-employee">
            {isSubmitting ? "Saving to API..." : isEditing ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};