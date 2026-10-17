import React from "react";
import { ToastMessage } from "../types/api";

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((toast) => {
        const typeClass =
          toast.type === "success"
            ? "toast-success"
            : toast.type === "error"
            ? "toast-error"
            : toast.type === "warning"
            ? "toast-warning"
            : "";

        return (
          <div key={toast.id} className={`toast-item ${typeClass}`}>
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              {toast.description && <div className="toast-desc">{toast.description}</div>}
            </div>
            <button
              type="button"
              className="toast-dismiss"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss toast"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="18" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
