/**
 * Employee Management System - Validation Layer
 *
 * Provides pure validation and sanitization functions for employee fields.
 */

/**
 * Validates and sanitizes an Employee ID.
 *
 * @param {string|number} id - The employee ID to validate.
 * @param {Array<Object>} [existingEmployees=[]] - Current employees list to check uniqueness.
 * @param {boolean} [isUpdate=false] - If true, permits retaining the current employee's ID.
 * @param {string|number} [currentId=null] - The ID of the employee being updated.
 * @returns {string} Sanitized employee ID.
 * @throws {TypeError} If id is not a string or number.
 * @throws {RangeError} If id is empty or blank.
 * @throws {Error} If id already exists.
 */
function validateId(id, existingEmployees = [], isUpdate = false, currentId = null) {
  if (id === null || id === undefined) {
    throw new RangeError('Employee ID cannot be empty or null.');
  }

  const sanitizedId = String(id).trim();
  if (sanitizedId.length === 0) {
    throw new RangeError('Employee ID cannot be blank.');
  }

  // Check uniqueness
  const conflict = existingEmployees.find(emp => {
    const isSameId = String(emp.id).toLowerCase() === sanitizedId.toLowerCase();
    if (isUpdate && currentId !== null) {
      return isSameId && String(emp.id).toLowerCase() !== String(currentId).toLowerCase();
    }
    return isSameId;
  });

  if (conflict) {
    throw new Error(`Employee ID "${sanitizedId}" already exists. IDs must be unique.`);
  }

  return sanitizedId;
}

/**
 * Validates and sanitizes an Employee Name.
 *
 * @param {string} name - Employee name.
 * @returns {string} Sanitized name.
 * @throws {TypeError} If name is not a string.
 * @throws {RangeError} If name is empty or blank.
 */
function validateName(name) {
  if (typeof name !== 'string') {
    throw new TypeError(`Employee Name must be a string, received ${typeof name}.`);
  }

  const sanitized = name.trim();
  if (sanitized.length === 0) {
    throw new RangeError('Employee Name cannot be empty or blank.');
  }

  return sanitized;
}

/**
 * Validates and sanitizes a Department name.
 *
 * @param {string} department - Department name.
 * @returns {string} Sanitized department.
 * @throws {TypeError} If department is not a string.
 * @throws {RangeError} If department is empty or blank.
 */
function validateDepartment(department) {
  if (typeof department !== 'string') {
    throw new TypeError(`Department must be a string, received ${typeof department}.`);
  }

  const sanitized = department.trim();
  if (sanitized.length === 0) {
    throw new RangeError('Department cannot be empty or blank.');
  }

  return sanitized;
}

/**
 * Validates and sanitizes an Employee Salary.
 *
 * @param {number|string} salary - Numeric salary value.
 * @returns {number} Sanitized positive finite numeric salary.
 * @throws {TypeError} If salary is not a number or cannot be parsed as a finite number.
 * @throws {RangeError} If salary is <= 0 or not finite.
 */
function validateSalary(salary) {
  const numericSalary = typeof salary === 'number' ? salary : Number(salary);

  if (!Number.isFinite(numericSalary)) {
    throw new TypeError(`Salary must be a valid finite number, received "${salary}".`);
  }

  if (numericSalary <= 0) {
    throw new RangeError(`Salary must be greater than zero. Received: ${numericSalary}.`);
  }

  // Round to 2 decimal places for currency precision
  return Math.round(numericSalary * 100) / 100;
}

/**
 * Validates an entire employee payload.
 *
 * @param {Object} payload - Employee data object.
 * @param {Array<Object>} [existingEmployees=[]] - List of current employees.
 * @param {boolean} [isUpdate=false] - Whether this is an update validation.
 * @param {string|number} [currentId=null] - Current ID if updating.
 * @returns {{id: string, name: string, department: string, salary: number}} Sanitized employee.
 */
function validateEmployee(payload, existingEmployees = [], isUpdate = false, currentId = null) {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('Employee payload must be a non-null object.');
  }

  const id = validateId(payload.id, existingEmployees, isUpdate, currentId);
  const name = validateName(payload.name);
  const department = validateDepartment(payload.department);
  const salary = validateSalary(payload.salary);

  return { id, name, department, salary };
}

module.exports = {
  validateId,
  validateName,
  validateDepartment,
  validateSalary,
  validateEmployee
};
