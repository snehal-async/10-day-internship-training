import React from "react";
import { DashboardStatistics } from "../types/employee";
import { formatCurrency } from "../utils/formatters";

interface DashboardStatsProps {
  stats: DashboardStatistics;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <section className="stats-grid" aria-label="Dashboard Metrics">
      {/* 1. Total Employees */}
      <div className="stat-card">
        <div className="stat-icon icon-purple">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Workforce</span>
          <span className="stat-value" id="stat-total-employees">
            {stats.totalEmployees}
          </span>
          <span className="stat-subtext">
            {stats.activeCount} Active • {stats.inactiveCount} Inactive
          </span>
        </div>
      </div>

      {/* 2. Average Salary */}
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Average Annual Salary</span>
          <span className="stat-value" id="stat-avg-salary">
            {formatCurrency(stats.averageSalary)}
          </span>
          <span className="stat-subtext">
            Payroll: {formatCurrency(stats.totalPayroll)}
          </span>
        </div>
      </div>

      {/* 3. Unique Departments */}
      <div className="stat-card">
        <div className="stat-icon icon-green">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Departments</span>
          <span className="stat-value" id="stat-unique-depts">
            {stats.uniqueDepartmentsCount}
          </span>
          <span className="stat-subtext">Operational Divisions</span>
        </div>
      </div>

      {/* 4. Active Retention Ratio */}
      <div className="stat-card">
        <div className="stat-icon icon-amber">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Active Engagement</span>
          <span className="stat-value" id="stat-active-retention">
            {stats.totalEmployees > 0
              ? `${Math.round((stats.activeCount / stats.totalEmployees) * 100)}%`
              : "0%"}
          </span>
          <span className="stat-subtext">
            {stats.onLeaveCount} Staff on Scheduled Leave
          </span>
        </div>
      </div>
    </section>
  );
};
