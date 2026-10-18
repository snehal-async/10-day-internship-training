import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FacilityService } from '../../core/services/facility.service';
import { ApiService } from '../../core/services/api.service';
import { Facility, FacilityFilterCriteria } from '../../models';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { ConditionIndicatorPipe } from '../../shared/pipes/condition-indicator.pipe';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgePipe,
    ConditionIndicatorPipe
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Facilities Directory</h1>
          <p class="page-subtitle">
            Search, filter, and review health conditions of all registered corporate assets.
          </p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-secondary" (click)="fetchFacilities()" [disabled]="isLoading">
            <span [class.animate-spin]="isLoading">🔄</span>
            <span>Refresh</span>
          </button>
          <a routerLink="/inspections/new" class="btn btn-primary">
            <span>➕</span>
            <span>Record Audit</span>
          </a>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="filter-panel">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="filter-input search-input"
            placeholder="Search facility name, code, city..."
            [(ngModel)]="criteria.searchTerm"
            (ngModelChange)="onFilterChanged()"
          />
          <button *ngIf="criteria.searchTerm" class="clear-search" (click)="criteria.searchTerm = ''; onFilterChanged()">
            &times;
          </button>
        </div>

        <div class="filter-group">
          <!-- Type Filter -->
          <select
            class="filter-select"
            [(ngModel)]="criteria.facilityType"
            (ngModelChange)="onFilterChanged()"
          >
            <option value="">All Facility Types</option>
            <option value="office">Office</option>
            <option value="warehouse">Warehouse</option>
            <option value="laboratory">Laboratory</option>
            <option value="datacenter">Data Center</option>
            <option value="manufacturing">Manufacturing</option>
          </select>

          <!-- Condition Filter -->
          <select
            class="filter-select"
            [(ngModel)]="criteria.conditionRating"
            (ngModelChange)="onFilterChanged()"
          >
            <option value="">All Health Ratings</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="critical">Critical</option>
          </select>

          <!-- Sort Selector -->
          <select
            class="filter-select"
            [(ngModel)]="criteria.sortBy"
            (ngModelChange)="onFilterChanged()"
          >
            <option value="name">Sort by Name</option>
            <option value="code">Sort by Code</option>
            <option value="condition">Sort by Condition</option>
            <option value="city">Sort by City</option>
          </select>

          <!-- Sort Order Toggle -->
          <button
            type="button"
            class="btn btn-secondary btn-icon"
            (click)="toggleSortOrder()"
            [title]="'Sorting order: ' + criteria.sortOrder"
          >
            {{ criteria.sortOrder === 'asc' ? '⬆️ Asc' : '⬇️ Desc' }}
          </button>

          <!-- Clear All Filters -->
          <button
            type="button"
            class="btn btn-secondary"
            *ngIf="hasActiveFilters()"
            (click)="resetFilters()"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="state-box" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Retrieving registered facilities...</p>
      </div>

      <!-- Error State -->
      <div class="error-box" *ngIf="errorMessage && !isLoading">
        <span class="error-icon">⚠️</span>
        <div>
          <h4>Error loading facilities</h4>
          <p>{{ errorMessage }}</p>
        </div>
        <button class="btn btn-primary" (click)="fetchFacilities()">Retry</button>
      </div>

      <!-- Empty State -->
      <div class="empty-box" *ngIf="!isLoading && !errorMessage && facilities.length === 0">
        <span class="empty-icon">🏢</span>
        <h3>No Facilities Match Criteria</h3>
        <p>Try adjusting your search query, type filters, or condition ratings.</p>
        <button class="btn btn-secondary" (click)="resetFilters()">Reset All Filters</button>
      </div>

      <!-- Facility Data Table -->
      <div class="panel-card" *ngIf="!isLoading && !errorMessage && facilities.length > 0">
        <div class="table-container">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Facility Name</th>
                <th>Type / Department</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Last Audit</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let facility of facilities">
                <td>
                  <span class="code-pill">{{ facility.facility_code }}</span>
                </td>
                <td>
                  <a [routerLink]="['/facilities', facility.id]" class="fac-link">
                    {{ facility.name }}
                  </a>
                  <div class="sub-address">{{ facility.address }}</div>
                </td>
                <td>
                  <div class="type-cell">
                    <span class="type-title">{{ facility.facility_type | uppercase }}</span>
                    <span class="dept-title">{{ facility.department_name || 'General Operations' }}</span>
                  </div>
                </td>
                <td>
                  <span class="location-text">📍 {{ facility.city }}{{ facility.state ? ', ' + facility.state : '' }}</span>
                </td>
                <td>
                  <span class="capacity-badge" *ngIf="facility.capacity">
                    👥 {{ facility.capacity | number }}
                  </span>
                  <span class="text-dim" *ngIf="!facility.capacity">—</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="facility.condition_rating | conditionIndicator:'class'">
                    {{ facility.condition_rating | conditionIndicator:'icon' }} {{ facility.condition_rating | uppercase }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + facility.status">
                    {{ facility.status | statusBadge }}
                  </span>
                </td>
                <td>
                  <span class="audit-date" *ngIf="facility.last_inspection_date">
                    {{ facility.last_inspection_date | date:'mediumDate' }}
                  </span>
                  <span class="text-dim" *ngIf="!facility.last_inspection_date">Never</span>
                </td>
                <td style="text-align: right;">
                  <div class="action-buttons">
                    <a [routerLink]="['/facilities', facility.id]" class="btn-action" title="View Facility Details">
                      👁️ Details
                    </a>
                    <a [routerLink]="['/inspections/new']" [queryParams]="{ facilityId: facility.id }" class="btn-action-primary" title="Record Safety Inspection">
                      📋 Audit
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
      margin-bottom: 1.5rem;
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

    .filter-panel {
      background: rgba(17, 24, 39, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .search-wrap {
      position: relative;
      flex: 1;
      min-width: 250px;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.85rem;
      color: #9ca3af;
      pointer-events: none;
    }
    .filter-input {
      width: 100%;
      background: #0b0f19;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.6rem 2.2rem 0.6rem 2.4rem;
      color: #ffffff;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }
    .filter-input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
    }
    .clear-search {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;
    }

    .filter-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
    }
    .filter-select {
      background: #0b0f19;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      color: #e5e7eb;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .filter-select:focus {
      outline: none;
      border-color: #6366f1;
    }

    .panel-card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    .table-container {
      overflow-x: auto;
    }
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    .styled-table th {
      background: rgba(17, 24, 39, 0.5);
      padding: 0.9rem 1.25rem;
      color: #9ca3af;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      white-space: nowrap;
    }
    .styled-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      color: #e5e7eb;
      vertical-align: middle;
    }
    .styled-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.025);
    }

    .code-pill {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #c7d2fe;
    }
    .fac-link {
      font-weight: 600;
      color: #ffffff;
      text-decoration: none;
    }
    .fac-link:hover {
      color: #818cf8;
      text-decoration: underline;
    }
    .sub-address {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 2px;
    }

    .type-cell {
      display: flex;
      flex-direction: column;
    }
    .type-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #ffffff;
    }
    .dept-title {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .location-text {
      color: #9ca3af;
      font-size: 0.825rem;
    }
    .capacity-badge {
      font-size: 0.8rem;
      color: #d1d5db;
    }
    .text-dim {
      color: #6b7280;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 3px 9px;
      border-radius: 9999px;
      font-size: 0.725rem;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .badge-success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; }
    .badge-info { background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; }
    .badge-warning { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; }
    .badge-orange { background: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.35); color: #fb923c; }
    .badge-danger { background: rgba(239, 68, 68, 0.18); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; }

    .badge-operational { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .badge-under_maintenance { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .badge-decommissioned { background: rgba(107, 114, 128, 0.2); color: #9ca3af; }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.45rem;
    }
    .btn-action {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e5e7eb;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.775rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-action:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }
    .btn-action-primary {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #a5b4fc;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.775rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-action-primary:hover {
      background: #6366f1;
      color: #ffffff;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.55rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .btn-primary { background: #6366f1; color: #ffffff; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-secondary { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.1); color: #ffffff; }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }

    .state-box, .error-box, .empty-box {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 3.5rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
      color: #9ca3af;
    }
    .empty-icon { font-size: 2.5rem; }
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
export class FacilitiesComponent implements OnInit {
  private readonly facilityService = inject(FacilityService);
  public readonly api = inject(ApiService);

  public facilities: Facility[] = [];
  public isLoading = true;
  public errorMessage: string | null = null;

  public criteria: FacilityFilterCriteria = {
    searchTerm: '',
    facilityType: '',
    conditionRating: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  ngOnInit(): void {
    this.fetchFacilities();
  }

  public fetchFacilities(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.facilityService.getFacilities(this.criteria).subscribe({
      next: data => {
        this.facilities = data;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err?.message || 'Failed to load facilities directory.';
        this.isLoading = false;
      }
    });
  }

  public onFilterChanged(): void {
    this.fetchFacilities();
  }

  public toggleSortOrder(): void {
    this.criteria.sortOrder = this.criteria.sortOrder === 'asc' ? 'desc' : 'asc';
    this.fetchFacilities();
  }

  public hasActiveFilters(): boolean {
    return !!(
      this.criteria.searchTerm ||
      this.criteria.facilityType ||
      this.criteria.conditionRating ||
      this.criteria.status ||
      this.criteria.sortBy !== 'name' ||
      this.criteria.sortOrder !== 'asc'
    );
  }

  public resetFilters(): void {
    this.criteria = {
      searchTerm: '',
      facilityType: '',
      conditionRating: '',
      status: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.fetchFacilities();
  }
}
