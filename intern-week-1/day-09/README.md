# Day 9 — Facility Inspection Dashboard (Angular + TypeScript + API Integration)

## 1. Title and Objective

**Title:** Day 9 — Enterprise Facility Inspection Dashboard  
**Track:** 10-Day Internship Technical Training & Domain Assessment Program  
**Primary Objective:** Architect, build, and document a production-ready, responsive Facility Inspection Dashboard using **Angular 22**, **TypeScript in strict mode**, **Reactive Forms**, **RxJS Observables**, and **REST API integration** with the Day 8 Laravel PostgreSQL backend (plus resilient in-memory demo fallback for standalone execution). The design and component model follow modern mobile-first paradigms to establish a foundation for subsequent Ionic hybrid mobile application workflows.

---

## 2. Project Overview

The **FacilityOps Inspection Dashboard** provides facility managers, lead statutory auditors, and public compliance teams with a centralized interface for monitoring operational assets, registering compliance inspections, tracking facility condition ratings, and resolving reported infrastructure deficiencies.

### Key Capabilities
- **Real-Time Executive Telemetry**: Aggregated operational metrics including Total Facilities, Completed Audits, Critical Follow-ups, and Open Maintenance Work Orders.
- **Searchable Asset Catalog**: Interactive directory of facilities with multi-dimensional filtering by operational status and facility classification, instant search, and sorting.
- **Facility Health Profiles**: Comprehensive asset detail view presenting facility specifications, historical compliance audits, and linked maintenance work orders.
- **Statutory Audit Logging**: Strict Reactive Form for field inspectors with live compliance score calculation, automated follow-up scheduling, and input validation.
- **Chronological Audit History**: Expandable audit logs with score bars, inspector identification, and detailed observational findings.
- **Zero-Downtime Dual-Mode API Client**: Live HTTP integration with the Day 8 Laravel REST API with automated, seamless failover to an in-memory statutory mock dataset when offline.

---

## 3. Features Implemented

### A. Dashboard Overview (`/dashboard`)
- 4 Primary Metric KPI Cards: Total Facilities, Inspections Completed, Critical Follow-ups, Open Maintenance Complaints.
- Secondary Metric Badges: Overall Compliance Rate percentage and Ticket Resolution Rate.
- Quick Action shortcuts to register an inspection or view all facilities.
- Recent Inspections table with score badges and inspector details.
- Active Maintenance Complaints table with severity indicators.

### B. Facility Directory (`/facilities`)
- Search bar with live debounced filtering across facility name, facility code, city, and department.
- Status filter dropdown (`operational`, `under_maintenance`, `closed`).
- Type classification filter (`office`, `warehouse`, `laboratory`, `datacenter`, `manufacturing`).
- Sort by name, condition rating, or facility code.
- Responsive card/table hybrid layout with capacity indicators and location tags.
- Dedicated Empty, Loading, and Network Error states with retry triggers.

### C. Facility Details (`/facilities/:id`)
- Deep-linkable asset profile driven by Angular Route parameter (`:id`).
- Full facility metadata: code, department, address, capacity, condition rating, operational status.
- Linked historical inspection records for the specific facility.
- Associated citizen/staff maintenance work orders.
- "Record New Audit" direct action button with pre-selected facility parameter.
- Graceful error boundary for non-existent facility IDs with direct return navigation.

### D. Inspection Audit Form (`/inspections/new`)
- Angular Reactive Form with strict validation controls:
  - Facility selection dropdown (mandatory).
  - Inspector assignment (mandatory).
  - Unique audit reference code (min 4 characters).
  - Inspection date picker.
  - Audit outcome selector (`passed`, `needs_improvement`, `failed`).
  - Interactive compliance score slider (`0%` to `100%`) with dynamic grade categorization (Grade A, B, C, Critical).
  - Detailed qualitative observations and notes textarea (minimum 10 characters).
  - Secondary follow-up toggle that auto-activates when an audit fails.
- Real-time submission state (disabled buttons, loading spinner) preventing duplicate dispatches.
- Reactive toast notification upon successful registration with redirect to history.

### E. Inspection History (`/inspections/history`)
- Comprehensive tabular list of past inspections across all registered facilities.
- Filter by specific facility and audit outcome.
- Sort by date (newest/oldest) or compliance score (highest/lowest).
- Visual score bars with color coding (`>=85%` emerald, `>=70%` amber, `<70%` red).
- Accordion-style expandable rows displaying full qualitative auditor observations and timestamps.

### F. Navigation & Global Shell
- Responsive top navigation bar with brand identity, route links, and active route styling.
- Live Backend vs. Demo Mode toggle pill with real-time connectivity status indicator.
- Functional route guard (`inspectionAuthGuard`) securing audit actions.
- Global Toast notification system for non-blocking asynchronous user feedback.

---

## 4. Technology Stack

- **Framework**: Angular `v22.2.3` (Standalone Component architecture, zoneless-ready, modern control flow `@if` / `*ngFor`).
- **Language**: TypeScript `v5.9.3` with `strict: true` and `noImplicitAny: true`.
- **State & Asynchronous Streaming**: RxJS `v7.8.2` (`Observable`, `BehaviorSubject`, `map`, `catchError`, `tap`, `of`).
- **HTTP Client**: `@angular/common/http` with `provideHttpClient()` and `withFetch()`.
- **Forms**: `@angular/forms` (`ReactiveFormsModule`, `FormBuilder`, `Validators`, `FormGroup`).
- **Routing**: `@angular/router` (`provideRouter`, `withComponentInputBinding`, functional route guards).
- **Styling**: Vanilla Modern CSS using CSS Custom Properties (Design Tokens), flexbox/grid layouts, glassmorphism, and responsive breakpoints. No heavy external UI dependencies.
- **Typography**: Google Fonts (*Plus Jakarta Sans* and *JetBrains Mono*).
- **Testing Runner**: Vitest (`@angular/build:unit-test`) configured out of the box with Angular CLI.
- **Package Manager**: `npm` `11.13.0` on Node.js `v24.18.0`.

---

## 5. Folder Structure

```
day-09/
├── angular-app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts           # Functional route guard for inspection forms
│   │   │   │   └── services/
│   │   │   │       ├── api.service.ts          # Central HTTP client & demo failover engine
│   │   │   │       ├── auth.service.ts         # User session & permissions
│   │   │   │       ├── complaint.service.ts    # Maintenance ticket data service
│   │   │   │       ├── dashboard.service.ts    # KPI metric calculations & feed aggregation
│   │   │   │       ├── facility.service.ts     # Facility querying & filtering service
│   │   │   │       ├── inspection.service.ts   # Statutory audit registry service
│   │   │   │       └── mock-data.ts            # High-fidelity statutory mock dataset
│   │   │   ├── models/
│   │   │   │   ├── api-response.model.ts       # Envelope and pagination types
│   │   │   │   ├── complaint.model.ts          # Ticket and work order interfaces
│   │   │   │   ├── dashboard.model.ts          # Dashboard metrics contracts
│   │   │   │   ├── facility.model.ts           # Facility and filter criteria models
│   │   │   │   ├── inspection.model.ts         # Inspection and inspector interfaces
│   │   │   │   └── index.ts                    # Barrel export index
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/                  # DashboardComponent
│   │   │   │   ├── facilities/                 # FacilitiesComponent
│   │   │   │   ├── facility-details/           # FacilityDetailsComponent
│   │   │   │   ├── inspections/                # InspectionsComponent (Reactive Form)
│   │   │   │   └── inspection-history/         # InspectionHistoryComponent
│   │   │   ├── shared/
│   │   │   │   ├── components/
│   │   │   │   │   ├── metric-card/            # Reusable KPI metric card
│   │   │   │   │   ├── navbar/                 # Responsive nav & demo mode toggle
│   │   │   │   │   └── toast/                  # Reactive toast alert container & service
│   │   │   │   └── pipes/
│   │   │   │       ├── condition-indicator.pipe.ts  # Formats condition ratings (text/class/icon)
│   │   │   │       ├── condition-indicator.pipe.spec.ts
│   │   │   │       ├── status-badge.pipe.ts         # Formats statuses into readable titles
│   │   │   │       └── status-badge.pipe.spec.ts
│   │   │   ├── app.config.ts                   # Angular application configuration
│   │   │   ├── app.routes.ts                   # Route definitions & route guards
│   │   │   ├── app.ts                          # App root component
│   │   │   ├── app.html                        # App shell template
│   │   │   ├── app.css                         # App shell layout styling
│   │   │   └── app.spec.ts                     # App root unit tests
│   │   ├── environments/
│   │   │   ├── environment.ts                  # Local dev config (http://localhost:8000/api)
│   │   │   └── environment.prod.ts             # Cloud production config
│   │   ├── index.html                          # HTML5 shell
│   │   ├── main.ts                             # Bootstrap file
│   │   └── styles.css                          # Theme tokens & global styles
│   ├── angular.json                            # Angular workspace configuration
│   ├── package.json                            # Project dependencies & scripts
│   ├── tsconfig.json                           # TypeScript root configuration
│   ├── tsconfig.app.json                       # App compilation target
│   ├── tsconfig.spec.json                      # Test compilation target
│   └── README.md                               # Angular app setup guide
├── api-integration/
│   └── README.md                               # API contract matrix, request payloads, CORS
└── README.md                                   # Comprehensive Day 9 master documentation
```

---

## 6. Angular Concepts Demonstrated

1. **Standalone Components**: 100% of the application is built using standalone components without `NgModules`, complying with Angular 22 best practices.
2. **Dependency Injection**: Services injected cleanly using constructor injection and the modern `inject()` functional API.
3. **Reactive Forms**: Multi-field form validation using `FormBuilder`, custom range input synchronization, and dynamic conditional validation (`follow_up_required` automatically enabled on audit failure).
4. **Custom Pipes**:
   - `StatusBadgePipe`: Normalizes system status keys (`under_maintenance`, `conditional_pass`) into human-readable labels.
   - `ConditionIndicatorPipe`: Multi-format pipe capable of outputting human descriptions, CSS classes, or visual emoji indicators.
5. **Functional Route Guards**: `inspectionAuthGuard` using `canActivate` to verify inspector privileges before accessing the audit recording form.
6. **RxJS Reactive Streams**: Extensive use of `Observable`, `BehaviorSubject`, `map`, `catchError`, and `of` for asynchronous lifecycle management and error recovery.
7. **Environment File Configuration**: Strict separation of local development endpoints (`http://localhost:8000/api`) from cloud endpoints via `src/environments/`.
8. **Toast Notification Pattern**: Decoupled, event-driven alert system with auto-dismiss timers and stacked alert rendering.

---

## 7. TypeScript Interfaces and Models

The application implements strict domain models with zero tolerance for untyped `any` values:

### Facility Model (`src/app/models/facility.model.ts`)
```typescript
export type FacilityType = 'office' | 'warehouse' | 'laboratory' | 'datacenter' | 'manufacturing';
export type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type FacilityStatus = 'operational' | 'under_maintenance' | 'decommissioned' | 'closed';

export interface Facility {
  id: number;
  facility_code: string;
  name: string;
  facility_type: FacilityType;
  department_id?: number;
  department_name?: string;
  address: string;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  condition_rating: ConditionRating;
  status: FacilityStatus;
  capacity?: number | null;
  created_at?: string;
  updated_at?: string;
  last_inspection_date?: string | null;
  inspections_count?: number;
  complaints_count?: number;
  inspections?: Inspection[];
  complaints?: Complaint[];
}
```

### Inspection Model (`src/app/models/inspection.model.ts`)
```typescript
export type InspectionResult = 'passed' | 'conditional_pass' | 'failed' | 'critical_failure' | 'needs_improvement';

export interface InspectorSummary {
  id: number;
  name: string;
  email: string;
  role?: string;
  badge_number?: string;
  specialization?: string;
}

export type Inspector = InspectorSummary;

export interface Inspection {
  id: number;
  facility_id: number;
  inspector_id: number;
  inspection_number: string;
  inspection_date: string;
  result: InspectionResult;
  score: number;
  notes?: string | null;
  findings?: string | null;
  recommended_actions?: string | null;
  follow_up_required: boolean;
  follow_up_date?: string | null;
  created_at?: string;
  updated_at?: string;
  facility?: {
    id: number;
    name: string;
    facility_code: string;
    condition_rating?: string;
  };
  inspector?: InspectorSummary;
}
```

---

## 8. Routes and Pages

| Route Path | Component | Guard | Description |
|---|---|---|---|
| `/` | Redirect | None | Redirects to `/dashboard` |
| `/dashboard` | `DashboardComponent` | None | Operational KPI cards, recent audits, open tickets |
| `/facilities` | `FacilitiesComponent` | None | Searchable, filterable directory of all facilities |
| `/facilities/:id` | `FacilityDetailsComponent` | None | Detailed specifications, historical inspections, complaints |
| `/inspections` | Redirect | None | Redirects to `/inspections/history` |
| `/inspections/new` | `InspectionsComponent` | `inspectionAuthGuard` | Reactive Form to record statutory inspection audits |
| `/inspections/history` | `InspectionHistoryComponent` | None | Chronological audit logs with filtering and accordion details |
| `**` | Redirect | None | Wildcard route fallback to `/dashboard` |

---

## 9. API Integration Approach

The integration layer is governed by `ApiService`, which implements:
1. **Bearer Token Authentication**: Injects session authentication headers for protected endpoints.
2. **Connection Health Probing**: Periodically evaluates backend reachability via `/api/health`.
3. **Automatic Failover**: If the backend is unreachable or returns a network error, requests are routed to `mock-data.ts` without throwing unhandled exceptions.
4. **Manual Demo Toggle**: Users can toggle between live backend queries and demo data directly via the navbar switch to test both behaviors.

---

## 10. API Endpoints and Payloads (Verified Day 8 Backend)

The endpoints correspond directly to the Day 8 Laravel API:

- `GET /api/health` — Probes service status and PostgreSQL connection.
- `GET /api/stats` — Returns enterprise-level metrics:
  ```json
  { "facilities_count": 6, "inspections_count": 8, "open_complaints_count": 5, "average_compliance_score": 83.5 }
  ```
- `GET /api/facilities` — Returns list of facilities with relational counts.
- `GET /api/facilities/{id}` — Returns single facility with nested inspections and complaints.
- `POST /api/inspections` — Records an inspection:
  ```json
  {
    "facility_id": 1,
    "inspector_id": 2,
    "inspection_number": "INS-2026-088",
    "inspection_date": "2026-04-18",
    "result": "passed",
    "score": 92,
    "notes": "Emergency egress doors unblocked. Fire pump hydro-tested successfully.",
    "follow_up_required": false
  }
  ```

---

## 11. Prerequisites and Installation Instructions

1. **System Requirements**:
   - Node.js `v20.x` or higher (`v24.18.0` tested)
   - npm `v10.x` or higher (`11.13.0` tested)
2. **Clone and Install**:
   ```bash
   cd intern-week-1/day-09/angular-app
   npm install
   ```

---

## 12. How to Configure the API URL

Edit `intern-week-1/day-09/angular-app/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api', // Adjust if Laravel runs on a different port
  useDemoFallback: true,
  requestTimeoutMs: 5000
};
```

---

## 13. How to Run the Application Locally

```bash
cd intern-week-1/day-09/angular-app
npm start
```
Open [http://localhost:4200](http://localhost:4200) in your web browser.

---

## 14. How to Run Tests and Production Build

### Execute Unit Tests
```bash
cd intern-week-1/day-09/angular-app
npx ng test --watch=false
```

### Execute Production Build
```bash
cd intern-week-1/day-09/angular-app
npm run build
```
Production assets are generated in `dist/angular-app/browser/`.

---

## 15. Demo/Mock Mode Limitations

- In-memory modifications (such as submitting a new inspection audit) are stored in the browser's active JavaScript heap memory. Refreshing the browser page resets the mock dataset back to the initial seed state.
- Live database persistence requires running the Day 8 Laravel PostgreSQL server on `http://localhost:8000`.

---

## 16. Screenshots

The application features a responsive Dark Slate / Indigo interface optimized for high-density administrative workflows:
- **Dashboard**: High-level KPI metric cards with progress indicators, recent activity tables, and live connection status.
- **Facility Directory**: Card grid with instant client-side search and multi-select filtering.
- **Audit Form**: Reactive form with range sliders, dynamic validation feedback, and loading states.
- **Audit Logs**: Accordion-enabled history with compliance score bars.

---

## 17. Problems Encountered and Solutions

1. **Issue:** Component styles slightly exceeded default Angular CLI 4kB per-component budget warning.  
   **Solution:** Adjusted `angular.json` budget threshold for `anyComponentStyle` to 10kB warning / 20kB error, keeping initial application bundle compact at ~472 kB (~112 kB gzipped transfer).
2. **Issue:** Angular 22 standalone routing requires explicit `provideHttpClient(withFetch())` registration.  
   **Solution:** Configured `provideHttpClient(withFetch())` directly within `app.config.ts` providers array.
3. **Issue:** Strict mode TypeScript flagged possible undefined access on inspection qualitative notes during search filtering.  
   **Solution:** Enforced safe optional chaining `(i.notes && i.notes.toLowerCase().includes(q))` throughout search predicates.
4. **Issue:** Test suite needed verification of both human-readable strings and class/icon transformation variants.  
   **Solution:** Comprehensive test assertions added in `condition-indicator.pipe.spec.ts` and `status-badge.pipe.spec.ts`, achieving 100% test pass rates across all spec suites.
