import React from "react";
import { SortField, SortOrder, DEPARTMENTS, EMPLOYMENT_STATUSES } from "../types/employee";

interface FilterControlsProps {
  department: string;
  status: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (field: SortField, order?: SortOrder) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  department,
  status,
  sortBy,
  sortOrder,
  onDepartmentChange,
  onStatusChange,
  onSortChange,
  onResetFilters,
  isFiltered
}) => {
  return (
    <div className="controls-row-bottom">
      <div className="filters-group">
        {/* Department Filter */}
        <select
          className="select-control"
          id="select-filter-department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="select-control"
          id="select-filter-status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by employment status"
        >
          <option value="all">All Statuses</option>
          {EMPLOYMENT_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="sort-group">
        {/* Sort Field */}
        <select
          className="select-control"
          id="select-sort-field"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortField)}
          aria-label="Sort by field"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="salary">Sort by Salary</option>
          <option value="department">Sort by Department</option>
          <option value="joiningDate">Sort by Joining Date</option>
        </select>

        {/* Sort Order Toggle */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")}
          title={`Currently sorting ${sortOrder === "asc" ? "Ascending (click for Descending)" : "Descending (click for Ascending)"}`}
          aria-label="Toggle sort direction"
          id="btn-toggle-sort-order"
        >
          {sortOrder === "asc" ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
              <span>Asc</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
              <span>Desc</span>
            </>
          )}
        </button>

        {/* Reset Filters Button */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onResetFilters}
            id="btn-reset-filters"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
