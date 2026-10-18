import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, FileText, User, Building, X } from 'lucide-react';
import type { Inspection } from '../types';

interface InspectionDetailModalProps {
  inspection: Inspection | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (inspection: Inspection) => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  inspection,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !inspection) return null;

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
            <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 className="modal-title">Inspection {inspection.inspection_number}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 4 }}>
                <span className={`badge badge-${inspection.result}`}>{inspection.result.replace('_', ' ')}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: inspection.score >= 80 ? '#34d399' : inspection.score >= 60 ? '#fbbf24' : '#f87171' }}>
                  Score: {inspection.score}/100
                </span>
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
                {inspection.facility ? `${inspection.facility.name} (${inspection.facility.facility_code})` : `Facility #${inspection.facility_id}`}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Inspector</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} color="#38bdf8" />
                {inspection.inspector?.name || `Inspector #${inspection.inspector_id}`}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Inspection Date</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="#fbbf24" />
                {new Date(inspection.inspection_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Follow-Up Required</span>
              <span className="detail-value">
                {inspection.follow_up_required ? (
                  <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={15} /> Yes (Due: {inspection.follow_up_date ? new Date(inspection.follow_up_date).toLocaleDateString() : 'TBD'})
                  </span>
                ) : (
                  <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={15} /> Not Required
                  </span>
                )}
              </span>
            </div>
            <div className="detail-item-full">
              <span className="detail-label">Inspector Notes & Findings</span>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {inspection.notes || 'No detailed inspection notes recorded.'}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {onEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(inspection);
              }}
            >
              Edit Inspection
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
