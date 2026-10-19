import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, Save } from 'lucide-react';
import { animateModalEntrance } from '../../utils/animations';
import { INITIAL_FACILITIES } from '../../data/seedData';

export function ComplaintFormModal({ isOpen, facilities, preselectedFacilityId, onClose, onSubmit, isLoading, }) {
    const dialogRef = useRef(null);
    const activeFacilities = (facilities && facilities.length > 0) ? facilities : INITIAL_FACILITIES;

    const [facilityId, setFacilityId] = useState(1);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('HVAC & Airflow');
    const [priority, setPriority] = useState('high');
    const [reportedByName, setReportedByName] = useState('On-Duty Safety Officer');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            const facList = (facilities && facilities.length > 0) ? facilities : INITIAL_FACILITIES;
            setFacilityId(preselectedFacilityId || (facList.length > 0 ? facList[0].id : 1));
            setTitle('');
            setCategory('HVAC & Airflow');
            setPriority('high');
            setReportedByName('Site Safety Officer');
            setDescription('');
            setErrors({});
        }
    }, [isOpen, preselectedFacilityId, facilities]);
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            animateModalEntrance(dialogRef.current);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    function validate() {
        const errs = {};
        if (!facilityId)
            errs.facilityId = 'Facility is required';
        if (!title.trim() || title.length < 5)
            errs.title = 'Title must be at least 5 characters';
        if (!description.trim() || description.length < 10)
            errs.description = 'Description must be at least 10 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate())
            return;
        const normPriority = (priority || 'medium').toLowerCase();
        await onSubmit({
            facility_id: Number(facilityId),
            title,
            category,
            priority: normPriority,
            severity: normPriority === 'urgent' || normPriority === 'critical' ? 'urgent' : normPriority,
            reported_by_name: reportedByName,
            description,
        });
    }
    return (<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div ref={dialogRef} className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--amber-50)',
            color: 'var(--amber-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <AlertTriangle size={20}/>
            </div>
            <div>
              <h3 className="modal-title">Log Maintenance Work Order</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Register infrastructure defect or statutory violation
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="comp-facility">
                Affected Facility Asset *
              </label>
              <select id="comp-facility" required value={facilityId} onChange={(e) => setFacilityId(Number(e.target.value))} className="form-control">
                {activeFacilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({fac.facility_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp-title">
                Incident / Issue Title *
              </label>
              <input id="comp-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="e.g. Cleanroom Airlock Differential Sensor Fluctuation"/>
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="comp-cat">
                  System Category
                </label>
                <select id="comp-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                  <option value="HVAC & Airflow">HVAC & Airflow</option>
                  <option value="Electrical">Electrical Power & UPS</option>
                  <option value="Fire & Life Safety">Fire & Life Safety</option>
                  <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                  <option value="Structural & Roofing">Structural & Roofing</option>
                  <option value="Security & Access">Security & Access</option>
                  <option value="Refrigeration">Refrigeration</option>
                  <option value="General">General Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="comp-priority">
                  Urgency / Priority
                </label>
                <select id="comp-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="form-control">
                  <option value="urgent">Urgent Priority (Immediate action)</option>
                  <option value="high">High Priority (24h response)</option>
                  <option value="medium">Medium Priority (Standard queue)</option>
                  <option value="low">Low Priority (Scheduled maintenance)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp-reporter">
                Reported By (Staff / Authority)
              </label>
              <input id="comp-reporter" type="text" value={reportedByName} onChange={(e) => setReportedByName(e.target.value)} className="form-control"/>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp-desc">
                Defect Description & Diagnostic Observations *
              </label>
              <textarea id="comp-desc" rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Specify precise physical location, diagnostic measurements, and potential impact on statutory compliance..."/>
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Save size={15}/>
              <span>{isLoading ? 'Creating Work Order...' : 'Dispatch Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
}
