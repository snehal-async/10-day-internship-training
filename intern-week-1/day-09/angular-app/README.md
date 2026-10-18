# FacilityOps — Angular Facility Inspection Dashboard

Enterprise Facility Operations and Statutory Compliance Inspection Dashboard built with **Angular 22**, **TypeScript Strict Mode**, **Reactive Forms**, and **RxJS**. Designed with modern web standards and architectural patterns optimized for future cross-platform Ionic mobile development.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or higher (`v24.x` recommended, tested on `v24.18.0`)
- **npm**: `v10.x` or higher (`11.13.0` verified)
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari

---

## 2. Installation & Setup

1. **Navigate to the Angular application directory:**
   ```bash
   cd intern-week-1/day-09/angular-app
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

---

## 3. Running Locally

### Development Server
Start the Angular local development server on `http://localhost:4200`:
```bash
npm start
```
or:
```bash
npx ng serve
```

### Specifying Host & Port (Optional)
```bash
npx ng serve --host 127.0.0.1 --port 4200 --open
```

The application runs in dual mode:
- **Backend Connected**: When the Day 8 Laravel API is running on `http://localhost:8000`, the dashboard automatically consumes live data and displays a green **"● Live Backend Connected"** indicator in the navbar.
- **Demo / Offline Fallback**: If the backend is stopped or unreachable, the application automatically switches to the in-memory statutory mock dataset without throwing errors, showing **"⚡ Demo Mode Active"**. You can also toggle demo mode manually in the navbar at any time.

---

## 4. Running Unit Tests

Execute unit tests via the configured Angular unit test runner (Vitest):
```bash
npm test
```
To run tests once without file watching (CI mode):
```bash
npx ng test --watch=false
```

---

## 5. Production Build

Compile the application with full ahead-of-time (AOT) optimizations and minification:
```bash
npm run build
```

The compiled production bundle will be output to:
```
dist/angular-app/browser/
```

To preview the production build locally:
```bash
npx serve -s dist/angular-app/browser
```

---

## 6. Project Architecture

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Functional route guard for audits
│   │   └── services/
│   │       ├── api.service.ts          # Central HTTP client & demo fallback engine
│   │       ├── auth.service.ts         # User session & permissions
│   │       ├── complaint.service.ts    # Maintenance work orders
│   │       ├── dashboard.service.ts    # Metric aggregations & KPI calculations
│   │       ├── facility.service.ts     # Facility querying & filtering
│   │       ├── inspection.service.ts   # Audits & compliance logs
│   │       └── mock-data.ts            # Enterprise seed dataset
│   ├── models/
│   │   ├── api-response.model.ts       # Generic envelope types
│   │   ├── complaint.model.ts          # Ticket domain models
│   │   ├── dashboard.model.ts          # KPI & metric card models
│   │   ├── facility.model.ts           # Facility specs & criteria
│   │   ├── inspection.model.ts         # Statutory audit contracts
│   │   └── index.ts                    # Barrel exports
│   ├── pages/
│   │   ├── dashboard/                  # KPI metrics, recent activity feeds
│   │   ├── facilities/                 # Searchable, filterable facility grid
│   │   ├── facility-details/           # Deep facility profile & audit logs
│   │   ├── inspections/                # Reactive Form for recording audits
│   │   └── inspection-history/         # Chronological audit history
│   ├── shared/
│   │   ├── components/
│   │   │   ├── metric-card/            # Reusable KPI tile
│   │   │   ├── navbar/                 # Responsive nav & demo switch
│   │   │   └── toast/                  # Reactive toast alerts
│   │   └── pipes/
│   │       ├── condition-indicator.pipe.ts  # Formats condition ratings
│   │       └── status-badge.pipe.ts         # Dynamic CSS status badge classes
│   ├── app.config.ts                   # Application providers & routing
│   ├── app.routes.ts                   # Functional route map
│   ├── app.ts                          # Root shell component
│   ├── app.html                        # Layout template
│   └── app.css                         # Layout styles
├── environments/
│   ├── environment.ts                  # Local dev config (localhost:8000)
│   └── environment.prod.ts             # Production cloud endpoint
├── index.html                          # HTML5 shell & fonts
├── main.ts                             # Bootstrap entrypoint
└── styles.css                          # Theme tokens & global styles
```

---

## 7. Key Features Demonstrated

1. **Angular 22 Standalone Components**: Modern component architecture without NgModule overhead.
2. **Strict TypeScript Typing**: No indiscriminate `any` usage; full end-to-end interface contracts.
3. **Reactive Forms**: Comprehensive inspection audit form with live validation, value changes, and range score slider.
4. **Custom Pipes**: `StatusBadgePipe` and `ConditionIndicatorPipe` with full unit test coverage.
5. **Functional Route Guards**: `canActivate: [inspectionAuthGuard]` protecting audit creation.
6. **Graceful Offline Mode**: Zero downtime or white-screen errors if backend services are offline.
