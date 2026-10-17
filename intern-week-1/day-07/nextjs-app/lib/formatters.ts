import { EmploymentStatus } from "../types/employee";

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

export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "N/A";
  try {
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day).toLocaleDateString("en-US", {
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

export function getInitials(firstName: string, lastName: string): string {
  const f = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
  return `${f}${l}` || "EM";
}

export function getAvatarColor(name: string): { bg: string; text: string } {
  const colors = [
    { bg: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", text: "#ffffff" },
    { bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", text: "#ffffff" }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getStatusBadgeConfig(status: EmploymentStatus | string): {
  label: string;
  className: string;
  dotColor: string;
} {
  switch (status) {
    case "Active":
      return { label: "Active", className: "badge-status-active", dotColor: "#10b981" };
    case "Inactive":
      return { label: "Inactive", className: "badge-status-inactive", dotColor: "#64748b" };
    case "On Leave":
      return { label: "On Leave", className: "badge-status-onleave", dotColor: "#f59e0b" };
    default:
      return { label: status, className: "badge-status-neutral", dotColor: "#94a3b8" };
  }
}