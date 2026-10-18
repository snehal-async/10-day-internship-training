import React from 'react';
import { Inbox, Plus } from 'lucide-react';
export function EmptyState({ title, description, icon, actionLabel, onAction, }) {
    return (<div className="empty-state">
      <div className="empty-icon-pill">
        {icon || <Inbox size={26} strokeWidth={1.5}/>}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLabel && onAction && (<button className="btn btn-primary btn-sm" onClick={onAction}>
          <Plus size={14}/>
          <span>{actionLabel}</span>
        </button>)}
    </div>);
}
