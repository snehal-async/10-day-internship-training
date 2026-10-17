/**
 * src/types/employee.ts
 * Core domain types and contracts for Employee Management System
 */

export type DepartmentName =
  | "Engineering"
  | "Design"
  | "Human Resources"
  | "Finance"
  | "Marketing"
  | "Operations";

export const DEPARTMENTS: readonly DepartmentName[] = [
  "Engineering",
  "Design",
  "Human Resources",
  "Finance",
  "Marketing",
  "Operations"
] as const;

export type EmploymentStatus = "Active" | "Inactive" | "On Leave";

export const EMPLOYMENT_STATUSES: readonly EmploymentStatus[] = [
  "Active",
  "Inactive",
  "On Leave"
] as const;

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: DepartmentName | string;
  designation: string;
  status: EmploymentStatus;
  joiningDate: string; // ISO format: YYYY-MM-DD
  salary: number;
}

export type EmployeeFormData = Omit<Employee, "id"> & {
  id?: string;
};

export type FormValidationErrors = Partial<Record<keyof EmployeeFormData, string>>;

export type SortField = "name" | "salary" | "department" | "joiningDate" | "id";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  searchQuery: string;
  department: string; // "all" or specific DepartmentName
  status: string;     // "all" or specific EmploymentStatus
  sortBy: SortField;
  sortOrder: SortOrder;
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
