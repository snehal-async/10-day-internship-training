import React from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  resultCount
}) => {
  return (
    <div className="search-wrapper">
      <span className="search-icon" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        type="text"
        className="search-input"
        id="input-search-employees"
        placeholder="Search employees by name, email, department, designation..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search employees"
      />

      {searchQuery && (
        <button
          type="button"
          className="clear-search-btn"
          onClick={() => onSearchChange("")}
          title="Clear search"
          aria-label="Clear search query"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};
