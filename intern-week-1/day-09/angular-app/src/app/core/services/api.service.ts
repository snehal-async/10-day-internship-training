import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  private readonly isOnlineSubject = new BehaviorSubject<boolean>(true);
  public readonly isOnline$ = this.isOnlineSubject.asObservable();

  private readonly isDemoModeSubject = new BehaviorSubject<boolean>(false);
  public readonly isDemoMode$ = this.isDemoModeSubject.asObservable();

  private authToken: string | null = null;
  private readonly requestTimeoutMs = 3500;

  constructor() {
    const isHosted = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const savedDemo = typeof localStorage !== 'undefined' ? localStorage.getItem('facilityops_demo_mode') : null;
    
    // In hosted cloud environments (e.g. Vercel) where local backend isn't reachable, default to interactive demo mode
    if (savedDemo === 'true' || (savedDemo === null && isHosted)) {
      this.isDemoModeSubject.next(true);
    }

    const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('facilityops_angular_token') : null;
    if (savedToken) {
      this.authToken = savedToken;
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public isDemoActive(): boolean {
    return this.isDemoModeSubject.value;
  }

  public setDemoMode(active: boolean): void {
    this.isDemoModeSubject.next(active);
    localStorage.setItem('facilityops_demo_mode', active ? 'true' : 'false');
  }

  public setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('facilityops_angular_token', token);
  }

  public getToken(): string | null {
    return this.authToken;
  }

  public clearToken(): void {
    this.authToken = null;
    localStorage.removeItem('facilityops_angular_token');
  }

  public markOffline(): void {
    this.isOnlineSubject.next(false);
  }

  public markOnline(): void {
    this.isOnlineSubject.next(true);
  }

  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    if (this.authToken) {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    return headers;
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }

    return this.http.get<T>(url, { headers: this.buildHeaders(), params: httpParams }).pipe(
      timeout(this.requestTimeoutMs),
      tap(() => this.markOnline()),
      catchError(err => {
        this.markOffline();
        this.setDemoMode(true);
        return throwError(() => err);
      })
    );
  }

  public post<T>(endpoint: string, body: unknown): Observable<T> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    const headers = this.buildHeaders().set('Content-Type', 'application/json');
    return this.http.post<T>(url, body, { headers }).pipe(
      timeout(this.requestTimeoutMs),
      tap(() => this.markOnline()),
      catchError(err => {
        this.markOffline();
        return throwError(() => err);
      })
    );
  }

  public put<T>(endpoint: string, body: unknown): Observable<T> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    const headers = this.buildHeaders().set('Content-Type', 'application/json');
    return this.http.put<T>(url, body, { headers }).pipe(
      timeout(this.requestTimeoutMs),
      tap(() => this.markOnline()),
      catchError(err => {
        this.markOffline();
        return throwError(() => err);
      })
    );
  }

  public delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    return this.http.delete<T>(url, { headers: this.buildHeaders() }).pipe(
      timeout(this.requestTimeoutMs),
      tap(() => this.markOnline()),
      catchError(err => {
        this.markOffline();
        return throwError(() => err);
      })
    );
  }
}
