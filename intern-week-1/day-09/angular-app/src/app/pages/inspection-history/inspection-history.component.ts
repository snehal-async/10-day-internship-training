import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InspectionService } from '../../core/services/inspection.service';
import { FacilityService } from '../../core/services/facility.service';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { ConditionIndicatorPipe } from '../../shared/pipes/condition-indicator.pipe';
import { Inspection, Facility } from '../../models';

@Component({
  selector: 'app-inspection-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatusBadgePipe, ConditionIndicatorPipe],
  template: `
    <div class="history-page">
      <header class="page-header">
        <div>
          <h1>Inspection History & Audit Logs</h1>
          <p class="subtitle">Complete chronological record of statutory facility audits, performance scores, and corrective findings.</p>
        </div>
        <a routerLink="/inspections/new" class="btn btn-primary">
          <span>+ Record New Inspection</span>
        </a>
      </header>

      <!-- Search & Filters Toolbar -->
      <div class="filters-card">
        <div class="filters-grid">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search reference, inspector, or observations..." 
              [(ngModel)]="searchQuery"
              (input)="applyFilters()"
            />
          </div>

          <div class="filter-group">
            <select [(ngModel)]="selectedFacilityId" (change)="applyFilters()">
              <option [ngValue]="null">All Facilities</option>
              <option *ngFor="let fac of facilities" [ngValue]="fac.id">
                {{ fac.name }} ({{ fac.facility_code }})
              </option>
            </select>
          </div>

          <div class="filter-group">
            <select [(ngModel)]="selectedResult" (change)="applyFilters()">
              <option value="ALL">All Audit Results</option>
              <option value="passed">Passed</option>
              <option value="needs_improvement">Needs Improvement</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div class="filter-group">
            <select [(ngModel)]="sortBy" (change)="applyFilters()">
              <option value="date_desc">Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="score_desc">Score (Highest First)</option>
              <option value="score_asc">Score (Lowest First)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="state-card loading-state">
        <div class="spinner"></div>
        <p>Retrieving statutory inspection audit logs...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage && !loading" class="state-card error-state">
        <span class="icon">⚠️</span>
        <h3>Failed to load audit records</h3>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-secondary" (click)="loadData()">Retry Fetch</button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !errorMessage && filteredInspections.length === 0" class="state-card empty-state">
        <span class="icon">📋</span>
        <h3>No inspection logs match criteria</h3>
        <p>Try resetting your filter parameters or register a new compliance inspection.</p>
        <button class="btn btn-secondary" (click)="resetFilters()">Clear Filters</button>
      </div>

      <!-- Inspection Cards / Table -->
      <div *ngIf="!loading && !errorMessage && filteredInspections.length > 0" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Audit Ref</th>
              <th>Facility</th>
              <th>Inspection Date</th>
              <th>Auditor / Badge</th>
              <th>Compliance Score</th>
              <th>Audit Result</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let insp of filteredInspections">
              <tr class="inspection-row">
                <td class="font-mono">
                  <strong>{{ insp.inspection_number }}</strong>
                </td>
                <td>
                  <a [routerLink]="['/facilities', insp.facility_id]" class="facility-link">
                    {{ insp.facility?.name || 'Facility #' + insp.facility_id }}
                  </a>
                  <span class="facility-code">{{ insp.facility?.facility_code }}</span>
                </td>
                <td>{{ insp.inspection_date | date:'mediumDate' }}</td>
                <td>
                  <div class="auditor-cell">
                    <span class="auditor-name">{{ insp.inspector?.name || 'Authorized Inspector' }}</span>
                    <span class="auditor-badge" *ngIf="insp.inspector?.email">{{ insp.inspector?.email }}</span>
                  </div>
                </td>
                <td>
                  <div class="score-display">
                    <span class="score-num font-mono">{{ insp.score }}%</span>
                    <div class="score-bar-bg">
                      <div class="score-bar-fill" [style.width.%]="insp.score" [ngClass]="getScoreColor(insp.score)"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="insp.result | statusBadge">
                    {{ insp.result | conditionIndicator }}
                  </span>
                </td>
                <td>
                  <span class="follow-up-tag" *ngIf="insp.follow_up_required" title="Requires scheduled verification">
                    ⚠️ Follow-up: {{ insp.follow_up_date | date:'shortDate' }}
                  </span>
                  <span class="cleared-tag" *ngIf="!insp.follow_up_required">
                    ✓ Cleared
                  </span>
                </td>
                <td>
                  <button class="btn btn-ghost" (click)="toggleExpand(insp.id)">
                    {{ expandedId === insp.id ? 'Hide Details' : 'View Notes' }}
                  </button>
                </td>
              </tr>
              <!-- Expanded Notes Accordion Row -->
              <tr *ngIf="expandedId === insp.id" class="details-row">
                <td colspan="8">
                  <div class="expanded-notes">
                    <h4>Auditor Observations & Compliance Findings</h4>
                    <p class="notes-text">{{ insp.notes || 'No detailed qualitative observations recorded.' }}</p>
                    <div class="notes-meta">
                      <span>Recorded on: {{ insp.created_at | date:'medium' }}</span>
                      <span *ngIf="insp.inspector?.role">Role: {{ insp.inspector?.role }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .history-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
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
    .filters-card {
      background: var(--color-surface, #1e293b);
      border: 1px solid var(--color-border, #334155);
      border-radius: 10px;
      padding: 1rem 1.25rem;
    }
    .filters-grid {
      display: grid;
      grid-template-columns: 2fr 1.25fr 1fr 1fr;
      gap: 1rem;
    }
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      color: var(--color-text-muted, #94a3b8);
      pointer-events: none;
    }
    .search-box input {
      width: 100%;
      background: var(--color-surface-soft, #0f172a);
      border: 1px solid var(--color-border, #334155);
      border-radius: 8px;
      padding: 0.6rem 0.85rem 0.6rem 2.4rem;
      color: var(--color-text, #f8fafc);
      font-size: 0.9rem;
    }
    .search-box input:focus {
      outline: none;
      border-color: var(--color-primary, #6366f1);
    }
    .filter-group select {
      width: 100%;
      background: var(--color-surface-soft, #0f172a);
      border: 1px solid var(--color-border, #334155);
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      color: var(--color-text, #f8fafc);
      font-size: 0.9rem;
    }
    .filter-group select:focus {
      outline: none;
      border-color: var(--color-primary, #6366f1);
    }
    .table-container {
      background: var(--color-surface, #1e293b);
      border: 1px solid var(--color-border, #334155);
      border-radius: 10px;
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    .data-table th {
      background: var(--color-surface-soft, #0f172a);
      padding: 0.85rem 1rem;
      color: var(--color-text-muted, #94a3b8);
      font-weight: 600;
      border-bottom: 1px solid var(--color-border, #334155);
      white-space: nowrap;
    }
    .data-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--color-border, #334155);
      color: var(--color-text, #f8fafc);
    }
    .inspection-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .facility-link {
      display: block;
      color: #818cf8;
      text-decoration: none;
      font-weight: 500;
    }
    .facility-link:hover {
      text-decoration: underline;
    }
    .facility-code {
      font-size: 0.75rem;
      color: var(--color-text-muted, #94a3b8);
    }
    .auditor-cell {
      display: flex;
      flex-direction: column;
    }
    .auditor-name {
      font-weight: 500;
    }
    .auditor-badge {
      font-size: 0.75rem;
      color: var(--color-text-muted, #94a3b8);
    }
    .score-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .score-num {
      width: 38px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .score-bar-bg {
      flex: 1;
      height: 6px;
      background: #334155;
      border-radius: 3px;
      overflow: hidden;
      min-width: 60px;
    }
    .score-bar-fill {
      height: 100%;
      border-radius: 3px;
    }
    .score-bar-fill.high { background: #10b981; }
    .score-bar-fill.mid { background: #f59e0b; }
    .score-bar-fill.low { background: #ef4444; }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .badge-neutral { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; }

    .follow-up-tag {
      font-size: 0.8rem;
      color: #fbbf24;
      font-weight: 500;
    }
    .cleared-tag {
      font-size: 0.8rem;
      color: #34d399;
      font-weight: 500;
    }
    .btn-ghost {
      background: transparent;
      border: 1px solid var(--color-border, #334155);
      color: var(--color-text-muted, #94a3b8);
      border-radius: 6px;
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--color-text, #f8fafc);
    }
    .details-row {
      background: rgba(15, 23, 42, 0.7);
    }
    .expanded-notes {
      padding: 1.25rem;
      border-left: 3px solid var(--color-primary, #6366f1);
    }
    .expanded-notes h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
      color: var(--color-text, #f8fafc);
    }
    .notes-text {
      color: var(--color-text-muted, #cbd5e1);
      margin: 0 0 0.75rem 0;
      line-height: 1.5;
    }
    .notes-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.75rem;
      color: #64748b;
    }
    .state-card {
      background: var(--color-surface, #1e293b);
      border: 1px solid var(--color-border, #334155);
      border-radius: 10px;
      padding: 3rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .state-card .icon {
      font-size: 2.25rem;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--color-primary, #6366f1);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .btn {
      padding: 0.65rem 1.25rem;
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
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .btn-secondary {
      background: var(--color-surface-soft, #0f172a);
      color: var(--color-text, #f8fafc);
      border: 1px solid var(--color-border, #334155);
    }
    @media (max-width: 900px) {
      .filters-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }
      .page-header {
        flex-direction: column;
      }
      .page-header .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class InspectionHistoryComponent implements OnInit {
  inspections: Inspection[] = [];
  filteredInspections: Inspection[] = [];
  facilities: Facility[] = [];
  loading = true;
  errorMessage = '';

  searchQuery = '';
  selectedFacilityId: number | null = null;
  selectedResult = 'ALL';
  sortBy = 'date_desc';
  expandedId: number | null = null;

  constructor(
    private inspectionService: InspectionService,
    private facilityService: FacilityService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Load facilities for lookup dropdown
    this.facilityService.getFacilities().subscribe({
      next: (facs) => (this.facilities = facs),
      error: () => {}
    });

    this.inspectionService.getInspections().subscribe({
      next: (data) => {
        this.inspections = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Network error fetching inspection history.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.inspections];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        i =>
          i.inspection_number.toLowerCase().includes(q) ||
          (i.notes && i.notes.toLowerCase().includes(q)) ||
          (i.inspector?.name && i.inspector.name.toLowerCase().includes(q)) ||
          (i.facility?.name && i.facility.name.toLowerCase().includes(q))
      );
    }

    // Filter by facility
    if (this.selectedFacilityId !== null) {
      result = result.filter(i => i.facility_id === this.selectedFacilityId);
    }

    // Filter by result
    if (this.selectedResult !== 'ALL') {
      result = result.filter(i => i.result === this.selectedResult);
    }

    // Sorting
    result.sort((a, b) => {
      switch (this.sortBy) {
        case 'date_asc':
          return new Date(a.inspection_date).getTime() - new Date(b.inspection_date).getTime();
        case 'score_desc':
          return b.score - a.score;
        case 'score_asc':
          return a.score - b.score;
        case 'date_desc':
        default:
          return new Date(b.inspection_date).getTime() - new Date(a.inspection_date).getTime();
      }
    });

    this.filteredInspections = result;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedFacilityId = null;
    this.selectedResult = 'ALL';
    this.sortBy = 'date_desc';
    this.applyFilters();
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  getScoreColor(score: number): string {
    if (score >= 85) return 'high';
    if (score >= 70) return 'mid';
    return 'low';
  }
}
