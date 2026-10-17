/**
 * src/hooks/useEmployees.ts
 * Core business logic and state management custom hook for Employee Management Dashboard
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Employee,
  EmployeeFormData,
  FilterState,
  SortField,
  SortOrder,
  DashboardStatistics
} from "../types/employee";
import { employeeApiService, ApiClientError } from "../services/api";
import { calculateDashboardStatistics } from "../utils/formatters";

const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: "",
  department: "all",
  status: "all",
  sortBy: "id",
  sortOrder: "asc"
};

export interface UseEmployeesReturn {
  employees: Employee[];
  filteredEmployees: Employee[];
  statistics: DashboardStatistics;
  isLoading: boolean;
  error: string | null;
  filterState: FilterState;
  refresh: () => Promise<void>;
  createEmployee: (formData: EmployeeFormData) => Promise<Employee>;
  updateEmployee: (id: string, formData: EmployeeFormData) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (department: string) => void;
  setStatusFilter: (status: string) => void;
  setSortCriteria: (field: SortField, order?: SortOrder) => void;
  resetFilters: () => void;
}

export function useEmployees(): UseEmployeesReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);

  /**
   * Loads all employees from REST API
   */
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await employeeApiService.getAll();
      setEmployees(data);
    } catch (err: unknown) {
      const msg =
        err instanceof ApiClientError
          ? err.message
          : "An unexpected error occurred while communicating with the Employee REST API.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial mount
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  /**
   * Creates a new employee and updates local state immediately
   */
  const createEmployee = useCallback(async (formData: EmployeeFormData): Promise<Employee> => {
    const created = await employeeApiService.create(formData);
    setEmployees((prev) => [created, ...prev]);
    return created;
  }, []);

  /**
   * Updates existing employee and merges updated record
   */
  const updateEmployee = useCallback(
    async (id: string, formData: EmployeeFormData): Promise<Employee> => {
      const updated = await employeeApiService.update(id, formData);
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? updated : emp)));
      return updated;
    },
    []
  );

  /**
   * Deletes employee by ID from backend and state
   */
  const deleteEmployee = useCallback(async (id: string): Promise<void> => {
    await employeeApiService.delete(id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  /**
   * Filter and Sort Handlers
   */
  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setDepartmentFilter = useCallback((department: string) => {
    setFilterState((prev) => ({ ...prev, department }));
  }, []);

  const setStatusFilter = useCallback((status: string) => {
    setFilterState((prev) => ({ ...prev, status }));
  }, []);

  const setSortCriteria = useCallback((field: SortField, order?: SortOrder) => {
    setFilterState((prev) => {
      if (order) {
        return { ...prev, sortBy: field, sortOrder: order };
      }
      // Toggle sort order if same field is clicked
      if (prev.sortBy === field) {
        return { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" };
      }
      return { ...prev, sortBy: field, sortOrder: "asc" };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(INITIAL_FILTER_STATE);
  }, []);

  /**
   * Computes aggregate statistics using useMemo
   */
  const statistics = useMemo(() => {
    return calculateDashboardStatistics(employees);
  }, [employees]);

  /**
   * Computes filtered and sorted employee list using useMemo
   */
  const filteredEmployees = useMemo(() => {
    const { searchQuery, department, status, sortBy, sortOrder } = filterState;
    const query = searchQuery.trim().toLowerCase();

    let result = employees.filter((emp) => {
      // 1. Text Search matching
      if (query) {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        const email = emp.email.toLowerCase();
        const dept = emp.department.toLowerCase();
        const designation = emp.designation.toLowerCase();
        const id = emp.id.toLowerCase();
        const matchesQuery =
          fullName.includes(query) ||
          email.includes(query) ||
          dept.includes(query) ||
          designation.includes(query) ||
          id.includes(query);

        if (!matchesQuery) return false;
      }

      // 2. Department Filter
      if (department !== "all" && emp.department.toLowerCase() !== department.toLowerCase()) {
        return false;
      }

      // 3. Status Filter
      if (status !== "all" && emp.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }

      return true;
    });

    // 4. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name": {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case "salary": {
          comparison = a.salary - b.salary;
          break;
        }
        case "department": {
          comparison = a.department.localeCompare(b.department);
          break;
        }
        case "joiningDate": {
          comparison = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
          break;
        }
        case "id":
        default: {
          comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
          break;
        }
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [employees, filterState]);

  return {
    employees,
    filteredEmployees,
    statistics,
    isLoading,
    error,
    filterState,
    refresh: loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setSearchQuery,
    setDepartmentFilter,
    setStatusFilter,
    setSortCriteria,
    resetFilters
  };
}
