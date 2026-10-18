import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import type { Facility, Inspection } from '../types';

interface InspectionsViewProps {
  inspections: Inspection[];
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onSelectInspection: (inspection: Inspection) => void;
  onEditInspection: (inspection: Inspection) => void;
  onDeleteInspection: (inspection: Inspection) => void;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  inspections,
  facilities,
  isLoading,
  error,
  onRefresh,
  onOpenCreate,
  onSelectInspection,
  onEditInspection,
  onDeleteInspection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');

  const filteredInspections = inspections.filter((insp) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      insp.inspection_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (insp.facility?.name && insp.facility.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (insp.inspector?.name && insp.inspector.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (insp.notes && insp.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFacility = facilityFilter === '' || insp.facility_id.toString() === facilityFilter;
    const matchesResult = resultFilter === '' || insp.result === resultFilter;

    return matchesSearch && matchesFacility && matchesResult;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Safety & Compliance Inspections</h1>
          <p className="page-subtitle">
            Track structural audits, environmental health reviews, fire code compliance, and scores.
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
            <Plus size={16} /> Log Inspection
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
              placeholder="Search audit #, inspector, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
          >
            <option value="">All Facilities</option>
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name} ({fac.facility_code})
              </option>
            ))}
          </select>

          <select
            className="select-filter"
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
          >
            <option value="">All Results</option>
            <option value="passed">Passed</option>
            <option value="conditional_pass">Conditional Pass</option>
            <option value="failed">Failed</option>
            <option value="critical_failure">Critical Failure</option>
          </select>

          {(searchTerm || facilityFilter || resultFilter) && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => {
                setSearchTerm('');
                setFacilityFilter('');
                setResultFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading && inspections.length === 0 ? (
          <div className="state-box">
            <div className="spinner" />
            <h3 className="state-title">Loading Inspections</h3>
            <p className="state-desc">Fetching inspection history from PostgreSQL...</p>
          </div>
        ) : error && inspections.length === 0 ? (
          <div className="state-box">
            <div className="state-icon" style={{ color: '#ef4444' }}>
              <AlertCircle size={28} />
            </div>
            <h3 className="state-title">Failed to Load Inspections</h3>
            <p className="state-desc">{error}</p>
            <button type="button" className="btn btn-primary" onClick={onRefresh}>
              Retry
            </button>
          </div>
        ) : filteredInspections.length === 0 ? (
          <div className="state-box">
            <div className="state-icon">
              <ClipboardList size={28} />
            </div>
            <h3 className="state-title">No Inspections Found</h3>
            <p className="state-desc">
              {inspections.length === 0
                ? 'No safety inspections have been conducted or recorded yet.'
                : 'No inspection records match your current filters.'}
            </p>
            {inspections.length === 0 ? (
              <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
                <Plus size={16} /> Record First Inspection
              </button>
            ) : null}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit Number</th>
                  <th>Facility</th>
                  <th>Inspector</th>
                  <th>Audit Date</th>
                  <th>Score</th>
                  <th>Result</th>
                  <th>Follow-Up</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((inspection) => (
                  <tr key={inspection.id}>
                    <td>
                      <span className="code-pill">{inspection.inspection_number}</span>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                        onClick={() => onSelectInspection(inspection)}
                      >
                        {inspection.facility?.name || `Facility #${inspection.facility_id}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {inspection.facility?.facility_code}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {inspection.inspector?.name || `User #${inspection.inspector_id}`}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                        <Calendar size={14} color="#fbbf24" />
                        {new Date(inspection.inspection_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="score-indicator">
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color:
                              inspection.score >= 80 ? '#34d399' : inspection.score >= 60 ? '#fbbf24' : '#f87171',
                          }}
                        >
                          {inspection.score}
                        </span>
                        <div className="score-bar-bg">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${inspection.score}%`,
                              background:
                                inspection.score >= 80 ? '#10b981' : inspection.score >= 60 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${inspection.result}`}>
                        {inspection.result.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {inspection.follow_up_required ? (
                        <span style={{ color: '#fb923c', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertTriangle size={14} /> Re-audit
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-only"
                          onClick={() => onSelectInspection(inspection)}
                          title="View Details"
                          aria-label={`View details for audit ${inspection.inspection_number}`}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-only"
                          onClick={() => onEditInspection(inspection)}
                          title="Edit Inspection"
                          aria-label={`Edit audit ${inspection.inspection_number}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-icon-only"
                          onClick={() => onDeleteInspection(inspection)}
                          title="Delete Inspection"
                          aria-label={`Delete audit ${inspection.inspection_number}`}
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
