import { Inspection } from './inspection.model';
import { Complaint } from './complaint.model';

export type FacilityType = 'office' | 'warehouse' | 'laboratory' | 'datacenter' | 'manufacturing';
export type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type FacilityStatus = 'operational' | 'under_maintenance' | 'decommissioned' | 'closed';

export interface Facility {
  id: number;
  facility_code: string;
  name: string;
  facility_type: FacilityType;
  department_id?: number;
  department_name?: string;
  address: string;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  condition_rating: ConditionRating;
  status: FacilityStatus;
  capacity?: number | null;
  created_at?: string;
  updated_at?: string;
  last_inspection_date?: string | null;
  inspections_count?: number;
  complaints_count?: number;
  inspections?: Inspection[];
  complaints?: Complaint[];
}

export interface FacilityFilterCriteria {
  searchTerm?: string;
  facilityType?: string;
  conditionRating?: string;
  status?: string;
  sortBy?: 'name' | 'code' | 'condition' | 'city';
  sortOrder?: 'asc' | 'desc';
}
