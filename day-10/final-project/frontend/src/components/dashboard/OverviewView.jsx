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
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Aggregating telemetry from FacilityOps database...</p>
        </div>
      </div>);
    }
    const totals = stats?.totals || {
        facilities: 0,
        inspections: 0,
        complaints: 0,
        open_complaints: 0,
        in_progress_complaints: 0,
        resolved_complaints: 0,
        poor_facilities: 0,
        compliance_rate: 87.5,
        avg_inspection_score: 83.2,
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
            Executive Facility Operations
          </h1>
          <p className="page-subtitle">
            Real-time compliance monitoring, statutory audit telemetry, and maintenance issue tracking.
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
        <StatCard label="Managed Facilities" value={totals.facilities} icon={<Building2 size={20}/>} iconBg="var(--primary-50)" iconColor="var(--primary-600)" trend={{ value: '+2', isPositive: true, label: 'added this quarter' }}/>

        <StatCard label="Statutory Audits" value={totals.inspections} icon={<ClipboardCheck size={20}/>} iconBg="var(--emerald-50)" iconColor="var(--emerald-600)" trend={{ value: `${totals.compliance_rate || 87.5}%`, isPositive: true, label: 'compliance pass rate' }}/>

        <StatCard label="Open Maintenance Issues" value={totals.open_complaints} icon={<AlertTriangle size={20}/>} iconBg={totals.open_complaints > 0 ? 'var(--amber-50)' : 'var(--emerald-50)'} iconColor={totals.open_complaints > 0 ? 'var(--amber-600)' : 'var(--emerald-600)'} trend={{
            value: `${totals.in_progress_complaints} in-prog`,
            isPositive: totals.open_complaints <= 2,
            label: `of ${totals.complaints} total tickets`,
        }}/>

        <StatCard label="Average Audit Score" value={`${totals.avg_inspection_score || 83.2}%`} icon={<CheckCircle2 size={20}/>} iconBg="var(--blue-50)" iconColor="var(--blue-600)" trend={{ value: '+1.4%', isPositive: true, label: 'cycle-over-cycle' }}/>
      </div>

      {/* Production Recharts Visualizations */}
      <DashboardCharts facilities={facilities} complaints={complaints} inspectionTrends={trends}/>

      {/* Analytics Row: Inspection Trends Chart + Facility Status Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {/* Inspection Trends Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Inspection & Compliance Trajectory</h2>
              <p className="card-subtitle">Monthly audit throughput and verified pass volume</p>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button className={`btn btn-sm ${activeTrendMetric === 'volume' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTrendMetric('volume')}>
                Volume
              </button>
              <button className={`btn btn-sm ${activeTrendMetric === 'score' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTrendMetric('score')}>
                Avg Score
              </button>
            </div>
          </div>
          <div className="card-body">
            {/* SVG Inspection Trend Chart */}
            <div style={{ width: '100%', height: 210, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 210" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Horizontal reference lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="var(--border-subtle)" strokeDasharray="3 3"/>
                <line x1="0" y1="90" x2="600" y2="90" stroke="var(--border-subtle)" strokeDasharray="3 3"/>
                <line x1="0" y1="140" x2="600" y2="140" stroke="var(--border-subtle)" strokeDasharray="3 3"/>
                <line x1="0" y1="190" x2="600" y2="190" stroke="var(--border-subtle)"/>

                {trends.map((item, index) => {
            const x = 50 + index * 95;
            const maxVal = activeTrendMetric === 'volume' ? 12 : 100;
            const currentVal = activeTrendMetric === 'volume' ? item.total : item.avgScore;
            const passedVal = activeTrendMetric === 'volume' ? item.passed : 0;
            const barHeight = (currentVal / maxVal) * 140;
            const passedBarHeight = (passedVal / maxVal) * 140;
            const y = 190 - barHeight;
            const passedY = 190 - passedBarHeight;
            return (<g key={item.month}>
                      {/* Total Volume Bar */}
                      <rect x={x - 18} y={y} width={36} height={barHeight} rx={4} fill={activeTrendMetric === 'volume' ? 'var(--primary-100)' : 'var(--blue-100)'}/>
                      {/* Passed Audits Layer */}
                      {activeTrendMetric === 'volume' && (<rect x={x - 18} y={passedY} width={36} height={passedBarHeight} rx={4} fill="var(--primary-600)"/>)}
                      {/* Value label */}
                      <text x={x} y={y - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                        {activeTrendMetric === 'volume' ? item.total : `${item.avgScore}%`}
                      </text>
                      {/* Month label */}
                      <text x={x} y={208} textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--text-muted)">
                        {item.month.split(' ')[0]}
                      </text>
                    </g>);
        })}
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 12, height: 12, backgroundColor: 'var(--primary-600)', borderRadius: 2 }}/>
                <span>Passed Audits</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 12, height: 12, backgroundColor: 'var(--primary-100)', borderRadius: 2 }}/>
                <span>Total Conducted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Facility Operational Breakdown Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Facility Infrastructure Breakdown</h2>
              <p className="card-subtitle">Real-time distribution of physical assets</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateTab('facilities')}>
              <span>View All</span>
              <ArrowRight size={14}/>
            </button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Visual multi-segment bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                <span>Asset Availability Index</span>
                <span style={{ color: 'var(--emerald-600)' }}>{opPct}% Fully Operational</span>
              </div>
              <div style={{ height: 16, width: '100%', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', backgroundColor: 'var(--border-subtle)' }}>
                <div style={{ width: `${opPct}%`, backgroundColor: 'var(--emerald-600)' }} title={`Operational: ${statusDist.operational}`}/>
                <div style={{ width: `${maintPct}%`, backgroundColor: 'var(--amber-500)' }} title={`Under Maintenance: ${statusDist.under_maintenance}`}/>
                <div style={{ width: `${closedPct}%`, backgroundColor: 'var(--rose-500)' }} title={`Closed: ${statusDist.closed}`}/>
              </div>
            </div>

            {/* Status Legend & Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--emerald-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--emerald-200)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--emerald-800)', fontWeight: 600 }}>Operational</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-800)', marginTop: '0.25rem' }}>
                  {statusDist.operational}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--emerald-700)' }}>Full clearance</div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--amber-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-200)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--amber-800)', fontWeight: 600 }}>Maintenance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-800)', marginTop: '0.25rem' }}>
                  {statusDist.under_maintenance}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--amber-700)' }}>Work ongoing</div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--rose-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--rose-200)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rose-800)', fontWeight: 600 }}>Critical / Off</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rose-800)', marginTop: '0.25rem' }}>
                  {statusDist.closed}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--rose-700)' }}>Remediation req.</div>
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Facilities flagged poor/critical rating:</span>
              <span style={{ fontWeight: 700, color: totals.poor_facilities > 0 ? 'var(--rose-600)' : 'var(--emerald-600)' }}>
                {totals.poor_facilities} {totals.poor_facilities === 1 ? 'Site' : 'Sites'}
              </span>
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
              <h2 className="card-title">Recent Statutory Audits</h2>
              <p className="card-subtitle">Latest compliance evaluations by certified inspectors</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateTab('inspections')}>
              <span>View History</span>
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
                            {ins.facility_name || `Facility #${ins.facility_id}`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span className="badge-code">{ins.inspection_code}</span>
                            <span>• {ins.inspection_date}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {ins.inspector_name || 'Inspector'}
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
                          <OutcomeBadge outcome={ins.outcome}/>
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
              <h2 className="card-title">Maintenance Tickets Requiring Attention</h2>
              <p className="card-subtitle">Active open & high-priority work orders</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigateTab('complaints')}>
              <span>All Tickets</span>
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
                            {comp.facility_name || `Facility #${comp.facility_id}`} • {comp.category}
                          </div>
                        </td>
                        <td>
                          <PriorityBadge priority={comp.priority}/>
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
