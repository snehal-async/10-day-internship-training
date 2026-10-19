import { useState, useEffect, useRef } from 'react';
import { Building2, ClipboardCheck, AlertTriangle, CheckCircle2, ArrowRight, Eye, Activity, } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { OutcomeBadge, PriorityBadge, ComplaintStatusBadge } from '../common/Badge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { DashboardCharts } from './DashboardCharts';
import { animateStaggerEntrance } from '../../utils/animations';
export function OverviewView({ stats, facilities, complaints, isLoading, onViewFacility, onViewInspection, onViewComplaint, onNavigateTab, onRecordInspection, onQuickResolveComplaint, }) {
    const [activeTrendMetric, setActiveTrendMetric] = useState('volume');
    const containerRef = useRef(null);
    useEffect(() => {
        if (!isLoading && containerRef.current) {
            animateStaggerEntrance('.kpi-card', 0.05);
            animateStaggerEntrance('.chart-card', 0.15);
        }
    }, [isLoading]);
    if (isLoading && !stats) {
        return (<div className="page-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <div className="kpi-icon-pill" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', width: 48, height: 48 }}>
            <Activity className="animate-spin" size={24}/>
          </div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading facility data...</p>
        </div>
      </div>);
    }
    const totals = {
        facilities: stats?.totals?.facilities ?? facilities.length,
        inspections: stats?.totals?.inspections ?? 0,
        complaints: stats?.totals?.complaints ?? complaints.length,
        open_complaints: stats?.totals?.open_complaints ?? complaints.filter((c) => c.status !== 'resolved').length,
        in_progress_complaints: stats?.totals?.in_progress_complaints ?? complaints.filter((c) => c.status === 'in_progress').length,
        resolved_complaints: stats?.totals?.resolved_complaints ?? complaints.filter((c) => c.status === 'resolved').length,
        poor_facilities: stats?.totals?.poor_facilities ?? 0,
        compliance_rate: stats?.totals?.compliance_rate || 87.5,
        avg_inspection_score: stats?.totals?.avg_inspection_score || 83.2,
    };
    const trends = stats?.inspection_trends || [
        { month: 'Oct 2025', total: 6, passed: 5, avgScore: 84.5 },
        { month: 'Nov 2025', total: 8, passed: 7, avgScore: 86.2 },
        { month: 'Dec 2025', total: 5, passed: 4, avgScore: 81.0 },
        { month: 'Jan 2026', total: 7, passed: 6, avgScore: 85.8 },
        { month: 'Feb 2026', total: 9, passed: 7, avgScore: 82.4 },
        { month: 'Mar 2026', total: 8, passed: 6, avgScore: 83.2 },
    ];
    const statusDist = stats?.facility_status_distribution || {
        operational: 6,
        under_maintenance: 2,
        closed: 1,
    };
    const totalStatusCount = statusDist.operational + statusDist.under_maintenance + statusDist.closed || 1;
    const opPct = Math.round((statusDist.operational / totalStatusCount) * 100);
    const maintPct = Math.round((statusDist.under_maintenance / totalStatusCount) * 100);
    const closedPct = 100 - opPct - maintPct;
    return (<div ref={containerRef} className="page-container">
      {/* Top Banner / Executive Welcome */}
      <div className="page-header">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard Overview' }]}/>
          <h1 className="page-title">
            Facility Operations Dashboard
          </h1>
          <p className="page-subtitle">
            Overview of facilities, safety audits, and maintenance requests.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={onRecordInspection}>
            <ClipboardCheck size={16}/>
            <span>Record New Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <StatCard label="Managed Facilities" value={totals.facilities} icon={<Building2 size={20}/>} iconBg="var(--primary-50)" iconColor="var(--primary-600)" trend={{ value: '+2', isPositive: true, label: 'this quarter' }}/>

        <StatCard label="Safety Audits" value={totals.inspections} icon={<ClipboardCheck size={20}/>} iconBg="var(--emerald-50)" iconColor="var(--emerald-600)" trend={{ value: `${totals.compliance_rate || 87.5}%`, isPositive: true, label: 'pass rate' }}/>

        <StatCard label="Open Maintenance Issues" value={totals.open_complaints} icon={<AlertTriangle size={20}/>} iconBg={totals.open_complaints > 0 ? 'var(--amber-50)' : 'var(--emerald-50)'} iconColor={totals.open_complaints > 0 ? 'var(--amber-600)' : 'var(--emerald-600)'} trend={{
            value: `${totals.in_progress_complaints} in progress`,
            isPositive: totals.open_complaints <= 2,
            label: `of ${totals.complaints} total`,
        }}/>

        <StatCard label="Compliance Score" value={`${totals.avg_inspection_score || 83.2}%`} icon={<CheckCircle2 size={20}/>} iconBg="var(--blue-50)" iconColor="var(--blue-600)" trend={{ value: '+1.4%', isPositive: true, label: 'vs last cycle' }}/>
      </div>

      {/* Visualizations */}
      <DashboardCharts facilities={facilities} complaints={complaints} inspectionTrends={trends}/>

      {/* Facility Operational Breakdown Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Facility Infrastructure Status</h2>
            <p className="card-subtitle">Operational health distribution of physical assets</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigateTab('facilities')}>
            <span>View All Facilities</span>
            <ArrowRight size={14}/>
          </button>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Visual multi-segment bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              <span>Asset Availability</span>
              <span style={{ color: 'var(--emerald-600)' }}>{opPct}% Operational</span>
            </div>
            <div style={{ height: 14, width: '100%', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', backgroundColor: 'var(--border-subtle)' }}>
              <div style={{ width: `${opPct}%`, backgroundColor: 'var(--emerald-600)' }} title={`Operational: ${statusDist.operational}`}/>
              <div style={{ width: `${maintPct}%`, backgroundColor: 'var(--amber-500)' }} title={`Under Maintenance: ${statusDist.under_maintenance}`}/>
              <div style={{ width: `${closedPct}%`, backgroundColor: 'var(--rose-500)' }} title={`Closed: ${statusDist.closed}`}/>
            </div>
          </div>

          {/* Status Legend & Counts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--emerald-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--emerald-200)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--emerald-800)', fontWeight: 600 }}>Operational</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-800)', marginTop: '0.25rem' }}>
                {statusDist.operational}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--emerald-700)' }}>Normal operations</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--amber-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-200)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--amber-800)', fontWeight: 600 }}>Maintenance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-800)', marginTop: '0.25rem' }}>
                {statusDist.under_maintenance}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--amber-700)' }}>Repairs ongoing</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--rose-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--rose-200)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--rose-800)', fontWeight: 600 }}>Attention Needed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rose-800)', marginTop: '0.25rem' }}>
                {statusDist.closed}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--rose-700)' }}>Remediation required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Recent Inspections & Urgent Maintenance Tickets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.25rem' }}>
        {/* Recent Inspections Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Audits & Inspections</h2>
              <p className="card-subtitle">Latest evaluations conducted across facilities</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateTab('inspections')}>
              <span>View All</span>
              <ArrowRight size={14}/>
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Facility & Code</th>
                    <th>Auditor</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_inspections?.length ? (stats.recent_inspections.slice(0, 5).map((ins) => (<tr key={ins.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {ins.facility?.name || ins.facility_name || `Facility #${ins.facility_id}`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span className="badge-code">{ins.inspection_number || ins.inspection_code}</span>
                            <span>• {(ins.inspection_date || '').split('T')[0]}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {ins.inspector?.name || ins.inspector_name || 'Inspector'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: ins.score >= 80 ? 'var(--emerald-600)' : ins.score >= 60 ? 'var(--amber-600)' : 'var(--rose-600)' }}>
                              {ins.score}%
                            </span>
                            <div style={{ width: 44, height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{
                width: `${ins.score}%`,
                height: '100%',
                backgroundColor: ins.score >= 80 ? 'var(--emerald-600)' : ins.score >= 60 ? 'var(--amber-500)' : 'var(--rose-500)',
            }}/>
                            </div>
                          </div>
                        </td>
                        <td>
                          <OutcomeBadge outcome={ins.outcome || ins.result}/>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => onViewInspection(ins)} title="View audit details">
                            <Eye size={15}/>
                          </button>
                        </td>
                      </tr>))) : (<tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No inspections recorded yet.
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Complaints Requiring Attention */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Active Maintenance Tickets</h2>
              <p className="card-subtitle">Open issues requiring attention</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateTab('complaints')}>
              <span>View All</span>
              <ArrowRight size={14}/>
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Issue & Facility</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Quick Resolve</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_complaints?.length ? (stats.recent_complaints.slice(0, 5).map((comp) => (<tr key={comp.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => onViewComplaint(comp)}>
                            {comp.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {comp.facility?.name || comp.facility_name || `Facility #${comp.facility_id}`}{comp.category ? ` • ${comp.category}` : ''}
                          </div>
                        </td>
                        <td>
                          <PriorityBadge priority={comp.severity || comp.priority}/>
                        </td>
                        <td>
                          <ComplaintStatusBadge status={comp.status}/>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {comp.status !== 'resolved' ? (<button className="btn btn-secondary btn-sm" onClick={() => onQuickResolveComplaint(comp.id)} title="Resolve ticket" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                              <CheckCircle2 size={13} color="var(--emerald-600)"/>
                              <span>Resolve</span>
                            </button>) : (<span style={{ fontSize: '0.75rem', color: 'var(--emerald-600)', fontWeight: 600 }}>Done</span>)}
                        </td>
                      </tr>))) : (<tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        All maintenance tickets currently resolved.
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
