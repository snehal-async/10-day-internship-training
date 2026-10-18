import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
export function StatCard({ label, value, icon, iconBg = 'var(--primary-50)', iconColor = 'var(--primary-600)', trend, subtext, }) {
    return (<div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon-pill" style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-meta">
        {trend && (<span className={`kpi-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? (<ArrowUpRight size={14} strokeWidth={2.5}/>) : (<ArrowDownRight size={14} strokeWidth={2.5}/>)}
            {trend.value}
          </span>)}
        <span>{trend?.label || subtext || 'vs. previous cycle'}</span>
      </div>
    </div>);
}
