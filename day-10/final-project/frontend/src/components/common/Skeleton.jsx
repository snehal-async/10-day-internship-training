import React from 'react';
export function Skeleton({ width = '100%', height = 18, borderRadius = 'var(--radius-sm)', className = '', style, }) {
    return (<div className={`skeleton ${className}`} style={{
            width,
            height,
            borderRadius,
            ...style,
        }} aria-hidden="true"/>);
}
export function TableSkeleton({ rows = 5, cols = 6 }) {
    return (<div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (<th key={i}>
                <Skeleton width={80} height={14}/>
              </th>))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (<tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (<td key={c}>
                  <Skeleton width={c === 0 ? '60%' : '80%'} height={16}/>
                </td>))}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
export function CardSkeleton() {
    return (<div className="kpi-card">
      <div className="kpi-top">
        <Skeleton width={100} height={14}/>
        <Skeleton width={38} height={38} borderRadius="var(--radius-md)"/>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton width={80} height={32}/>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton width={140} height={14}/>
      </div>
    </div>);
}
