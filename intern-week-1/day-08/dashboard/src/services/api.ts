import type {
  ApiResponse,
  AuthUser,
  Complaint,
  DashboardStatsData,
  Facility,
  Inspection,
  UserSummary,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

const TOKEN_KEY = 'facilityops_auth_token';
const USER_KEY = 'facilityops_auth_user';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getStoredToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status} (${response.statusText})`;
    throw new ApiError(errorMsg, response.status, data?.errors);
  }

  return data as T;
}

export const api = {
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  // Health check
  async checkHealth(): Promise<{ status: string; framework: string; database: string; timestamp: string }> {
    return request('/health');
  },

  // Auth endpoints
  async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const res = await request<ApiResponse<{ user: AuthUser; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearStoredAuth();
    }
  },

  async getMe(): Promise<AuthUser> {
    const res = await request<ApiResponse<{ user: AuthUser }>>('/auth/me');
    return res.data.user;
  },

  // Dashboard Stats & Inspectors lookup
  async getStats(): Promise<DashboardStatsData> {
    const res = await request<ApiResponse<DashboardStatsData>>('/stats');
    return res.data;
  },

  async getInspectors(): Promise<UserSummary[]> {
    const res = await request<ApiResponse<UserSummary[]>>('/inspectors');
    return res.data;
  },

  // Facilities CRUD
  async getFacilities(params?: {
    search?: string;
    type?: string;
    condition?: string;
    status?: string;
    city?: string;
    per_page?: number;
  }): Promise<ApiResponse<Facility[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.type) query.append('type', params.type);
    if (params?.condition) query.append('condition', params.condition);
    if (params?.status) query.append('status', params.status);
    if (params?.city) query.append('city', params.city);
    if (params?.per_page) query.append('per_page', params.per_page.toString());

    const qs = query.toString();
    return request<ApiResponse<Facility[]>>(`/facilities${qs ? `?${qs}` : ''}`);
  },

  async getFacility(id: number | string): Promise<Facility> {
    const res = await request<ApiResponse<Facility>>(`/facilities/${id}`);
    return res.data;
  },

  async createFacility(payload: Partial<Facility>): Promise<Facility> {
    const res = await request<ApiResponse<Facility>>('/facilities', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateFacility(id: number | string, payload: Partial<Facility>): Promise<Facility> {
    const res = await request<ApiResponse<Facility>>(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteFacility(id: number | string): Promise<void> {
    await request(`/facilities/${id}`, { method: 'DELETE' });
  },

  // Inspections CRUD
  async getInspections(params?: {
    facility_id?: number | string;
    inspector_id?: number | string;
    result?: string;
    min_score?: number;
    follow_up_required?: boolean;
    per_page?: number;
  }): Promise<ApiResponse<Inspection[]>> {
    const query = new URLSearchParams();
    if (params?.facility_id) query.append('facility_id', params.facility_id.toString());
    if (params?.inspector_id) query.append('inspector_id', params.inspector_id.toString());
    if (params?.result) query.append('result', params.result);
    if (params?.min_score !== undefined) query.append('min_score', params.min_score.toString());
    if (params?.follow_up_required !== undefined) {
      query.append('follow_up_required', params.follow_up_required ? 'true' : 'false');
    }
    if (params?.per_page) query.append('per_page', params.per_page.toString());

    const qs = query.toString();
    return request<ApiResponse<Inspection[]>>(`/inspections${qs ? `?${qs}` : ''}`);
  },

  async getInspection(id: number | string): Promise<Inspection> {
    const res = await request<ApiResponse<Inspection>>(`/inspections/${id}`);
    return res.data;
  },

  async createInspection(payload: Partial<Inspection>): Promise<Inspection> {
    const res = await request<ApiResponse<Inspection>>('/inspections', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateInspection(id: number | string, payload: Partial<Inspection>): Promise<Inspection> {
    const res = await request<ApiResponse<Inspection>>(`/inspections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteInspection(id: number | string): Promise<void> {
    await request(`/inspections/${id}`, { method: 'DELETE' });
  },

  // Complaints CRUD
  async getComplaints(params?: {
    search?: string;
    facility_id?: number | string;
    status?: string;
    severity?: string;
    assigned_to_id?: number | string;
    per_page?: number;
  }): Promise<ApiResponse<Complaint[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.facility_id) query.append('facility_id', params.facility_id.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.assigned_to_id) query.append('assigned_to_id', params.assigned_to_id.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());

    const qs = query.toString();
    return request<ApiResponse<Complaint[]>>(`/complaints${qs ? `?${qs}` : ''}`);
  },

  async getComplaint(id: number | string): Promise<Complaint> {
    const res = await request<ApiResponse<Complaint>>(`/complaints/${id}`);
    return res.data;
  },

  async createComplaint(payload: Partial<Complaint>): Promise<Complaint> {
    const res = await request<ApiResponse<Complaint>>('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateComplaint(id: number | string, payload: Partial<Complaint>): Promise<Complaint> {
    const res = await request<ApiResponse<Complaint>>(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteComplaint(id: number | string): Promise<void> {
    await request(`/complaints/${id}`, { method: 'DELETE' });
  },
};
