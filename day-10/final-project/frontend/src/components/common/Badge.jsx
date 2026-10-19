import React from 'react';
export function Badge({ variant = 'neutral', children, icon, className = '' }) {
    return (<span className={`badge badge-${variant} ${className}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>);
}
export function FacilityStatusBadge({ status }) {
    switch (status) {
        case 'operational':
            return <Badge variant="success">Operational</Badge>;
        case 'under_maintenance':
            return <Badge variant="warning">Under Maintenance</Badge>;
        case 'closed':
            return <Badge variant="danger">Decommissioned</Badge>;
        default:
            return <Badge variant="neutral">{status}</Badge>;
    }
}
export function ConditionBadge({ rating }) {
    switch (rating) {
        case 'excellent':
            return <Badge variant="success">Excellent</Badge>;
        case 'good':
            return <Badge variant="success">Good</Badge>;
        case 'fair':
            return <Badge variant="warning">Fair</Badge>;
        case 'poor':
            return <Badge variant="danger">Poor</Badge>;
        case 'critical':
            return <Badge variant="danger">Critical</Badge>;
        default:
            return <Badge variant="neutral">{rating}</Badge>;
    }
}
export function OutcomeBadge({ outcome }) {
    switch (outcome) {
        case 'passed':
            return <Badge variant="success">Passed Audit</Badge>;
        case 'needs_improvement':
        case 'conditional_pass':
            return <Badge variant="warning">Conditional Pass</Badge>;
        case 'failed':
        case 'critical_failure':
            return <Badge variant="danger">Failed Audit</Badge>;
        default:
            return <Badge variant="neutral">{outcome?.replace('_', ' ')}</Badge>;
    }
}
export function PriorityBadge({ priority }) {
    switch (priority) {
        case 'urgent':
            return <Badge variant="danger">Urgent Priority</Badge>;
        case 'high':
            return <Badge variant="danger">High</Badge>;
        case 'medium':
            return <Badge variant="warning">Medium</Badge>;
        case 'low':
            return <Badge variant="info">Low</Badge>;
        default:
            return <Badge variant="neutral">{priority}</Badge>;
    }
}
export function ComplaintStatusBadge({ status }) {
    switch (status) {
        case 'open':
            return <Badge variant="danger">Open Issue</Badge>;
        case 'in_progress':
            return <Badge variant="warning">In Progress</Badge>;
        case 'resolved':
            return <Badge variant="success">Resolved</Badge>;
        default:
            return <Badge variant="neutral">{status}</Badge>;
    }
}
