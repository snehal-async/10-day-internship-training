import { useState } from 'react';
import { X, Building2, MapPin, Users, Maximize2, ClipboardCheck, AlertTriangle, Shield, FileText, } from 'lucide-react';
import { FacilityStatusBadge, ConditionBadge, OutcomeBadge, PriorityBadge, ComplaintStatusBadge } from '../common/Badge';
export function FacilityDetailModal({ facility, inspections, complaints, isOpen, onClose, onRecordAudit, onLogComplaint, }) {
    const [activeTab, setActiveTab] = useState('specs');
    if (!isOpen || !facility)
        return null;
    // Filter linked records
    const linkedInspections = inspections.filter((i) => i.facility_id === facility.id);
    const linkedComplaints = complaints.filter((c) => c.facility_id === facility.id);
    return (<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <Building2 size={22}/>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="modal-title">{facility.name}</h3>
                <span className="badge-code">{facility.facility_code}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {facility.address}, {facility.city}, {facility.state} • {facility.department_name || 'Operations'}
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}>
          <button className={`btn btn-sm ${activeTab === 'specs' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('specs')} style={{ borderRadius: '6px 6px 0 0', padding: '0.5rem 1rem' }}>
            <FileText size={14}/>
            <span>Specifications & Overview</span>
          </button>
          <button className={`btn btn-sm ${activeTab === 'inspections' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('inspections')} style={{ borderRadius: '6px 6px 0 0', padding: '0.5rem 1rem' }}>
            <ClipboardCheck size={14}/>
            <span>Audit History ({linkedInspections.length})</span>
          </button>
          <button className={`btn btn-sm ${activeTab === 'complaints' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('complaints')} style={{ borderRadius: '6px 6px 0 0', padding: '0.5rem 1rem' }}>
            <AlertTriangle size={14}/>
            <span>Maintenance Tickets ({linkedComplaints.length})</span>
          </button>
        </div>

        {/* Body content based on tab */}
        <div className="modal-body" style={{ minHeight: 380 }}>
          {activeTab === 'specs' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Status Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Operational Health Status</span>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <FacilityStatusBadge status={facility.status}/>
                    <ConditionBadge rating={facility.condition_rating}/>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => onLogComplaint(facility.id)}>
                    <AlertTriangle size={14} color="var(--amber-600)"/>
                    <span>Log Work Order</span>
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => onRecordAudit(facility.id)}>
                    <ClipboardCheck size={14}/>
                    <span>Record Audit</span>
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <MapPin size={14}/> Physical Address
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {facility.address}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {facility.city}, {facility.state} {facility.postal_code}, {facility.country}
                  </div>
                </div>

                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Maximize2 size={14}/> Usable Area & Capacity
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', marginTop: '0.25rem' }}>
                    {facility.square_feet.toLocaleString()} sq ft
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Max Occupancy: {facility.capacity.toLocaleString()} persons
                  </div>
                </div>

                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Shield size={14}/> Operational Division
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {facility.department_name || 'Corporate Property Operations'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Classification: <strong style={{ textTransform: 'capitalize' }}>{facility.type}</strong>
                  </div>
                </div>

                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Users size={14}/> Facility Manager Lead
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {facility.manager_name || 'Designated Lead Engineer'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    System ID: #{facility.id}
                  </div>
                </div>
              </div>

              {/* Audit Summary Statistics */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compliance Track Record</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {linkedInspections.length} recorded audit cycles
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unresolved Maintenance</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: linkedComplaints.filter((c) => c.status !== 'resolved').length > 0 ? 'var(--rose-600)' : 'var(--emerald-600)' }}>
                    {linkedComplaints.filter((c) => c.status !== 'resolved').length} open tickets
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Since</span>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date(facility.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>)}

          {activeTab === 'inspections' && (<div>
              {linkedInspections.length > 0 ? (<div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Audit Code & Date</th>
                        <th>Auditor</th>
                        <th>Score</th>
                        <th>Outcome</th>
                        <th>Findings Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedInspections.map((ins) => (<tr key={ins.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{ins.inspection_code}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ins.inspection_date}</div>
                          </td>
                          <td style={{ fontSize: '0.8125rem' }}>{ins.inspector_name || 'Inspector'}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: ins.score >= 80 ? 'var(--emerald-600)' : ins.score >= 60 ? 'var(--amber-600)' : 'var(--rose-600)' }}>
                              {ins.score}%
                            </span>
                          </td>
                          <td>
                            <OutcomeBadge outcome={ins.outcome}/>
                          </td>
                          <td style={{ maxWidth: 260, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {ins.findings}
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>) : (<div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <ClipboardCheck size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }}/>
                  <p>No inspection audits on record for this facility yet.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => onRecordAudit(facility.id)}>
                    Record First Audit
                  </button>
                </div>)}
            </div>)}

          {activeTab === 'complaints' && (<div>
              {linkedComplaints.length > 0 ? (<div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title & Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Reported By</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedComplaints.map((c) => (<tr key={c.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</div>
                          </td>
                          <td>
                            <PriorityBadge priority={c.priority}/>
                          </td>
                          <td>
                            <ComplaintStatusBadge status={c.status}/>
                          </td>
                          <td style={{ fontSize: '0.8125rem' }}>{c.reported_by_name || 'Staff'}</td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(c.created_at).toLocaleDateString()}
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>) : (<div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <AlertTriangle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }}/>
                  <p>No maintenance issues or work orders reported for this facility.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => onLogComplaint(facility.id)}>
                    Log New Issue
                  </button>
                </div>)}
            </div>)}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>);
}
