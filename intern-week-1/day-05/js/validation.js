/**
 * validation.js - Form Validation Rules & Sanitization
 */

const Validation = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,

  /**
   * Validate entire employee form payload
   * @param {Object} data Form values
   * @param {string|null} currentEmployeeId If editing, excludes this ID from uniqueness checks
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  validate(data, currentEmployeeId = null) {
    const errors = {};

    // 1. First Name
    const firstName = (data.firstName || '').trim();
    if (!firstName) {
      errors.firstName = 'First name is required.';
    } else if (firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters.';
    }

    // 2. Last Name
    const lastName = (data.lastName || '').trim();
    if (!lastName) {
      errors.lastName = 'Last name is required.';
    } else if (lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters.';
    }

    // 3. Work Email
    const email = (data.email || '').trim().toLowerCase();
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!this.EMAIL_REGEX.test(email)) {
      errors.email = 'Please provide a valid email format (e.g. name@example.com).';
    } else if (typeof EmployeeAPI !== 'undefined' && EmployeeAPI.isEmailTaken(email, currentEmployeeId)) {
      errors.email = 'This email address is already registered to another employee.';
    }

    // 4. Contact Phone
    const phone = (data.phone || '').trim();
    if (!phone) {
      errors.phone = 'Phone number is required.';
    } else if (phone.replace(/[^0-9]/g, '').length < 7) {
      errors.phone = 'Please provide a valid phone number with at least 7 digits.';
    }

    // 5. Department
    const department = (data.department || '').trim();
    if (!department) {
      errors.department = 'Please select an assigned department.';
    }

    // 6. Designation
    const designation = (data.designation || '').trim();
    if (!designation) {
      errors.designation = 'Designation/Job title is required.';
    } else if (designation.length < 2) {
      errors.designation = 'Designation must be at least 2 characters.';
    }

    // 7. Employment Status
    const status = (data.status || '').trim();
    if (!status || (status !== 'Active' && status !== 'Inactive')) {
      errors.status = 'Please choose a valid status (Active or Inactive).';
    }

    // 8. Joining Date
    const joiningDate = (data.joiningDate || '').trim();
    if (!joiningDate) {
      errors.joiningDate = 'Joining date is required.';
    } else {
      const parsedDate = new Date(joiningDate);
      if (isNaN(parsedDate.getTime())) {
        errors.joiningDate = 'Invalid date provided.';
      }
    }

    // 9. Annual Salary
    const salaryStr = (data.salary !== undefined && data.salary !== null) ? String(data.salary).trim() : '';
    if (!salaryStr) {
      errors.salary = 'Annual salary is required.';
    } else {
      const salaryNum = parseFloat(salaryStr);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        errors.salary = 'Salary must be a positive number greater than 0.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};