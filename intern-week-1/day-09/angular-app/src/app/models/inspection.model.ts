export type InspectionResult = 'passed' | 'conditional_pass' | 'failed' | 'critical_failure' | 'needs_improvement';

export interface InspectorSummary {
  id: number;
  name: string;
  email: string;
  role?: string;
  badge_number?: string;
  specialization?: string;
}

export type Inspector = InspectorSummary;

export interface Inspection {
  id: number;
  facility_id: number;
  inspector_id: number;
  inspection_number: string;
  inspection_date: string;
  result: InspectionResult;
  score: number;
  notes?: string | null;
  findings?: string | null;
  recommended_actions?: string | null;
  follow_up_required: boolean;
  follow_up_date?: string | null;
  created_at?: string;
  updated_at?: string;
  facility?: {
    id: number;
    name: string;
    facility_code: string;
    condition_rating?: string;
  };
  inspector?: InspectorSummary;
}

export interface CreateInspectionDto {
  facility_id: number;
  inspector_id: number;
  inspection_number: string;
  inspection_date: string;
  result: InspectionResult;
  score: number;
  notes?: string | null;
  findings?: string | null;
  recommended_actions?: string | null;
  follow_up_required?: boolean;
  follow_up_date?: string | null;
}
