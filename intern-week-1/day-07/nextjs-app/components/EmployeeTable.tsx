"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Employee } from "../types/employee";
import {
  formatCurrency,
  formatDate,
  getInitials,
  getAvatarColor,
  getStatusBadgeConfig
} from "../lib/formatters";
import { ConfirmModal } from "./ConfirmModal";

interface EmployeeTableProps {
  initialEmployees: Employee[];
  onDeleteSuccess?: (id: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  initialEmployees,
  onDeleteSuccess
}) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync state if props change
  React.useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const { api } = await import("../lib/api");
      await api.deleteEmployee(deletingEmployee.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
      if (onDeleteSuccess) onDeleteSuccess(deletingEmployee.id);
      setDeletingEmployee(null);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  if (employees.length === 0) {
    return (
      <div style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>No Employees Found</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          No records matched your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      {deleteError && (
        <div className="error-banner" style={{ margin: "1rem" }}>
          <span>{deleteError}</span>
          <button type="button" onClick={() => setDeleteError(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            ✕
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Profile</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Salary</th>
              <th>Joined Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const avatar = getAvatarColor(`${emp.firstName} ${emp.lastName}`);
              const statusConfig = getStatusBadgeConfig(emp.status);
              return (
                <tr key={emp.id} id={`row-${emp.id}`}>
                  <td>
                    <span className="emp-id-badge">{emp.id}</span>
                  </td>

                  <td>
                    <div className="employee-cell-profile">
                      <div
                        className="avatar-circle"
                        style={{ background: avatar.bg, color: avatar.text }}
                      >
                        {getInitials(emp.firstName, emp.lastName)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600 }}>
                          {emp.firstName} {emp.lastName}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {emp.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="department-tag">{emp.department}</span>
                  </td>

                  <td>
                    <span style={{ fontWeight: 500 }}>{emp.designation}</span>
                  </td>

                  <td>
                    <span className={`badge-status ${statusConfig.className}`}>
                      <span className="badge-dot" style={{ backgroundColor: statusConfig.dotColor }}></span>
                      <span>{statusConfig.label}</span>
                    </span>
                  </td>

                  <td>
                    <span className="salary-text">{formatCurrency(emp.salary)}</span>
                  </td>

                  <td>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                      {formatDate(emp.joiningDate)}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`/employees/${emp.id}`}
                        className="btn-icon-action btn-action-view"
                        title={`View ${emp.firstName}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>

                      <Link
                        href={`/employees/${emp.id}/edit`}
                        className="btn-icon-action btn-action-edit"
                        title={`Edit ${emp.firstName}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        className="btn-icon-action btn-action-delete"
                        onClick={() => setDeletingEmployee(emp)}
                        title={`Delete ${emp.firstName}`}
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

      <ConfirmModal
        isOpen={Boolean(deletingEmployee)}
        employee={deletingEmployee}
        isDeleting={isDeleting}
        onCancel={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};