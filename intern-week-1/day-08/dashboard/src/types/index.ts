export type FacilityType = 'office' | 'warehouse' | 'laboratory' | 'datacenter' | 'manufacturing';
export type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type FacilityStatus = 'operational' | 'under_maintenance' | 'decommissioned' | 'closed';

export type InspectionResult = 'passed' | 'conditional_pass' | 'failed' | 'critical_failure';

export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'urgent';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface Facility {
  id: number;
  facility_code: string;
  name: string;
  facility_type: FacilityType;
  address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  condition_rating: ConditionRating;
  status: FacilityStatus;
  capacity: number | null;
  created_at?: string;
  updated_at?: string;
  inspections_count?: number;
  complaints_count?: number;
  inspections?: Inspection[];
  complaints?: Complaint[];
}

export interface Inspection {
  id: number;
  facility_id: number;
  inspector_id: number;
  inspection_number: string;
  inspection_date: string;
  result: InspectionResult;
  score: number;
  notes: string | null;
  follow_up_required: boolean;
  follow_up_date: string | null;
  created_at?: string;
  updated_at?: string;
  facility?: {
    id: number;
    name: string;
    facility_code: string;
    condition_rating?: ConditionRating;
  };
  inspector?: UserSummary;
}

export interface Complaint {
  id: number;
  facility_id: number;
  reporter_id: number | null;
  assigned_to_id: number | null;
  ticket_number: string;
  title: string;
  description: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at?: string;
  updated_at?: string;
  facility?: {
    id: number;
    name: string;
    facility_code: string;
  };
  reporter?: UserSummary;
  assigned_to?: UserSummary;
}

export interface DashboardTotals {
  facilities: number;
  inspections: number;
  complaints: number;
  open_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  poor_facilities: number;
}

export interface DashboardStatsData {
  totals: DashboardTotals;
  recent_inspections: Inspection[];
  recent_complaints: Complaint[];
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
