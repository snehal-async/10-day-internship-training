import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, Complaint } from '../../models';
import { MOCK_COMPLAINTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private readonly api = inject(ApiService);
  private localComplaints: Complaint[] = [...MOCK_COMPLAINTS];

  public getComplaints(filters?: { facility_id?: number; status?: string }): Observable<Complaint[]> {
    if (this.api.isDemoActive()) {
      let filtered = [...this.localComplaints];
      if (filters?.facility_id) {
        filtered = filtered.filter(c => c.facility_id === Number(filters.facility_id));
      }
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      return of(filtered);
    }

    const params: Record<string, string | number> = { per_page: 100 };
    if (filters?.facility_id) params['facility_id'] = filters.facility_id;
    if (filters?.status) params['status'] = filters.status;

    return this.api.get<ApiResponse<Complaint[]>>('complaints', params).pipe(
      map(res => res.data || []),
      catchError(() => of(this.localComplaints))
    );
  }
}
