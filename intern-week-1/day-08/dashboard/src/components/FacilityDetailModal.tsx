import React from 'react';
import { ClipboardList, AlertCircle, MapPin, Building2, X } from 'lucide-react';
import type { Facility } from '../types';

interface FacilityDetailModalProps {
  facility: Facility | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (facility: Facility) => void;
}

export const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  facility,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !facility) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 680 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Building2 size={22} />
            </div>
            <div>
              <h3 className="modal-title">{facility.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 4 }}>
                <span className="code-pill">{facility.facility_code}</span>
                <span className={`badge badge-${facility.condition_rating}`}>{facility.condition_rating}</span>
                <span className={`badge badge-${facility.status}`}>{facility.status}</span>
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
              <span className="detail-label">Facility Type</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                {facility.facility_type}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Design Capacity</span>
              <span className="detail-value">{facility.capacity ? `${facility.capacity.toLocaleString()} persons` : 'N/A'}</span>
            </div>
            <div className="detail-item-full">
              <span className="detail-label">Location Address</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="#818cf8" />
                {facility.address}, {facility.city}{facility.state ? `, ${facility.state}` : ''} {facility.postal_code || ''}
              </span>
            </div>
          </div>

          {/* Recent Audits section if loaded */}
          {facility.inspections && facility.inspections.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
                <ClipboardList size={16} color="#34d399" />
                Recent Safety Inspections ({facility.inspections.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {facility.inspections.map((insp) => (
                  <div
                    key={insp.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.825rem',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span className="code-pill" style={{ marginRight: 6 }}>{insp.inspection_number}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {new Date(insp.inspection_date).toLocaleDateString()}
                      </span>
                      {insp.inspector && (
                        <span style={{ marginLeft: 8, color: 'var(--text-dim)' }}>
                          • {insp.inspector.name}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: insp.score >= 80 ? '#34d399' : insp.score >= 60 ? '#fbbf24' : '#f87171' }}>
                        {insp.score}/100
                      </span>
                      <span className={`badge badge-${insp.result}`}>{insp.result.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Complaints section if loaded */}
          {facility.complaints && facility.complaints.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
                <AlertCircle size={16} color="#fbbf24" />
                Active Complaints & Work Orders ({facility.complaints.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {facility.complaints.map((comp) => (
                  <div
                    key={comp.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.825rem',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span className="code-pill" style={{ marginRight: 6 }}>{comp.ticket_number}</span>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>{comp.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge badge-${comp.severity}`}>{comp.severity}</span>
                      <span className={`badge badge-${comp.status}`}>{comp.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {onEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(facility);
              }}
            >
              Edit Facility
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
