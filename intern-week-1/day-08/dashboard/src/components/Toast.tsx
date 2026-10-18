import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} className="text-emerald-400" color="#10b981" />}
          {toast.type === 'error' && <AlertCircle size={20} className="text-red-400" color="#ef4444" />}
          {toast.type === 'info' && <Info size={20} className="text-sky-400" color="#0ea5e9" />}
          <div style={{ flex: 1 }}>
            {toast.title && <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{toast.title}</div>}
            <div style={{ color: 'var(--text-muted)' }}>{toast.message}</div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 4 }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
