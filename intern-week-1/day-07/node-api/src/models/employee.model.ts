import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.resolve(__dirname, "../../data/employees.json");

export type DepartmentName =
  | "Engineering"
  | "Design"
  | "Human Resources"
  | "Finance"
  | "Marketing"
  | "Operations";

export const ALLOWED_DEPARTMENTS: DepartmentName[] = [
  "Engineering",
  "Design",
  "Human Resources",
  "Finance",
  "Marketing",
  "Operations"
];

export type EmploymentStatus = "Active" | "Inactive" | "On Leave";

export const ALLOWED_STATUSES: EmploymentStatus[] = [
  "Active",
  "Inactive",
  "On Leave"
];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: DepartmentName | string;
  designation: string;
  status: EmploymentStatus;
  joiningDate: string;
  salary: number;
}

export type CreateEmployeeDTO = Omit<Employee, "id"> & {
  id?: string;
};

export type UpdateEmployeeDTO = Partial<Omit<Employee, "id">>;

export interface EmployeeFilterQuery {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: "name" | "salary" | "department" | "joiningDate" | "id";
  sortOrder?: "asc" | "desc";
}

export interface DashboardStatistics {
  totalEmployees: number;
  averageSalary: number;
  uniqueDepartmentsCount: number;
  activeCount: number;
  inactiveCount: number;
  onLeaveCount: number;
  totalPayroll: number;
}

export class EmployeeRepository {
  /**
   * Reads all employees from persistent JSON storage
   */
  public static async readAll(): Promise<Employee[]> {
    try {
      const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
      return JSON.parse(data) as Employee[];
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        // If file does not exist, initialize empty array
        await this.writeAll([]);
        return [];
      }
      throw new Error(`Failed to read data from ${DATA_FILE_PATH}: ${error.message}`);
    }
  }

  /**
   * Safely writes employee collection to persistent JSON storage atomically
   */
  public static async writeAll(employees: Employee[]): Promise<void> {
    const tempPath = `${DATA_FILE_PATH}.tmp`;
    const json = JSON.stringify(employees, null, 2);
    try {
      // Ensure data directory exists
      await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
      // Write to temporary file first
      await fs.writeFile(tempPath, json, "utf-8");
      // Atomic rename ensures file is never partially written
      await fs.rename(tempPath, DATA_FILE_PATH);
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(`Failed to persist employees to storage: ${error.message}`);
    }
  }

  /**
   * Find employee by ID
   */
  public static async findById(id: string): Promise<Employee | null> {
    const all = await this.readAll();
    const found = all.find((emp) => emp.id.toLowerCase() === id.trim().toLowerCase());
    return found || null;
  }

  /**
   * Find employee by email
   */
  public static async findByEmail(email: string): Promise<Employee | null> {
    const all = await this.readAll();
    const found = all.find((emp) => emp.email.toLowerCase() === email.trim().toLowerCase());
    return found || null;
  }

  /**
   * Create a new employee record
   */
  public static async create(data: CreateEmployeeDTO): Promise<Employee> {
    const all = await this.readAll();
    const newId = data.id && data.id.trim().length > 0 ? data.id.trim() : `EMP-${Date.now().toString().slice(-4)}`;

    const newEmployee: Employee = {
      id: newId,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      department: data.department,
      designation: data.designation.trim(),
      status: data.status,
      joiningDate: data.joiningDate,
      salary: Number(data.salary)
    };

    all.unshift(newEmployee);
    await this.writeAll(all);
    return newEmployee;
  }

  /**
   * Update an existing employee record
   */
  public static async update(id: string, updates: UpdateEmployeeDTO): Promise<Employee | null> {
    const all = await this.readAll();
    const index = all.findIndex((emp) => emp.id.toLowerCase() === id.trim().toLowerCase());
    if (index === -1) return null;

    const existing = all[index];
    const updated: Employee = {
      ...existing,
      ...updates,
      id: existing.id // ID remains immutable
    };

    if (updates.email) updated.email = updates.email.trim().toLowerCase();
    if (updates.firstName) updated.firstName = updates.firstName.trim();
    if (updates.lastName) updated.lastName = updates.lastName.trim();
    if (updates.phone) updated.phone = updates.phone.trim();
    if (updates.designation) updated.designation = updates.designation.trim();
    if (updates.salary !== undefined) updated.salary = Number(updates.salary);

    all[index] = updated;
    await this.writeAll(all);
    return updated;
  }

  /**
   * Delete an employee record
   */
  public static async delete(id: string): Promise<boolean> {
    const all = await this.readAll();
    const index = all.findIndex((emp) => emp.id.toLowerCase() === id.trim().toLowerCase());
    if (index === -1) return false;

    all.splice(index, 1);
    await this.writeAll(all);
    return true;
  }
}