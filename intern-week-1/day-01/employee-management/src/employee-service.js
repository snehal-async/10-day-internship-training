/**
 * Employee Management System - Business Logic Service
 *
 * Implements the core 8 domain features independently of any console or UI layer:
 * 1. Add Employee
 * 2. Update Employee
 * 3. Delete Employee
 * 4. Search Employee (by ID or Name)
 * 5. List Employees
 * 6. Highest Salary Employee(s) (with ties)
 * 7. Average Salary (with empty list safety)
 * 8. Department Filter (case-insensitive)
 */

const { validateEmployee, validateSalary, validateName, validateDepartment, validateId } = require('./validators');
const { EmployeeStore } = require('./employee-store');

class EmployeeService {
  /**
   * @param {EmployeeStore} [store] - Instance of EmployeeStore.
   */
  constructor(store) {
    this.store = store || new EmployeeStore();
    /** @type {Array<Object>} In-memory collection of employees */
    this.employees = [];
  }

  /**
   * Initializes the service by reading data from the store.
   * @returns {Promise<void>}
   */
  async init() {
    this.employees = await this.store.load();
  }

  /**
   * Synchronous initialization from the store.
   */
  initSync() {
    this.employees = this.store.loadSync();
  }

  /**
   * Feature 1: Add a new employee.
   *
   * @param {Object} data - Employee input fields { id, name, department, salary }.
   * @returns {Promise<Object>} The added employee record.
   */
  async addEmployee(data) {
    const validRecord = validateEmployee(data, this.employees, false);
    this.employees.push(validRecord);
    await this.store.save(this.employees);
    return validRecord;
  }

  /**
   * Feature 2: Update an existing employee by ID.
   *
   * @param {string|number} id - The ID of the employee to update.
   * @param {Object} updates - Fields to update { name, department, salary }.
   * @returns {Promise<Object>} The updated employee record.
   * @throws {Error} If employee with given ID does not exist.
   */
  async updateEmployee(id, updates) {
    const stringId = String(id).trim();
    const index = this.employees.findIndex(
      emp => String(emp.id).toLowerCase() === stringId.toLowerCase()
    );

    if (index === -1) {
      throw new Error(`Employee with ID "${stringId}" does not exist.`);
    }

    const current = this.employees[index];

    // Merge existing values with supplied updates
    const mergedPayload = {
      id: updates.id !== undefined && updates.id !== '' ? updates.id : current.id,
      name: updates.name !== undefined && updates.name !== '' ? updates.name : current.name,
      department: updates.department !== undefined && updates.department !== '' ? updates.department : current.department,
      salary: updates.salary !== undefined && updates.salary !== '' ? updates.salary : current.salary
    };

    const validatedUpdated = validateEmployee(mergedPayload, this.employees, true, current.id);
    this.employees[index] = validatedUpdated;
    await this.store.save(this.employees);
    return validatedUpdated;
  }

  /**
   * Feature 3: Delete an employee by ID.
   *
   * @param {string|number} id - Employee ID to delete.
   * @returns {Promise<Object>} The deleted employee record.
   * @throws {Error} If employee ID not found.
   */
  async deleteEmployee(id) {
    const stringId = String(id).trim();
    const index = this.employees.findIndex(
      emp => String(emp.id).toLowerCase() === stringId.toLowerCase()
    );

    if (index === -1) {
      throw new Error(`Employee with ID "${stringId}" does not exist.`);
    }

    const [deleted] = this.employees.splice(index, 1);
    await this.store.save(this.employees);
    return deleted;
  }

  /**
   * Feature 4A: Get employee by exact ID (case-insensitive).
   *
   * @param {string|number} id - Employee ID.
   * @returns {Object|null} Matching employee or null if not found.
   */
  getEmployeeById(id) {
    if (id === null || id === undefined) return null;
    const stringId = String(id).trim().toLowerCase();
    const found = this.employees.find(
      emp => String(emp.id).trim().toLowerCase() === stringId
    );
    return found ? { ...found } : null;
  }

  /**
   * Feature 4B: Search employees by name (case-insensitive partial or exact matching).
   *
   * @param {string} query - Name search query.
   * @returns {Array<Object>} List of matching employees.
   */
  searchByName(query) {
    if (typeof query !== 'string') {
      return [];
    }
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) {
      return [];
    }

    return this.employees
      .filter(emp => emp.name.toLowerCase().includes(cleanQuery))
      .map(emp => ({ ...emp }));
  }

  /**
   * Feature 4 Combined: Search employees by ID or Name.
   *
   * @param {string} query - Search term.
   * @returns {Array<Object>} List of matching employees.
   */
  searchEmployees(query) {
    if (!query || typeof query !== 'string') {
      return [];
    }
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) {
      return [];
    }

    return this.employees
      .filter(emp =>
        String(emp.id).toLowerCase() === cleanQuery ||
        emp.name.toLowerCase().includes(cleanQuery)
      )
      .map(emp => ({ ...emp }));
  }

  /**
   * Feature 5: List all employees.
   *
   * @returns {Array<Object>} Copy of all employee records.
   */
  getAllEmployees() {
    return this.employees.map(emp => ({ ...emp }));
  }

  /**
   * Feature 6: Retrieve employee(s) with the highest salary, correctly supporting ties.
   *
   * @returns {{ maxSalary: number|null, employees: Array<Object> }}
   */
  getHighestSalaryEmployees() {
    if (this.employees.length === 0) {
      return { maxSalary: null, employees: [] };
    }

    let maxSalary = this.employees[0].salary;
    for (let i = 1; i < this.employees.length; i++) {
      if (this.employees[i].salary > maxSalary) {
        maxSalary = this.employees[i].salary;
      }
    }

    const topEmployees = this.employees.filter(emp => emp.salary === maxSalary);
    return {
      maxSalary,
      employees: topEmployees.map(emp => ({ ...emp }))
    };
  }

  /**
   * Feature 7: Calculate average salary, handling empty employee lists gracefully.
   *
   * @returns {{ count: number, total: number, average: number }}
   */
  getAverageSalary() {
    const count = this.employees.length;
    if (count === 0) {
      return { count: 0, total: 0, average: 0 };
    }

    const total = this.employees.reduce((acc, curr) => acc + curr.salary, 0);
    const average = Math.round((total / count) * 100) / 100;

    return {
      count,
      total: Math.round(total * 100) / 100,
      average
    };
  }

  /**
   * Feature 8: Filter employees by department (case-insensitive).
   *
   * @param {string} department - Department name to filter by.
   * @returns {Array<Object>} Employees belonging to the specified department.
   */
  filterByDepartment(department) {
    if (typeof department !== 'string') {
      return [];
    }
    const cleanDept = department.trim().toLowerCase();
    if (cleanDept.length === 0) {
      return [];
    }

    return this.employees
      .filter(emp => emp.department.trim().toLowerCase() === cleanDept)
      .map(emp => ({ ...emp }));
  }
}

module.exports = { EmployeeService };
