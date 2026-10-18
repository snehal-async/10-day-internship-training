import { Inspection } from './inspection.model';
import { Complaint } from './complaint.model';

export interface DashboardMetrics {
  totalFacilities: number;
  inspectionsCompleted: number;
  pendingInspections: number;
  openComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  poorFacilitiesCount: number;
  resolutionRate: number;
}

export interface DashboardSummaryData {
  metrics: DashboardMetrics;
  recentInspections: Inspection[];
  recentComplaints: Complaint[];
}
