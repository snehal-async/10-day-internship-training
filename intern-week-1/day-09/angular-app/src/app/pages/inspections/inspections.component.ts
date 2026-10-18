import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FacilityService } from '../../core/services/facility.service';
import { InspectionService } from '../../core/services/inspection.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { Facility, Inspector } from '../../models';

@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="inspection-form-page">
      <header class="page-header">
        <a routerLink="/inspections/history" class="back-link">← View Inspection History</a>
        <h1>Record Facility Inspection</h1>
        <p class="subtitle">Complete the statutory compliance inspection form below to submit an audit to the facility registry.</p>
      </header>

      <div class="form-card">
        <form [formGroup]="inspectionForm" (ngSubmit)="onSubmit()" novalidate>
          <!-- Section 1: Facility & Inspector -->
          <div class="form-section">
            <h2 class="section-title">1. Facility & Inspector Allocation</h2>
            
            <div class="form-grid">
              <div class="form-group" [class.has-error]="isFieldInvalid('facility_id')">
                <label for="facility_id">Facility <span class="req">*</span></label>
                <select id="facility_id" formControlName="facility_id" class="form-control">
                  <option value="" disabled>-- Select Facility --</option>
                  <option *ngFor="let fac of facilities" [value]="fac.id">
                    {{ fac.facility_code }} — {{ fac.name }} ({{ fac.facility_type }})
                  </option>
                </select>
                <div class="error-msg" *ngIf="isFieldInvalid('facility_id')">
                  Facility selection is required.
                </div>
              </div>

              <div class="form-group" [class.has-error]="isFieldInvalid('inspector_id')">
                <label for="inspector_id">Lead Inspector <span class="req">*</span></label>
                <select id="inspector_id" formControlName="inspector_id" class="form-control">
                  <option value="" disabled>-- Select Lead Auditor --</option>
                  <option *ngFor="let insp of inspectors" [value]="insp.id">
                    {{ insp.name }} — {{ insp.email }} ({{ insp.role || 'Inspector' }})
                  </option>
                </select>
                <div class="error-msg" *ngIf="isFieldInvalid('inspector_id')">
                  Please designate a qualified lead auditor.
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Audit Details -->
          <div class="form-section">
            <h2 class="section-title">2. Audit Details & Outcome</h2>
            
            <div class="form-grid three-col">
              <div class="form-group" [class.has-error]="isFieldInvalid('inspection_number')">
                <label for="inspection_number">Audit Reference Code <span class="req">*</span></label>
                <input 
                  type="text" 
                  id="inspection_number" 
                  formControlName="inspection_number" 
                  class="form-control" 
                  placeholder="e.g. INS-2026-088"
                />
                <div class="error-msg" *ngIf="isFieldInvalid('inspection_number')">
                  Reference code is required (min 4 characters).
                </div>
              </div>

              <div class="form-group" [class.has-error]="isFieldInvalid('inspection_date')">
                <label for="inspection_date">Inspection Date <span class="req">*</span></label>
                <input 
                  type="date" 
                  id="inspection_date" 
                  formControlName="inspection_date" 
                  class="form-control"
                />
                <div class="error-msg" *ngIf="isFieldInvalid('inspection_date')">
                  A valid inspection date is required.
                </div>
              </div>

              <div class="form-group" [class.has-error]="isFieldInvalid('result')">
                <label for="result">Audit Result <span class="req">*</span></label>
                <select id="result" formControlName="result" class="form-control">
                  <option value="passed">Passed (Compliant)</option>
                  <option value="needs_improvement">Needs Improvement (Conditional)</option>
                  <option value="failed">Failed (Non-Compliant)</option>
                </select>
                <div class="error-msg" *ngIf="isFieldInvalid('result')">
                  Result classification is mandatory.
                </div>
              </div>
            </div>

            <!-- Score rating slider / input -->
            <div class="form-group score-group" [class.has-error]="isFieldInvalid('score')">
              <div class="score-header">
                <label for="score">Compliance Score: <strong>{{ inspectionForm.get('score')?.value }}%</strong></label>
                <span class="score-badge" [ngClass]="getScoreClass()">{{ getScoreLabel() }}</span>
              </div>
              <input 
                type="range" 
                id="score" 
                formControlName="score" 
                min="0" 
                max="100" 
                step="1"
                class="range-slider"
              />
              <div class="error-msg" *ngIf="isFieldInvalid('score')">
                Score must be between 0 and 100.
              </div>
            </div>
          </div>

          <!-- Section 3: Qualitative Findings & Observations -->
          <div class="form-section">
            <h2 class="section-title">3. Audit Observations & Corrective Actions</h2>

            <div class="form-group" [class.has-error]="isFieldInvalid('notes')">
              <label for="notes">Auditor Findings & Observations <span class="req">*</span></label>
              <textarea 
                id="notes" 
                formControlName="notes" 
                rows="4" 
                class="form-control"
                placeholder="Document observed conditions, equipment integrity, adherence to protocols, and specific non-conformities..."
              ></textarea>
              <div class="error-msg" *ngIf="isFieldInvalid('notes')">
                Comprehensive notes are required (minimum 10 characters).
              </div>
            </div>

            <div class="follow-up-card">
              <div class="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="follow_up_required" 
                  formControlName="follow_up_required" 
                />
                <label for="follow_up_required" class="checkbox-label">
                  <strong>Re-inspection / Follow-up Required</strong>
                  <span>Schedule a secondary inspection to verify corrective measures have been implemented.</span>
                </label>
              </div>

              <div class="form-group mt-3" *ngIf="inspectionForm.get('follow_up_required')?.value">
                <label for="follow_up_date">Scheduled Follow-up Date</label>
                <input 
                  type="date" 
                  id="follow_up_date" 
                  formControlName="follow_up_date" 
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              routerLink="/inspections/history"
              [disabled]="submitting"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="submitting"
            >
              <span *ngIf="submitting" class="spinner"></span>
              {{ submitting ? 'Submitting Audit...' : 'Submit Inspection' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .inspection-form-page {
      max-width: 900px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--color-primary-light, #818cf8);
      text-decoration: none;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    .page-header h1 {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: var(--color-text, #f8fafc);
    }
    .subtitle {
      color: var(--color-text-muted, #94a3b8);
      margin: 0;
      font-size: 0.95rem;
    }
    .form-card {
      background: var(--color-surface, #1e293b);
      border: 1px solid var(--color-border, #334155);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border, #334155);
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text, #f8fafc);
      margin: 0 0 1.25rem 0;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .form-grid.three-col {
      grid-template-columns: repeat(3, 1fr);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--color-text-muted, #cbd5e1);
    }
    .req {
      color: #ef4444;
    }
    .form-control {
      background: var(--color-surface-soft, #0f172a);
      border: 1px solid var(--color-border, #334155);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: var(--color-text, #f8fafc);
      font-size: 0.9rem;
      transition: all 0.2s ease;
      width: 100%;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
    .has-error .form-control {
      border-color: #ef4444;
    }
    .error-msg {
      font-size: 0.775rem;
      color: #ef4444;
      margin-top: 0.2rem;
    }
    .score-group {
      margin-top: 1.25rem;
    }
    .score-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .score-badge {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .score-badge.excellent {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }
    .score-badge.good {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }
    .score-badge.warning {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }
    .score-badge.critical {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    .range-slider {
      width: 100%;
      accent-color: var(--color-primary, #6366f1);
      cursor: pointer;
      height: 6px;
      background: #334155;
      border-radius: 4px;
    }
    .follow-up-card {
      background: var(--color-surface-soft, #0f172a);
      border: 1px solid var(--color-border, #334155);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-top: 1.25rem;
    }
    .checkbox-wrapper {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .checkbox-wrapper input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: var(--color-primary, #6366f1);
      cursor: pointer;
    }
    .checkbox-label {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      cursor: pointer;
    }
    .checkbox-label strong {
      font-size: 0.9rem;
      color: var(--color-text, #f8fafc);
    }
    .checkbox-label span {
      font-size: 0.8rem;
      color: var(--color-text-muted, #94a3b8);
    }
    .mt-3 {
      margin-top: 1rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.7rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: var(--color-surface-soft, #0f172a);
      color: var(--color-text, #f8fafc);
      border: 1px solid var(--color-border, #334155);
    }
    .btn-secondary:hover:not(:disabled) {
      background: #1e293b;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 768px) {
      .form-grid, .form-grid.three-col {
        grid-template-columns: 1fr;
      }
      .form-card {
        padding: 1.25rem;
      }
      .form-actions {
        flex-direction: column-reverse;
      }
      .form-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class InspectionsComponent implements OnInit {
  inspectionForm!: FormGroup;
  facilities: Facility[] = [];
  inspectors: Inspector[] = [];
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private facilityService: FacilityService,
    private inspectionService: InspectionService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    const generatedAuditNumber = `INS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    this.inspectionForm = this.fb.group({
      facility_id: ['', [Validators.required]],
      inspector_id: ['', [Validators.required]],
      inspection_number: [generatedAuditNumber, [Validators.required, Validators.minLength(4)]],
      inspection_date: [today, [Validators.required]],
      result: ['passed', [Validators.required]],
      score: [85, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: ['', [Validators.required, Validators.minLength(10)]],
      follow_up_required: [false],
      follow_up_date: ['']
    });

    this.loadFacilities();
    this.loadInspectors();

    // Check for pre-selected facility query param e.g. /inspections/new?facilityId=2
    this.route.queryParams.subscribe(params => {
      if (params['facilityId']) {
        const facId = Number(params['facilityId']);
        this.inspectionForm.patchValue({ facility_id: facId });
      }
    });

    // Automatically adapt follow-up requirements when audit result is failed
    this.inspectionForm.get('result')?.valueChanges.subscribe(result => {
      if (result === 'failed') {
        this.inspectionForm.patchValue({ follow_up_required: true });
      }
    });
  }

  loadFacilities(): void {
    this.facilityService.getFacilities().subscribe({
      next: (data) => (this.facilities = data),
      error: () => this.toast.error('Failed to load facilities list.')
    });
  }

  loadInspectors(): void {
    this.inspectionService.getInspectors().subscribe({
      next: (data) => {
        this.inspectors = data;
        if (data.length > 0 && !this.inspectionForm.get('inspector_id')?.value) {
          this.inspectionForm.patchValue({ inspector_id: data[0].id });
        }
      },
      error: () => this.toast.error('Failed to load inspector directory.')
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.inspectionForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getScoreClass(): string {
    const score = Number(this.inspectionForm.get('score')?.value || 0);
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  getScoreLabel(): string {
    const score = Number(this.inspectionForm.get('score')?.value || 0);
    if (score >= 90) return 'Superior (Grade A)';
    if (score >= 75) return 'Standard (Grade B)';
    if (score >= 60) return 'Substandard (Grade C)';
    return 'Critical Non-Compliance';
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid) {
      this.inspectionForm.markAllAsTouched();
      this.toast.warning('Please complete all mandatory fields with valid values.');
      return;
    }

    this.submitting = true;
    const formValue = this.inspectionForm.value;

    const payload = {
      facility_id: Number(formValue.facility_id),
      inspector_id: Number(formValue.inspector_id),
      inspection_number: formValue.inspection_number,
      inspection_date: formValue.inspection_date,
      result: formValue.result,
      score: Number(formValue.score),
      notes: formValue.notes,
      follow_up_required: !!formValue.follow_up_required,
      follow_up_date: formValue.follow_up_date || undefined
    };

    this.inspectionService.createInspection(payload).subscribe({
      next: (created) => {
        this.submitting = false;
        this.toast.success(`Inspection ${created.inspection_number} successfully recorded!`);
        this.router.navigate(['/inspections/history']);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.error(err.message || 'Failed to submit inspection audit to backend.');
      }
    });
  }
}
