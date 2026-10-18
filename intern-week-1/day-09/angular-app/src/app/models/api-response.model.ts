export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface AuthSession {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
