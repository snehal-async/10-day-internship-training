import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  MapPin,
  Users,
} from 'lucide-react';
import type { Facility } from '../types';

interface FacilitiesViewProps {
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onSelectFacility: (facility: Facility) => void;
  onEditFacility: (facility: Facility) => void;
  onDeleteFacility: (facility: Facility) => void;
}

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({
  facilities,
  isLoading,
  error,
  onRefresh,
  onOpenCreate,
  onSelectFacility,
  onEditFacility,
  onDeleteFacility,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('');

  const filteredFacilities = facilities.filter((fac) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.facility_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === '' || fac.facility_type === typeFilter;
    const matchesCondition = conditionFilter === '' || fac.condition_rating === conditionFilter;

    return matchesSearch && matchesType && matchesCondition;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facilities Directory</h1>
          <p className="page-subtitle">
            Manage corporate physical assets, real estate, design capacities, and health ratings.
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
            <Plus size={16} /> Add Facility
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, code, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="office">Office</option>
            <option value="warehouse">Warehouse</option>
            <option value="laboratory">Laboratory</option>
            <option value="datacenter">Data Center</option>
            <option value="manufacturing">Manufacturing</option>
          </select>

          <select
            className="select-filter"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="critical">Critical</option>
          </select>

          {(searchTerm || typeFilter || conditionFilter) && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setConditionFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading && facilities.length === 0 ? (
          <div className="state-box">
            <div className="spinner" />
            <h3 className="state-title">Loading Facilities</h3>
            <p className="state-desc">Fetching registered locations from PostgreSQL...</p>
          </div>
        ) : error && facilities.length === 0 ? (
          <div className="state-box">
            <div className="state-icon" style={{ color: '#ef4444' }}>
              <AlertCircle size={28} />
            </div>
            <h3 className="state-title">Failed to Load Facilities</h3>
            <p className="state-desc">{error}</p>
            <button type="button" className="btn btn-primary" onClick={onRefresh}>
              Retry
            </button>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="state-box">
            <div className="state-icon">
              <Building2 size={28} />
            </div>
            <h3 className="state-title">No Facilities Found</h3>
            <p className="state-desc">
              {facilities.length === 0
                ? 'No facilities have been registered in the database yet.'
                : 'No facilities match your search and filter criteria.'}
            </p>
            {facilities.length === 0 ? (
              <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
                <Plus size={16} /> Register First Facility
              </button>
            ) : null}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Facility Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((facility) => (
                  <tr key={facility.id}>
                    <td>
                      <span className="code-pill">{facility.facility_code}</span>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                        onClick={() => onSelectFacility(facility)}
                      >
                        {facility.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {facility.address}
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{facility.facility_type}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                        <MapPin size={14} color="#818cf8" />
                        {facility.city}{facility.state ? `, ${facility.state}` : ''}
                      </span>
                    </td>
                    <td>
                      {facility.capacity ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                          <Users size={14} />
                          {facility.capacity.toLocaleString()}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${facility.condition_rating}`}>
                        {facility.condition_rating}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${facility.status}`}>
                        {facility.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-only"
                          onClick={() => onSelectFacility(facility)}
                          title="View Details"
                          aria-label={`View details for ${facility.name}`}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-only"
                          onClick={() => onEditFacility(facility)}
                          title="Edit Facility"
                          aria-label={`Edit ${facility.name}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-icon-only"
                          onClick={() => onDeleteFacility(facility)}
                          title="Delete Facility"
                          aria-label={`Delete ${facility.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
