import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastAlert {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastAlert[]>([]);
  public readonly toasts$ = this.toastsSubject.asObservable();

  public show(type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string): void {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastAlert = { id, type, title, message };
    this.toastsSubject.next([...this.toastsSubject.value, newToast]);

    setTimeout(() => {
      this.dismiss(id);
    }, 4500);
  }

  public success(message: string, title: string = 'Success'): void {
    this.show('success', message, title);
  }

  public error(message: string, title: string = 'Error'): void {
    this.show('error', message, title);
  }

  public info(message: string, title: string = 'Notice'): void {
    this.show('info', message, title);
  }

  public warning(message: string, title: string = 'Warning'): void {
    this.show('warning', message, title);
  }

  public dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}
