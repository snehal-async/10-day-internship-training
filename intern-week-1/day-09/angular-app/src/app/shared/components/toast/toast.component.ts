import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper" *ngIf="(toastService.toasts$ | async) as toasts">
      <div
        *ngFor="let t of toasts"
        class="toast-card"
        [ngClass]="'toast-' + t.type"
        role="alert"
      >
        <div class="toast-indicator"></div>
        <div class="toast-content">
          <div class="toast-title" *ngIf="t.title">{{ t.title }}</div>
          <div class="toast-msg">{{ t.message }}</div>
        </div>
        <button type="button" class="toast-close" (click)="toastService.dismiss(t.id)" aria-label="Dismiss notification">
          &times;
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      pointer-events: none;
      max-width: 420px;
      width: calc(100% - 3rem);
    }
    .toast-card {
      pointer-events: auto;
      background: #111827;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }
    .toast-indicator {
      width: 4px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }
    .toast-success .toast-indicator { background: #10b981; }
    .toast-error .toast-indicator { background: #ef4444; }
    .toast-info .toast-indicator { background: #38bdf8; }
    .toast-warning .toast-indicator { background: #f59e0b; }

    .toast-content {
      flex: 1;
    }
    .toast-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .toast-msg {
      font-size: 0.825rem;
      color: #9ca3af;
      line-height: 1.4;
    }
    .toast-close {
      background: transparent;
      border: none;
      color: #6b7280;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      padding: 0 4px;
      transition: color 0.15s;
    }
    .toast-close:hover {
      color: #ffffff;
    }
    @keyframes slideIn {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  public readonly toastService = inject(ToastService);
}
