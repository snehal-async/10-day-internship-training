import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Breadcrumbs({ items }) {
    return (<nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-link" aria-label="Home">
        <Home size={13}/>
      </Link>
      {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (<React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight size={12} color="var(--text-muted)"/>
            {isLast || !item.to ? (<span className="breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>) : (<Link to={item.to} className="breadcrumb-link">
                {item.label}
              </Link>)}
          </React.Fragment>);
        })}
    </nav>);
}
