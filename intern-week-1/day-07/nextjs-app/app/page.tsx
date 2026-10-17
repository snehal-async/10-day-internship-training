import Link from "next/link";
import { api } from "../lib/api";
import { DashboardStats } from "../components/DashboardStats";
import { DashboardStatistics, Employee } from "../types/employee";
import { formatCurrency, formatDate, getInitials, getAvatarColor, getStatusBadgeConfig } from "../lib/formatters";

export default async function HomePage() {
  let stats: DashboardStatistics = {
    totalEmployees: 0,
    averageSalary: 0,
    uniqueDepartmentsCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    onLeaveCount: 0,
    totalPayroll: 0
  };

  let recentEmployees: Employee[] = [];
  let connectionError: string | null = null;

  try {
    const [fetchedStats, fetchedEmployees] = await Promise.all([
      api.getStatistics(),
      api.getEmployees({ sortBy: "id", sortOrder: "desc" })
    ]);
    stats = fetchedStats;
    recentEmployees = fetchedEmployees.slice(0, 5);
  } catch (err: any) {
    connectionError = err.message || "Failed to connect to backend";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>Enterprise Workforce Intelligence</h2>
          <p>
            Real-time analytics and management powered by Next.js 14 App Router and Express REST API.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/employees" className="btn btn-secondary">
            View All Employees →
          </Link>
          <Link href="/employees/create" className="btn btn-primary">
            + Add New Employee
          </Link>
        </div>
      </div>

      {/* Connection Notice if Express API is offline */}
      {connectionError && (
        <div className="error-banner">
          <div>
            <strong>Backend Connection Notice:</strong> {connectionError}
          </div>
          <Link href="/api/health" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            Check Health
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <DashboardStats stats={stats} />

      {/* Quick Action Navigation Grid */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        <div className="stat-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Employee Directory</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Search, filter by department, and view detailed profiles for all {stats.totalEmployees} registered employees.
          </p>
          <Link href="/employees" className="btn btn-primary" style={{ marginTop: "auto" }}>
            Open Directory
          </Link>
        </div>

        <div className="stat-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Quick Onboarding</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Register a new employee with automated email uniqueness and salary bounds validation.
          </p>
          <Link href="/employees/create" className="btn btn-secondary" style={{ marginTop: "auto" }}>
            Onboard Employee
          </Link>
        </div>

        <div className="stat-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>REST API Health</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Node.js/Express backend listening on port 4000 with JSON file persistence.
          </p>
          <span style={{ fontSize: "0.8125rem", color: "var(--primary-600)", fontWeight: 600, marginTop: "auto" }}>
            Target: http://localhost:4000/api
          </span>
        </div>
      </section>

      {/* Recent Employees Preview */}
      {recentEmployees.length > 0 && (
        <section className="table-card">
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Recent Additions</h3>
            <Link href="/employees" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-600)" }}>
              View all ({stats.totalEmployees}) →
            </Link>
          </div>
          <div className="table-responsive">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => {
                  const avatar = getAvatarColor(`${emp.firstName} ${emp.lastName}`);
                  const statusConfig = getStatusBadgeConfig(emp.status);
                  return (
                    <tr key={emp.id}>
                      <td><span className="emp-id-badge">{emp.id}</span></td>
                      <td>
                        <div className="employee-cell-profile">
                          <div className="avatar-circle" style={{ background: avatar.bg, color: avatar.text }}>
                            {getInitials(emp.firstName, emp.lastName)}
                          </div>
                          <div>
                            <Link href={`/employees/${emp.id}`} style={{ fontWeight: 600 }}>
                              {emp.firstName} {emp.lastName}
                            </Link>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="department-tag">{emp.department}</span></td>
                      <td>{emp.designation}</td>
                      <td>
                        <span className={`badge-status ${statusConfig.className}`}>
                          <span className="badge-dot" style={{ backgroundColor: statusConfig.dotColor }}></span>
                          <span>{statusConfig.label}</span>
                        </span>
                      </td>
                      <td><span className="salary-text">{formatCurrency(emp.salary)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}