import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  DashboardStatistics,
  ApiResponse
} from "../types/employee";

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const DEMO_API_KEY: string =
  process.env.NEXT_PUBLIC_DEMO_API_KEY || "intern-auth-token-2026";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "API_ERROR",
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {})
  };

  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store" // Ensure fresh data on dynamic dashboard queries
    });
  } catch (err: unknown) {
    throw new ApiError(
      `Unable to connect to Express backend at ${API_BASE_URL}. Ensure the Express API is running on port 4000 (npm run dev inside node-api/).`,
      0,
      "NETWORK_FAILURE"
    );
  }

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    const errorMsg = json.error?.message || json.message || `Request failed with status ${response.status}`;
    const code = json.error?.code || "HTTP_ERROR";
    throw new ApiError(errorMsg, response.status, code, json.error?.details);
  }

  return json.data;
}

export const api = {
  /**
   * Get all employees with optional query filters
   */
  async getEmployees(params?: {
    search?: string;
    department?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Employee[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.department && params.department !== "all") query.set("department", params.department);
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

    const qs = query.toString();
    const endpoint = `/employees${qs ? `?${qs}` : ""}`;
    return request<Employee[]>(endpoint, { method: "GET" });
  },

  /**
   * Get single employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return request<Employee>(`/employees/${encodeURIComponent(id)}`, { method: "GET" });
  },

  /**
   * Get aggregate dashboard metrics
   */
  async getStatistics(): Promise<DashboardStatistics> {
    return request<DashboardStatistics>("/employees/stats", { method: "GET" });
  },

  /**
   * Create new employee
   */
  async createEmployee(data: CreateEmployeeInput): Promise<Employee> {
    return request<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  /**
   * Update existing employee
   */
  async updateEmployee(id: string, data: UpdateEmployeeInput): Promise<Employee> {
    return request<Employee>(`/employees/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete employee (Protected by demo authorization token)
   */
  async deleteEmployee(id: string): Promise<void> {
    await request<{ id: string; deleted: boolean }>(`/employees/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${DEMO_API_KEY}`
      }
    });
  },

  /**
   * Check backend health
   */
  async checkHealth(): Promise<{ status: string; uptimeSeconds: number }> {
    return request<{ status: string; uptimeSeconds: number }>("/health", { method: "GET" });
  }
};