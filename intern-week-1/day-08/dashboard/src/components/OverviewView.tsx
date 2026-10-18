import React from 'react';
import {
  Building2,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import type { Complaint, DashboardStatsData, Inspection } from '../types';

interface OverviewViewProps {
  stats: DashboardStatsData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onNavigateTab: (tab: 'facilities' | 'inspections' | 'complaints') => void;
  onOpenCreateFacility: () => void;
  onOpenCreateInspection: () => void;
  onOpenCreateComplaint: () => void;
  onSelectInspection: (inspection: Inspection) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  isLoading,
  error,
  onRefresh,
  onNavigateTab,
  onOpenCreateFacility,
  onOpenCreateInspection,
  onOpenCreateComplaint,
  onSelectInspection,
  onSelectComplaint,
}) => {
  if (isLoading && !stats) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <h3 className="state-title">Retrieving Live Metrics from PostgreSQL</h3>
        <p className="state-desc">Querying Laravel API and aggregates...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="state-box">
        <div className="state-icon" style={{ color: '#ef4444' }}>
          <AlertCircle size={28} />
        </div>
        <h3 className="state-title">Failed to Connect to Laravel API</h3>
        <p className="state-desc">{error}</p>
        <button type="button" className="btn btn-primary" onClick={onRefresh}>
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  const totals = stats?.totals || {
    facilities: 0,
    inspections: 0,
    complaints: 0,
    open_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
    poor_facilities: 0,
  };

  const resolutionRate = totals.complaints > 0
    ? Math.round((totals.resolved_complaints / totals.complaints) * 100)
    : 100;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facility & Safety Overview</h1>
          <p className="page-subtitle">
            Real-time telemetry and operational aggregates from PostgreSQL 18 database.
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh Metrics
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenCreateFacility}>
            <Plus size={16} /> Add Facility
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigateTab('facilities')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Total Facilities</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Building2 size={22} />
            </div>
          </div>
          <div>
            <div className="kpi-val">{totals.facilities}</div>
            <div className="kpi-sub">
              {totals.poor_facilities > 0 ? (
                <span style={{ color: '#fb923c', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={14} /> {totals.poor_facilities} critical/poor condition
                </span>
              ) : (
                <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={14} /> All facilities operational
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('inspections')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Total Audits</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <ClipboardList size={22} />
            </div>
          </div>
          <div>
            <div className="kpi-val">{totals.inspections}</div>
            <div className="kpi-sub">
              <span>Safety & compliance audits completed</span>
            </div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('complaints')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Total Tickets</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <AlertCircle size={22} />
            </div>
          </div>
          <div>
            <div className="kpi-val">{totals.complaints}</div>
            <div className="kpi-sub">
              <span style={{ color: totals.open_complaints > 0 ? '#fbbf24' : '#34d399' }}>
                {totals.open_complaints} open, {totals.in_progress_complaints} active dispatch
              </span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Resolution Rate</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div>
            <div className="kpi-val">{resolutionRate}%</div>
            <div className="kpi-sub">
              <span style={{ color: '#34d399' }}>{totals.resolved_complaints} resolved tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Inspections & Complaints */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Inspections Panel */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <ClipboardList size={20} color="#34d399" />
              Recent Safety Audits
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                onClick={onOpenCreateInspection}
              >
                <Plus size={14} /> New Audit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => onNavigateTab('inspections')}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit #</th>
                  <th>Facility</th>
                  <th>Inspector</th>
                  <th>Score</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_inspections && stats.recent_inspections.length > 0 ? (
                  stats.recent_inspections.map((insp) => (
                    <tr
                      key={insp.id}
                      onClick={() => onSelectInspection(insp)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="code-pill">{insp.inspection_number}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{insp.facility?.name || `Facility #${insp.facility_id}`}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{insp.inspector?.name || 'Staff'}</td>
                      <td>
                        <div className="score-indicator">
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              color: insp.score >= 80 ? '#34d399' : insp.score >= 60 ? '#fbbf24' : '#f87171',
                            }}
                          >
                            {insp.score}
                          </span>
                          <div className="score-bar-bg">
                            <div
                              className="score-bar-fill"
                              style={{
                                width: `${insp.score}%`,
                                background: insp.score >= 80 ? '#10b981' : insp.score >= 60 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${insp.result}`}>{insp.result.replace('_', ' ')}</span>
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(insp.inspection_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                      No inspection records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Complaints Panel */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <AlertCircle size={20} color="#f87171" />
              Active Maintenance Tickets
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                onClick={onOpenCreateComplaint}
              >
                <Plus size={14} /> New Ticket
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => onNavigateTab('complaints')}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Facility</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_complaints && stats.recent_complaints.length > 0 ? (
                  stats.recent_complaints.map((comp) => (
                    <tr
                      key={comp.id}
                      onClick={() => onSelectComplaint(comp)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="code-pill">{comp.ticket_number}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{comp.facility?.name || `Facility #${comp.facility_id}`}</td>
                      <td style={{ color: '#ffffff' }}>
                        <div style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {comp.title}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${comp.severity}`}>{comp.severity}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${comp.status}`}>{comp.status.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                      No complaint records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
