import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';
import type { Complaint, ComplaintStatus, Facility } from '../types';

interface ComplaintsViewProps {
  complaints: Complaint[];
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onEditComplaint: (complaint: Complaint) => void;
  onDeleteComplaint: (complaint: Complaint) => void;
  onQuickStatusChange: (complaint: Complaint, status: ComplaintStatus) => void;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  facilities,
  isLoading,
  error,
  onRefresh,
  onOpenCreate,
  onSelectComplaint,
  onEditComplaint,
  onDeleteComplaint,
  onQuickStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [facilityFilter, setFacilityFilter] = useState<string>('');

  const filteredComplaints = complaints.filter((comp) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      comp.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.facility?.name && comp.facility.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === '' || comp.status === statusFilter;
    const matchesSeverity = severityFilter === '' || comp.severity === severityFilter;
    const matchesFacility = facilityFilter === '' || comp.facility_id.toString() === facilityFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesFacility;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints & Work Orders</h1>
          <p className="page-subtitle">
            Log maintenance tickets, prioritize hazards by severity, and assign technicians.
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
            <Plus size={16} /> New Ticket
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search ticket, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="select-filter"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            className="select-filter"
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
          >
            <option value="">All Facilities</option>
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name}
              </option>
            ))}
          </select>

          {(searchTerm || statusFilter || severityFilter || facilityFilter) && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setSeverityFilter('');
                setFacilityFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading && complaints.length === 0 ? (
          <div className="state-box">
            <div className="spinner" />
            <h3 className="state-title">Loading Tickets</h3>
            <p className="state-desc">Fetching maintenance complaints from PostgreSQL...</p>
          </div>
        ) : error && complaints.length === 0 ? (
          <div className="state-box">
            <div className="state-icon" style={{ color: '#ef4444' }}>
              <AlertCircle size={28} />
            </div>
            <h3 className="state-title">Failed to Load Complaints</h3>
            <p className="state-desc">{error}</p>
            <button type="button" className="btn btn-primary" onClick={onRefresh}>
              Retry
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="state-box">
            <div className="state-icon">
              <AlertCircle size={28} />
            </div>
            <h3 className="state-title">No Tickets Found</h3>
            <p className="state-desc">
              {complaints.length === 0
                ? 'No maintenance complaints or tickets exist in the database.'
                : 'No tickets match the selected filters.'}
            </p>
            {complaints.length === 0 ? (
              <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
                <Plus size={16} /> Log First Ticket
              </button>
            ) : null}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Facility</th>
                  <th>Complaint Title & Description</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Reported Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <span className="code-pill">{complaint.ticket_number}</span>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                        onClick={() => onSelectComplaint(complaint)}
                      >
                        {complaint.facility?.name || `Facility #${complaint.facility_id}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {complaint.facility?.facility_code}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                        onClick={() => onSelectComplaint(complaint)}
                      >
                        {complaint.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          maxWidth: 320,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 2,
                        }}
                      >
                        {complaint.description}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${complaint.severity}`}>{complaint.severity}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          className="select-filter"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: 4 }}
                          value={complaint.status}
                          onChange={(e) => onQuickStatusChange(complaint, e.target.value as ComplaintStatus)}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Calendar size={13} color="#fbbf24" />
                        {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-only"
                          onClick={() => onSelectComplaint(complaint)}
                          title="View Details"
                          aria-label={`View details for ticket ${complaint.ticket_number}`}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-only"
                          onClick={() => onEditComplaint(complaint)}
                          title="Edit Complaint"
                          aria-label={`Edit ticket ${complaint.ticket_number}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-icon-only"
                          onClick={() => onDeleteComplaint(complaint)}
                          title="Delete Complaint"
                          aria-label={`Delete ticket ${complaint.ticket_number}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
