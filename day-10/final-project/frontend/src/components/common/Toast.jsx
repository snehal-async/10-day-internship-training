import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
export function ToastContainer({ toasts, onDismiss }) {
    if (toasts.length === 0)
        return null;
    return (<div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => (<div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--emerald-600)"/>}
            {toast.type === 'warning' && <AlertTriangle size={18} color="var(--amber-600)"/>}
            {toast.type === 'error' && <AlertCircle size={18} color="var(--rose-600)"/>}
            {toast.type === 'info' && <Info size={18} color="var(--primary-600)"/>}
          </div>
          <div className="toast-content" style={{ flex: 1 }}>
            {toast.title && <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{toast.title}</div>}
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{toast.message}</div>
          </div>
          <button onClick={() => onDismiss(toast.id)} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0.25rem',
                display: 'flex',
            }} aria-label="Close notification">
            <X size={14}/>
          </button>
        </div>))}
    </div>);
}
