import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Facility, Inspection, InspectionResult, UserSummary } from '../types';

interface InspectionModalProps {
  isOpen: boolean;
  inspection: Inspection | null;
  facilities: Facility[];
  inspectors: UserSummary[];
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: Partial<Inspection>) => Promise<void>;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  inspection,
  facilities,
  inspectors,
  isLoading,
  onClose,
  onSave,
}) => {
  const isEditing = !!inspection;

  const [formData, setFormData] = useState({
    facility_id: '',
    inspector_id: '',
    inspection_number: '',
    inspection_date: new Date().toISOString().split('T')[0],
    result: 'passed' as InspectionResult,
    score: '90',
    notes: '',
    follow_up_required: false,
    follow_up_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (inspection) {
      setFormData({
        facility_id: inspection.facility_id.toString(),
        inspector_id: inspection.inspector_id.toString(),
        inspection_number: inspection.inspection_number,
        inspection_date: inspection.inspection_date ? inspection.inspection_date.split('T')[0] : '',
        result: inspection.result,
        score: inspection.score.toString(),
        notes: inspection.notes || '',
        follow_up_required: !!inspection.follow_up_required,
        follow_up_date: inspection.follow_up_date ? inspection.follow_up_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        facility_id: facilities.length > 0 ? facilities[0].id.toString() : '',
        inspector_id: inspectors.length > 0 ? inspectors[0].id.toString() : '',
        inspection_number: `INSP-2026-${Math.floor(100 + Math.random() * 900)}`,
        inspection_date: new Date().toISOString().split('T')[0],
        result: 'passed',
        score: '92',
        notes: '',
        follow_up_required: false,
        follow_up_date: '',
      });
    }
    setErrors({});
  }, [inspection, isOpen, facilities, inspectors]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.facility_id) {
      errs.facility_id = 'Please select a facility';
    }

    if (!formData.inspector_id) {
      errs.inspector_id = 'Please assign an inspector';
    }

    if (!formData.inspection_number.trim()) {
      errs.inspection_number = 'Inspection number is required';
    }

    if (!formData.inspection_date) {
      errs.inspection_date = 'Inspection date is required';
    }

    const scoreNum = parseInt(formData.score, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      errs.score = 'Score must be between 0 and 100';
    }

    if (formData.follow_up_required && !formData.follow_up_date) {
      errs.follow_up_date = 'Follow-up date is required when follow-up is checked';
    }

    if (formData.follow_up_date && formData.inspection_date && formData.follow_up_date < formData.inspection_date) {
      errs.follow_up_date = 'Follow-up date cannot be earlier than inspection date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Partial<Inspection> = {
      facility_id: parseInt(formData.facility_id, 10),
      inspector_id: parseInt(formData.inspector_id, 10),
      inspection_number: formData.inspection_number.trim(),
      inspection_date: formData.inspection_date,
      result: formData.result,
      score: parseInt(formData.score, 10),
      notes: formData.notes.trim() || null,
      follow_up_required: formData.follow_up_required,
      follow_up_date: formData.follow_up_required && formData.follow_up_date ? formData.follow_up_date : null,
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
            <h3 className="modal-title">
              {isEditing ? `Edit Inspection: ${inspection?.inspection_number}` : 'Record Safety Inspection'}
            </h3>
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
                <label className="form-label" htmlFor="insp_facility">
                  Facility <span className="req">*</span>
                </label>
                <select
                  id="insp_facility"
                  className={`form-select ${errors.facility_id ? 'error' : ''}`}
                  value={formData.facility_id}
                  onChange={(e) => setFormData({ ...formData, facility_id: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="">Select Facility...</option>
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.facility_code})
                    </option>
                  ))}
                </select>
                {errors.facility_id && <span className="field-error">{errors.facility_id}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="insp_inspector">
                  Assigned Inspector <span className="req">*</span>
                </label>
                <select
                  id="insp_inspector"
                  className={`form-select ${errors.inspector_id ? 'error' : ''}`}
                  value={formData.inspector_id}
                  onChange={(e) => setFormData({ ...formData, inspector_id: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="">Select Inspector...</option>
                  {inspectors.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role || 'Staff'})
                    </option>
                  ))}
                </select>
                {errors.inspector_id && <span className="field-error">{errors.inspector_id}</span>}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="insp_number">
                  Inspection Number <span className="req">*</span>
                </label>
                <input
                  id="insp_number"
                  type="text"
                  className={`form-input ${errors.inspection_number ? 'error' : ''}`}
                  placeholder="INSP-2026-009"
                  value={formData.inspection_number}
                  onChange={(e) => setFormData({ ...formData, inspection_number: e.target.value })}
                  disabled={isLoading}
                />
                {errors.inspection_number && <span className="field-error">{errors.inspection_number}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="insp_date">
                  Inspection Date <span className="req">*</span>
                </label>
                <input
                  id="insp_date"
                  type="date"
                  className={`form-input ${errors.inspection_date ? 'error' : ''}`}
                  value={formData.inspection_date}
                  onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                  disabled={isLoading}
                />
                {errors.inspection_date && <span className="field-error">{errors.inspection_date}</span>}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="insp_result">
                  Audit Result <span className="req">*</span>
                </label>
                <select
                  id="insp_result"
                  className="form-select"
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value as InspectionResult })}
                  disabled={isLoading}
                >
                  <option value="passed">Passed (Compliant)</option>
                  <option value="conditional_pass">Conditional Pass (Minor Fixes)</option>
                  <option value="failed">Failed (Significant Hazards)</option>
                  <option value="critical_failure">Critical Failure (Immediate Shutdown)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="insp_score">
                  Compliance Score (0–100) <span className="req">*</span>
                </label>
                <input
                  id="insp_score"
                  type="number"
                  min="0"
                  max="100"
                  className={`form-input ${errors.score ? 'error' : ''}`}
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  disabled={isLoading}
                />
                {errors.score && <span className="field-error">{errors.score}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="insp_notes">
                Inspection Findings & Notes
              </label>
              <textarea
                id="insp_notes"
                className="form-textarea"
                rows={3}
                placeholder="Document observed conditions, sprinkler pressures, electrical compliance, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <input
                id="follow_up_req"
                type="checkbox"
                checked={formData.follow_up_required}
                onChange={(e) => setFormData({ ...formData, follow_up_required: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <label htmlFor="follow_up_req" style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                Follow-Up Re-Audit Required
              </label>
            </div>

            {formData.follow_up_required && (
              <div className="form-group">
                <label className="form-label" htmlFor="insp_follow_date">
                  Scheduled Follow-Up Date <span className="req">*</span>
                </label>
                <input
                  id="insp_follow_date"
                  type="date"
                  className={`form-input ${errors.follow_up_date ? 'error' : ''}`}
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  disabled={isLoading}
                />
                {errors.follow_up_date && <span className="field-error">{errors.follow_up_date}</span>}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Inspection' : 'Save Inspection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
