import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { animateModalEntrance } from '../../utils/animations';
export function FacilityFormModal({ isOpen, facility, onClose, onSubmit, isLoading, }) {
    const dialogRef = useRef(null);
    const [name, setName] = useState('');
    const [facilityCode, setFacilityCode] = useState('');
    const [type, setType] = useState('office');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [capacity, setCapacity] = useState(250);
    const [squareFeet, setSquareFeet] = useState(35000);
    const [conditionRating, setConditionRating] = useState('good');
    const [status, setStatus] = useState('operational');
    const [departmentName, setDepartmentName] = useState('Corporate Operations');
    const [managerName, setManagerName] = useState('');
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (facility) {
            setName(facility.name);
            setFacilityCode(facility.facility_code);
            setType(facility.type);
            setAddress(facility.address);
            setCity(facility.city);
            setState(facility.state);
            setPostalCode(facility.postal_code);
            setCapacity(facility.capacity);
            setSquareFeet(facility.square_feet);
            setConditionRating(facility.condition_rating);
            setStatus(facility.status);
            setDepartmentName(facility.department_name || '');
            setManagerName(facility.manager_name || '');
        }
        else {
            setName('');
            setFacilityCode(`FAC-${Math.floor(100 + Math.random() * 900)}`);
            setType('office');
            setAddress('');
            setCity('San Francisco');
            setState('CA');
            setPostalCode('94105');
            setCapacity(300);
            setSquareFeet(45000);
            setConditionRating('good');
            setStatus('operational');
            setDepartmentName('Operations & Facilities');
            setManagerName('');
        }
        setErrors({});
    }, [facility, isOpen]);
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            animateModalEntrance(dialogRef.current);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    function validate() {
        const errs = {};
        if (!name.trim())
            errs.name = 'Facility name is required';
        if (!facilityCode.trim())
            errs.facilityCode = 'Facility code is required';
        if (!address.trim())
            errs.address = 'Street address is required';
        if (!city.trim())
            errs.city = 'City is required';
        if (!state.trim())
            errs.state = 'State is required';
        if (capacity <= 0)
            errs.capacity = 'Capacity must be greater than 0';
        if (squareFeet <= 0)
            errs.squareFeet = 'Square footage must be greater than 0';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit({
            name,
            facility_code: facilityCode,
            type,
            address,
            city,
            state,
            postal_code: postalCode,
            country: 'United States',
            capacity: Number(capacity),
            square_feet: Number(squareFeet),
            condition_rating: conditionRating,
            status,
            department_name: departmentName,
            manager_name: managerName,
        });
    }
    return (<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div ref={dialogRef} className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <Building2 size={20}/>
            </div>
            <div>
              <h3 className="modal-title">
                {facility ? 'Edit Facility Specifications' : 'Register New Asset'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {facility ? `Modifying profile for ${facility.facility_code}` : 'Enter verified property & building metrics'}
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fac-name">
                  Facility Name *
                </label>
                <input id="fac-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="e.g. Apex Tier-IV Data Center"/>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-code">
                  Asset Code *
                </label>
                <input id="fac-code" type="text" required value={facilityCode} onChange={(e) => setFacilityCode(e.target.value.toUpperCase())} className="form-control" placeholder="FAC-001"/>
                {errors.facilityCode && <span className="form-error">{errors.facilityCode}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fac-type">
                  Classification Type
                </label>
                <select id="fac-type" value={type} onChange={(e) => setType(e.target.value)} className="form-control">
                  <option value="office">Corporate Office</option>
                  <option value="warehouse">Logistics Warehouse</option>
                  <option value="laboratory">Research Lab</option>
                  <option value="datacenter">Data Center</option>
                  <option value="manufacturing">Manufacturing Plant</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-status">
                  Operational Status
                </label>
                <select id="fac-status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
                  <option value="operational">Operational</option>
                  <option value="under_maintenance">Under Maintenance</option>
                  <option value="closed">Decommissioned</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-condition">
                  Condition Rating
                </label>
                <select id="fac-condition" value={conditionRating} onChange={(e) => setConditionRating(e.target.value)} className="form-control">
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fac-address">
                Street Address *
              </label>
              <input id="fac-address" type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" placeholder="100 Technology Loop, Suite 400"/>
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fac-city">
                  City *
                </label>
                <input id="fac-city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="form-control"/>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-state">
                  State / Prov *
                </label>
                <input id="fac-state" type="text" required value={state} onChange={(e) => setState(e.target.value)} className="form-control" placeholder="CA"/>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-zip">
                  Postal Code
                </label>
                <input id="fac-zip" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="form-control" placeholder="94105"/>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fac-capacity">
                  Maximum Occupancy Capacity
                </label>
                <input id="fac-capacity" type="number" min="1" required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="form-control"/>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-sqft">
                  Gross Area (Square Feet)
                </label>
                <input id="fac-sqft" type="number" min="100" required value={squareFeet} onChange={(e) => setSquareFeet(Number(e.target.value))} className="form-control"/>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fac-dept">
                  Managing Department
                </label>
                <input id="fac-dept" type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className="form-control" placeholder="e.g. Cloud Infrastructure"/>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fac-manager">
                  Facility Manager Lead
                </label>
                <input id="fac-manager" type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} className="form-control" placeholder="e.g. Sarah Chen"/>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Save size={15}/>
              <span>{isLoading ? 'Saving...' : facility ? 'Update Facility' : 'Register Facility'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
}
