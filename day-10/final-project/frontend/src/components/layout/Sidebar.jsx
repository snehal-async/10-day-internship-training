import { LayoutDashboard, Building2, ClipboardCheck, AlertTriangle, Layers, ChevronLeft, ChevronRight, ShieldCheck, } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile, isOnline, openComplaintsCount, }) {
    const location = useLocation();
    const navigate = useNavigate();
    function handleNavigate(path) {
        navigate(path);
        onCloseMobile();
    }
    const currentPath = location.pathname;
    return (<>
      {mobileOpen && (<div className="sidebar-backdrop" onClick={onCloseMobile} style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                zIndex: 35,
            }} aria-hidden="true"/>)}

      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="sidebar-brand" style={{ cursor: 'pointer' }} onClick={() => handleNavigate('/')}>
            <div className="brand-icon-wrapper">
              <Building2 size={20} strokeWidth={2.5}/>
            </div>
            {!collapsed && (<div className="brand-title">
                FacilityOps
              </div>)}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onToggleCollapse} style={{ color: 'var(--navy-text-muted)', padding: '0.35rem' }} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-title">Core Management</div>}

          <button className={`nav-item ${currentPath === '/' ? 'active' : ''}`} onClick={() => handleNavigate('/')} title="Dashboard Overview">
            <LayoutDashboard size={18}/>
            {!collapsed && <span>Dashboard Overview</span>}
          </button>

          <button className={`nav-item ${currentPath.startsWith('/facilities') ? 'active' : ''}`} onClick={() => handleNavigate('/facilities')} title="Facilities Inventory">
            <Building2 size={18}/>
            {!collapsed && <span>Facilities Directory</span>}
          </button>

          <button className={`nav-item ${currentPath.startsWith('/inspections') ? 'active' : ''}`} onClick={() => handleNavigate('/inspections')} title="Audits & Inspections">
            <ClipboardCheck size={18}/>
            {!collapsed && <span>Audits & Inspections</span>}
          </button>

          <button className={`nav-item ${currentPath.startsWith('/complaints') ? 'active' : ''}`} onClick={() => handleNavigate('/complaints')} title="Maintenance & Issues">
            <AlertTriangle size={18}/>
            {!collapsed && (<>
                <span>Maintenance Issues</span>
                {openComplaintsCount > 0 && (<span className="nav-item-badge warning">{openComplaintsCount}</span>)}
              </>)}
          </button>

          {!collapsed && <div className="nav-section-title" style={{ marginTop: '0.75rem' }}>Modules</div>}

          <button className={`nav-item ${currentPath.startsWith('/angular-inspection') ? 'active' : ''}`} onClick={() => handleNavigate('/angular-inspection')} title="Field Inspection Module">
            <Layers size={18}/>
            {!collapsed && <span>Field Inspections</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`status-dot ${isOnline ? '' : 'offline'}`} />
                <span style={{ color: 'var(--navy-text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
                  {isOnline ? 'System Operational' : 'Offline Mode'}
                </span>
              </div>
              <span style={{ color: 'var(--navy-text-muted)', fontSize: '0.6875rem', opacity: 0.6 }}>v1.0</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span className={`status-dot ${isOnline ? '' : 'offline'}`} title={isOnline ? 'System Operational' : 'Offline Mode'} />
            </div>
          )}
        </div>
      </aside>
    </>);
}
