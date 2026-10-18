import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { FacilityService } from './facility.service';
import { InspectionService } from './inspection.service';
import { ComplaintService } from './complaint.service';
import { ApiResponse, DashboardMetrics, DashboardSummaryData } from '../../models';
import { MOCK_FACILITIES, MOCK_INSPECTIONS, MOCK_COMPLAINTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly api = inject(ApiService);
  private readonly facilityService = inject(FacilityService);
  private readonly inspectionService = inject(InspectionService);
  private readonly complaintService = inject(ComplaintService);

  public getSummaryData(): Observable<DashboardSummaryData> {
    if (this.api.isDemoActive()) {
      return of(this.computeLocalSummary());
    }

    return this.api.get<ApiResponse<{
      totals: {
        facilities: number;
        inspections: number;
        complaints: number;
        open_complaints: number;
        in_progress_complaints: number;
        resolved_complaints: number;
        poor_facilities: number;
      };
      recent_inspections: any[];
      recent_complaints: any[];
    }>>('stats').pipe(
      map(res => {
        if (!res || !res.data || !res.data.totals) {
          return this.computeLocalSummary();
        }

        const totals = res.data.totals;
        const totalComplaints = totals.complaints || 0;
        const resolved = totals.resolved_complaints || 0;
        const rate = totalComplaints > 0 ? Math.round((resolved / totalComplaints) * 100) : 100;
        const recentInspections = Array.isArray(res.data.recent_inspections) ? res.data.recent_inspections : [];
        const recentComplaints = Array.isArray(res.data.recent_complaints) ? res.data.recent_complaints : [];

        const metrics: DashboardMetrics = {
          totalFacilities: totals.facilities || 0,
          inspectionsCompleted: totals.inspections || 0,
          pendingInspections: recentInspections.filter(i => i.follow_up_required).length,
          openComplaints: totals.open_complaints || 0,
          inProgressComplaints: totals.in_progress_complaints || 0,
          resolvedComplaints: resolved,
          poorFacilitiesCount: totals.poor_facilities || 0,
          resolutionRate: rate
        };

        return {
          metrics,
          recentInspections,
          recentComplaints
        };
      }),
      catchError(() => {
        return of(this.computeLocalSummary());
      })
    );
  }

  private computeLocalSummary(): DashboardSummaryData {
    const facilities = MOCK_FACILITIES;
    const inspections = MOCK_INSPECTIONS;
    const complaints = MOCK_COMPLAINTS;

    const openTickets = complaints.filter(c => c.status === 'open').length;
    const inProgressTickets = complaints.filter(c => c.status === 'in_progress').length;
    const resolvedTickets = complaints.filter(c => c.status === 'resolved').length;
    const followUps = inspections.filter(i => i.follow_up_required).length;
    const poorCount = facilities.filter(f => f.condition_rating === 'poor' || f.condition_rating === 'critical').length;
    const rate = complaints.length > 0 ? Math.round((resolvedTickets / complaints.length) * 100) : 100;

    const metrics: DashboardMetrics = {
      totalFacilities: facilities.length,
      inspectionsCompleted: inspections.length,
      pendingInspections: followUps,
      openComplaints: openTickets,
      inProgressComplaints: inProgressTickets,
      resolvedComplaints: resolvedTickets,
      poorFacilitiesCount: poorCount,
      resolutionRate: rate
    };

    return {
      metrics,
      recentInspections: inspections.slice(0, 5),
      recentComplaints: complaints.slice(0, 5)
    };
  }
}
