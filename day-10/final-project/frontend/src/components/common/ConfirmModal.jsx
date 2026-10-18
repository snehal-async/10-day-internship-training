import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { animateModalEntrance } from '../../utils/animations';
export function ConfirmModal({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', isDanger = false, isLoading = false, onConfirm, onCancel, }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            animateModalEntrance(dialogRef.current);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div ref={dialogRef} className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: isDanger ? 'var(--rose-50)' : 'var(--amber-50)',
            color: isDanger ? 'var(--rose-600)' : 'var(--amber-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
              <AlertTriangle size={18}/>
            </div>
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button type="button" className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>);
}
