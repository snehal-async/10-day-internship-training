import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ConditionRating, Facility, FacilityStatus, FacilityType } from '../types';

interface FacilityModalProps {
  isOpen: boolean;
  facility: Facility | null;
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: Partial<Facility>) => Promise<void>;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({
  isOpen,
  facility,
  isLoading,
  onClose,
  onSave,
}) => {
  const isEditing = !!facility;

  const [formData, setFormData] = useState({
    name: '',
    facility_code: '',
    facility_type: 'office' as FacilityType,
    address: '',
    city: '',
    state: '',
    postal_code: '',
    condition_rating: 'good' as ConditionRating,
    status: 'operational' as FacilityStatus,
    capacity: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || '',
        facility_code: facility.facility_code || '',
        facility_type: facility.facility_type || 'office',
        address: facility.address || '',
        city: facility.city || '',
        state: facility.state || '',
        postal_code: facility.postal_code || '',
        condition_rating: facility.condition_rating || 'good',
        status: facility.status || 'operational',
        capacity: facility.capacity !== null && facility.capacity !== undefined ? facility.capacity.toString() : '',
      });
    } else {
      setFormData({
        name: '',
        facility_code: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
        facility_type: 'office',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        condition_rating: 'good',
        status: 'operational',
        capacity: '100',
      });
    }
    setErrors({});
  }, [facility, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Facility name is required';
    } else if (formData.name.length > 150) {
      errs.name = 'Facility name cannot exceed 150 characters';
    }

    if (!formData.facility_code.trim()) {
      errs.facility_code = 'Facility code is required';
    } else if (formData.facility_code.length > 30) {
      errs.facility_code = 'Facility code cannot exceed 30 characters';
    }

    if (!formData.address.trim()) {
      errs.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required';
    }

    if (formData.capacity && (!/^\d+$/.test(formData.capacity) || parseInt(formData.capacity, 10) < 1)) {
      errs.capacity = 'Capacity must be a positive integer';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Partial<Facility> = {
      name: formData.name.trim(),
      facility_code: formData.facility_code.trim(),
      facility_type: formData.facility_type,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim() || null,
      postal_code: formData.postal_code.trim() || null,
      condition_rating: formData.condition_rating,
      status: formData.status,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
    };

    try {
      await onSave(payload);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err && err.errors) {
        const apiErrors = err.errors as Record<string, string[]>;
        const mappedErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(apiErrors)) {
          mappedErrors[key] = msgs[0];
        }
        setErrors(mappedErrors);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3 className="modal-title">{isEditing ? `Edit Facility: ${facility?.facility_code}` : 'Add New Facility'}</h3>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="fac_name">
                  Facility Name <span className="req">*</span>
                </label>
                <input
                  id="fac_name"
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Pacific Logistics Depot"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac_code">
                  Facility Code <span className="req">*</span>
                </label>
                <input
                  id="fac_code"
                  type="text"
                  className={`form-input ${errors.facility_code ? 'error' : ''}`}
                  placeholder="e.g. FAC-WH-02"
                  value={formData.facility_code}
                  onChange={(e) => setFormData({ ...formData, facility_code: e.target.value })}
                  disabled={isLoading}
                />
                {errors.facility_code && <span className="field-error">{errors.facility_code}</span>}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="fac_type">
                  Facility Type <span className="req">*</span>
                </label>
                <select
                  id="fac_type"
                  className="form-select"
                  value={formData.facility_type}
                  onChange={(e) => setFormData({ ...formData, facility_type: e.target.value as FacilityType })}
                  disabled={isLoading}
                >
                  <option value="office">Corporate Office</option>
                  <option value="warehouse">Warehouse & Logistics</option>
                  <option value="laboratory">R&D Laboratory</option>
                  <option value="datacenter">Data Center</option>
                  <option value="manufacturing">Manufacturing Foundry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac_capacity">
                  Design Capacity
                </label>
                <input
                  id="fac_capacity"
                  type="number"
                  min="1"
                  className={`form-input ${errors.capacity ? 'error' : ''}`}
                  placeholder="e.g. 250"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  disabled={isLoading}
                />
                {errors.capacity && <span className="field-error">{errors.capacity}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fac_address">
                Street Address <span className="req">*</span>
              </label>
              <input
                id="fac_address"
                type="text"
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="e.g. 400 Pine Street, Suite 500"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={isLoading}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="fac_city">
                  City <span className="req">*</span>
                </label>
                <input
                  id="fac_city"
                  type="text"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="e.g. Seattle"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={isLoading}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac_state">
                  State / Province
                </label>
                <input
                  id="fac_state"
                  type="text"
                  className="form-input"
                  placeholder="e.g. WA"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="fac_condition">
                  Condition Rating
                </label>
                <select
                  id="fac_condition"
                  className="form-select"
                  value={formData.condition_rating}
                  onChange={(e) => setFormData({ ...formData, condition_rating: e.target.value as ConditionRating })}
                  disabled={isLoading}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac_status">
                  Operational Status
                </label>
                <select
                  id="fac_status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as FacilityStatus })}
                  disabled={isLoading}
                >
                  <option value="operational">Operational</option>
                  <option value="under_maintenance">Under Maintenance</option>
                  <option value="decommissioned">Decommissioned</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Facility' : 'Create Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
