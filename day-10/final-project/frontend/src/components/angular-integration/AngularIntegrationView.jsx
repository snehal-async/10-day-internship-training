import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, ArrowRight, Server, } from 'lucide-react';
import { api } from '../../services/api';
export function AngularIntegrationView() {
    const [apiStatus, setApiStatus] = useState(null);
    const [testingEndpoint, setTestingEndpoint] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    useEffect(() => {
        checkConnection();
    }, []);
    async function checkConnection() {
        setTestingEndpoint(true);
        const res = await api.checkBackendHealth();
        setApiStatus(res);
        setTestingEndpoint(false);
    }
    return (<div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Cross-Framework Angular 22 Integration
          </h1>
          <p className="page-subtitle">
            Harmonized enterprise design system bridging the Day 9 Angular client with the Day 8 Laravel/PostgreSQL API
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={checkConnection} disabled={testingEndpoint}>
            <RefreshCw size={15} className={testingEndpoint ? 'animate-spin' : ''}/>
            <span>Probe API Health</span>
          </button>
          <a href="http://localhost:4200" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <span>Launch Angular Hub</span>
            <ExternalLink size={15}/>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <button className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('overview')} style={{ borderRadius: '6px 6px 0 0' }}>
          Integration Overview
        </button>
        <button className={`btn btn-sm ${activeTab === 'api-explorer' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('api-explorer')} style={{ borderRadius: '6px 6px 0 0' }}>
          Shared REST API Contract
        </button>
        <button className={`btn btn-sm ${activeTab === 'architecture' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('architecture')} style={{ borderRadius: '6px 6px 0 0' }}>
          Design System & Architecture
        </button>
      </div>

      {activeTab === 'overview' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Alert Banner */}
          <div className="card" style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: apiStatus?.online ? 'var(--emerald-50)' : 'var(--blue-50)',
                borderColor: apiStatus?.online ? 'var(--emerald-200)' : 'var(--blue-200)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: apiStatus?.online ? 'var(--emerald-600)' : 'var(--primary-600)',
                boxShadow: 'var(--shadow-xs)',
            }}>
                  <Server size={22}/>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Backend REST Gateway: {apiStatus?.online ? 'Online & Synchronized' : 'Dual-Mode Demo Fallback'}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {apiStatus?.message || 'Probing Laravel 11 at http://localhost:8000/api...'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge-code" style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem' }}>
                  Target: http://localhost:8000/api
                </span>
              </div>
            </div>
          </div>

          {/* Integration Specs Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Day 9 Angular 22 Client</h3>
                  <p className="card-subtitle">Standalone component architecture with strict TypeScript</p>
                </div>
                <span className="badge badge-info">Angular 22.2</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <p>
                  Built with <strong>zoneless-ready signals</strong>, <strong>Reactive Forms</strong> with real-time audit score calculation, and <strong>RxJS Observables</strong>.
                </p>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem' }}>
                  <code>src/app/pages/facilities/</code> — Interactive facility catalog<br />
                  <code>src/app/pages/inspections/</code> — Reactive statutory audit form<br />
                  <code>src/app/core/services/api.service.ts</code> — Dual-mode HTTP service
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <a href="http://localhost:4200/facilities" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    <span>View Angular Facilities Page</span>
                    <ArrowRight size={13}/>
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Day 8 Laravel 11 Backend</h3>
                  <p className="card-subtitle">Eloquent ORM with PostgreSQL 18 & ACID transaction suite</p>
                </div>
                <span className="badge badge-success">Laravel 11.57</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <p>
                  Serves 20 versioned REST API routes for facilities, inspections, complaints, authentication, and stats.
                </p>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem' }}>
                  <code>GET /api/stats</code> — Aggregated telemetry & metrics<br />
                  <code>GET /api/facilities</code> — Searchable asset listings<br />
                  <code>POST /api/inspections</code> — Validated audit creation<br />
                  <code>PUT /api/complaints/:id</code> — Work order lifecycle
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    27 Feature tests passing with 105 automated assertions.
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Day 10 Unified Design System</h3>
                  <p className="card-subtitle">Standardized tokens across React & Angular</p>
                </div>
                <span className="badge badge-neutral">FacilityOps DS</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <p>
                  Cohesive visual language: <strong>Deep Navy</strong> navigation, <strong>Warm Neutral #F8FAFC</strong> canvas, and <strong>Indigo #4F46E5</strong> primary accent.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div style={{ height: 32, backgroundColor: 'var(--navy-900)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.625rem', fontWeight: 700 }}>
                    #0F172A
                  </div>
                  <div style={{ height: 32, backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700 }}>
                    #F8FAFC
                  </div>
                  <div style={{ height: 32, backgroundColor: 'var(--primary-600)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.625rem', fontWeight: 700 }}>
                    #4F46E5
                  </div>
                  <div style={{ height: 32, backgroundColor: 'var(--emerald-600)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.625rem', fontWeight: 700 }}>
                    #059669
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Both frontends render semantic HTML5, accessible ARIA states, and consistent typography.
                </div>
              </div>
            </div>
          </div>
        </div>)}

      {activeTab === 'api-explorer' && (<div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Shared REST API Endpoint Directory</h3>
              <p className="card-subtitle">Common contract consumed by both React and Angular frontends</p>
            </div>
            <span className="badge-code">v1.0.0</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Route Path</th>
                    <th>Description</th>
                    <th>Auth Requirement</th>
                    <th>Shared By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-info" style={{ fontWeight: 700 }}>GET</span></td>
                    <td><code>/api/health</code></td>
                    <td>Probes system availability, framework version & database status</td>
                    <td><span className="badge badge-neutral">Public</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info" style={{ fontWeight: 700 }}>GET</span></td>
                    <td><code>/api/stats</code></td>
                    <td>Aggregated counts, recent inspections, and active work orders</td>
                    <td><span className="badge badge-neutral">Public</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info" style={{ fontWeight: 700 }}>GET</span></td>
                    <td><code>/api/facilities</code></td>
                    <td>Paginated and filtered facility asset catalog</td>
                    <td><span className="badge badge-neutral">Public</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info" style={{ fontWeight: 700 }}>GET</span></td>
                    <td><code>/api/facilities/:id</code></td>
                    <td>Deep asset profile with historical inspections and linked issues</td>
                    <td><span className="badge badge-neutral">Public</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success" style={{ fontWeight: 700 }}>POST</span></td>
                    <td><code>/api/facilities</code></td>
                    <td>Create new facility asset (validated Form Request)</td>
                    <td><span className="badge badge-warning">Bearer Token</span></td>
                    <td>React Dashboard</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info" style={{ fontWeight: 700 }}>GET</span></td>
                    <td><code>/api/inspections</code></td>
                    <td>List all statutory compliance audits with filters</td>
                    <td><span className="badge badge-neutral">Public</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success" style={{ fontWeight: 700 }}>POST</span></td>
                    <td><code>/api/inspections</code></td>
                    <td>Submit certified audit with compliance score calculation</td>
                    <td><span className="badge badge-warning">Bearer Token</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info" style={{ fontWeight: 700 }}>GET</span></td>
                    <td><code>/api/complaints</code></td>
                    <td>List maintenance work orders by priority and status</td>
                    <td><span className="badge badge-neutral">Public</span></td>
                    <td>React & Angular</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-warning" style={{ fontWeight: 700 }}>PUT</span></td>
                    <td><code>/api/complaints/:id</code></td>
                    <td>Update issue lifecycle status and record resolution findings</td>
                    <td><span className="badge badge-warning">Bearer Token</span></td>
                    <td>React Dashboard</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>)}

      {activeTab === 'architecture' && (<div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Production Design System Guidelines</h3>
              <p className="card-subtitle">Enterprise conventions and token hierarchy</p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <p>
              To avoid generic AI-generated aesthetics, FacilityOps enforces commercial-grade enterprise design principles:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Deep Navy Sidebar (<code>#0F172A</code>)</strong>: Provides authority and grounding, with high-contrast icons and subtle active left-border accents.
              </li>
              <li>
                <strong>Warm Off-White Canvas (<code>#F8FAFC</code>)</strong>: Prevents pure-white glare and eye fatigue during prolonged operational shifts.
              </li>
              <li>
                <strong>Restrained Violet/Blue Accent (<code>#4F46E5</code>)</strong>: Used purposefully for primary dispatch actions, tab highlights, and focus rings.
              </li>
              <li>
                <strong>Crisp Typography</strong>: Inter / Plus Jakarta Sans at standard 14px body and tabular numerals for compliance scores and capacity metrics.
              </li>
              <li>
                <strong>Subtle Elevation</strong>: Flat 1px border structure (<code>#E2E8F0</code>) with minimal 2-4px drop shadows instead of oversized fuzzy blur cards.
              </li>
              <li>
                <strong>Semantic Color Discipline</strong>: Emerald strictly reserved for operational/passed states; amber for maintenance/caution; rose for critical/failed states.
              </li>
            </ul>
          </div>
        </div>)}
    </div>);
}
