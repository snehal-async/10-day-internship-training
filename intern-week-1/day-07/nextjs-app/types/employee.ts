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
  joiningDate: string;
  salary: number;
}

export type CreateEmployeeInput = Omit<Employee, "id"> & {
  id?: string;
};

export type UpdateEmployeeInput = Partial<Omit<Employee, "id">>;

export interface DashboardStatistics {
  totalEmployees: number;
  averageSalary: number;
  uniqueDepartmentsCount: number;
  activeCount: number;
  inactiveCount: number;
  onLeaveCount: number;
  totalPayroll: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}