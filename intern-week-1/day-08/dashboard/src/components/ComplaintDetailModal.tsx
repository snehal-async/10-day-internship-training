import React from 'react';
import { AlertCircle, Calendar, CheckCircle2, User, Building, X, Clock } from 'lucide-react';
import type { Complaint, ComplaintStatus } from '../types';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (complaint: Complaint) => void;
  onQuickStatusChange?: (complaint: Complaint, status: ComplaintStatus) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onEdit,
  onQuickStatusChange,
}) => {
  if (!isOpen || !complaint) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 className="modal-title">{complaint.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 4 }}>
                <span className="code-pill">{complaint.ticket_number}</span>
                <span className={`badge badge-${complaint.severity}`}>{complaint.severity}</span>
                <span className={`badge badge-${complaint.status}`}>{complaint.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Facility</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building size={16} color="#818cf8" />
                {complaint.facility ? `${complaint.facility.name} (${complaint.facility.facility_code})` : `Facility #${complaint.facility_id}`}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned Technician</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} color="#38bdf8" />
                {complaint.assigned_to?.name || 'Unassigned'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Reported At</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="#fbbf24" />
                {complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Resolution Timestamp</span>
              <span className="detail-value">
                {complaint.resolved_at ? (
                  <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={15} /> {new Date(complaint.resolved_at).toLocaleString()}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={15} /> Pending Resolution
                  </span>
                )}
              </span>
            </div>
            <div className="detail-item-full">
              <span className="detail-label">Issue Description</span>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {complaint.description}
              </div>
            </div>

            {complaint.resolution_notes && (
              <div className="detail-item-full">
                <span className="detail-label">Resolution Summary</span>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#d1fae5',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {complaint.resolution_notes}
                </div>
              </div>
            )}

            {onQuickStatusChange && (
              <div className="detail-item-full" style={{ marginTop: '0.5rem' }}>
                <span className="detail-label" style={{ marginBottom: '0.4rem' }}>Quick Update Status</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(['open', 'in_progress', 'resolved', 'closed'] as ComplaintStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-secondary ${complaint.status === st ? 'btn-primary' : ''}`}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      onClick={() => onQuickStatusChange(complaint, st)}
                    >
                      Mark as {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {onEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(complaint);
              }}
            >
              Edit Ticket
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
