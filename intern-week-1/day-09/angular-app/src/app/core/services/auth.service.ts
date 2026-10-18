import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, AuthSession } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly currentUserSubject = new BehaviorSubject<{ id: number; name: string; email: string; role: string } | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('facilityops_angular_user');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch {
        this.currentUserSubject.next(null);
      }
    } else {
      // Auto-set Demo Inspector credentials so user can test inspection forms right away
      this.loginAsDemoInspector();
    }
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  public getCurrentUser(): { id: number; name: string; email: string; role: string } | null {
    return this.currentUserSubject.value;
  }

  public loginAsDemoInspector(): void {
    const demoUser = {
      id: 3,
      name: 'Elena Rostova (Lead Inspector)',
      email: 'elena.rostova@enterprise.local',
      role: 'inspector'
    };
    this.currentUserSubject.next(demoUser);
    localStorage.setItem('facilityops_angular_user', JSON.stringify(demoUser));
    this.api.setToken('demo-inspector-sanctum-token');
  }

  public loginWithCredentials(email: string, pass: string): Observable<boolean> {
    if (this.api.isDemoActive()) {
      this.loginAsDemoInspector();
      return of(true);
    }

    return this.api.post<ApiResponse<AuthSession>>('auth/login', { email, password: pass }).pipe(
      tap(res => {
        if (res.data?.token) {
          this.api.setToken(res.data.token);
          this.currentUserSubject.next(res.data.user);
          localStorage.setItem('facilityops_angular_user', JSON.stringify(res.data.user));
        }
      }),
      map(res => !!res.data?.token),
      catchError(() => {
        // Fallback to local demo inspector session
        this.loginAsDemoInspector();
        return of(true);
      })
    );
  }

  public logout(): void {
    this.api.clearToken();
    this.currentUserSubject.next(null);
    localStorage.removeItem('facilityops_angular_user');
  }
}
