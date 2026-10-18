import React, { useState } from 'react';
import { KeyRound, LogIn, LogOut, ShieldCheck, UserCheck, X } from 'lucide-react';
import type { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: AuthUser | null;
  isLoading: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  isLoading,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [email, setEmail] = useState('sarah.admin@enterprise.local');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onLogin(email, password);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check credentials.');
      }
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('sarah.admin@enterprise.local');
    setPassword('Password123!');
    setError(null);
    try {
      await onLogin('sarah.admin@enterprise.local', 'Password123!');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', width: 34, height: 34 }}>
              <ShieldCheck size={20} />
            </div>
            <h3 className="modal-title">API Authentication & Tokens</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <UserCheck size={26} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem' }}>{currentUser.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{currentUser.email}</p>
                <span className="badge badge-operational" style={{ marginTop: 6 }}>Role: {currentUser.role}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                You are currently authenticated with a bearer token. Mutation operations (create, update, delete) are permitted.
              </p>
              <button
                type="button"
                className="btn btn-danger"
                style={{ marginTop: '0.5rem' }}
                onClick={async () => {
                  await onLogout();
                  onClose();
                }}
                disabled={isLoading}
              >
                <LogOut size={16} /> Sign Out & Revoke Token
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Laravel API mutation endpoints (<code className="code-pill">POST</code>, <code className="code-pill">PUT</code>, <code className="code-pill">DELETE</code>) require a valid Sanctum Bearer token.
              </p>

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="auth_email">Email Address</label>
                <input
                  id="auth_email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" htmlFor="auth_password">Password</label>
                <input
                  id="auth_password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                  <LogIn size={16} /> {isLoading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div style={{ position: 'relative', textAlign: 'center', margin: '0.25rem 0' }}>
                  <span style={{ background: 'var(--bg-card-elevated)', padding: '0 8px', fontSize: '0.75rem', color: 'var(--text-dim)', position: 'relative', zIndex: 1 }}>
                    OR QUICK CONNECT
                  </span>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border-subtle)', zIndex: 0 }} />
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                  onClick={handleDemoAdmin}
                  disabled={isLoading}
                >
                  <KeyRound size={16} color="#818cf8" /> One-Click Sign In as Demo Admin
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
