import React, { useState } from "react";
import { Employee, EmployeeFormData } from "../types/employee";
import { ToastMessage } from "../types/api";
import { useEmployees } from "../hooks/useEmployees";
import { DashboardStats } from "../components/DashboardStats";
import { SearchBar } from "../components/SearchBar";
import { FilterControls } from "../components/FilterControls";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeDetails } from "../components/EmployeeDetails";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingState } from "../components/LoadingState";
import { ErrorMessage } from "../components/ErrorMessage";

interface DashboardPageProps {
  onAddToast: (toast: Omit<ToastMessage, "id">) => void;
  openAddModalTrigger?: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onAddToast
}) => {
  const {
    employees,
    filteredEmployees,
    statistics,
    isLoading,
    error,
    filterState,
    refresh,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setSearchQuery,
    setDepartmentFilter,
    setStatusFilter,
    setSortCriteria,
    resetFilters
  } = useEmployees();

  // Modal Dialog States
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [detailsEmployee, setDetailsEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form Handlers
  const handleOpenAddForm = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: EmployeeFormData) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, formData);
      onAddToast({
        type: "success",
        title: "Employee Updated",
        description: `Successfully updated profile for ${formData.firstName} ${formData.lastName}.`
      });
    } else {
      const created = await createEmployee(formData);
      onAddToast({
        type: "success",
        title: "Employee Added",
        description: `Created new record for ${created.firstName} ${created.lastName} (${created.id}).`
      });
    }
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    try {
      setIsDeleting(true);
      await deleteEmployee(deletingEmployee.id);
      onAddToast({
        type: "success",
        title: "Employee Deleted",
        description: `Permanently removed ${deletingEmployee.firstName} ${deletingEmployee.lastName} (${deletingEmployee.id}).`
      });
      setDeletingEmployee(null);
    } catch (err: unknown) {
      onAddToast({
        type: "error",
        title: "Failed to Delete",
        description: (err as Error).message
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered =
    filterState.searchQuery.trim() !== "" ||
    filterState.department !== "all" ||
    filterState.status !== "all";

  return (
    <main className="main-content">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-text">
          <h2>Workforce Analytics & Management</h2>
          <p>
            Monitor real-time company statistics, search talent records, and manage corporate rosters via REST API.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAddForm}
          id="btn-add-employee-hero"
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
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Dashboard KPI Statistics */}
      <DashboardStats stats={statistics} />

      {/* Error Message if API fails */}
      {error && <ErrorMessage message={error} onRetry={refresh} />}

      {/* Filter and Search Controls */}
      <section className="controls-card" aria-label="Search and Filter Controls">
        <div className="controls-row-top">
          <SearchBar
            searchQuery={filterState.searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredEmployees.length}
          />
        </div>

        <FilterControls
          department={filterState.department}
          status={filterState.status}
          sortBy={filterState.sortBy}
          sortOrder={filterState.sortOrder}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setStatusFilter}
          onSortChange={setSortCriteria}
          onResetFilters={resetFilters}
          isFiltered={isFiltered}
        />
      </section>

      {/* Results Count Summary */}
      <div className="results-info">
        <span>
          Showing{" "}
          <strong className="results-badge">{filteredEmployees.length}</strong> of{" "}
          <strong>{employees.length}</strong> total employee records
          {isFiltered && " (filtered)"}
        </span>
      </div>

      {/* Main Table Content */}
      <section className="table-card" aria-label="Employee List Table">
        {isLoading ? (
          <LoadingState message="Fetching live employee dataset from JSON Server..." />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            sortBy={filterState.sortBy}
            sortOrder={filterState.sortOrder}
            onSortChange={setSortCriteria}
            onViewDetails={(emp) => setDetailsEmployee(emp)}
            onEdit={handleOpenEditForm}
            onDelete={(emp) => setDeletingEmployee(emp)}
          />
        )}
      </section>

      {/* Add / Edit Form Modal */}
      <EmployeeForm
        isOpen={isFormOpen}
        initialEmployee={editingEmployee}
        existingEmployees={employees}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* View Details Modal */}
      <EmployeeDetails
        isOpen={Boolean(detailsEmployee)}
        employee={detailsEmployee}
        onClose={() => setDetailsEmployee(null)}
        onEdit={(emp) => handleOpenEditForm(emp)}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingEmployee)}
        employee={deletingEmployee}
        isDeleting={isDeleting}
        onCancel={() => setDeletingEmployee(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
};
