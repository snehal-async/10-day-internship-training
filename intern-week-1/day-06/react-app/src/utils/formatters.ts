/**
 * src/utils/formatters.ts
 * Formatting utilities for currency, dates, statistics, and UI badges
 */

import { Employee, DashboardStatistics, EmploymentStatus } from "../types/employee";

/**
 * Formats a number as USD / standard localized currency
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into readable format: "15 Mar 2022"
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "N/A";
  try {
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }
    const d = new Date(isoDate);
    return isNaN(d.getTime()) ? isoDate : d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return isoDate;
  }
}

/**
 * Calculates aggregate dashboard metrics safely, handling empty lists without NaN
 */
export function calculateDashboardStatistics(employees: Employee[]): DashboardStatistics {
  const total = employees.length;
  if (total === 0) {
    return {
      totalEmployees: 0,
      averageSalary: 0,
      uniqueDepartmentsCount: 0,
      activeCount: 0,
      inactiveCount: 0,
      onLeaveCount: 0,
      totalPayroll: 0
    };
  }

  const uniqueDepartments = new Set(
    employees.map((e) => e.department.trim()).filter((d) => d.length > 0)
  );

  let active = 0;
  let inactive = 0;
  let onLeave = 0;
  let payrollSum = 0;

  for (const emp of employees) {
    const sal = Number(emp.salary) || 0;
    payrollSum += sal;

    if (emp.status === "Active") active++;
    else if (emp.status === "Inactive") inactive++;
    else if (emp.status === "On Leave") onLeave++;
  }

  const avgSalary = Math.round(payrollSum / total);

  return {
    totalEmployees: total,
    averageSalary: avgSalary,
    uniqueDepartmentsCount: uniqueDepartments.size,
    activeCount: active,
    inactiveCount: inactive,
    onLeaveCount: onLeave,
    totalPayroll: payrollSum
  };
}

/**
 * Returns initials from first and last name
 */
export function getInitials(firstName: string, lastName: string): string {
  const f = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
  return `${f}${l}` || "EM";
}

/**
 * Returns deterministic avatar gradient / background based on employee name
 */
export function getAvatarColor(name: string): { bg: string; text: string } {
  const colors = [
    { bg: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", text: "#ffffff" }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Badges styling classes for Employment Status
 */
export function getStatusBadgeConfig(status: EmploymentStatus | string): {
  label: string;
  className: string;
  dotColor: string;
} {
  switch (status) {
    case "Active":
      return {
        label: "Active",
        className: "badge-status-active",
        dotColor: "#10b981"
      };
    case "Inactive":
      return {
        label: "Inactive",
        className: "badge-status-inactive",
        dotColor: "#64748b"
      };
    case "On Leave":
      return {
        label: "On Leave",
        className: "badge-status-onleave",
        dotColor: "#f59e0b"
      };
    default:
      return {
        label: status,
        className: "badge-status-neutral",
        dotColor: "#94a3b8"
      };
  }
}
