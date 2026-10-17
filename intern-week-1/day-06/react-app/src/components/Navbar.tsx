import React from "react";

interface NavbarProps {
  onAddClick: () => void;
  activeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddClick, activeCount }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="brand-titles">
            <h1>StaffHub Enterprise</h1>
            <p>React + TypeScript Dashboard (Day 06)</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="api-pill" title="Connected to JSON Server REST API on port 3001">
            <span className="pulse-dot"></span>
            <span>REST API Active ({activeCount} Active)</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddClick}
            id="btn-add-employee-nav"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
};
