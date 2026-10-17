"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Employee, DEPARTMENTS, EMPLOYMENT_STATUSES } from "../../types/employee";
import { api } from "../../lib/api";
import { EmployeeTable } from "../../components/EmployeeTable";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState<string>("");
  const [department, setDepartment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || "Failed to load employees from Express backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and sorted memoized computation
  const filteredEmployees = useMemo(() => {
    let result = employees.filter((emp) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const match =
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (department !== "all" && emp.department.toLowerCase() !== department.toLowerCase()) {
        return false;
      }

      if (status !== "all" && emp.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case "salary":
          cmp = a.salary - b.salary;
          break;
        case "department":
          cmp = a.department.localeCompare(b.department);
          break;
        case "joiningDate":
          cmp = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
          break;
        case "id":
        default:
          cmp = a.id.localeCompare(b.id, undefined, { numeric: true });
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [employees, search, department, status, sortBy, sortOrder]);

  const isFiltered = search.trim() !== "" || department !== "all" || status !== "all";

  const resetFilters = () => {
    setSearch("");
    setDepartment("all");
    setStatus("all");
    setSortBy("id");
    setSortOrder("asc");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>Employee Directory</h2>
          <p>Browse, search, and manage registered staff profiles across operational units.</p>
        </div>

        <Link href="/employees/create" className="btn btn-primary" id="btn-add-employee-dir">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Employee</span>
        </Link>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button type="button" className="btn btn-secondary" onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      {/* Controls Card */}
      <section className="controls-card">
        <div className="controls-row-top">
          <div className="search-wrapper">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, department, role, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
            {search && (
              <button type="button" className="clear-search-btn" onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="controls-row-bottom">
          <div className="filters-group">
            <select
              className="select-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              id="select-department"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="select-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              id="select-status"
            >
              <option value="all">All Statuses</option>
              {EMPLOYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-group">
            <select
              className="select-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="select-sort"
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="salary">Sort by Salary</option>
              <option value="department">Sort by Department</option>
              <option value="joiningDate">Sort by Joining Date</option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title="Toggle sort direction"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>

            {isFiltered && (
              <button type="button" className="btn btn-ghost" onClick={resetFilters}>
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Count Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
        <span>
          Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
          {isFiltered && " (filtered)"}
        </span>
      </div>

      {/* Table Section */}
      <section className="table-card">
        {isLoading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Fetching employee records from Express backend...</p>
          </div>
        ) : (
          <EmployeeTable
            initialEmployees={filteredEmployees}
            onDeleteSuccess={() => loadData()}
          />
        )}
      </section>
    </div>
  );
}