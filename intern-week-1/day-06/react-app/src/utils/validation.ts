/**
 * src/utils/validation.ts
 * Reusable defensive client-side validation logic for Employee Forms
 */

import { Employee, EmployeeFormData, FormValidationErrors } from "../types/employee";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Validates employee form input fields defensively
 * Checks formats, bounds, required fields, and email uniqueness across active records
 */
export function validateEmployeeForm(
  data: EmployeeFormData,
  existingEmployees: Employee[],
  editingEmployeeId?: string
): { isValid: boolean; errors: FormValidationErrors } {
  const errors: FormValidationErrors = {};

  // 1. First Name
  const firstName = data.firstName ? data.firstName.trim() : "";
  if (!firstName) {
    errors.firstName = "First name is strictly required.";
  } else if (firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (!/^[A-Za-z\s'-]+$/.test(firstName)) {
    errors.firstName = "First name can only contain letters, spaces, and hyphens.";
  }

  // 2. Last Name
  const lastName = data.lastName ? data.lastName.trim() : "";
  if (!lastName) {
    errors.lastName = "Last name is strictly required.";
  } else if (lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  } else if (!/^[A-Za-z\s'-]+$/.test(lastName)) {
    errors.lastName = "Last name can only contain letters, spaces, and hyphens.";
  }

  // 3. Email Address (Format & Unique check)
  const email = data.email ? data.email.trim().toLowerCase() : "";
  if (!email) {
    errors.email = "Work email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please provide a valid email format (e.g., user@example.com).";
  } else {
    // Uniqueness verification (ignore current employee if editing)
    const isDuplicate = existingEmployees.some(
      (emp) => emp.email.toLowerCase() === email && emp.id !== editingEmployeeId
    );
    if (isDuplicate) {
      errors.email = "An employee with this email address already exists.";
    }
  }

  // 4. Phone Number
  const phone = data.phone ? data.phone.trim() : "";
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = "Enter a valid phone number (e.g. +91-98230-11223 or 555-0192).";
  }

  // 5. Department
  const department = data.department ? data.department.trim() : "";
  if (!department) {
    errors.department = "Department selection is required.";
  }

  // 6. Designation
  const designation = data.designation ? data.designation.trim() : "";
  if (!designation) {
    errors.designation = "Job designation is required.";
  } else if (designation.length < 2) {
    errors.designation = "Job designation must be at least 2 characters.";
  }

  // 7. Salary
  const salary = Number(data.salary);
  if (data.salary === undefined || data.salary === null || String(data.salary).trim() === "") {
    errors.salary = "Annual base salary is required.";
  } else if (isNaN(salary)) {
    errors.salary = "Salary must be a valid numeric amount.";
  } else if (salary <= 0) {
    errors.salary = "Salary must be a positive number greater than 0.";
  } else if (salary > 10000000) {
    errors.salary = "Salary exceeds maximum allowed threshold ($10,000,000).";
  }

  // 8. Employment Status
  if (!data.status) {
    errors.status = "Employment status is required.";
  }

  // 9. Joining Date
  const joiningDate = data.joiningDate ? data.joiningDate.trim() : "";
  if (!joiningDate) {
    errors.joiningDate = "Joining date is required.";
  } else {
    const parsedDate = new Date(joiningDate);
    if (isNaN(parsedDate.getTime())) {
      errors.joiningDate = "Please provide a valid calendar date.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
