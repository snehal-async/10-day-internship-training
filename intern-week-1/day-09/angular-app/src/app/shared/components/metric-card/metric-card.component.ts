import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="metric-card"
      [ngClass]="'status-' + status"
      [routerLink]="routerLinkTarget"
      [style.cursor]="routerLinkTarget ? 'pointer' : 'default'"
    >
      <div class="card-header">
        <span class="card-title">{{ title }}</span>
        <div class="card-icon" [innerHTML]="icon"></div>
      </div>
      <div class="card-body">
        <div class="card-val">{{ value }}</div>
        <div class="card-sub" *ngIf="subtitle">
          <span class="sub-dot"></span>
          <span>{{ subtitle }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem 1.35rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.85rem;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.35);
    }
    .metric-card:hover {
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.35);
      box-shadow: 0 8px 25px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.3);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-title {
      font-size: 0.775rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9ca3af;
    }
    .card-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      background: rgba(255, 255, 255, 0.05);
    }
    .status-success .card-icon { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-warning .card-icon { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .status-danger .card-icon { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .status-info .card-icon { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }

    .card-val {
      font-size: 2.15rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .card-sub {
      margin-top: 0.35rem;
      font-size: 0.8rem;
      color: #9ca3af;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .sub-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .status-success .sub-dot { color: #10b981; }
    .status-warning .sub-dot { color: #f59e0b; }
    .status-danger .sub-dot { color: #ef4444; }
    .status-info .sub-dot { color: #38bdf8; }
  `]
})
export class MetricCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number | string;
  @Input() icon: string = '📊';
  @Input() subtitle?: string;
  @Input() status: 'default' | 'success' | 'warning' | 'danger' | 'info' = 'default';
  @Input() routerLinkTarget?: string;
}
