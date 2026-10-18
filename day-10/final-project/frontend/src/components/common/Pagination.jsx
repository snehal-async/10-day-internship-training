import { ChevronLeft, ChevronRight } from 'lucide-react';
export function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange, }) {
    if (totalPages <= 1)
        return null;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    return (<div className="pagination-container" aria-label="Pagination Navigation">
      <div>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
      </div>

      <div className="pagination-controls">
        <button className="btn btn-secondary btn-sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">
          <ChevronLeft size={14}/>
          <span>Previous</span>
        </button>

        <span style={{ fontSize: '0.8125rem', padding: '0 0.5rem', fontWeight: 600 }}>
          Page {currentPage} of {totalPages}
        </span>

        <button className="btn btn-secondary btn-sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Next page">
          <span>Next</span>
          <ChevronRight size={14}/>
        </button>
      </div>
    </div>);
}
