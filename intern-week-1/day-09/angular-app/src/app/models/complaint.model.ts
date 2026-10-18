export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'urgent';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

export interface Complaint {
  id: number;
  facility_id: number;
  reporter_id?: number | null;
  assigned_to_id?: number | null;
  ticket_number: string;
  title: string;
  description: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  resolution_notes?: string | null;
  resolved_at?: string | null;
  created_at?: string;
  updated_at?: string;
  facility?: {
    id: number;
    name: string;
    facility_code: string;
  };
}
