import { useState, useMemo } from 'react';
import { Plus, Search, CheckCircle2, Clock, Eye, } from 'lucide-react';
import { PriorityBadge, ComplaintStatusBadge } from '../common/Badge';
export function ComplaintsView({ complaints, facilities, isLoading, onViewComplaint, onLogComplaint, onUpdateStatus, }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [facilityFilter, setFacilityFilter] = useState('all');
    const filteredComplaints = useMemo(() => {
        return complaints.filter((c) => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.facility_name && c.facility_name.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
            const matchesFacility = facilityFilter === 'all' || c.facility_id === Number(facilityFilter);
            return matchesSearch && matchesStatus && matchesPriority && matchesFacility;
        });
    }, [complaints, searchTerm, statusFilter, priorityFilter, facilityFilter]);
    // Breakdown metrics
    const openCount = complaints.filter((c) => c.status === 'open').length;
    const inProgCount = complaints.filter((c) => c.status === 'in_progress').length;
    const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
    const urgentCount = complaints.filter((c) => c.priority === 'urgent' && c.status !== 'resolved').length;
    return (<div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Maintenance & Issue Tracking
          </h1>
          <p className="page-subtitle">
            Lifecycle resolution of infrastructure deficiencies, tenant complaints, and equipment tickets ({filteredComplaints.length} tickets)
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={onLogComplaint}>
            <Plus size={16}/>
            <span>Log Work Order</span>
          </button>
        </div>
      </div>

      {/* Mini metric pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', borderLeft: '4px solid var(--rose-600)' }} onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Open Issues</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rose-700)', marginTop: '0.2rem' }}>
            {openCount}
          </div>
        </div>

        <div className="card" style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', borderLeft: '4px solid var(--amber-500)' }} onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Progress / Triaged</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-700)', marginTop: '0.2rem' }}>
            {inProgCount}
          </div>
        </div>

        <div className="card" style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', borderLeft: '4px solid var(--emerald-600)' }} onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved Tickets</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-700)', marginTop: '0.2rem' }}>
            {resolvedCount}
          </div>
        </div>

        <div className="card" style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', borderLeft: '4px solid #ef4444' }} onClick={() => setPriorityFilter(priorityFilter === 'urgent' ? 'all' : 'urgent')}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgent Unresolved</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
            {urgentCount}
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: '1 1 280px', minWidth: 260, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input type="text" placeholder="Filter by issue title, description, category, or site..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem' }}/>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-control" style={{ width: 160 }} aria-label="Filter by status">
              <option value="all">All Statuses</option>
              <option value="open">Open Issues</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="form-control" style={{ width: 160 }} aria-label="Filter by priority">
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)} className="form-control" style={{ width: 180 }} aria-label="Filter by facility">
              <option value="all">All Facilities</option>
              {facilities.map((fac) => (<option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>))}
            </select>

            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || facilityFilter !== 'all') && (<button className="btn btn-ghost btn-sm" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setFacilityFilter('all');
            }}>
                Clear
              </button>)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue Title & Details</th>
              <th>Facility Asset</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reported / Assignee</th>
              <th style={{ textAlign: 'right' }}>Status Lifecycle Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (filteredComplaints.map((c) => (<tr key={c.id}>
                  <td style={{ maxWidth: 300 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => onViewComplaint(c)}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.facility_name || `Facility #${c.facility_id}`}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.facility_code}</div>
                  </td>
                  <td>
                    <span className="badge-neutral" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                      {c.category}
                    </span>
                  </td>
                  <td>
                    <PriorityBadge priority={c.priority}/>
                  </td>
                  <td>
                    <ComplaintStatusBadge status={c.status}/>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {c.reported_by_name || 'Staff'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Assignee: {c.assigned_to_name || 'Unassigned'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                      {c.status === 'open' && (<button className="btn btn-secondary btn-sm" onClick={() => onUpdateStatus(c.id, 'in_progress')} title="Transition to In Progress" style={{ fontSize: '0.75rem' }}>
                          <Clock size={13} color="var(--amber-600)"/>
                          <span>Start</span>
                        </button>)}
                      {c.status === 'in_progress' && (<button className="btn btn-secondary btn-sm" onClick={() => onUpdateStatus(c.id, 'resolved')} title="Mark Resolved" style={{ fontSize: '0.75rem', color: 'var(--emerald-700)' }}>
                          <CheckCircle2 size={13} color="var(--emerald-600)"/>
                          <span>Resolve</span>
                        </button>)}
                      {c.status === 'resolved' && (<button className="btn btn-ghost btn-sm" onClick={() => onUpdateStatus(c.id, 'open')} title="Reopen ticket" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Reopen
                        </button>)}
                      <button className="btn btn-ghost btn-sm" onClick={() => onViewComplaint(c)} title="View ticket notes">
                        <Eye size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>))) : (<tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No maintenance tickets found matching your criteria.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
