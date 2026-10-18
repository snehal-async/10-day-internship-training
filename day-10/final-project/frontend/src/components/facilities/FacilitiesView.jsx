import { useState, useMemo } from 'react';
import { Plus, Search, ArrowUpDown, LayoutGrid, List, Eye, Edit2, Trash2, MapPin, } from 'lucide-react';
import { FacilityStatusBadge, ConditionBadge } from '../common/Badge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import { TableSkeleton } from '../common/Skeleton';
export function FacilitiesView({ facilities, isLoading, onViewFacility, onEditFacility, onDeleteFacility, onCreateFacility, onRecordAudit, }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [conditionFilter, setConditionFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table');
    const [sortField, setSortField] = useState('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    // Extract unique departments
    const departmentOptions = useMemo(() => {
        const set = new Set();
        facilities.forEach((f) => {
            if (f.department_name)
                set.add(f.department_name);
        });
        return Array.from(set);
    }, [facilities]);
    // Filtered and sorted dataset
    const filteredFacilities = useMemo(() => {
        return facilities
            .filter((fac) => {
            const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fac.facility_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fac.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (fac.department_name && fac.department_name.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDepartment = departmentFilter === 'all' || fac.department_name === departmentFilter;
            const matchesStatus = statusFilter === 'all' || fac.status === statusFilter;
            const matchesType = typeFilter === 'all' || fac.type === typeFilter;
            const matchesCondition = conditionFilter === 'all' || fac.condition_rating === conditionFilter;
            return matchesSearch && matchesDepartment && matchesStatus && matchesType && matchesCondition;
        })
            .sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortAsc ? valA - valB : valB - valA;
            }
            return 0;
        });
    }, [facilities, searchTerm, departmentFilter, statusFilter, typeFilter, conditionFilter, sortField, sortAsc]);
    const totalPages = Math.ceil(filteredFacilities.length / pageSize) || 1;
    const paginatedFacilities = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredFacilities.slice(start, start + pageSize);
    }, [filteredFacilities, currentPage, pageSize]);
    function handleSort(field) {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        }
        else {
            setSortField(field);
            setSortAsc(true);
        }
    }
    function handleResetFilters() {
        setSearchTerm('');
        setDepartmentFilter('all');
        setStatusFilter('all');
        setTypeFilter('all');
        setConditionFilter('all');
        setCurrentPage(1);
    }
    return (<div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Breadcrumbs items={[{ label: 'Facilities Directory' }]}/>
          <h1 className="page-title">
            Facilities Inventory
          </h1>
          <p className="page-subtitle">
            Enterprise physical infrastructure & building assets ({filteredFacilities.length} of {facilities.length} active sites)
          </p>
        </div>
        <div className="page-actions">
          <div className="btn-group" style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('table')} title="Table view" style={{ borderRadius: 0, border: 'none' }} aria-label="Table view">
              <List size={15}/>
            </button>
            <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('grid')} title="Card grid view" style={{ borderRadius: 0, border: 'none' }} aria-label="Card grid view">
              <LayoutGrid size={15}/>
            </button>
          </div>

          <button className="btn btn-primary" onClick={onCreateFacility}>
            <Plus size={16}/>
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: '1 1 260px', minWidth: 240, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input type="text" placeholder="Search code, name, city, department..." value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
        }} className="form-control" style={{ paddingLeft: '2.25rem' }} aria-label="Search facilities"/>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
            {/* Department Filter */}
            <select value={departmentFilter} onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
        }} className="form-control" style={{ width: 170 }} aria-label="Filter by department">
              <option value="all">All Departments</option>
              {departmentOptions.map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
            </select>

            {/* Status Dropdown */}
            <select value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
        }} className="form-control" style={{ width: 150 }} aria-label="Filter by operational status">
              <option value="all">All Statuses</option>
              <option value="operational">Operational</option>
              <option value="under_maintenance">Maintenance</option>
              <option value="closed">Decommissioned</option>
            </select>

            {/* Type Dropdown */}
            <select value={typeFilter} onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
        }} className="form-control" style={{ width: 150 }} aria-label="Filter by facility type">
              <option value="all">All Classifications</option>
              <option value="office">Office</option>
              <option value="warehouse">Warehouse</option>
              <option value="laboratory">Laboratory</option>
              <option value="datacenter">Data Center</option>
              <option value="manufacturing">Manufacturing</option>
            </select>

            {/* Condition Dropdown */}
            <select value={conditionFilter} onChange={(e) => {
            setConditionFilter(e.target.value);
            setCurrentPage(1);
        }} className="form-control" style={{ width: 140 }} aria-label="Filter by condition rating">
              <option value="all">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="critical">Critical</option>
            </select>

            {(searchTerm || departmentFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all' || conditionFilter !== 'all') && (<button className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
                Reset
              </button>)}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (<TableSkeleton rows={6} cols={7}/>) : filteredFacilities.length === 0 ? (<EmptyState title="No facilities found" description="No facilities match your active search filters. Try resetting the filters or register a new facility asset." actionLabel="Register Facility" onAction={onCreateFacility}/>) : viewMode === 'table' ? (
        /* Data Table */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Facility Name & Code
                    <ArrowUpDown size={12}/>
                  </div>
                </th>
                <th>Department</th>
                <th className="sortable" onClick={() => handleSort('city')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Location
                    <ArrowUpDown size={12}/>
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('capacity')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Capacity
                    <ArrowUpDown size={12}/>
                  </div>
                </th>
                <th>Condition</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFacilities.map((fac) => (<tr key={fac.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => onViewFacility(fac)}>
                      {fac.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span className="badge-code">{fac.facility_code}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        • {fac.type}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {fac.department_name || 'General Operations'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <MapPin size={14} color="var(--text-muted)"/>
                      <span>{fac.city}, {fac.state}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                      {fac.capacity.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> pers.</span>
                  </td>
                  <td>
                    <ConditionBadge rating={fac.condition_rating}/>
                  </td>
                  <td>
                    <FacilityStatusBadge status={fac.status}/>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onViewFacility(fac)} title="View profile & history" aria-label={`View details for ${fac.name}`}>
                        <Eye size={15}/>
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => onEditFacility(fac)} title="Edit facility specs" aria-label={`Edit ${fac.name}`}>
                        <Edit2 size={15}/>
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => onDeleteFacility(fac.id, fac.name)} title="Decommission facility" style={{ color: 'var(--rose-600)' }} aria-label={`Delete ${fac.name}`}>
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredFacilities.length} pageSize={pageSize} onPageChange={setCurrentPage}/>
        </div>) : (
        /* Mobile / Grid Card View */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {paginatedFacilities.map((fac) => (<div key={fac.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
                  <div>
                    <span className="badge-code" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>
                      {fac.facility_code}
                    </span>
                    <h3 className="card-title" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => onViewFacility(fac)}>
                      {fac.name}
                    </h3>
                  </div>
                  <FacilityStatusBadge status={fac.status}/>
                </div>

                <div className="card-body" style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--text-muted)"/>
                    <span>{fac.address}, {fac.city}, {fac.state}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Department</span>
                      <strong style={{ fontSize: '0.8125rem' }}>{fac.department_name || 'Operations'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Area</span>
                      <strong style={{ fontSize: '0.8125rem' }}>{fac.square_feet.toLocaleString()} sq ft</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Condition</span>
                      <ConditionBadge rating={fac.condition_rating}/>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Capacity</span>
                      <strong style={{ fontSize: '0.8125rem' }}>{fac.capacity.toLocaleString()} persons</strong>
                    </div>
                  </div>
                </div>

                <div className="card-footer" style={{ padding: '0.75rem 1.25rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => onRecordAudit(fac.id)}>
                    Record Audit
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => onViewFacility(fac)}>
                    View Details
                  </button>
                </div>
              </div>))}
          </div>

          <div style={{ marginTop: '1.25rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredFacilities.length} pageSize={pageSize} onPageChange={setCurrentPage}/>
          </div>
        </div>)}
    </div>);
}
