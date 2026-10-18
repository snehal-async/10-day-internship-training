import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { ApiService } from '../../core/services/api.service';
import { DashboardSummaryData } from '../../models';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { ConditionIndicatorPipe } from '../../shared/pipes/condition-indicator.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MetricCardComponent,
    StatusBadgePipe,
    ConditionIndicatorPipe
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Facility Inspection Overview</h1>
          <p class="page-subtitle">
            Enterprise health telemetry, compliance metrics, and active maintenance tickets.
          </p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-secondary" (click)="loadDashboard()" [disabled]="isLoading">
            <span [class.animate-spin]="isLoading">🔄</span>
            <span>Refresh</span>
          </button>
          <a routerLink="/inspections/new" class="btn btn-primary">
            <span>➕</span>
            <span>New Inspection</span>
          </a>
        </div>
      </div>

      <!-- Demo Mode Banner -->
      <div class="demo-banner" *ngIf="(api.isDemoMode$ | async)">
        <div class="banner-badge">DEMO DATA MODE</div>
        <div>
          Displaying verified local fixture data from the Day 8 PostgreSQL schema. Backend calls are emulated.
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-box" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading real-time inspection analytics...</p>
      </div>

      <!-- Error State -->
      <div class="error-box" *ngIf="errorMessage && !isLoading">
        <span class="error-icon">⚠️</span>
        <div>
          <h4>Failed to synchronize with server</h4>
          <p>{{ errorMessage }}</p>
        </div>
        <button class="btn btn-primary" (click)="loadDashboard()">Retry</button>
      </div>

      <!-- Content Area -->
      <div *ngIf="summary && !isLoading">
        <!-- KPI Metrics Grid -->
        <div class="kpi-grid">
          <app-metric-card
            title="Total Facilities"
            [value]="summary.metrics.totalFacilities"
            icon="🏢"
            subtitle="Registered physical sites"
            status="info"
            routerLinkTarget="/facilities"
          />
          <app-metric-card
            title="Audits Completed"
            [value]="summary.metrics.inspectionsCompleted"
            icon="📋"
            subtitle="Safety certifications"
            status="success"
            routerLinkTarget="/inspections/history"
          />
          <app-metric-card
            title="Pending Follow-Ups"
            [value]="summary.metrics.pendingInspections"
            icon="⏳"
            [subtitle]="summary.metrics.pendingInspections > 0 ? 'Requires re-inspection' : 'Zero hazard backlogs'"
            [status]="summary.metrics.pendingInspections > 0 ? 'warning' : 'success'"
            routerLinkTarget="/inspections/history"
          />
          <app-metric-card
            title="Open Complaints"
            [value]="summary.metrics.openComplaints"
            icon="⚠️"
            [subtitle]="summary.metrics.inProgressComplaints + ' tickets in progress'"
            [status]="summary.metrics.openComplaints > 0 ? 'danger' : 'success'"
          />
        </div>

        <!-- 2-Column Section: Recent Audits & Maintenance Tickets -->
        <div class="grid-2col">
          <!-- Recent Safety Audits -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon">📋</span>
                <span>Recent Safety Audits</span>
              </div>
              <a routerLink="/inspections/history" class="panel-link">View All &rarr;</a>
            </div>

            <div class="table-container">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>Audit #</th>
                    <th>Facility</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let audit of summary.recentInspections">
                    <td>
                      <span class="code-pill">{{ audit.inspection_number }}</span>
                    </td>
                    <td>
                      <div class="facility-cell">
                        <span class="fac-name">{{ audit.facility?.name || 'Facility #' + audit.facility_id }}</span>
                        <span class="fac-code">{{ audit.facility?.facility_code }}</span>
                      </div>
                    </td>
                    <td>{{ audit.inspection_date | date:'mediumDate' }}</td>
                    <td>
                      <div class="score-pill" [ngClass]="getScoreClass(audit.score)">
                        {{ audit.score }}/100
                      </div>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="audit.result | statusBadge">
                        {{ audit.result | conditionIndicator }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="summary.recentInspections.length === 0">
                    <td colspan="5" class="empty-cell">No audits recorded yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Active Maintenance Complaints -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon">🛠️</span>
                <span>Active Work Orders & Complaints</span>
              </div>
              <span class="badge badge-info">{{ summary.metrics.resolutionRate }}% Resolved</span>
            </div>

            <div class="table-container">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Title & Facility</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let comp of summary.recentComplaints">
                    <td>
                      <span class="code-pill">{{ comp.ticket_number }}</span>
                    </td>
                    <td>
                      <div class="facility-cell">
                        <span class="fac-name">{{ comp.title }}</span>
                        <span class="fac-code">{{ comp.facility?.name || 'Facility #' + comp.facility_id }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="comp.severity | statusBadge">
                        {{ comp.severity }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="comp.status | statusBadge">
                        {{ comp.status | conditionIndicator }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="summary.recentComplaints.length === 0">
                    <td colspan="4" class="empty-cell">No active complaints.</td>
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
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }
    .page-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.03em;
    }
    .page-subtitle {
      color: #9ca3af;
      font-size: 0.925rem;
      margin-top: 0.25rem;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .demo-banner {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      font-size: 0.85rem;
    }
    .banner-badge {
      background: #f59e0b;
      color: #0b0f19;
      font-weight: 800;
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
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
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    .panel-header {
      padding: 1.15rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .panel-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .panel-icon {
      font-size: 1.15rem;
    }
    .panel-link {
      color: #818cf8;
      text-decoration: none;
      font-size: 0.825rem;
      font-weight: 600;
    }
    .panel-link:hover {
      text-decoration: underline;
    }

    .table-container {
      overflow-x: auto;
    }
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;
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
    .styled-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .facility-cell {
      display: flex;
      flex-direction: column;
    }
    .fac-name {
      font-weight: 600;
      color: #ffffff;
    }
    .fac-code {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .code-pill {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #c7d2fe;
    }

    .score-pill {
      font-weight: 700;
      font-size: 0.825rem;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-block;
    }
    .score-high { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .score-med { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .score-low { background: rgba(239, 68, 68, 0.15); color: #f87171; }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-passed, .badge-resolved, .badge-operational {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }
    .badge-conditional_pass, .badge-in_progress, .badge-low {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
    }
    .badge-open, .badge-medium, .badge-under_maintenance {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
    }
    .badge-failed, .badge-high {
      background: rgba(249, 115, 22, 0.15);
      border: 1px solid rgba(249, 115, 22, 0.35);
      color: #fb923c;
    }
    .badge-critical_failure, .badge-urgent, .badge-critical {
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
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .btn-primary {
      background: #6366f1;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .btn-primary:hover {
      background: #4f46e5;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .loading-box, .error-box {
      background: rgba(17, 24, 39, 0.85);
      border-radius: 14px;
      padding: 3rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: #9ca3af;
      margin-bottom: 2rem;
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
    .animate-spin { display: inline-block; animation: spin 0.8s linear infinite; }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  public readonly api = inject(ApiService);

  public summary: DashboardSummaryData | null = null;
  public isLoading = true;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  public loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService.getSummaryData().subscribe({
      next: data => {
        this.summary = data;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err?.message || 'Unable to retrieve dashboard metrics from the API.';
        this.isLoading = false;
      }
    });
  }

  public getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-med';
    return 'score-low';
  }

  public getResultBadgeClass(result: string): string {
    return 'badge-' + result.toLowerCase();
  }
}
