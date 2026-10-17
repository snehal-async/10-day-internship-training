/**
 * src/types/api.ts
 * Generic and domain-specific API interfaces and error contracts
 */

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}
