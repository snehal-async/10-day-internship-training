import { useState } from 'react';
import { Menu, Search, Plus, RefreshCw, LogIn, LogOut, Building2, ClipboardCheck, AlertTriangle, ChevronDown, } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
export function TopHeader({ onToggleMobileSidebar, searchQuery, onSearchChange, isOnline, onRefresh, isRefreshing, currentUser, onOpenAuth, onLogout, onQuickAction, }) {
    const [showQuickMenu, setShowQuickMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    return (<header className="app-header">
      <div className="header-left">
        <button className="btn btn-ghost btn-sm d-lg-none" onClick={onToggleMobileSidebar} aria-label="Toggle navigation menu" style={{ padding: '0.4rem' }}>
          <Menu size={20}/>
        </button>

        <div className="header-search">
          <Search size={16} className="header-search-icon"/>
          <input type="text" placeholder="Search facilities, audits, or issues..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} aria-label="Global search input"/>
        </div>
      </div>

      <div className="header-right">
        {/* System Status Indicator */}
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: isOnline ? 'var(--emerald-700)' : 'var(--amber-700)',
            backgroundColor: isOnline ? 'var(--emerald-50)' : 'var(--amber-50)',
            border: `1px solid ${isOnline ? 'var(--emerald-200)' : 'var(--amber-200)'}`,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isOnline ? 'var(--emerald-600)' : 'var(--amber-600)',
            boxShadow: isOnline ? '0 0 0 2px rgba(16, 185, 129, 0.3)' : '0 0 0 2px rgba(245, 158, 11, 0.3)',
        }}/>
          {isOnline ? 'Online' : 'Offline'}
        </div>

        {/* Refresh button */}
        <button className="btn btn-secondary btn-icon" onClick={onRefresh} disabled={isRefreshing} title="Sync & refresh data" aria-label="Refresh data">
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''}/>
        </button>

        {/* Dark/Light Mode Switcher */}
        <ThemeToggle />

        {/* Quick Action Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setShowQuickMenu(!showQuickMenu)} aria-haspopup="true" aria-expanded={showQuickMenu}>
            <Plus size={16}/>
            <span>New Action</span>
            <ChevronDown size={14}/>
          </button>

          {showQuickMenu && (<>
              <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={() => setShowQuickMenu(false)}/>
              <div className="header-dropdown-menu" style={{ width: 220 }}>
                <button className="header-dropdown-item" onClick={() => {
                onQuickAction('inspection');
                setShowQuickMenu(false);
            }}>
                  <ClipboardCheck size={16} color="var(--primary-600)"/>
                  <span>Record Audit</span>
                </button>
                <button className="header-dropdown-item" onClick={() => {
                onQuickAction('facility');
                setShowQuickMenu(false);
            }}>
                  <Building2 size={16} color="var(--primary-600)"/>
                  <span>Register Facility</span>
                </button>
                <button className="header-dropdown-item" onClick={() => {
                onQuickAction('complaint');
                setShowQuickMenu(false);
            }}>
                  <AlertTriangle size={16} color="var(--amber-600)"/>
                  <span>Log Work Order</span>
                </button>
              </div>
            </>)}
        </div>

        {/* User profile / Auth button */}
        {currentUser ? (<div style={{ position: 'relative' }}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem', gap: '0.5rem' }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
            }}>
                {currentUser.name.charAt(0)}
              </div>
              <span style={{ fontWeight: 600, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <span style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                padding: '0.1rem 0.35rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                fontWeight: 700,
            }}>
                {currentUser.role}
              </span>
            </button>

            {showUserMenu && (<>
                <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={() => setShowUserMenu(false)}/>
                <div className="header-dropdown-menu" style={{ width: 230 }}>
                  <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  </div>
                  <button className="header-dropdown-item" style={{ color: 'var(--rose-600)', marginTop: '0.25rem' }} onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                }}>
                    <LogOut size={16}/>
                    <span>Sign Out</span>
                  </button>
                </div>
              </>)}
          </div>) : (<button className="btn btn-secondary btn-sm" onClick={onOpenAuth}>
            <LogIn size={15}/>
            <span>Sign In</span>
          </button>)}
      </div>
    </header>);
}
