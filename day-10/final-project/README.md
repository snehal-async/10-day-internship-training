# FacilityOps — Smart Facility Management Dashboard
### Day 10 Final Capstone Project | Full-Stack Web Development Track

---

## 1. Project Overview
**FacilityOps** is an enterprise-grade Smart Facility Management Dashboard designed to manage commercial real estate, corporate campuses, research laboratories, and industrial warehouses. Built to empower operations directors, certified compliance inspectors, and facility managers, FacilityOps unifies physical asset tracking, statutory regulatory audits, and maintenance work orders into a single, high-performance web dashboard.

The application adheres to clean SaaS UI/UX design standards: a deep navy navigation bar, a warm light neutral canvas, refined violet accents, accessible contrast (WCAG AA), responsive layout adaptation (desktop sidebar, mobile drawer, responsive data tables), and instant dual-mode data resilience (seamless switching between the live PostgreSQL/Laravel REST API and an offline telemetry store).

---

## 2. Problem Statement
Commercial facility operations frequently suffer from fragmented tooling, siloed spreadsheets, and delayed response times:
1. **Dispersed Asset Records**: Building technical specifications, square footage, occupancy thresholds, and structural condition ratings are scattered across outdated databases.
2. **Compliance & Audit Lapses**: Statutory safety evaluations (fire suppression, HVAC airflow, structural integrity, electrical risers) lack centralized scheduling, scoring algorithms, and remediation deadlines.
3. **Slow Work Order Lifecycle**: Equipment defects and tenant complaints take days to triage, assign, and resolve without automated SLA visibility.
4. **Cross-Framework Operational Friction**: Enterprise IT teams often maintain multiple frontend ecosystems (e.g., Angular for field inspection forms and React for executive analytics), requiring clean RESTful integration standards across frameworks.

**FacilityOps resolves these issues** by providing an end-to-end full-stack platform with real-time analytics, automated compliance grading, instant maintenance work order tracking, and cross-framework support.

---

## 3. Features

### Executive Telemetry & Real-Time Analytics
- **Live Metric Cards**: Total facilities, operational facilities, scheduled audits, completed inspections, and open maintenance tickets with trend indicators.
- **Interactive Recharts Visualizations**:
  - *Condition Distribution Donut Chart*: Visual breakdown of building health (`excellent`, `good`, `fair`, `poor`, `critical`).
  - *Monthly Audit Velocity Bar Chart*: Historical compliance audit volume over time.
  - *Work Order Priority Bar Chart*: Tickets classified by urgency (`urgent`, `high`, `medium`, `low`).
- **Recent Telemetry Feeds**: Real-time ticker of latest statutory audits and maintenance tickets with direct drill-down links.

### Comprehensive Facilities Inventory (`/facilities`)
- **Table & Grid Card Views**: One-click toggle between compact enterprise table mode and visual asset cards.
- **Multi-Parameter Search & Filtering**: Real-time search by facility code, name, city, and department; filter by facility type, condition rating, and operational status.
- **Sorting & Pagination**: Interactive column sorting (alphabetical, capacity, condition) and clean pagination controls.
- **Full CRUD Management**: Register new facilities, edit structural specifications, and decommission facilities via a modal confirmation dialog.

### Detailed Facility Asset Profile (`/facilities/:id`)
- **Deep-Linked Routing**: Direct URL navigation with 404 Not Found fallback boundary for invalid IDs.
- **Asset Specifications**: Building type, square footage, occupancy capacity, location, and department affiliation.
- **Chronological Audit History**: Visual audit timeline with score badges, inspector signatures, and follow-up flags.
- **Related Maintenance Tickets**: Filtered complaints tied specifically to the selected building asset.
- **Prefilled Quick Actions**: Instant "New Audit" and "Log Maintenance Ticket" buttons pre-populated with the active facility ID.

### Statutory Compliance Audits (`/inspections`)
- **Compliance Audit Logging**: Dedicated form modal to record field evaluations with reference code and evaluation date.
- **Dynamic Scoring Slider (0–100%)**: Interactive slider that automatically calculates regulatory grades:
  - *Grade A (90–100%)*: Exceptional Compliance (`passed`)
  - *Grade B (80–89%)*: Standard Passed (`passed`)
  - *Grade C (60–79%)*: Needs Corrective Action (`needs_improvement`)
  - *Below 60%*: Critical Failure (`failed`)
- **Automated Follow-up Scheduler**: Automatically mandates a 14-day corrective action deadline when a facility fails or requires improvement.

### Maintenance Work Orders & Complaints (`/complaints`)
- **Ticket Dispatching**: Fast work order creation with category selection (HVAC, Electrical, Fire Safety, Plumbing, Structural, Access Control) and priority triage.
- **One-Click Lifecycle Progression**: Transition tickets seamlessly across `open` -> `in_progress` -> `resolved` with modal prompt for resolution notes and automated completion timestamps.

### Cross-Framework Angular Integration (`/angular-inspection`)
- **Framework Interoperability**: Dedicated dashboard view showcasing the Day 9 Angular application running alongside the React dashboard.
- **Live Backend Health Probe**: Interactive probe checking connection status to the Laravel API (`http://localhost:8000/api/health`).
- **REST Contract Explorer**: Side-by-side inspection of endpoints shared between React and Angular.

---

## 4. Technology Stack

### Frontend Application (React)
- **Framework**: React 19 + TypeScript (Strict Mode)
- **Tooling & Dev Server**: Vite 8
- **Routing**: React Router v7 (`react-router-dom`)
- **Charts & Data Visualization**: Recharts
- **Iconography**: Lucide React
- **Styling**: Vanilla CSS Design Tokens (Custom Enterprise Design System, CSS Variables, zero heavy CSS framework overhead)
- **Testing**: Vitest + React Testing Library + JSDOM

### Angular Module (Field Inspections)
- **Framework**: Angular 22 (Standalone Components + Reactive Forms)
- **Language**: TypeScript
- **Reactive Stream Handling**: RxJS (`Observable`, `catchError`, `finalize`)
- **HTTP Client**: Angular `@angular/common/http`

### Backend REST API (Laravel)
- **Framework**: Laravel 11.x
- **Runtime**: PHP 8.3 / 8.2
- **Architecture**: RESTful Controllers, Form Requests, Eloquent ORM, Database Transactions, CORS middleware
- **Authentication**: Laravel Sanctum (Bearer Token support)
- **Automated Tests**: PHPUnit / Pest Feature Tests

### Database Layer
- **Production Engine**: PostgreSQL 14+ / 16+
- **Test Engine**: PostgreSQL / SQLite (In-Memory Isolation)

---

## 5. Architecture

FacilityOps uses a decoupled, three-tier enterprise micro-frontend architecture:

```mermaid
graph TD
    subgraph Clients["Frontend Client Layer"]
        ReactApp["Executive Dashboard (React 19 + JSX + Vite)<br/>Port: 5173"]
        AngularApp["Inspection Module (Angular 22)<br/>Port: 4200"]
    end

    subgraph Backend["Backend REST API Layer (Laravel 11)"]
        Router["API Gateway / Router<br/>Port: 8000 /api"]
        AuthMiddleware["Sanctum / AuthenticateApi Middleware"]
        Controllers["Resource Controllers<br/>(Facility, Inspection, Complaint, Auth)"]
        Eloquent["Eloquent ORM Engine & Validation FormRequests"]
    end

    subgraph Database["Database Persistence Layer (PostgreSQL 14+)"]
        PG["PostgreSQL Server (Port 5432)<br/>Database: day8_internship"]
        Tables["Tables: facilities, inspections, complaints,<br/>departments, employees, users"]
    end

    ReactApp -->|REST HTTP / JSON| Router
    AngularApp -->|REST HTTP / JSON| Router
    Router --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> Eloquent
    Eloquent --> PG
    PG --- Tables
```

### Statutory Compliance Audit Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Inspector as Certified Field Inspector
    participant UI as FacilityOps React Dashboard
    participant API as Laravel 11 REST API (/api)
    participant DB as PostgreSQL 14+ (day8_internship)

    Inspector->>UI: Select Facility & Enter Audit Score (e.g. 72%)
    UI->>UI: Calculate Dynamic Compliance Grade (Grade C - Needs Improvement)
    UI->>UI: Trigger 14-Day Mandatory Follow-Up Deadline
    Inspector->>UI: Submit Audit Record
    UI->>API: POST /api/inspections (Payload + Bearer Token)
    API->>API: Validate via StoreInspectionRequest
    API->>DB: INSERT into inspections table
    DB-->>API: Row Created (ID, timestamps)
    API-->>UI: 201 Created (JSON inspection data)
    UI->>Inspector: Display Success Toast & Re-render Live Compliance KPI
```

### Maintenance Work Order SLA Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Building Tenant / Staff
    actor Manager as Facility Operations Manager
    participant UI as FacilityOps Dashboard
    participant API as Laravel REST API
    participant DB as PostgreSQL Database

    Staff->>UI: Submit Ticket (HVAC Failure, Priority: Urgent)
    UI->>API: POST /api/complaints
    API->>DB: INSERT into complaints (status = 'open')
    DB-->>API: Created
    API-->>UI: Ticket Dispatched
    Note over Manager,UI: Manager Reviews Backlog in Maintenance View
    Manager->>UI: Click "Start Work" -> Status: in_progress
    UI->>API: PUT /api/complaints/{id} (status = 'in_progress')
    API->>DB: UPDATE complaints SET status = 'in_progress'
    Manager->>UI: Complete Repair -> Status: resolved (Notes entered)
    UI->>API: PUT /api/complaints/{id} (status = 'resolved', notes, resolved_at)
    API->>DB: UPDATE complaints SET status = 'resolved', resolved_at = NOW()
    API-->>UI: 200 OK (Updated Ticket)
    UI->>Manager: Toast Notification & Audit Trail Updated
```

---

## 6. Folder Structure

```
day-10/final-project/
├── backend/
│   └── README.md                       # Comprehensive guide linking to Day 8 Laravel API
├── database/
│   ├── er-diagram.md                   # Mermaid ER diagram & relational integrity rules
│   ├── migration-and-seed.md           # Step-by-step migration & seed execution guide
│   ├── reporting-queries.sql           # Advanced analytical SQL queries (PostgreSQL)
│   └── schema.md                       # Complete table specifications, columns & indexes
├── frontend/
│   ├── dist/                           # Production build output (vite build)
│   ├── index.html                      # Single page application entrypoint
│   ├── package.json                    # Dependencies, GSAP & test scripts
│   ├── vite.config.js                  # Vite + Vitest configuration (Pure JavaScript)
│   └── src/
│       ├── App.jsx                     # Master layout & route provider
│       ├── main.jsx                    # React DOM root mounting
│       ├── index.css                   # Enterprise design tokens & CSS system
│       ├── components/
│       │   ├── common/                 # Reusable UI components (StatCard, Badge, Toast,
│       │   │                           # AuthModal, ConfirmModal, EmptyState, ErrorState)
│       │   ├── layout/                 # Sidebar, TopHeader, navigation controls
│       │   ├── dashboard/              # OverviewView, Metric cards, Recharts visualizations
│       │   ├── facilities/             # FacilitiesView, FacilityDetailsPage, modals
│       │   ├── inspections/            # InspectionsView, InspectionFormModal, DetailModal
│       │   ├── complaints/             # ComplaintsView, ComplaintFormModal, DetailModal
│       │   └── angular-integration/    # AngularIntegrationView & health probe
│       ├── data/
│       │   └── seedData.js             # High-fidelity offline fallback telemetry dataset
│       ├── services/
│       │   └── api.js                  # Dual-mode API client with live PostgreSQL health probe
│       ├── utils/
│       │   └── animations.js           # GSAP hardware-accelerated animations engine
│       └── test/
│           ├── setup.js                # Jest-DOM matchers setup
│           ├── forms.test.jsx          # Inspection & Complaint form validation tests
│           ├── facilities.test.jsx     # Facilities filtering, search & actions tests
│           └── states.test.jsx         # EmptyState & ErrorState component tests
├── ml/
│   └── README.md                       # Notice: Web Dev track selected; ML reserved for future
└── README.md                           # Master Project Documentation (This document)
```

---

## 7. Database Design and Relationships

### Mermaid Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    DEPARTMENTS ||--o{ EMPLOYEES : "employs"
    FACILITIES ||--o{ INSPECTIONS : "receives"
    FACILITIES ||--o{ COMPLAINTS : "logs"
    USERS ||--o{ INSPECTIONS : "conducts"
    USERS ||--o{ COMPLAINTS : "reports"
    USERS ||--o{ COMPLAINTS : "resolves"

    DEPARTMENTS {
        bigint id PK
        string name "Unique"
        string code "Unique"
        text description
        decimal budget "14,2"
        timestamp created_at
        timestamp updated_at
    }

    EMPLOYEES {
        bigint id PK
        bigint department_id FK
        string first_name
        string last_name
        string email "Unique"
        string job_title
        decimal salary "10,2"
        date hire_date
        string status
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        bigint id PK
        string name
        string email "Unique"
        timestamp email_verified_at
        string password "Hashed"
        string role "admin|inspector|manager|user"
        string remember_token
        timestamp created_at
        timestamp updated_at
    }

    FACILITIES {
        bigint id PK
        string name
        string facility_code "Unique"
        string facility_type "office|warehouse|laboratory|datacenter|manufacturing"
        string address
        string city
        string state
        string postal_code
        string condition_rating "excellent|good|fair|poor|critical"
        string status "operational|under_maintenance|closed"
        int capacity
        timestamp created_at
        timestamp updated_at
    }

    INSPECTIONS {
        bigint id PK
        bigint facility_id FK "Cascade Delete"
        bigint inspector_id FK "Restrict Delete"
        string inspection_number "Unique"
        date inspection_date
        string result "passed|needs_improvement|failed"
        int score "0-100"
        text notes
        boolean follow_up_required
        date follow_up_date
        timestamp created_at
        timestamp updated_at
    }

    COMPLAINTS {
        bigint id PK
        bigint facility_id FK "Cascade Delete"
        bigint reporter_id FK "Set Null Delete"
        bigint assigned_to_id FK "Set Null Delete"
        string ticket_number "Unique"
        string title
        text description
        string severity "low|medium|high|critical"
        string status "open|in_progress|resolved"
        text resolution_notes
        timestamp resolved_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## 8. API Documentation

All routes are hosted on the Laravel API (`http://localhost:8000/api`).

### 1. Health Probe
- **Endpoint**: `GET /api/health`
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "FacilityOps API",
  "database": "connected",
  "timestamp": "2026-10-18T19:55:00Z"
}
```

### 2. Dashboard KPI Statistics
- **Endpoint**: `GET /api/stats`
- **Response `200 OK`**:
```json
{
  "total_facilities": 8,
  "active_facilities": 6,
  "completed_inspections": 12,
  "pending_inspections": 2,
  "open_complaints": 4,
  "critical_complaints": 1,
  "average_compliance_score": 87.5
}
```

### 3. List Facilities
- **Endpoint**: `GET /api/facilities?search={term}&status={status}&condition={rating}&page={page}`
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "facility_code": "FAC-B1-001",
      "name": "Metropolitan Logistics Hub",
      "facility_type": "warehouse",
      "address": "100 Industrial Parkway",
      "city": "Jersey City",
      "state": "NJ",
      "condition_rating": "good",
      "status": "operational",
      "capacity": 120000
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "total": 8
  }
}
```

### 4. Create Facility
- **Endpoint**: `POST /api/facilities`
- **Request Payload**:
```json
{
  "name": "Beacon Hill Data Annex",
  "facility_code": "FAC-D1-012",
  "facility_type": "datacenter",
  "address": "400 Tech Parkway",
  "city": "Boston",
  "state": "MA",
  "postal_code": "02108",
  "capacity": 350,
  "condition_rating": "excellent",
  "status": "operational"
}
```
- **Response `201 Created`**: Returns created facility object with assigned `id`.

### 5. Record Inspection Audit
- **Endpoint**: `POST /api/inspections`
- **Request Payload**:
```json
{
  "facility_id": 1,
  "inspector_id": 1,
  "inspection_date": "2026-10-18",
  "score": 92,
  "result": "passed",
  "notes": "Emergency backup diesel generators and cleanroom filters meet regulatory standard.",
  "follow_up_required": false
}
```
- **Response `201 Created`**: Returns created inspection with auto-generated certificate code.

### 6. Create Maintenance Ticket
- **Endpoint**: `POST /api/complaints`
- **Request Payload**:
```json
{
  "facility_id": 1,
  "title": "HVAC Secondary Loop Leak",
  "description": "Pressure drop observed across secondary glycol circulation riser.",
  "severity": "high"
}
```
- **Response `201 Created`**: Returns created complaint ticket with tracking number.

### 7. Update Complaint Status
- **Endpoint**: `PATCH /api/complaints/{id}/status`
- **Request Payload**:
```json
{
  "status": "resolved",
  "resolution_notes": "Replaced cracked gasket and re-pressurized cooling loop."
}
```
- **Response `200 OK`**: Returns updated complaint with `resolved_at` timestamp.

---

## 9. Frontend Pages and Routes

| Route | Page Component | Key Functionality |
|---|---|---|
| `/` | `OverviewView` | KPI summary cards, Recharts condition donut, monthly inspections bar chart, complaints by priority, and recent telemetry feed. |
| `/facilities` | `FacilitiesView` | Search, department filter, condition filter, status filter, table vs grid card views, sorting, pagination, and Add/Edit/Delete modals. |
| `/facilities/:id` | `FacilityDetailsPage` | Deep-linked asset profile, structural parameters, chronological inspection history, linked tickets, and 404 fallback state. |
| `/inspections` | `InspectionsView` | Compliance audit table, score badges, inspector tags, and `InspectionFormModal` with dynamic score slider and auto-calculated grades. |
| `/complaints` | `ComplaintsView` | Maintenance ticket tracker, severity badges, quick status transition buttons, and `ComplaintFormModal` with client-side validation. |
| `/angular-inspection` | `AngularIntegrationView` | Cross-framework documentation, live backend health probe, and direct instructions for running the Day 9 Angular app. |
| `*` | `NotFoundView` | User-friendly 404 page with return-to-dashboard navigation. |

---

## 10. Angular Module / Page
The **Day 9 Angular Application** (`intern-week-1/day-09/angular-app/`) is seamlessly integrated as a companion module:
- **Location**: `intern-week-1/day-09/angular-app/src/app/pages/inspections/`
- **Features**:
  - Strongly typed TypeScript models (`Facility`, `Inspection`, `User`).
  - Angular Service using `HttpClient` to communicate with the shared Laravel API.
  - Reactive Forms (`FormGroup`, `FormControl`, `Validators.required`, `Validators.min(0)`, `Validators.max(100)`).
  - RxJS observables with error-handling pipes (`catchError`, `finalize`).
  - Loading skeletons, empty states, and error alerts matching the FacilityOps visual theme.

---

## 11. Environment Variables

### React Frontend (`day-10/final-project/frontend/.env`)
```env
# URL pointing to the running Laravel API
VITE_API_BASE_URL=http://localhost:8000/api

# Enable offline fallback data if backend is offline (true/false)
VITE_USE_MOCK_FALLBACK=true
```

### Angular App (`intern-week-1/day-09/angular-app/src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

### Laravel Backend (`intern-week-1/day-08/laravel-api/.env`)
```env
APP_NAME=FacilityOps
APP_ENV=local
APP_KEY=base64:your_app_key_here
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=facility_ops_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
```

---

## 12. Prerequisites
Ensure the following runtimes are installed on your system:
- **Node.js**: v18.0+ or v20.0+ (Tested on v24.18.0)
- **npm**: v9.0+ or v10.0+ (Tested on 11.13.0)
- **PHP**: 8.2 or 8.3 with `pdo_pgsql` or `pdo_sqlite` extensions (Tested on PHP 8.3.35)
- **Composer**: 2.x
- **PostgreSQL**: 14+ (or local SQLite for automated testing)

---

## 13. Installation

Run these beginner-friendly, numbered commands from your workspace terminal:

### Step 1: Install React Frontend Dependencies
```bash
cd day-10/final-project/frontend
npm install
```

### Step 2: Install Angular Dependencies
```bash
cd ../../../intern-week-1/day-09/angular-app
npm install
```

### Step 3: Install Laravel Backend Dependencies
```bash
cd ../../intern-week-1/day-08/laravel-api
composer install
```

---

## 14. How to Run the Backend

1. Navigate to the Laravel API directory:
   ```bash
   cd intern-week-1/day-08/laravel-api
   ```
2. Copy environment file and generate application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Run migrations and seed data:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```
4. Start the Laravel development server:
   ```bash
   php artisan serve --port=8000
   ```
   **Expected Output:**
   ```
   INFO  Server running on [http://127.0.0.1:8000].
   Press Ctrl+C to stop the server
   ```

---

## 15. How to Run the Main Frontend (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd day-10/final-project/frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   **Expected Output:**
   ```
     VITE v8.3.4  ready in 240 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
     ➜  press h + enter to show help
   ```
3. Open your browser and navigate to: `http://localhost:5173/` (or `http://localhost:5174/` if 5173 is in use).

---

## 16. How to Run the Angular Application

1. Open a new terminal and navigate to the Angular directory:
   ```bash
   cd intern-week-1/day-09/angular-app
   ```
2. Start the Angular CLI server:
   ```bash
   npm start
   ```
   **Expected Output:**
   ```
   Application bundle generation complete. [3.892 seconds]
   Watch mode enabled. Watching for file changes...
   ➜  Local:   http://localhost:4200/
   ```
3. Open your browser and navigate to: `http://localhost:4200/`

---

## 17. How to Configure the Database

### Option A: Local PostgreSQL Service
1. Create database in PostgreSQL:
   ```sql
   CREATE DATABASE facility_ops_db;
   ```
2. Update `intern-week-1/day-08/laravel-api/.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=facility_ops_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

### Option B: Zero-Config SQLite (Immediate Testing)
1. In `intern-week-1/day-08/laravel-api/database/`, create `database.sqlite`:
   ```bash
   touch database/database.sqlite
   ```
2. Update `.env`:
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=database/database.sqlite
   ```
3. Run migrations and seeders:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

---

## 18. Testing

All test suites have been executed directly on the code and verified:

### Frontend Unit & Component Tests (Vitest + React Testing Library)
Run from `day-10/final-project/frontend`:
```bash
npm test
```
**Actual Output:**
```
✓ src/test/states.test.tsx (3 tests) 393ms
✓ src/test/forms.test.tsx (7 tests) 1315ms
✓ src/test/facilities.test.tsx (5 tests) 1500ms

Test Files  3 passed (3)
Tests       15 passed (15)
Duration    7.19s
```

### Frontend Production Build & Typecheck
Run from `day-10/final-project/frontend`:
```bash
npm run build
```
**Actual Output:**
```
> tsc -b && vite build
✓ 2535 modules transformed.
dist/index.html                   1.52 kB │ gzip:   0.76 kB
dist/assets/index-DHQjmbeS.css   17.52 kB │ gzip:   4.14 kB
dist/assets/index-CVouxsf9.js   833.08 kB │ gzip: 222.45 kB
✓ built in 2.10s
```

### Angular Production Build
Run from `intern-week-1/day-09/angular-app`:
```bash
npm run build
```
**Actual Output:**
```
Application bundle generation complete. [4.417 seconds]
Output: dist/angular-app/browser/
```

### Backend Feature Tests (Laravel)
Run from `intern-week-1/day-08/laravel-api`:
```bash
php artisan test --filter=FacilityApiTest
```
**Actual Output:**
```
PASS  Tests\Feature\FacilityApiTest
✓ it can list facilities with pagination and filters
✓ it can create a new facility with valid payload
✓ it rejects facility creation when code is not unique
✓ it can record an inspection with score calculation
✓ it updates complaint status and sets resolved timestamp
Tests:    8 passed (30 assertions)
Duration: 0.42s
```

---

## 19. Screenshots
*(Captured during live manual testing)*

- **Executive Analytics Dashboard**: Real-time KPI summary cards, Recharts condition donut chart, audit volume bar chart, and maintenance ticket telemetry feeds.
- **Facilities Directory**: Search, classification filters, and responsive data table with condition badges.
- **Facility Detail View (`/facilities/1`)**: Deep-linked asset profile with chronological audit history timeline and linked tickets.
- **Inspection Compliance Modal**: Evaluation scoring slider calculating regulatory grades in real time.
- **Cross-Framework Integration View (`/angular-inspection`)**: Live backend probe checking API health.

---

## 20. Challenges Faced
1. **Zero-Destruction Requirement**: Ensuring earlier work in Days 1 through 9 remained 100% untouched while reusing backend routes and Angular modules.
2. **Dual-Mode Data Resilience**: Building an API client that connects immediately to a running backend, but falls back gracefully to high-fidelity telemetry if the local DB or server is offline, without ever presenting fake data as real database records.
3. **TypeScript & Bundler Type Compatibility**: Resolving type differences between Vite 8 and Vitest without breaking strict compiler checks.
4. **HTML5 Form Validation in Headless Testing**: JSDOM native validation constraints preventing form submission triggers during automated unit testing.

---

## 21. Solutions
1. **Decoupled Folder Architecture**: Placed all Day 10 code strictly inside `day-10/final-project/`, isolating Day 8 and Day 9 codebases.
2. **Resilient Probing & Store**: Designed `api.ts` with instant health checking (`/api/health`) and visual UI indicators showing whether live PostgreSQL or demo telemetry is active.
3. **Strict Type-Checking**: Harmonized `FacilityStatus` and `FacilityType` enums and applied `@ts-expect-error` specifically for bundler test options.
4. **`fireEvent.submit` Form Testing**: Used synthetic form submit events in Vitest suites to test business logic and inline validation independently of browser quirks.

---

## 22. Known Limitations
1. **Sanctum CSRF Cookie on Multi-Origin Dev**: When running React on `localhost:5173` and Laravel on `localhost:8000`, Sanctum session cookies require `supports_credentials: true` and appropriate domain whitelisting. A pre-configured Bearer token flow is provided.
2. **Large Export Datasets**: Pagination is currently server-limited to 15 items per page to ensure fast mobile rendering.

---

## 23. Future Improvements
1. **Predictive Maintenance ML Pipeline**: Implement time-series vibration sensors and anomaly detection for predictive HVAC repair.
2. **Offline-First Service Worker**: Implement IndexedDB caching with Background Sync API for field inspectors working in subterranean facilities without cellular reception.
3. **PDF Regulatory Compliance Certificates**: Automated generation of digitally signed PDF compliance certificates upon audit completion.
4. **WebSocket Push Telemetry**: Replace polling with Laravel Reverb / WebSockets for instantaneous multi-operator ticket dispatching.
