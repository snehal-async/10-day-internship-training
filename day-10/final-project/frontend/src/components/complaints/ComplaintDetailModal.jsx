import { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { PriorityBadge, ComplaintStatusBadge } from '../common/Badge';
export function ComplaintDetailModal({ complaint, isOpen, onClose, onUpdateStatus, isLoading, }) {
    const [resolutionNotes, setResolutionNotes] = useState('');
    if (!isOpen || !complaint)
        return null;
    async function handleStatusChange(status) {
        if (!complaint)
            return;
        await onUpdateStatus(complaint.id, status, resolutionNotes || undefined);
    }
    return (<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--amber-50)',
            color: 'var(--amber-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <AlertTriangle size={20}/>
            </div>
            <div>
              <h3 className="modal-title">Work Order Details</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket #{complaint.id}</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <PriorityBadge priority={complaint.priority}/>
              <ComplaintStatusBadge status={complaint.status}/>
              <span className="badge-neutral" style={{ fontSize: '0.75rem' }}>{complaint.category}</span>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {complaint.title}
            </h2>
          </div>

          <div style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Site Facility</span>
              <strong style={{ color: 'var(--text-primary)' }}>{complaint.facility_name || `Facility #${complaint.facility_id}`}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{complaint.facility_code}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Reported By</span>
              <strong style={{ color: 'var(--text-primary)' }}>{complaint.reported_by_name || 'Staff Officer'}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(complaint.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Defect Description:
            </span>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', padding: '0.75rem 1rem', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              {complaint.description}
            </p>
          </div>

          {complaint.resolution_notes && (<div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--emerald-800)', display: 'block', marginBottom: '0.35rem' }}>
                Resolution Findings & Sign-off Notes:
              </span>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--emerald-900)', padding: '0.75rem 1rem', backgroundColor: 'var(--emerald-50)', border: '1px solid var(--emerald-200)', borderRadius: 'var(--radius-md)' }}>
                {complaint.resolution_notes}
              </p>
            </div>)}

          {/* Lifecycle Status Management */}
          <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-subtle)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Update Lifecycle Status:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button type="button" className={`btn btn-sm ${complaint.status === 'open' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleStatusChange('open')} disabled={isLoading}>
                Mark Open
              </button>
              <button type="button" className={`btn btn-sm ${complaint.status === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleStatusChange('in_progress')} disabled={isLoading}>
                <Clock size={13}/>
                <span>Mark In Progress</span>
              </button>
              <button type="button" className={`btn btn-sm ${complaint.status === 'resolved' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleStatusChange('resolved')} disabled={isLoading} style={{ color: complaint.status === 'resolved' ? '#ffffff' : 'var(--emerald-700)' }}>
                <CheckCircle2 size={13}/>
                <span>Mark Resolved</span>
              </button>
            </div>

            {complaint.status !== 'resolved' && (<div style={{ marginTop: '0.75rem' }}>
                <input type="text" placeholder="Optional resolution notes before marking resolved..." value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} className="form-control" style={{ fontSize: '0.8125rem', height: 36 }}/>
              </div>)}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>);
}
