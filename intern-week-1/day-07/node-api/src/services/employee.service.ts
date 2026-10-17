import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeFilterQuery,
  DashboardStatistics,
  EmployeeRepository
} from "../models/employee.model.js";

export class EmployeeService {
  /**
   * Retrieves list of employees with search, department/status filter, and multi-field sorting
   */
  public static async list(query: EmployeeFilterQuery = {}): Promise<Employee[]> {
    let list = await EmployeeRepository.readAll();

    // 1. Text Search across name, email, department, designation, id
    if (query.search && query.search.trim().length > 0) {
      const q = query.search.trim().toLowerCase();
      list = list.filter((emp) => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return (
          fullName.includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q)
        );
      });
    }

    // 2. Department filter
    if (query.department && query.department !== "all") {
      list = list.filter((emp) => emp.department.toLowerCase() === query.department!.toLowerCase());
    }

    // 3. Status filter
    if (query.status && query.status !== "all") {
      list = list.filter((emp) => emp.status.toLowerCase() === query.status!.toLowerCase());
    }

    // 4. Sorting
    const sortBy = query.sortBy || "id";
    const sortOrder = query.sortOrder || "asc";

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name": {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          cmp = nameA.localeCompare(nameB);
          break;
        }
        case "salary": {
          cmp = a.salary - b.salary;
          break;
        }
        case "department": {
          cmp = a.department.localeCompare(b.department);
          break;
        }
        case "joiningDate": {
          cmp = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
          break;
        }
        case "id":
        default: {
          cmp = a.id.localeCompare(b.id, undefined, { numeric: true });
          break;
        }
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return list;
  }

  /**
   * Fetch single employee by ID
   */
  public static async getById(id: string): Promise<Employee | null> {
    return await EmployeeRepository.findById(id);
  }

  /**
   * Compute aggregate statistics
   */
  public static async getStatistics(): Promise<DashboardStatistics> {
    const employees = await EmployeeRepository.readAll();
    const total = employees.length;

    if (total === 0) {
      return {
        totalEmployees: 0,
        averageSalary: 0,
        uniqueDepartmentsCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        onLeaveCount: 0,
        totalPayroll: 0
      };
    }

    const uniqueDepts = new Set(employees.map((e) => e.department.trim()).filter(Boolean));
    let active = 0;
    let inactive = 0;
    let onLeave = 0;
    let payrollSum = 0;

    for (const emp of employees) {
      payrollSum += emp.salary;
      if (emp.status === "Active") active++;
      else if (emp.status === "Inactive") inactive++;
      else if (emp.status === "On Leave") onLeave++;
    }

    return {
      totalEmployees: total,
      averageSalary: Math.round(payrollSum / total),
      uniqueDepartmentsCount: uniqueDepts.size,
      activeCount: active,
      inactiveCount: inactive,
      onLeaveCount: onLeave,
      totalPayroll: payrollSum
    };
  }

  /**
   * Create employee with uniqueness check
   */
  public static async create(data: CreateEmployeeDTO): Promise<Employee> {
    const existing = await EmployeeRepository.findByEmail(data.email);
    if (existing) {
      const err = new Error(`An employee with email '${data.email}' already exists.`);
      (err as any).statusCode = 400;
      (err as any).code = "DUPLICATE_EMAIL";
      throw err;
    }

    return await EmployeeRepository.create(data);
  }

  /**
   * Update employee with uniqueness check
   */
  public static async update(id: string, updates: UpdateEmployeeDTO): Promise<Employee> {
    const existing = await EmployeeRepository.findById(id);
    if (!existing) {
      const err = new Error(`Employee with ID '${id}' was not found.`);
      (err as any).statusCode = 404;
      (err as any).code = "NOT_FOUND";
      throw err;
    }

    if (updates.email && updates.email.toLowerCase() !== existing.email.toLowerCase()) {
      const duplicate = await EmployeeRepository.findByEmail(updates.email);
      if (duplicate && duplicate.id !== id) {
        const err = new Error(`An employee with email '${updates.email}' already exists.`);
        (err as any).statusCode = 400;
        (err as any).code = "DUPLICATE_EMAIL";
        throw err;
      }
    }

    const updated = await EmployeeRepository.update(id, updates);
    if (!updated) {
      const err = new Error(`Failed to update employee '${id}'.`);
      (err as any).statusCode = 500;
      throw err;
    }
    return updated;
  }

  /**
   * Delete employee
   */
  public static async delete(id: string): Promise<void> {
    const existing = await EmployeeRepository.findById(id);
    if (!existing) {
      const err = new Error(`Employee with ID '${id}' was not found.`);
      (err as any).statusCode = 404;
      (err as any).code = "NOT_FOUND";
      throw err;
    }

    const deleted = await EmployeeRepository.delete(id);
    if (!deleted) {
      const err = new Error(`Failed to delete employee '${id}'.`);
      (err as any).statusCode = 500;
      throw err;
    }
  }
}