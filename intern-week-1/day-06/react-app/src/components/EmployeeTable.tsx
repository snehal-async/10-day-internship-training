import React from "react";
import { Employee, SortField, SortOrder } from "../types/employee";
import {
  formatCurrency,
  formatDate,
  getInitials,
  getAvatarColor,
  getStatusBadgeConfig
} from "../utils/formatters";

interface EmployeeTableProps {
  employees: Employee[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onViewDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  sortBy,
  sortOrder,
  onSortChange,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return (
        <span style={{ opacity: 0.3 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
          </svg>
        </span>
      );
    }
    return sortOrder === "asc" ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    );
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h3>No Matching Employees Found</h3>
        <p>No employee records matched your active search query or filter criteria. Try adjusting the keywords or clear active filters.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="employee-table" aria-label="Employees Directory Table">
        <thead>
          <tr>
            <th
              className="th-sortable"
              onClick={() => onSortChange("id")}
              title="Sort by Employee ID"
            >
              <div className="th-content">
                <span>ID</span>
                {renderSortIndicator("id")}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSortChange("name")}
              title="Sort by Name"
            >
              <div className="th-content">
                <span>Employee</span>
                {renderSortIndicator("name")}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSortChange("department")}
              title="Sort by Department"
            >
              <div className="th-content">
                <span>Department</span>
                {renderSortIndicator("department")}
              </div>
            </th>

            <th>Designation</th>

            <th>Status</th>

            <th
              className="th-sortable"
              onClick={() => onSortChange("salary")}
              title="Sort by Salary"
            >
              <div className="th-content">
                <span>Salary</span>
                {renderSortIndicator("salary")}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSortChange("joiningDate")}
              title="Sort by Joining Date"
            >
              <div className="th-content">
                <span>Joined Date</span>
                {renderSortIndicator("joiningDate")}
              </div>
            </th>

            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const avatar = getAvatarColor(`${emp.firstName} ${emp.lastName}`);
            const statusConfig = getStatusBadgeConfig(emp.status);
            return (
              <tr key={emp.id} id={`employee-row-${emp.id}`}>
                {/* ID Badge */}
                <td>
                  <span className="emp-id-badge">{emp.id}</span>
                </td>

                {/* Profile Cell */}
                <td>
                  <div className="employee-cell-profile">
                    <div
                      className="avatar-circle"
                      style={{ background: avatar.bg, color: avatar.text }}
                      aria-hidden="true"
                    >
                      {getInitials(emp.firstName, emp.lastName)}
                    </div>
                    <div className="employee-meta">
                      <span className="emp-name">{emp.firstName} {emp.lastName}</span>
                      <span className="emp-email">{emp.email}</span>
                    </div>
                  </div>
                </td>

                {/* Department Tag */}
                <td>
                  <span className="department-tag">{emp.department}</span>
                </td>

                {/* Designation */}
                <td>
                  <span style={{ fontWeight: 500 }}>{emp.designation}</span>
                </td>

                {/* Employment Status Badge */}
                <td>
                  <span className={`badge-status ${statusConfig.className}`}>
                    <span
                      className="badge-dot"
                      style={{ backgroundColor: statusConfig.dotColor }}
                    ></span>
                    <span>{statusConfig.label}</span>
                  </span>
                </td>

                {/* Salary */}
                <td>
                  <span className="salary-text">{formatCurrency(emp.salary)}</span>
                </td>

                {/* Joining Date */}
                <td>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                    {formatDate(emp.joiningDate)}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn-icon-action btn-action-view"
                      onClick={() => onViewDetails(emp)}
                      title={`View details for ${emp.firstName}`}
                      aria-label={`View details for ${emp.firstName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="btn-icon-action btn-action-edit"
                      onClick={() => onEdit(emp)}
                      title={`Edit ${emp.firstName}`}
                      aria-label={`Edit ${emp.firstName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="btn-icon-action btn-action-delete"
                      onClick={() => onDelete(emp)}
                      title={`Delete ${emp.firstName}`}
                      aria-label={`Delete ${emp.firstName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
