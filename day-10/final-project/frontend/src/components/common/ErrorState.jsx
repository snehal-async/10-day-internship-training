import { AlertCircle, RefreshCw } from 'lucide-react';
export function ErrorState({ title = 'Failed to load telemetry data', message, onRetry, isRetrying = false, }) {
    return (<div className="error-state" role="alert">
      <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'var(--rose-100)',
            color: 'var(--rose-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        <AlertCircle size={22}/>
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rose-800)' }}>{title}</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--rose-700)', marginTop: '0.25rem' }}>{message}</p>
      </div>
      {onRetry && (<button className="btn btn-secondary btn-sm" onClick={onRetry} disabled={isRetrying} style={{ marginTop: '0.5rem', borderColor: 'var(--rose-200)', color: 'var(--rose-800)' }}>
          <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''}/>
          <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
        </button>)}
    </div>);
}
