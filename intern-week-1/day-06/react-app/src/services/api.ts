/**
 * src/services/api.ts
 * Strongly typed HTTP client communicating with the JSON Server Mock REST API
 */

import { Employee, EmployeeFormData } from "../types/employee";

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:3001";

const EMPLOYEES_ENDPOINT = `${API_BASE_URL}/employees`;

/**
 * Custom application error class preserving HTTP status and network details
 */
export class ApiClientError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Generic safe JSON fetch wrapper with error diagnostics
 */
async function handleResponse<T>(response: Response, endpoint: string): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Body was not JSON; keep status text
    }
    throw new ApiClientError(errorMessage, response.status, endpoint);
  }
  return response.json() as Promise<T>;
}

/**
 * Core Employee REST API Service methods
 */
export const employeeApiService = {
  /**
   * GET /employees
   * Retrieves all employee records from the backend database
   */
  async getAll(): Promise<Employee[]> {
    try {
      const response = await fetch(EMPLOYEES_ENDPOINT, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });
      return await handleResponse<Employee[]>(response, EMPLOYEES_ENDPOINT);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError(
        `Failed to connect to REST API at ${API_BASE_URL}. Ensure JSON Server is running on port 3001 (npm run server).`,
        0,
        EMPLOYEES_ENDPOINT
      );
    }
  },

  /**
   * GET /employees/:id
   * Retrieves a single employee record by ID
   */
  async getById(id: string): Promise<Employee> {
    const url = `${EMPLOYEES_ENDPOINT}/${encodeURIComponent(id)}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
      return await handleResponse<Employee>(response, url);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError(`Unable to fetch employee ${id}: ${(err as Error).message}`, 0, url);
    }
  },

  /**
   * POST /employees
   * Creates a new employee record
   */
  async create(data: EmployeeFormData): Promise<Employee> {
    try {
      // If client didn't supply an ID, auto-generate sequential ID or timestamp ID
      const newRecord: Employee = {
        id: data.id && data.id.trim().length > 0 ? data.id : `EMP-${Date.now().toString().slice(-4)}`,
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

      const response = await fetch(EMPLOYEES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newRecord)
      });
      return await handleResponse<Employee>(response, EMPLOYEES_ENDPOINT);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError(`Failed to create employee: ${(err as Error).message}`, 0, EMPLOYEES_ENDPOINT);
    }
  },

  /**
   * PUT /employees/:id
   * Updates an existing employee record
   */
  async update(id: string, data: EmployeeFormData): Promise<Employee> {
    const url = `${EMPLOYEES_ENDPOINT}/${encodeURIComponent(id)}`;
    try {
      const payload: Partial<Employee> = {
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

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      return await handleResponse<Employee>(response, url);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError(`Failed to update employee ${id}: ${(err as Error).message}`, 0, url);
    }
  },

  /**
   * DELETE /employees/:id
   * Deletes an employee record from the backend
   */
  async delete(id: string): Promise<void> {
    const url = `${EMPLOYEES_ENDPOINT}/${encodeURIComponent(id)}`;
    try {
      const response = await fetch(url, {
        method: "DELETE"
      });
      if (!response.ok && response.status !== 404) {
        throw new ApiClientError(`Failed to delete record ${id}`, response.status, url);
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError(`Failed to delete employee ${id}: ${(err as Error).message}`, 0, url);
    }
  }
};
