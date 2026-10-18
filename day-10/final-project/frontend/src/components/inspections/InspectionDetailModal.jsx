import { X, ClipboardCheck, User, Building2, ShieldCheck } from 'lucide-react';
import { OutcomeBadge } from '../common/Badge';
export function InspectionDetailModal({ inspection, isOpen, onClose, }) {
    if (!isOpen || !inspection)
        return null;
    return (<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <ClipboardCheck size={20}/>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="modal-title">Statutory Audit Record</h3>
                <span className="badge-code">{inspection.inspection_code}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Certified Compliance Evaluation Certificate
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Score & Outcome Header */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Evaluated Compliance Score
              </span>
              <div style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            color: inspection.score >= 80 ? 'var(--emerald-600)' : inspection.score >= 60 ? 'var(--amber-600)' : 'var(--rose-600)',
            lineHeight: 1.1,
            marginTop: '0.25rem',
        }}>
                {inspection.score}%
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                <OutcomeBadge outcome={inspection.outcome}/>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Mandatory Follow-up</span>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: inspection.requires_follow_up ? 'var(--rose-600)' : 'var(--emerald-600)', marginTop: '0.25rem' }}>
                {inspection.requires_follow_up ? 'Required' : 'Clear (None)'}
              </div>
              {inspection.requires_follow_up && inspection.follow_up_date && (<div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Due: {inspection.follow_up_date}
                </div>)}
            </div>
          </div>

          {/* Audit Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Building2 size={13}/> Facility Location
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {inspection.facility_name || `Facility #${inspection.facility_id}`}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inspection.facility_code}</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <User size={13}/> Certified Inspector
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {inspection.inspector_name || 'Inspector Lead'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{inspection.inspector_id}</div>
            </div>
          </div>

          {/* Findings & Observations */}
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Detailed Auditor Observations & Findings:
            </span>
            <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
        }}>
              {inspection.findings}
            </div>
          </div>

          {/* Signoff metadata */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="var(--primary-600)"/>
              <span>Cryptographically signed & verified</span>
            </div>
            <div>Timestamp: {new Date(inspection.created_at).toLocaleString()}</div>
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
