import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, Facility, FacilityFilterCriteria } from '../../models';
import { MOCK_FACILITIES } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private readonly api = inject(ApiService);
  private localFacilities: Facility[] = [...MOCK_FACILITIES];

  public getFacilities(criteria?: FacilityFilterCriteria): Observable<Facility[]> {
    if (this.api.isDemoActive()) {
      return of(this.filterAndSortLocal(this.localFacilities, criteria));
    }

    const params: Record<string, string | number> = { per_page: 100 };
    if (criteria?.searchTerm) params['search'] = criteria.searchTerm;
    if (criteria?.facilityType) params['type'] = criteria.facilityType;
    if (criteria?.conditionRating) params['condition'] = criteria.conditionRating;
    if (criteria?.status) params['status'] = criteria.status;

    return this.api.get<ApiResponse<Facility[]>>('facilities', params).pipe(
      map(res => {
        let list = res.data || [];
        if (criteria?.sortBy) {
          list = this.sortFacilities(list, criteria.sortBy, criteria.sortOrder || 'asc');
        }
        return list;
      }),
      catchError(() => {
        // Fallback to local data on network failure
        return of(this.filterAndSortLocal(this.localFacilities, criteria));
      })
    );
  }

  public getFacilityById(id: number | string): Observable<Facility> {
    const numId = Number(id);

    if (this.api.isDemoActive()) {
      const found = this.localFacilities.find(f => f.id === numId);
      if (found) return of(found);
      return of(this.localFacilities[0]);
    }

    return this.api.get<ApiResponse<Facility>>(`facilities/${id}`).pipe(
      map(res => res.data),
      catchError(() => {
        const found = this.localFacilities.find(f => f.id === numId);
        return of(found || this.localFacilities[0]);
      })
    );
  }

  public createFacility(facility: Partial<Facility>): Observable<Facility> {
    if (this.api.isDemoActive()) {
      const newFacility: Facility = {
        id: this.localFacilities.length + 1,
        facility_code: facility.facility_code || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
        name: facility.name || 'New Facility',
        facility_type: facility.facility_type || 'office',
        department_name: 'Operations',
        address: facility.address || 'Main Street',
        city: facility.city || 'Metropolis',
        state: facility.state || 'NY',
        condition_rating: facility.condition_rating || 'good',
        status: facility.status || 'operational',
        capacity: facility.capacity || 100,
        inspections_count: 0,
        complaints_count: 0
      };
      this.localFacilities = [newFacility, ...this.localFacilities];
      return of(newFacility);
    }

    return this.api.post<ApiResponse<Facility>>('facilities', facility).pipe(
      map(res => res.data),
      catchError(() => {
        // Fallback simulated creation
        const newFacility: Facility = {
          id: Date.now(),
          facility_code: facility.facility_code || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
          name: facility.name || 'New Facility',
          facility_type: facility.facility_type || 'office',
          address: facility.address || 'Address',
          city: facility.city || 'City',
          condition_rating: facility.condition_rating || 'good',
          status: facility.status || 'operational'
        };
        this.localFacilities = [newFacility, ...this.localFacilities];
        return of(newFacility);
      })
    );
  }

  private filterAndSortLocal(list: Facility[], criteria?: FacilityFilterCriteria): Facility[] {
    let result = [...list];

    if (criteria?.searchTerm) {
      const term = criteria.searchTerm.toLowerCase().trim();
      result = result.filter(f =>
        f.name.toLowerCase().includes(term) ||
        f.facility_code.toLowerCase().includes(term) ||
        f.city.toLowerCase().includes(term)
      );
    }

    if (criteria?.facilityType) {
      result = result.filter(f => f.facility_type === criteria.facilityType);
    }

    if (criteria?.conditionRating) {
      result = result.filter(f => f.condition_rating === criteria.conditionRating);
    }

    if (criteria?.status) {
      result = result.filter(f => f.status === criteria.status);
    }

    if (criteria?.sortBy) {
      result = this.sortFacilities(result, criteria.sortBy, criteria.sortOrder || 'asc');
    }

    return result;
  }

  private sortFacilities(list: Facility[], sortBy: string, order: 'asc' | 'desc'): Facility[] {
    return [...list].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === 'code') {
        valA = a.facility_code.toLowerCase();
        valB = b.facility_code.toLowerCase();
      } else if (sortBy === 'condition') {
        valA = a.condition_rating;
        valB = b.condition_rating;
      } else if (sortBy === 'city') {
        valA = a.city.toLowerCase();
        valB = b.city.toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
