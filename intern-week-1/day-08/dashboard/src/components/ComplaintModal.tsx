import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Complaint, ComplaintSeverity, ComplaintStatus, Facility, UserSummary } from '../types';

interface ComplaintModalProps {
  isOpen: boolean;
  complaint: Complaint | null;
  facilities: Facility[];
  users: UserSummary[];
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: Partial<Complaint>) => Promise<void>;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  complaint,
  facilities,
  users,
  isLoading,
  onClose,
  onSave,
}) => {
  const isEditing = !!complaint;

  const [formData, setFormData] = useState({
    facility_id: '',
    assigned_to_id: '',
    ticket_number: '',
    title: '',
    description: '',
    severity: 'medium' as ComplaintSeverity,
    status: 'open' as ComplaintStatus,
    resolution_notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (complaint) {
      setFormData({
        facility_id: complaint.facility_id.toString(),
        assigned_to_id: complaint.assigned_to_id ? complaint.assigned_to_id.toString() : '',
        ticket_number: complaint.ticket_number,
        title: complaint.title,
        description: complaint.description,
        severity: complaint.severity,
        status: complaint.status,
        resolution_notes: complaint.resolution_notes || '',
      });
    } else {
      setFormData({
        facility_id: facilities.length > 0 ? facilities[0].id.toString() : '',
        assigned_to_id: '',
        ticket_number: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        resolution_notes: '',
      });
    }
    setErrors({});
  }, [complaint, isOpen, facilities]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.facility_id) {
      errs.facility_id = 'Please select a facility';
    }

    if (!formData.ticket_number.trim()) {
      errs.ticket_number = 'Ticket number is required';
    }

    if (!formData.title.trim()) {
      errs.title = 'Complaint title is required';
    } else if (formData.title.length > 200) {
      errs.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Detailed description is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Partial<Complaint> = {
      facility_id: parseInt(formData.facility_id, 10),
      assigned_to_id: formData.assigned_to_id ? parseInt(formData.assigned_to_id, 10) : null,
      ticket_number: formData.ticket_number.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      severity: formData.severity,
      status: formData.status,
      resolution_notes: formData.resolution_notes.trim() || null,
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
              {isEditing ? `Edit Ticket: ${complaint?.ticket_number}` : 'Create Maintenance Ticket / Complaint'}
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
                <label className="form-label" htmlFor="comp_facility">
                  Facility <span className="req">*</span>
                </label>
                <select
                  id="comp_facility"
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
                <label className="form-label" htmlFor="comp_ticket">
                  Ticket Number <span className="req">*</span>
                </label>
                <input
                  id="comp_ticket"
                  type="text"
                  className={`form-input ${errors.ticket_number ? 'error' : ''}`}
                  placeholder="CMP-2026-011"
                  value={formData.ticket_number}
                  onChange={(e) => setFormData({ ...formData, ticket_number: e.target.value })}
                  disabled={isLoading}
                />
                {errors.ticket_number && <span className="field-error">{errors.ticket_number}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp_title">
                Complaint Title <span className="req">*</span>
              </label>
              <input
                id="comp_title"
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. HVAC Compressor Unit 2 Tripping Breaker"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoading}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp_desc">
                Description of Issue <span className="req">*</span>
              </label>
              <textarea
                id="comp_desc"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows={3}
                placeholder="Describe the hazard, location within building, and symptoms..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="comp_severity">
                  Severity Level
                </label>
                <select
                  id="comp_severity"
                  className="form-select"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as ComplaintSeverity })}
                  disabled={isLoading}
                >
                  <option value="low">Low (Cosmetic / Non-critical)</option>
                  <option value="medium">Medium (Standard Maintenance)</option>
                  <option value="high">High (Operational Impairment)</option>
                  <option value="urgent">Urgent (Life Safety / Immediate)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="comp_status">
                  Ticket Status
                </label>
                <select
                  id="comp_status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ComplaintStatus })}
                  disabled={isLoading}
                >
                  <option value="open">Open (Logged)</option>
                  <option value="in_progress">In Progress (Dispatch Sent)</option>
                  <option value="resolved">Resolved (Completed)</option>
                  <option value="closed">Closed (Verified)</option>
                  <option value="rejected">Rejected (Not Applicable)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp_assigned">
                Assign Maintenance Lead
              </label>
              <select
                id="comp_assigned"
                className="form-select"
                value={formData.assigned_to_id}
                onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value })}
                disabled={isLoading}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role || 'Staff'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comp_resolution">
                Resolution & Maintenance Notes
              </label>
              <textarea
                id="comp_resolution"
                className="form-textarea"
                rows={2}
                placeholder="Log actions taken, parts replaced, or vendor ticket numbers..."
                value={formData.resolution_notes}
                onChange={(e) => setFormData({ ...formData, resolution_notes: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Ticket' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
