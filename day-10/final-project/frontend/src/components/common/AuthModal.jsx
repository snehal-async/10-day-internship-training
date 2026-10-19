import React, { useState, useEffect, useRef } from 'react';
import { LogIn, UserPlus, Key, Mail, Lock, User, Shield, X, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { animateModalEntrance } from '../../utils/animations';

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setMode(initialMode);
      if (dialogRef.current) {
        animateModalEntrance(dialogRef.current);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  function switchMode(newMode) {
    setMode(newMode);
    setError(null);
  }

  function handleUseDemoCredentials() {
    setEmail('sarah.admin@enterprise.local');
    setPassword('Password123!');
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });
        onSuccess(res.user);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await api.login(email.trim(), password);
        onSuccess(res.user);
        onClose();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        ref={dialogRef}
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 460 }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 className="modal-title">
                {mode === 'login' ? 'Sign In to FacilityOps' : 'Create an Account'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {mode === 'login'
                  ? 'Access your facility management dashboard'
                  : 'Register a new account to manage operations'}
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 1.5rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              flex: 1,
              borderRadius: '6px 6px 0 0',
              justifyContent: 'center',
              fontWeight: 600,
            }}
            onClick={() => switchMode('login')}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              flex: 1,
              borderRadius: '6px 6px 0 0',
              justifyContent: 'center',
              fontWeight: 600,
            }}
            onClick={() => switchMode('register')}
          >
            <UserPlus size={14} />
            <span>Create Account</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--rose-50)',
                  border: '1px solid var(--rose-200)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--rose-700)',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div>{error}</div>
                  {mode === 'login' && error.toLowerCase().includes('invalid') && (
                    <div style={{ marginTop: '0.35rem', fontSize: '0.75rem' }}>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('register')}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          color: 'var(--primary-700)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Click here to create a new account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-name">
                    Full Name <span style={{ color: 'var(--rose-500)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.25rem' }}
                      placeholder="e.g. Snehal Solanke"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="auth-role">
                    Account Role
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Shield
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <select
                      id="auth-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.25rem' }}
                    >
                      <option value="staff">Facility Operations Staff</option>
                      <option value="manager">Operations Manager</option>
                      <option value="inspector">Certified Safety Inspector</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                Email Address <span style={{ color: 'var(--rose-500)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                Password <span style={{ color: 'var(--rose-500)' }}>*</span>
                {mode === 'register' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    (min 8 characters)
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={mode === 'register' ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Confirm Password (Registration Only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-confirm-password">
                  Confirm Password <span style={{ color: 'var(--rose-500)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    id="auth-confirm-password"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.25rem' }}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            )}

            {/* Sign In Mode Helper: Demo Credentials */}
            {mode === 'login' && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Key size={13} /> Demo Administrator Account:
                  </div>
                  <div style={{ marginTop: '0.2rem' }}>sarah.admin@enterprise.local</div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem' }}
                  onClick={handleUseDemoCredentials}
                >
                  Use Demo
                </button>
              </div>
            )}

            {/* Switch Mode Prompt */}
            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--primary-600)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Sign up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--primary-600)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? mode === 'register'
                  ? 'Creating Account...'
                  : 'Authenticating...'
                : mode === 'register'
                ? 'Create Account & Sign In'
                : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
