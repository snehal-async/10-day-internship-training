import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Maximize2, ClipboardCheck, AlertTriangle, ArrowLeft, Plus, FileText, Clock, CheckCircle2, } from 'lucide-react';
import { FacilityStatusBadge, ConditionBadge, OutcomeBadge, PriorityBadge, ComplaintStatusBadge } from '../common/Badge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EmptyState } from '../common/EmptyState';
export function FacilityDetailsPage({ facilities, inspections, complaints, isLoading, onRecordInspection, onLogComplaint, onUpdateComplaintStatus, }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('timeline');
    const facilityId = Number(id);
    const facility = useMemo(() => {
        if (isNaN(facilityId))
            return null;
        return facilities.find((f) => f.id === facilityId) || null;
    }, [facilities, facilityId]);
    if (isLoading && !facility) {
        return (<div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading facility details...</p>
        </div>
      </div>);
    }
    // Proper 404 Not Found State
    if (!facility) {
        return (<div className="page-container">
        <Breadcrumbs items={[{ label: 'Facilities', to: '/facilities' }, { label: 'Not Found' }]}/>
        <div style={{ marginTop: '2rem' }}>
          <EmptyState title="Facility Asset Not Found" description={`We could not locate an active facility with identifier #${id}. It may have been decommissioned or the URL parameter is invalid.`} actionLabel="Return to Facilities Directory" onAction={() => navigate('/facilities')}/>
        </div>
      </div>);
    }
    const linkedInspections = inspections
        .filter((i) => i.facility_id === facility.id)
        .sort((a, b) => new Date(b.inspection_date).getTime() - new Date(a.inspection_date).getTime());
    const linkedComplaints = complaints
        .filter((c) => c.facility_id === facility.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return (<div className="page-container">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
            { label: 'Facilities Directory', to: '/facilities' },
            { label: `${facility.name} (${facility.facility_code})` },
        ]}/>

      {/* Header Banner */}
      <div className="page-header" style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <button className="btn btn-secondary btn-icon" onClick={() => navigate('/facilities')} title="Back to facilities catalog" aria-label="Back to facilities list">
            <ArrowLeft size={16}/>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="page-title" style={{ margin: 0 }}>
                {facility.name}
              </h1>
              <span className="badge-code" style={{ fontSize: '0.8125rem' }}>
                {facility.facility_code}
              </span>
              <FacilityStatusBadge status={facility.status}/>
              <ConditionBadge rating={facility.condition_rating}/>
            </div>
            <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>
              {facility.address}, {facility.city}, {facility.state} {facility.postal_code} • {facility.department_name || 'General Operations'}
            </p>
          </div>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => onLogComplaint(facility.id)}>
            <AlertTriangle size={15} color="var(--amber-600)"/>
            <span>New Complaint</span>
          </button>

          <button className="btn btn-primary" onClick={() => onRecordInspection(facility.id)}>
            <ClipboardCheck size={15}/>
            <span>New Inspection</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Maximize2 size={14}/> Usable Area
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {facility.square_feet.toLocaleString()} <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>sq ft</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross building area</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Users size={14}/> Capacity
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {facility.capacity.toLocaleString()} <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>persons</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maximum permitted occupancy</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ClipboardCheck size={14}/> Audits Completed
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--primary-600)' }}>
            {linkedInspections.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recorded compliance audits</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <AlertTriangle size={14}/> Active Work Orders
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            marginTop: '0.25rem',
            color: linkedComplaints.filter((c) => c.status !== 'resolved').length > 0 ? 'var(--rose-600)' : 'var(--emerald-600)',
        }}>
            {linkedComplaints.filter((c) => c.status !== 'resolved').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {linkedComplaints.filter((c) => c.status === 'resolved').length} already resolved
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <button className={`btn btn-sm ${activeTab === 'timeline' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('timeline')} style={{ borderRadius: '6px 6px 0 0' }}>
          <ClipboardCheck size={14}/>
          <span>Inspection History Timeline ({linkedInspections.length})</span>
        </button>

        <button className={`btn btn-sm ${activeTab === 'complaints' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('complaints')} style={{ borderRadius: '6px 6px 0 0' }}>
          <AlertTriangle size={14}/>
          <span>Related Maintenance Issues ({linkedComplaints.length})</span>
        </button>

        <button className={`btn btn-sm ${activeTab === 'specs' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('specs')} style={{ borderRadius: '6px 6px 0 0' }}>
          <FileText size={14}/>
          <span>Facility Specifications</span>
        </button>
      </div>

      {/* Tab 1: Inspection History Timeline */}
      {activeTab === 'timeline' && (<div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Chronological Compliance History</h3>
              <p className="card-subtitle">Complete statutory inspection logs for {facility.facility_code}</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onRecordInspection(facility.id)}>
              <Plus size={14}/>
              <span>Record Audit</span>
            </button>
          </div>
          <div className="card-body">
            {linkedInspections.length > 0 ? (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
                {/* Timeline vertical bar */}
                <div style={{
                    position: 'absolute',
                    left: 7,
                    top: 10,
                    bottom: 10,
                    width: 2,
                    backgroundColor: 'var(--border-subtle)',
                }}/>

                {linkedInspections.map((ins) => (<div key={ins.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {/* Bullet */}
                    <div style={{
                        position: 'absolute',
                        left: -23,
                        top: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: ins.score >= 80 ? 'var(--emerald-600)' : ins.score >= 60 ? 'var(--amber-500)' : 'var(--rose-600)',
                        border: '3px solid var(--bg-surface)',
                        boxShadow: 'var(--shadow-xs)',
                    }}/>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge-code">{ins.inspection_code}</span>
                        <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                          Score: {ins.score}%
                        </strong>
                        <OutcomeBadge outcome={ins.outcome}/>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13}/>
                        <span>{ins.inspection_date} • Evaluated by {ins.inspector_name || 'Inspector Lead'}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '0.25rem', backgroundColor: 'var(--bg-surface-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                      {ins.findings}
                    </p>

                    {ins.requires_follow_up && (<div style={{ fontSize: '0.75rem', color: 'var(--rose-600)', fontWeight: 600 }}>
                        ⚠ Remediation Follow-up required by {ins.follow_up_date || 'TBD'}
                      </div>)}
                  </div>))}
              </div>) : (<EmptyState title="No inspections recorded for this site" description="This facility has no statutory compliance audits in the registry yet. Schedule and record an audit below." actionLabel="Record Audit for Facility" onAction={() => onRecordInspection(facility.id)}/>)}
          </div>
        </div>)}

      {/* Tab 2: Related Complaints */}
      {activeTab === 'complaints' && (<div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Maintenance Tickets & Work Orders</h3>
              <p className="card-subtitle">Infrastructure deficiencies lodged for {facility.facility_code}</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onLogComplaint(facility.id)}>
              <Plus size={14}/>
              <span>Log Complaint</span>
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {linkedComplaints.length > 0 ? (<div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Issue Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Reported By</th>
                      <th style={{ textAlign: 'right' }}>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedComplaints.map((c) => (<tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.description}</div>
                        </td>
                        <td>
                          <span className="badge-neutral" style={{ fontSize: '0.75rem' }}>{c.category}</span>
                        </td>
                        <td>
                          <PriorityBadge priority={c.priority}/>
                        </td>
                        <td>
                          <ComplaintStatusBadge status={c.status}/>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8125rem' }}>{c.reported_by_name || 'Staff'}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {c.status === 'open' && (<button className="btn btn-secondary btn-sm" onClick={() => onUpdateComplaintStatus(c.id, 'in_progress')}>
                              <Clock size={13}/>
                              <span>Start</span>
                            </button>)}
                          {c.status === 'in_progress' && (<button className="btn btn-secondary btn-sm" onClick={() => onUpdateComplaintStatus(c.id, 'resolved')} style={{ color: 'var(--emerald-700)' }}>
                              <CheckCircle2 size={13}/>
                              <span>Resolve</span>
                            </button>)}
                          {c.status === 'resolved' && (<span style={{ fontSize: '0.75rem', color: 'var(--emerald-600)', fontWeight: 600 }}>Resolved</span>)}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>) : (<EmptyState title="No work orders reported" description="This facility currently has no reported maintenance issues or tenant complaints." actionLabel="Log Work Order" onAction={() => onLogComplaint(facility.id)}/>)}
          </div>
        </div>)}

      {/* Tab 3: Detailed Specifications */}
      {activeTab === 'specs' && (<div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Facility Profile Specifications</h3>
              <p className="card-subtitle">Technical, structural and geographic parameters</p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Facility Name</span>
                <strong style={{ fontSize: '0.9375rem' }}>{facility.name}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Unique Code Identifier</span>
                <span className="badge-code">{facility.facility_code}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Classification Type</span>
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{facility.type}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Department Ownership</span>
                <span style={{ fontWeight: 600 }}>{facility.department_name || 'Corporate Property Operations'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Site Lead / Manager</span>
                <span style={{ fontWeight: 600 }}>{facility.manager_name || 'Designated Lead Engineer'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Postal Address</span>
                <span>{facility.address}, {facility.city}, {facility.state} {facility.postal_code}, {facility.country}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Gross Area (Sq Ft)</span>
                <strong style={{ fontSize: '1rem' }}>{facility.square_feet.toLocaleString()} sq ft</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Occupancy Capacity</span>
                <strong style={{ fontSize: '1rem' }}>{facility.capacity.toLocaleString()} persons</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Record Created In Database</span>
                <span>{new Date(facility.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
