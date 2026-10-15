/**
 * api.js - Data Access & Persistence Layer for Employee Management Dashboard
 * 
 * Manages localStorage synchronization with automated fallback initialization
 * from data/employees.json.
 */

const STORAGE_KEY = 'day05_employee_records';

// Built-in fallback sample data (ensures instant functionality even if file:// CORS blocks fetch)
const DEFAULT_FALLBACK_EMPLOYEES = [
  { id: 'EMP-001', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '+91-98230-11223', department: 'Engineering', designation: 'Lead Architect', status: 'Active', joiningDate: '2022-03-15', salary: 125000 },
  { id: 'EMP-002', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', phone: '+91-98230-22334', department: 'Design', designation: 'Senior UX Researcher', status: 'Active', joiningDate: '2023-01-10', salary: 92000 },
  { id: 'EMP-003', firstName: 'Rohan', lastName: 'Verma', email: 'rohan.verma@example.com', phone: '+91-98230-33445', department: 'Engineering', designation: 'Full Stack Developer', status: 'Active', joiningDate: '2023-06-01', salary: 85000 },
  { id: 'EMP-004', firstName: 'Ananya', lastName: 'Iyer', email: 'ananya.iyer@example.com', phone: '+91-98230-44556', department: 'Human Resources', designation: 'HR Operations Lead', status: 'Active', joiningDate: '2021-11-20', salary: 78000 },
  { id: 'EMP-005', firstName: 'Vikram', lastName: 'Malhotra', email: 'vikram.malhotra@example.com', phone: '+91-98230-55667', department: 'Finance', designation: 'Financial Analyst', status: 'Active', joiningDate: '2022-08-14', salary: 95000 },
  { id: 'EMP-006', firstName: 'Neha', lastName: 'Gupta', email: 'neha.gupta@example.com', phone: '+91-98230-66778', department: 'Marketing', designation: 'Growth Marketing Strategist', status: 'Active', joiningDate: '2023-04-05', salary: 82000 },
  { id: 'EMP-007', firstName: 'Karan', lastName: 'Deshmukh', email: 'karan.deshmukh@example.com', phone: '+91-98230-77889', department: 'Operations', designation: 'Facilities Director', status: 'Active', joiningDate: '2020-02-18', salary: 105000 },
  { id: 'EMP-008', firstName: 'Simran', lastName: 'Kaur', email: 'simran.kaur@example.com', phone: '+91-98230-88990', department: 'Engineering', designation: 'QA Automation Specialist', status: 'Active', joiningDate: '2023-09-12', salary: 76000 },
  { id: 'EMP-009', firstName: 'Aditya', lastName: 'Joshi', email: 'aditya.joshi@example.com', phone: '+91-98230-99001', department: 'Engineering', designation: 'DevOps Engineer', status: 'Inactive', joiningDate: '2022-05-30', salary: 89000 },
  { id: 'EMP-010', firstName: 'Meera', lastName: 'Nair', email: 'meera.nair@example.com', phone: '+91-98230-10112', department: 'Design', designation: 'Visual Brand Designer', status: 'Active', joiningDate: '2024-02-01', salary: 71000 },
  { id: 'EMP-011', firstName: 'Siddharth', lastName: 'Chopra', email: 'siddharth.chopra@example.com', phone: '+91-98230-21223', department: 'Finance', designation: 'Senior Controller', status: 'Active', joiningDate: '2019-10-10', salary: 118000 },
  { id: 'EMP-012', firstName: 'Kavita', lastName: 'Reddy', email: 'kavita.reddy@example.com', phone: '+91-98230-32334', department: 'Marketing', designation: 'Content & SEO Specialist', status: 'Inactive', joiningDate: '2021-07-22', salary: 68000 },
  { id: 'EMP-013', firstName: 'Arjun', lastName: 'Rao', email: 'arjun.rao@example.com', phone: '+91-98230-43445', department: 'Engineering', designation: 'Backend Python Engineer', status: 'Active', joiningDate: '2023-11-15', salary: 88000 },
  { id: 'EMP-014', firstName: 'Divya', lastName: 'Menon', email: 'divya.menon@example.com', phone: '+91-98230-54556', department: 'Human Resources', designation: 'Talent Acquisition Partner', status: 'Active', joiningDate: '2022-04-18', salary: 72000 },
  { id: 'EMP-015', firstName: 'Rajesh', lastName: 'Kulkarni', email: 'rajesh.kulkarni@example.com', phone: '+91-98230-65667', department: 'Operations', designation: 'Supply Chain Coordinator', status: 'Active', joiningDate: '2021-03-09', salary: 65000 },
  { id: 'EMP-016', firstName: 'Pooja', lastName: 'Bhatia', email: 'pooja.bhatia@example.com', phone: '+91-98230-76778', department: 'Design', designation: 'Product Design Lead', status: 'Active', joiningDate: '2020-09-01', salary: 110000 },
  { id: 'EMP-017', firstName: 'Manoj', lastName: 'Tiwari', email: 'manoj.tiwari@example.com', phone: '+91-98230-87889', department: 'Engineering', designation: 'Cloud Security Specialist', status: 'Active', joiningDate: '2022-12-05', salary: 102000 },
  { id: 'EMP-018', firstName: 'Sneha', lastName: 'Mukherjee', email: 'sneha.mukherjee@example.com', phone: '+91-98230-98990', department: 'Marketing', designation: 'Communications Manager', status: 'Active', joiningDate: '2023-08-19', salary: 86000 },
  { id: 'EMP-019', firstName: 'Gaurav', lastName: 'Kapoor', email: 'gaurav.kapoor@example.com', phone: '+91-98230-09101', department: 'Finance', designation: 'Payroll & Tax Accountant', status: 'Inactive', joiningDate: '2020-06-11', salary: 74000 },
  { id: 'EMP-020', firstName: 'Ishita', lastName: 'Bose', email: 'ishita.bose@example.com', phone: '+91-98230-19212', department: 'Engineering', designation: 'Frontend UI Specialist', status: 'Active', joiningDate: '2024-01-15', salary: 81000 },
  { id: 'EMP-021', firstName: 'Harsh', lastName: 'Vardhan', email: 'harsh.vardhan@example.com', phone: '+91-98230-29323', department: 'Operations', designation: 'Logistics Supervisor', status: 'Active', joiningDate: '2021-08-30', salary: 67000 },
  { id: 'EMP-022', firstName: 'Tanvi', lastName: 'Pandey', email: 'tanvi.pandey@example.com', phone: '+91-98230-39434', department: 'Human Resources', designation: 'Culture & Engagement Lead', status: 'Active', joiningDate: '2023-03-25', salary: 75000 }
];

const EmployeeAPI = {
  /**
   * Initializes data store. If localStorage is empty, fetches data/employees.json.
   * If fetch is blocked (e.g. file:// CORS), falls back to embedded sample data.
   */
  async init() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.warn('LocalStorage data was malformed, reinitializing from defaults.');
      }
    }

    // Attempt to load from static JSON file
    try {
      const response = await fetch('data/employees.json');
      if (response.ok) {
        const data = await response.json();
        this._saveToStorage(data);
        return data;
      }
    } catch (err) {
      console.info('Fetch from data/employees.json unavailable (likely file:// protocol). Initializing from built-in seed dataset.');
    }

    // Fallback to bundled dataset
    this._saveToStorage(DEFAULT_FALLBACK_EMPLOYEES);
    return DEFAULT_FALLBACK_EMPLOYEES;
  },

  /**
   * Returns all current employees
   */
  getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  /**
   * Retrieve single employee by ID
   */
  getById(id) {
    const employees = this.getAll();
    return employees.find(emp => emp.id === id) || null;
  },

  /**
   * Create and persist a new employee
   */
  create(employeeData) {
    const employees = this.getAll();
    
    // Generate unique ID: EMP-xxx
    const nextNum = employees.length + 1;
    const newId = `EMP-${String(nextNum).padStart(3, '0')}`;
    
    const newEmployee = {
      id: newId,
      firstName: employeeData.firstName.trim(),
      lastName: employeeData.lastName.trim(),
      email: employeeData.email.trim().toLowerCase(),
      phone: employeeData.phone.trim(),
      department: employeeData.department.trim(),
      designation: employeeData.designation.trim(),
      status: employeeData.status || 'Active',
      joiningDate: employeeData.joiningDate,
      salary: parseFloat(employeeData.salary) || 0
    };

    employees.push(newEmployee);
    this._saveToStorage(employees);
    return newEmployee;
  },

  /**
   * Update existing employee record
   */
  update(id, updatedFields) {
    const employees = this.getAll();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    const current = employees[index];
    const updated = {
      ...current,
      firstName: updatedFields.firstName !== undefined ? updatedFields.firstName.trim() : current.firstName,
      lastName: updatedFields.lastName !== undefined ? updatedFields.lastName.trim() : current.lastName,
      email: updatedFields.email !== undefined ? updatedFields.email.trim().toLowerCase() : current.email,
      phone: updatedFields.phone !== undefined ? updatedFields.phone.trim() : current.phone,
      department: updatedFields.department !== undefined ? updatedFields.department.trim() : current.department,
      designation: updatedFields.designation !== undefined ? updatedFields.designation.trim() : current.designation,
      status: updatedFields.status !== undefined ? updatedFields.status : current.status,
      joiningDate: updatedFields.joiningDate !== undefined ? updatedFields.joiningDate : current.joiningDate,
      salary: updatedFields.salary !== undefined ? parseFloat(updatedFields.salary) : current.salary
    };

    employees[index] = updated;
    this._saveToStorage(employees);
    return updated;
  },

  /**
   * Delete employee by ID
   */
  delete(id) {
    const employees = this.getAll();
    const filtered = employees.filter(emp => emp.id !== id);
    if (filtered.length === employees.length) {
      return false;
    }
    this._saveToStorage(filtered);
    return true;
  },

  /**
   * Reset demonstration dataset back to original 22 records
   */
  reset() {
    this._saveToStorage(DEFAULT_FALLBACK_EMPLOYEES);
    return [...DEFAULT_FALLBACK_EMPLOYEES];
  },

  /**
   * Check if email is already taken by another employee
   */
  isEmailTaken(email, excludeId = null) {
    const employees = this.getAll();
    const cleanEmail = email.trim().toLowerCase();
    return employees.some(emp => emp.email.toLowerCase() === cleanEmail && emp.id !== excludeId);
  },

  _saveToStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};