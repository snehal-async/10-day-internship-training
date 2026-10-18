import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FacilityService } from '../../core/services/facility.service';
import { InspectionService } from '../../core/services/inspection.service';
import { ComplaintService } from '../../core/services/complaint.service';
import { Facility, Inspection, Complaint } from '../../models';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { ConditionIndicatorPipe } from '../../shared/pipes/condition-indicator.pipe';

@Component({
  selector: 'app-facility-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusBadgePipe,
    ConditionIndicatorPipe
  ],
  template: `
    <div class="page-container">
      <!-- Back Navigation -->
      <div class="breadcrumb-bar">
        <a routerLink="/facilities" class="back-link">&larr; Back to Facilities Directory</a>
      </div>

      <!-- Loading State -->
      <div class="state-box" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Fetching facility profile & inspection history...</p>
      </div>

      <!-- Error State -->
      <div class="error-box" *ngIf="errorMessage && !isLoading">
        <span class="error-icon">⚠️</span>
        <div>
          <h4>Facility Not Found</h4>
          <p>{{ errorMessage }}</p>
        </div>
        <a routerLink="/facilities" class="btn btn-primary">Return to Directory</a>
      </div>

      <!-- Facility Details View -->
      <div *ngIf="facility && !isLoading">
        <!-- Profile Header Card -->
        <div class="profile-header-card">
          <div class="header-main">
            <div class="title-cluster">
              <span class="code-badge">{{ facility.facility_code }}</span>
              <h1 class="facility-name">{{ facility.name }}</h1>
              <div class="badges-row">
                <span class="badge" [ngClass]="facility.condition_rating | conditionIndicator:'class'">
                  {{ facility.condition_rating | conditionIndicator:'icon' }} {{ facility.condition_rating | uppercase }}
                </span>
                <span class="badge" [ngClass]="'badge-' + facility.status">
                  {{ facility.status | statusBadge }}
                </span>
                <span class="type-pill">{{ facility.facility_type | uppercase }}</span>
              </div>
            </div>
            <div class="header-actions">
              <a [routerLink]="['/inspections/new']" [queryParams]="{ facilityId: facility.id }" class="btn btn-primary">
                <span>📋</span>
                <span>Record New Audit</span>
              </a>
            </div>
          </div>

          <!-- Specs Grid -->
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Department / Unit</span>
              <span class="spec-value">{{ facility.department_name || 'General Corporate' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Street Address</span>
              <span class="spec-value">📍 {{ facility.address }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">City, State & Postal</span>
              <span class="spec-value">{{ facility.city }}{{ facility.state ? ', ' + facility.state : '' }} {{ facility.postal_code || '' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Design Occupancy</span>
              <span class="spec-value">{{ facility.capacity ? (facility.capacity | number) + ' persons' : 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- 2-Column Section: Audit History & Active Work Orders -->
        <div class="grid-2col">
          <!-- Safety Audit History -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title">
                <span>📋</span>
                <span>Audit History ({{ inspections.length }})</span>
              </div>
              <a [routerLink]="['/inspections/new']" [queryParams]="{ facilityId: facility.id }" class="panel-btn">
                + Log Audit
              </a>
            </div>

            <div class="table-container">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>Audit #</th>
                    <th>Date</th>
                    <th>Inspector</th>
                    <th>Score</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let audit of inspections">
                    <td>
                      <span class="code-pill">{{ audit.inspection_number }}</span>
                    </td>
                    <td>{{ audit.inspection_date | date:'mediumDate' }}</td>
                    <td>{{ audit.inspector?.name || 'Staff' }}</td>
                    <td>
                      <span class="score-tag" [ngClass]="getScoreClass(audit.score)">
                        {{ audit.score }}/100
                      </span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="'badge-' + audit.result">
                        {{ audit.result | statusBadge }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="inspections.length === 0">
                    <td colspan="5" class="empty-cell">
                      No inspection history recorded for this facility.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Active Maintenance Complaints -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title">
                <span>🛠️</span>
                <span>Reported Issues & Tickets ({{ complaints.length }})</span>
              </div>
            </div>

            <div class="table-container">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Description</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let comp of complaints">
                    <td>
                      <span class="code-pill">{{ comp.ticket_number }}</span>
                    </td>
                    <td>
                      <div class="comp-title">{{ comp.title }}</div>
                      <div class="comp-desc">{{ comp.description }}</div>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="'badge-' + comp.severity">
                        {{ comp.severity }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="'badge-' + comp.status">
                        {{ comp.status | statusBadge }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="complaints.length === 0">
                    <td colspan="4" class="empty-cell">
                      Zero complaints or active maintenance tickets logged.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1380px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .breadcrumb-bar {
      margin-bottom: 1.5rem;
    }
    .back-link {
      color: #818cf8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .back-link:hover {
      text-decoration: underline;
    }

    .profile-header-card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    .header-main {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .title-cluster {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .code-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
    }
    .facility-name {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.03em;
    }
    .badges-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }
    .type-pill {
      font-size: 0.725rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.06);
      color: #d1d5db;
      padding: 3px 9px;
      border-radius: 9999px;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .spec-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9ca3af;
      font-weight: 600;
    }
    .spec-value {
      font-size: 0.95rem;
      color: #ffffff;
      font-weight: 500;
    }

    .grid-2col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 600px) {
      .grid-2col {
        grid-template-columns: 1fr;
      }
    }

    .panel-card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
    }
    .panel-header {
      padding: 1.15rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .panel-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .panel-btn {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.35);
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.775rem;
      font-weight: 600;
      text-decoration: none;
    }

    .table-container {
      overflow-x: auto;
    }
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      text-align: left;
    }
    .styled-table th {
      background: rgba(17, 24, 39, 0.5);
      padding: 0.85rem 1.25rem;
      color: #9ca3af;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .styled-table td {
      padding: 0.95rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      color: #e5e7eb;
      vertical-align: middle;
    }

    .code-pill {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #c7d2fe;
    }

    .score-tag {
      font-weight: 700;
      font-size: 0.8rem;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .score-high { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .score-med { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .score-low { background: rgba(239, 68, 68, 0.15); color: #f87171; }

    .comp-title { font-weight: 600; color: #ffffff; }
    .comp-desc { font-size: 0.775rem; color: #9ca3af; margin-top: 2px; }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 9999px;
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: capitalize;
    }
    .badge-success, .badge-passed, .badge-resolved, .badge-operational {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }
    .badge-info, .badge-conditional_pass, .badge-in_progress, .badge-low {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
    }
    .badge-warning, .badge-open, .badge-medium, .badge-under_maintenance {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
    }
    .badge-failed, .badge-high {
      background: rgba(249, 115, 22, 0.15);
      border: 1px solid rgba(249, 115, 22, 0.35);
      color: #fb923c;
    }
    .badge-danger, .badge-critical_failure, .badge-urgent, .badge-critical {
      background: rgba(239, 68, 68, 0.18);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.15rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid transparent;
    }
    .btn-primary { background: #6366f1; color: #ffffff; }
    .btn-primary:hover { background: #4f46e5; }

    .state-box, .error-box {
      background: rgba(17, 24, 39, 0.85);
      border-radius: 16px;
      padding: 3.5rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: #9ca3af;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class FacilityDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly facilityService = inject(FacilityService);
  private readonly inspectionService = inject(InspectionService);
  private readonly complaintService = inject(ComplaintService);

  public facility: Facility | null = null;
  public inspections: Inspection[] = [];
  public complaints: Complaint[] = [];
  public isLoading = true;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadFacilityData(id);
      } else {
        this.errorMessage = 'No facility ID was specified in the route.';
        this.isLoading = false;
      }
    });
  }

  private loadFacilityData(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.facilityService.getFacilityById(id).subscribe({
      next: fac => {
        this.facility = fac;
        this.isLoading = false;

        // Fetch related audits and tickets
        this.inspectionService.getInspections({ facility_id: fac.id }).subscribe(data => {
          this.inspections = data;
        });

        this.complaintService.getComplaints({ facility_id: fac.id }).subscribe(data => {
          this.complaints = data;
        });
      },
      error: err => {
        this.errorMessage = `Could not find facility #${id}.`;
        this.isLoading = false;
      }
    });
  }

  public getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-med';
    return 'score-low';
  }
}
