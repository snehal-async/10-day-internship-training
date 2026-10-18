import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar-wrapper">
      <div class="nav-container">
        <!-- Logo / Brand -->
        <div class="nav-brand" routerLink="/dashboard">
          <div class="brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">FacilityOps</span>
            <span class="brand-tag">Angular</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="nav-links" [class.mobile-open]="isMobileMenuOpen">
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
            class="nav-link"
          >
            Dashboard
          </a>
          <a
            routerLink="/facilities"
            routerLinkActive="active"
            (click)="closeMobileMenu()"
            class="nav-link"
          >
            Facilities
          </a>
          <a
            routerLink="/inspections/new"
            routerLinkActive="active"
            (click)="closeMobileMenu()"
            class="nav-link"
          >
            Record Audit
          </a>
          <a
            routerLink="/inspections/history"
            routerLinkActive="active"
            (click)="closeMobileMenu()"
            class="nav-link"
          >
            Audit History
          </a>
        </nav>

        <!-- Right Side Controls (Mode Switch & User) -->
        <div class="nav-actions">
          <!-- API / Demo Mode Pill -->
          <button
            type="button"
            class="mode-pill"
            [ngClass]="(api.isDemoMode$ | async) ? 'mode-demo' : ((api.isOnline$ | async) ? 'mode-online' : 'mode-offline')"
            (click)="toggleDemoMode()"
            [title]="(api.isDemoMode$ | async) ? 'Click to switch to Live API Mode' : 'Click to force Demo Mock Mode'"
          >
            <span class="pulse-indicator"></span>
            <span *ngIf="(api.isDemoMode$ | async)">Demo Mode</span>
            <span *ngIf="!(api.isDemoMode$ | async)">
              {{ (api.isOnline$ | async) ? 'Live API (Day 8)' : 'Backend Offline' }}
            </span>
          </button>

          <!-- Inspector Session -->
          <div class="inspector-badge" *ngIf="(auth.currentUser$ | async) as user" [title]="user.email">
            <span class="inspector-avatar">IR</span>
            <span class="inspector-name">{{ user.name }}</span>
          </div>

          <!-- Mobile Hamburger -->
          <button
            type="button"
            class="mobile-toggle"
            (click)="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(10, 15, 29, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.75rem 1.5rem;
    }
    .nav-container {
      max-width: 1380px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      text-decoration: none;
    }
    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.35);
    }
    .brand-text {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .brand-tag {
      font-size: 0.65rem;
      padding: 2px 7px;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #a5b4fc;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(17, 24, 39, 0.6);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .nav-link {
      color: #9ca3af;
      text-decoration: none;
      padding: 0.45rem 0.95rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .nav-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }
    .nav-link.active {
      color: #ffffff;
      background: #6366f1;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .mode-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      padding: 5px 12px;
      font-size: 0.775rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      cursor: pointer;
      color: #ffffff;
      transition: all 0.2s ease;
    }
    .mode-online {
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.35);
      color: #34d399;
    }
    .mode-demo {
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.35);
      color: #fbbf24;
    }
    .mode-offline {
      background: rgba(239, 68, 68, 0.12);
      border-color: rgba(239, 68, 68, 0.35);
      color: #f87171;
    }
    .pulse-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 6px currentColor;
    }

    .inspector-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 10px 4px 5px;
      border-radius: 9999px;
    }
    .inspector-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #818cf8;
      color: #0b0f19;
      font-size: 0.7rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .inspector-name {
      font-size: 0.8rem;
      color: #e5e7eb;
      font-weight: 500;
      max-width: 140px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .mobile-toggle span {
      width: 20px;
      height: 2px;
      background: #ffffff;
      border-radius: 2px;
    }

    @media (max-width: 900px) {
      .mobile-toggle {
        display: flex;
      }
      .inspector-badge {
        display: none;
      }
      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: #111827;
        border-radius: 0;
        border-top: none;
        padding: 1rem;
        gap: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
      }
      .nav-links.mobile-open {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
  public readonly api = inject(ApiService);
  public readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  public isMobileMenuOpen = false;

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  public toggleDemoMode(): void {
    const current = this.api.isDemoActive();
    this.api.setDemoMode(!current);
    if (!current) {
      this.toast.info('Switched to Demo/Mock Mode. Using local fixtures.', 'Mode Changed');
    } else {
      this.toast.success('Switched to Live API Mode. Querying Laravel endpoints.', 'Mode Changed');
    }
  }
}
