import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, CreateInspectionDto, Inspection, InspectorSummary } from '../../models';
import { MOCK_INSPECTIONS, MOCK_INSPECTORS, MOCK_FACILITIES } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private readonly api = inject(ApiService);
  private localInspections: Inspection[] = [...MOCK_INSPECTIONS];

  public getInspections(filters?: { facility_id?: number; result?: string }): Observable<Inspection[]> {
    if (this.api.isDemoActive()) {
      let filtered = [...this.localInspections];
      if (filters?.facility_id) {
        filtered = filtered.filter(i => i.facility_id === Number(filters.facility_id));
      }
      if (filters?.result) {
        filtered = filtered.filter(i => i.result === filters.result);
      }
      return of(filtered);
    }

    const params: Record<string, string | number> = { per_page: 100 };
    if (filters?.facility_id) params['facility_id'] = filters.facility_id;
    if (filters?.result) params['result'] = filters.result;

    return this.api.get<ApiResponse<Inspection[]>>('inspections', params).pipe(
      map(res => res.data || []),
      catchError(() => of(this.localInspections))
    );
  }

  public getInspectionById(id: number | string): Observable<Inspection> {
    const numId = Number(id);

    if (this.api.isDemoActive()) {
      const found = this.localInspections.find(i => i.id === numId);
      return of(found || this.localInspections[0]);
    }

    return this.api.get<ApiResponse<Inspection>>(`inspections/${id}`).pipe(
      map(res => res.data),
      catchError(() => {
        const found = this.localInspections.find(i => i.id === numId);
        return of(found || this.localInspections[0]);
      })
    );
  }

  public getInspectors(): Observable<InspectorSummary[]> {
    if (this.api.isDemoActive()) {
      return of(MOCK_INSPECTORS);
    }

    return this.api.get<ApiResponse<InspectorSummary[]>>('inspectors').pipe(
      map(res => res.data || MOCK_INSPECTORS),
      catchError(() => of(MOCK_INSPECTORS))
    );
  }

  public createInspection(dto: CreateInspectionDto): Observable<Inspection> {
    const fac = MOCK_FACILITIES.find(f => f.id === dto.facility_id);
    const inspector = MOCK_INSPECTORS.find(ins => ins.id === dto.inspector_id);

    if (this.api.isDemoActive()) {
      const newInspection: Inspection = {
        id: this.localInspections.length + 1,
        facility_id: dto.facility_id,
        inspector_id: dto.inspector_id,
        inspection_number: dto.inspection_number,
        inspection_date: dto.inspection_date,
        result: dto.result,
        score: dto.score,
        notes: dto.notes || null,
        follow_up_required: !!dto.follow_up_required,
        follow_up_date: dto.follow_up_date || null,
        facility: fac ? { id: fac.id, name: fac.name, facility_code: fac.facility_code } : undefined,
        inspector: inspector || undefined,
        created_at: new Date().toISOString()
      };
      this.localInspections = [newInspection, ...this.localInspections];
      return of(newInspection);
    }

    return this.api.post<ApiResponse<Inspection>>('inspections', dto).pipe(
      map(res => res.data),
      catchError(() => {
        // Fallback local save on network error
        const newInspection: Inspection = {
          id: Date.now(),
          facility_id: dto.facility_id,
          inspector_id: dto.inspector_id,
          inspection_number: dto.inspection_number,
          inspection_date: dto.inspection_date,
          result: dto.result,
          score: dto.score,
          notes: dto.notes || null,
          follow_up_required: !!dto.follow_up_required,
          follow_up_date: dto.follow_up_date || null,
          facility: fac ? { id: fac.id, name: fac.name, facility_code: fac.facility_code } : undefined,
          inspector: inspector || undefined
        };
        this.localInspections = [newInspection, ...this.localInspections];
        return of(newInspection);
      })
    );
  }
}
