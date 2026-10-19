import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Key, Mail, Lock, X } from 'lucide-react';
import { api } from '../../services/api';
import { animateModalEntrance } from '../../utils/animations';
export function AuthModal({ isOpen, onClose, onSuccess }) {
    const [email, setEmail] = useState('sarah.admin@enterprise.local');
    const [password, setPassword] = useState('Password123!');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            animateModalEntrance(dialogRef.current);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.login(email, password);
            onSuccess(res.user);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        }
        finally {
            setLoading(false);
        }
    }
    return (<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div ref={dialogRef} className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <LogIn size={18}/>
            </div>
            <div>
              <h3 className="modal-title">Sign In to FacilityOps</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Access elevated management & mutation rights
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (<div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--rose-50)',
                border: '1px solid var(--rose-200)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--rose-700)',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
            }}>
                {error}
              </div>)}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
        }}/>
                <input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="admin@facilityops.io"/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
        }}/>
                <input id="auth-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="••••••••••••"/>
              </div>
            </div>

            <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
        }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                <Key size={13}/> Administrator Account:
              </div>
              Email: <code>sarah.admin@enterprise.local</code> | Password: <code>Password123!</code>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
