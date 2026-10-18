import React, { useState, useEffect, useRef } from 'react';
import { X, ClipboardCheck, Save } from 'lucide-react';
import { animateModalEntrance } from '../../utils/animations';
export function InspectionFormModal({ isOpen, facilities, inspectors, preselectedFacilityId, onClose, onSubmit, isLoading, }) {
    const dialogRef = useRef(null);
    const [facilityId, setFacilityId] = useState(1);
    const [inspectorId, setInspectorId] = useState(1);
    const [inspectionCode, setInspectionCode] = useState('');
    const [inspectionDate, setInspectionDate] = useState('');
    const [score, setScore] = useState(88);
    const [outcome, setOutcome] = useState('passed');
    const [findings, setFindings] = useState('');
    const [requiresFollowUp, setRequiresFollowUp] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (isOpen) {
            const targetFacId = preselectedFacilityId || (facilities.length > 0 ? facilities[0].id : 1);
            setFacilityId(targetFacId);
            setInspectorId(inspectors.length > 0 ? inspectors[0].id : 1);
            const randomSuffix = Math.floor(100 + Math.random() * 900);
            setInspectionCode(`INS-${new Date().getFullYear()}-${randomSuffix}`);
            setInspectionDate(new Date().toISOString().split('T')[0]);
            setScore(88);
            setOutcome('passed');
            setFindings('');
            setRequiresFollowUp(false);
            setFollowUpDate('');
            setErrors({});
        }
    }, [isOpen, preselectedFacilityId, facilities, inspectors]);
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            animateModalEntrance(dialogRef.current);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    // Real-time compliance grade computation
    function getScoreGrade(val) {
        if (val >= 90)
            return { label: 'Grade A — Exceptional Compliance', color: 'var(--emerald-600)', outcome: 'passed' };
        if (val >= 80)
            return { label: 'Grade B — Standard Passed', color: 'var(--emerald-600)', outcome: 'passed' };
        if (val >= 60)
            return { label: 'Grade C — Needs Corrective Action', color: 'var(--amber-600)', outcome: 'needs_improvement' };
        return { label: 'Critical Failure — Immediate Mandate', color: 'var(--rose-600)', outcome: 'failed' };
    }
    function handleScoreChange(newScore) {
        setScore(newScore);
        const grade = getScoreGrade(newScore);
        setOutcome(grade.outcome);
        if (grade.outcome === 'failed' || grade.outcome === 'needs_improvement') {
            setRequiresFollowUp(true);
            // Auto-set 14 days later
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + 14);
            setFollowUpDate(nextDate.toISOString().split('T')[0]);
        }
        else {
            setRequiresFollowUp(false);
            setFollowUpDate('');
        }
    }
    function validate() {
        const errs = {};
        if (!facilityId)
            errs.facilityId = 'Facility is required';
        if (!inspectorId)
            errs.inspectorId = 'Inspector is required';
        if (!inspectionCode.trim() || inspectionCode.length < 4) {
            errs.inspectionCode = 'Audit code must be at least 4 characters';
        }
        if (!inspectionDate)
            errs.inspectionDate = 'Inspection date is required';
        if (findings.trim().length < 10) {
            errs.findings = 'Qualitative observations must be at least 10 characters';
        }
        if (requiresFollowUp && !followUpDate) {
            errs.followUpDate = 'Follow-up deadline date is required';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit({
            facility_id: Number(facilityId),
            inspector_id: Number(inspectorId),
            inspection_code: inspectionCode,
            inspection_date: inspectionDate,
            score: Number(score),
            outcome,
            findings,
            requires_follow_up: requiresFollowUp,
            follow_up_date: requiresFollowUp ? followUpDate : null,
        });
    }
    const currentGrade = getScoreGrade(score);
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
              <ClipboardCheck size={20}/>
            </div>
            <div>
              <h3 className="modal-title">Record Statutory Facility Audit</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Field inspector evaluation & compliance scoring engine
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ins-facility">
                  Select Facility Asset *
                </label>
                <select id="ins-facility" required value={facilityId} onChange={(e) => setFacilityId(Number(e.target.value))} className="form-control">
                  {facilities.map((fac) => (<option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.facility_code}) - {fac.city}
                    </option>))}
                </select>
                {errors.facilityId && <span className="form-error">{errors.facilityId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ins-inspector">
                  Certified Inspector *
                </label>
                <select id="ins-inspector" required value={inspectorId} onChange={(e) => setInspectorId(Number(e.target.value))} className="form-control">
                  {inspectors.map((insp) => (<option key={insp.id} value={insp.id}>
                      {insp.name} ({insp.email})
                    </option>))}
                </select>
                {errors.inspectorId && <span className="form-error">{errors.inspectorId}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ins-code">
                  Audit Protocol Reference *
                </label>
                <input id="ins-code" type="text" required value={inspectionCode} onChange={(e) => setInspectionCode(e.target.value)} className="form-control" placeholder="INS-2026-001"/>
                {errors.inspectionCode && <span className="form-error">{errors.inspectionCode}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ins-date">
                  Evaluation Date *
                </label>
                <input id="ins-date" type="date" required value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} className="form-control"/>
                {errors.inspectionDate && <span className="form-error">{errors.inspectionDate}</span>}
              </div>
            </div>

            {/* Dynamic Compliance Score Slider */}
            <div className="score-slider-wrapper" style={{ margin: '1rem 0' }}>
              <div className="score-slider-header">
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Compliance Audit Score:
                  </span>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: currentGrade.color }}>
                    {currentGrade.label}
                  </div>
                </div>
                <div className="score-display-pill" style={{ color: currentGrade.color }}>
                  {score}%
                </div>
              </div>

              <input type="range" min="0" max="100" step="1" value={score} onChange={(e) => handleScoreChange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-600)', cursor: 'pointer' }} aria-label="Compliance score percentage slider"/>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                <span>0% (Critical Failure)</span>
                <span>60% (Threshold)</span>
                <span>80% (Pass Standard)</span>
                <span>100% (Perfect)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ins-outcome">
                  Statutory Outcome Category
                </label>
                <select id="ins-outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} className="form-control">
                  <option value="passed">Passed Audit</option>
                  <option value="needs_improvement">Needs Improvement</option>
                  <option value="failed">Failed Audit</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                  <input type="checkbox" checked={requiresFollowUp} onChange={(e) => setRequiresFollowUp(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--primary-600)' }}/>
                  <span>Mandatory Remediation Follow-up Required</span>
                </label>
                {requiresFollowUp && (<div style={{ marginTop: '0.5rem' }}>
                    <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="form-control" placeholder="Follow-up deadline date"/>
                    {errors.followUpDate && <span className="form-error">{errors.followUpDate}</span>}
                  </div>)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ins-findings">
                Inspector Qualitative Observations & Findings * (Min 10 characters)
              </label>
              <textarea id="ins-findings" rows={4} required value={findings} onChange={(e) => setFindings(e.target.value)} className="form-control" placeholder="Detail physical inspection of HVAC filtration, electrical risers, fire extinguishers, emergency egress illumination, and hazardous material storage..."/>
              {errors.findings && <span className="form-error">{errors.findings}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Save size={15}/>
              <span>{isLoading ? 'Submitting Audit...' : 'Register Inspection Audit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
}
