import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "../../../lib/api";
import {
  formatCurrency,
  formatDate,
  getInitials,
  getAvatarColor,
  getStatusBadgeConfig
} from "../../../lib/formatters";
import { Employee } from "../../../types/employee";

interface PageProps {
  params: { id: string };
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  let employee: Employee;

  try {
    employee = await api.getEmployeeById(params.id);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }

  const avatar = getAvatarColor(`${employee.firstName} ${employee.lastName}`);
  const statusConfig = getStatusBadgeConfig(employee.status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Breadcrumb / Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/employees" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-600)" }}>
          ← Back to Directory
        </Link>
        <Link href={`/employees/${employee.id}/edit`} className="btn btn-primary">
          Edit Profile
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="profile-card">
        <div className="profile-hero">
          <div
            className="profile-avatar-large"
            style={{ background: avatar.bg, color: avatar.text }}
          >
            {getInitials(employee.firstName, employee.lastName)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                {employee.firstName} {employee.lastName}
              </h2>
              <span className="emp-id-badge">{employee.id}</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginTop: "0.25rem" }}>
              {employee.designation} • {employee.department}
            </p>
            <div style={{ marginTop: "0.75rem" }}>
              <span className={`badge-status ${statusConfig.className}`}>
                <span className="badge-dot" style={{ backgroundColor: statusConfig.dotColor }}></span>
                <span>{statusConfig.label}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <div className="detail-item-title">Work Email Address</div>
            <div className="detail-item-value">{employee.email}</div>
          </div>

          <div>
            <div className="detail-item-title">Direct Phone Contact</div>
            <div className="detail-item-value">{employee.phone}</div>
          </div>

          <div>
            <div className="detail-item-title">Assigned Department</div>
            <div className="detail-item-value">{employee.department}</div>
          </div>

          <div>
            <div className="detail-item-title">Corporate Designation</div>
            <div className="detail-item-value">{employee.designation}</div>
          </div>

          <div>
            <div className="detail-item-title">Annual Base Compensation</div>
            <div className="detail-item-value salary-text">{formatCurrency(employee.salary)}</div>
          </div>

          <div>
            <div className="detail-item-title">Official Joining Date</div>
            <div className="detail-item-value">{formatDate(employee.joiningDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}