# Day 08: Relational Database Design, SQL Query Suite & Laravel 11 CRUD API

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)  
**Submission Folder:** `intern-week-1/day-08/`  
**Database Engine:** PostgreSQL 18.x (Host: `localhost:5432`)  
**Backend Framework:** Laravel 11.57.0 (PHP 8.3+)

---

## 1. Executive Summary & Program Milestone

Day 08 of the internship transitions from frontend clients and node services into **enterprise database engineering, relational schema design, SQL optimization, and robust backend framework architecture** using Laravel 11 and PostgreSQL.

### Core Objectives Achieved

1. **Normalized Database Architecture (3NF):** Designed and implemented an enterprise database for a **Facility & Employee Management System** comprising six interconnected tables (`users`, `departments`, `employees`, `facilities`, `inspections`, and `complaints`).
2. **PostgreSQL Schema & Optimization:** Defined primary keys, foreign key constraints with cascade/restrict rules, check expressions, comments, and strategic B-tree indexes to accelerate JOINs, aggregations, and sorted lookups.
3. **Advanced SQL Query Suite:** Authored and documented all 14 mandatory SQL query scenarios covering multi-table joins, aggregations with `GROUP BY` and `HAVING`, scalar/correlated subqueries, CTEs, query cost inspection with `EXPLAIN`, and multi-statement ACID transactions with `SAVEPOINT` and `ROLLBACK`.
4. **Real Laravel 11 Application:** Scaffolding a full-stack Laravel 11 application with Eloquent ORM, database migrations, seeders, Form Request validation, Bearer token authentication middleware, and complete CRUD endpoints for Facilities, Inspections, and Complaints.
5. **Quality Assurance & Verification:** Executed a comprehensive automated test suite consisting of **27 feature and unit tests with 105 assertions** verifying 100% test passage across authentication, authorization, CRUD operations, edge cases, and 422 validation errors.

---

## 2. Directory Structure & Deliverables

All Day 08 code and documentation strictly reside within `intern-week-1/day-08/` following the existing repository folder convention:

```text
intern-week-1/day-08/
├── README.md                          # Master Day 08 documentation & technical report
├── dashboard/                         # Working React 19 + TypeScript + Vite web dashboard
│   ├── src/                           # UI views, typed API client, modals, & theme
│   ├── index.html                     # Dashboard application entry point
│   ├── package.json                   # Dashboard dependencies (lucide-react, react 19, vite)
│   ├── .env.example                   # Dashboard API URL configuration template
│   └── README.md                      # Frontend architecture & execution guide
├── sql/
│   ├── README.md                      # Guide to PostgreSQL scripts & query performance
│   ├── 01-create-tables.sql           # DDL schema creating all 6 tables with constraints & indexes
│   ├── 02-seed-data.sql               # Realistic fictional dataset across all 6 tables
│   ├── 03-basic-queries.sql           # Projections, WHERE filters, ORDER BY, & safe CRUD
│   ├── 04-joins-and-aggregations.sql  # Multi-table joins, GROUP BY, HAVING, and pivot matrix
│   ├── 05-subqueries-and-indexes.sql  # Subqueries, CTEs, window functions, & index analysis
│   └── 06-transactions.sql            # ACID multi-table workflows, error rollback, & savepoints
├── database/
│   ├── README.md                      # Database design philosophy, normalization, & pgAdmin manual
│   ├── schema.sql                     # Consolidated PostgreSQL DDL schema & indexes
│   ├── seed.sql                       # Consolidated realistic seed data script
│   └── er-diagram.md                  # Mermaid ER diagram, cardinality, & normalization breakdown
└── laravel-api/
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   ├── AuthController.php          # Register, login, logout, & profile endpoints
    │   │   │   ├── FacilityController.php      # Full Facility CRUD with filters & pagination
    │   │   │   ├── InspectionController.php    # Safety audit CRUD with inspector linking
    │   │   │   └── ComplaintController.php     # Maintenance ticket CRUD & resolution lifecycle
    │   │   ├── Middleware/
    │   │   │   └── AuthenticateApi.php         # Bearer token validation & request authentication
    │   │   └── Requests/                       # Dedicated Form Requests for input validation
    │   │       ├── StoreFacilityRequest.php
    │   │       ├── UpdateFacilityRequest.php
    │   │       ├── StoreInspectionRequest.php
    │   │       ├── UpdateInspectionRequest.php
    │   │       ├── StoreComplaintRequest.php
    │   │       ├── UpdateComplaintRequest.php
    │   │       ├── LoginRequest.php
    │   │       └── RegisterRequest.php
    │   └── Models/                             # Eloquent models matching database schema
    │       ├── User.php
    │       ├── Department.php
    │       ├── Employee.php
    │       ├── Facility.php
    │       ├── Inspection.php
    │       └── Complaint.php
    ├── database/
    │   ├── migrations/                         # 6 Laravel migrations defining tables & foreign keys
    │   └── seeders/                            # 6 Eloquent seeders for database population
    ├── routes/
    │   └── api.php                             # 20 versioned REST API routes (public & protected)
    ├── tests/
    │   └── Feature/                            # 27 automated tests (Auth, Facility, Inspection, Complaint)
    ├── .env.example                            # PostgreSQL database environment configuration
    ├── composer.json                           # Laravel 11 dependencies and metadata
    ├── phpunit.xml                             # Test configuration with SQLite in-memory runner
    └── README.md                               # Laravel architecture & execution manual
```

---

## 3. Database Design & Entity Architecture

### Relational Schema Summary

| Entity | Primary Key | Description | Relationships & Foreign Keys |
| :--- | :--- | :--- | :--- |
| **`users`** | `id` (BIGSERIAL) | System authentication principals and role-based permissions (`admin`, `inspector`, `staff`, `manager`). | Referenced by `inspections` (inspector) and `complaints` (reporter, assignee). |
| **`departments`** | `id` (BIGSERIAL) | Organizational cost centers and operational units. | Has many `employees` (`ON DELETE RESTRICT`). |
| **`employees`** | `id` (BIGSERIAL) | Organizational payroll and HR personnel. | Belongs to `departments`. |
| **`facilities`** | `id` (BIGSERIAL) | Physical sites, buildings, laboratories, and warehouses. | Has many `inspections` and `complaints` (`ON DELETE CASCADE`). |
| **`inspections`** | `id` (BIGSERIAL) | Safety and regulatory audits with standardized scores (0–100). | Belongs to `facilities` and `users` (inspector). |
| **`complaints`** | `id` (BIGSERIAL) | Incident and maintenance tickets with status and severity. | Belongs to `facilities`, optionally linked to reporter and assignee. |

### Architectural Distinction: Users vs. Employees

As documented in the schema and model designs, `users` and `employees` are intentionally decoupled:
- **`users`** represents *system identity and credentials* (email, password hash, API tokens, authorization roles). External auditors and system administrators are users who are not payroll employees.
- **`employees`** represents *human resource personnel* (job title, compensation, hire date, department allocation). Not all workforce employees have software system accounts.
- This design prevents mixing public HR directories with sensitive credential stores while supporting flexible role assignment to facility inspectors and ticket technicians.

---

## 4. Required SQL Queries Catalog

All 14 query scenarios specified in the curriculum are implemented and verified in the `sql/` directory:

| Query # | Requirement | Implementation Script | Key SQL Constructs |
| :---: | :--- | :--- | :--- |
| **1** | Employees with department names | `sql/03-basic-queries.sql` | `INNER JOIN`, string concatenation `\|\|` |
| **2** | Employees in selected department | `sql/03-basic-queries.sql` | `WHERE d.code = 'DEPT-ENG'`, multi-column projection |
| **3** | Sort employees by salary | `sql/03-basic-queries.sql` | `ORDER BY salary DESC NULLS LAST`, `TO_CHAR` formatting |
| **4** | Average salary per department | `sql/04-joins-and-aggregations.sql` | `GROUP BY`, `AVG()`, `COUNT()`, `MIN()`, `MAX()`, `ROUND()` |
| **5** | Departments with avg salary > threshold | `sql/04-joins-and-aggregations.sql` | `HAVING AVG(e.salary) > 85000.00` |
| **6** | Highest-paid employee | `sql/05-subqueries-and-indexes.sql` | Scalar subquery `WHERE salary = (SELECT MAX(...))` & CTE with `DENSE_RANK()` |
| **7** | Facilities in poor/critical condition | `sql/05-subqueries-and-indexes.sql` | `WHERE condition_rating IN (...) OR id IN (SELECT ...)`, subquery counts |
| **8** | Count complaints by facility & status | `sql/04-joins-and-aggregations.sql` | Multi-column `GROUP BY f.id, c.status`, Pivot matrix via `CASE WHEN` |
| **9** | Inspection history for selected facility | `sql/04-joins-and-aggregations.sql` | Multi-table join (`facilities` + `inspections` + `users`), chronologically ordered |
| **10** | Appropriate JOIN demonstration | `sql/04-joins-and-aggregations.sql` | `INNER JOIN`, `LEFT JOIN`, `FULL OUTER JOIN`, `COALESCE()` |
| **11** | Subquery demonstration | `sql/05-subqueries-and-indexes.sql` | `CROSS JOIN LATERAL` correlated subquery, `WHERE EXISTS` predicate |
| **12** | Indexes & query cost demonstration | `sql/05-subqueries-and-indexes.sql` | `EXPLAIN`, B-Tree index scan analysis, trade-off breakdown |
| **13** | Transactions with rollback & savepoint | `sql/06-transactions.sql` | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`, constraint failure recovery |
| **14** | Safe CRUD operations | `sql/03-basic-queries.sql` | Parameterized `INSERT ... RETURNING`, `SELECT`, `UPDATE ... WHERE`, `DELETE` |

---

## 5. Laravel 11 REST API Overview

### Endpoints Implemented

1. **Facilities CRUD:**
   - `GET /api/facilities` — Public listing with search (`name`, `code`, `city`), filters (`type`, `condition`, `status`), and pagination.
   - `GET /api/facilities/{id}` — Public details with latest inspections and complaints.
   - `POST /api/facilities` — Protected creation (requires Bearer token).
   - `PUT/PATCH /api/facilities/{id}` — Protected update.
   - `DELETE /api/facilities/{id}` — Protected deletion (cascades associated child records).
2. **Inspections CRUD:**
   - `GET /api/inspections` — Public listing with filters (`facility_id`, `result`, `inspector_id`, `min_score`).
   - `GET /api/inspections/{id}` — Public details with inspector and facility profiles.
   - `POST /api/inspections` — Protected audit creation (score validated 0–100, facility and inspector existence validated).
   - `PUT/PATCH /api/inspections/{id}` — Protected update.
   - `DELETE /api/inspections/{id}` — Protected deletion.
3. **Complaints CRUD:**
   - `GET /api/complaints` — Public listing with status/severity filters.
   - `GET /api/complaints/{id}` — Public details with reporter and assigned technician.
   - `POST /api/complaints` — Protected ticket creation.
   - `PUT/PATCH /api/complaints/{id}` — Protected update (auto-stamps `resolved_at` when transitioned to `resolved`).
   - `DELETE /api/complaints/{id}` — Protected deletion.
4. **Authentication & Identity:**
   - `POST /api/auth/register` — Public registration issuing Bearer token.
   - `POST /api/auth/login` — Public login issuing Bearer token.
   - `GET /api/auth/me` — Protected user profile.
   - `POST /api/auth/logout` — Protected token invalidation.

---

## 6. Request-to-Response Flow Deep Dive

The architectural flow illustrates how an HTTP request travels through Laravel:

```text
[HTTP Request] 
      │ (1. Headers & Payload)
      ▼
[Middleware: AuthenticateApi] ──(Fails)──► [401 Unauthorized JSON]
      │ (2. Validates Bearer Token & Injects User)
      ▼
[Routing: routes/api.php]
      │ (3. Dispatches to Controller Action)
      ▼
[Form Request: StoreInspectionRequest] ──(Fails)──► [422 Validation Error JSON]
      │ (4. Authorizes & Validates Payload)
      ▼
[Controller: InspectionController@store]
      │ (5. Executes Business Logic)
      ▼
[Eloquent Model: Inspection::create()]
      │ (6. Generates Parameterized SQL)
      ▼
[Database: PostgreSQL 18 Engine]
      │ (7. Enforces Constraints & Writes Rows)
      ▼
[Eloquent Model Hydration & Eager Loading]
      │ (8. Loads Relations: facility, inspector)
      ▼
[HTTP Response: 201 Created JSON]
```

---

## 7. Automated Test Suite Execution & Results

The test suite was executed using Laravel's native test runner (`artisan test` powered by PHPUnit 11) backed by an in-memory SQLite runner for instant, reproducible CI/CD execution:

```powershell
& "C:\Users\LENOVO\tools\php\php.exe" artisan test
```

### Verified Test Run Results

```text
   PASS  Tests\Unit\ExampleTest
  ✓ that true is true                                                    0.02s  

   PASS  Tests\Feature\AuthApiTest
  ✓ user can register with valid payload                                 1.26s  
  ✓ registration fails with duplicate email                              0.05s  
  ✓ user can login with valid credentials                                0.04s  
  ✓ login fails with invalid password                                    0.03s  
  ✓ protected route rejects unauthenticated request                      0.03s  
  ✓ protected route allows authenticated user                            0.03s  
  ✓ user can logout and revoke token                                     0.03s  

   PASS  Tests\Feature\ComplaintApiTest
  ✓ can list complaints publicly                                         0.05s  
  ✓ can show single complaint with relationships                         0.04s  
  ✓ can create complaint ticket when authenticated                       0.04s  
  ✓ updating status to resolved auto sets timestamp                      0.04s  
  ✓ can delete complaint                                                 0.04s  

   PASS  Tests\Feature\ExampleTest
  ✓ api health endpoint returns successful response                      0.05s  

   PASS  Tests\Feature\FacilityApiTest
  ✓ can list facilities publicly                                         0.04s  
  ✓ can show single facility                                             0.04s  
  ✓ show returns 404 for nonexistent facility                            0.03s  
  ✓ creating facility requires authentication                            0.04s  
  ✓ authenticated user can create facility                               0.03s  
  ✓ facility creation fails validation for missing fields or condition  0.04s  
  ✓ can update facility                                                  0.03s  
  ✓ can delete facility                                                  0.03s  

   PASS  Tests\Feature\InspectionApiTest
  ✓ can list inspections                                                 0.04s  
  ✓ can show inspection                                                  0.03s  
  ✓ create inspection fails with nonexistent facility or illegal score   0.05s  
  ✓ can create valid inspection when authenticated                       0.03s  
  ✓ can delete inspection                                                0.04s  

  Tests:    27 passed (105 assertions)
  Duration: 2.83s
```

---

## 8. Setup & Local Execution Guide

### Database Setup (PostgreSQL 18 via pgAdmin or psql)

1. Open pgAdmin 4 or terminal and create the database:
   ```sql
   CREATE DATABASE internship_day08;
   ```
2. Apply the consolidated schema:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/database/schema.sql"
   ```
3. Load the sample seed data:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d day8_internship -f "intern-week-1/day-08/database/seed.sql"
   ```

### Laravel API Setup

1. Copy `.env.example` to `.env` in `intern-week-1/day-08/laravel-api/`:
   ```powershell
   cd intern-week-1/day-08/laravel-api
   Copy-Item .env.example .env
   ```
2. Configure your local PostgreSQL credentials in `.env`:
   ```ini
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=day8_internship
   DB_USERNAME=postgres
   DB_PASSWORD=your_actual_postgres_password
   ```
3. Run migrations and seeders:
   ```powershell
   & "C:\Users\LENOVO\tools\php\php.exe" artisan migrate --seed
   ```
4. Start the Laravel development server:
   ```powershell
   & "C:\Users\LENOVO\tools\php\php.exe" artisan serve --port=8000
   ```
5. Verify the API is responding:
   ```bash
   curl http://localhost:8000/api/health
   curl http://localhost:8000/api/stats
   curl http://localhost:8000/api/facilities
   ```

---

## 9. FacilityOps Web Dashboard

A responsive frontend web dashboard was added to `intern-week-1/day-08/dashboard/` using **React 19**, **TypeScript**, and **Vite**.

### Dashboard Features

1. **Executive Overview Page:**
   - Real-time KPI summary cards displaying live counts of:
     - Total Facilities
     - Total Completed Inspections & Audits
     - Total Maintenance Complaints / Tickets
     - Open vs. In-Progress vs. Resolved Complaints
     - Resolution Rate Percentage
     - Facilities flagged in Poor or Critical health rating
   - Live stream of recent safety audits with color-coded compliance gauges.
   - Live stream of recent maintenance tickets with priority severity pills.
   - Quick shortcut actions to register facilities, audits, or tickets.

2. **Facilities Directory Page:**
   - Full tabular directory of physical facilities.
   - Real-time search across facility names, alphanumeric facility codes, street addresses, and cities.
   - Filter dropdowns for facility types (*Corporate Office*, *Warehouse*, *Laboratory*, *Data Center*, *Manufacturing*) and condition ratings (*Excellent*, *Good*, *Fair*, *Poor*, *Critical*).
   - Facility Detail Modal displaying capacity, full address, and embedded recent inspection audits and active maintenance tickets.
   - Full CRUD modal workflows with validation (name, unique code, street address, city, positive integer capacity).
   - Deletion confirmation modal with cascade warning.

3. **Safety & Compliance Inspections Page:**
   - Audits directory with inspection numbers, facility names, assigned inspector, audit dates, compliance scores, and results.
   - Visual compliance score bars (0–100) color-coded by threshold (emerald for pass >=80, amber for conditional >=60, rose for fail <60).
   - Inspection Record Modal with facility picker, inspector picker, score validation, notes, and conditional follow-up date enforcement.
   - Inspection Detail Modal with complete findings and inspector notes.
   - Deletion confirmation modal.

4. **Complaints & Work Orders Page:**
   - Maintenance ticket directory with facility association, issue descriptions, severity ratings, lifecycle status, and timestamps.
   - Filter by status (*Open*, *In Progress*, *Resolved*, *Closed*, *Rejected*) and severity (*Low*, *Medium*, *High*, *Urgent*).
   - In-line quick status updater allowing instant ticket lifecycle transitions with auto-timestamping upon resolution.
   - Ticket Creation & Edit Modals with facility selector, staff assignee, and resolution notes.
   - Deletion confirmation modal.

5. **API Integration & Authentication:**
   - Real HTTP requests to the Laravel 11 REST API via `fetch` (no mocked dummy data, no silent localStorage substitution).
   - Configurable API endpoint via `VITE_API_URL` environment variable.
   - Bearer token authentication with a one-click **Demo Admin** switcher using seeded credentials (`sarah.admin@enterprise.local` / `Password123!`).
   - CORS enabled for seamless cross-origin communication between `localhost:5173` and `localhost:8000`.
   - Polished Toast notification system with auto-dismiss for clear success and error feedback.

### Dashboard Setup & Running Instructions

1. Navigate to the dashboard directory:
   ```powershell
   cd intern-week-1/day-08/dashboard
   ```
2. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Install frontend dependencies:
   ```powershell
   npm install
   ```
4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
5. Open your browser:
   👉 **`http://localhost:5173`**

### Simultaneous Execution of All Required Services

To operate the complete full-stack Day 8 system locally:

| Service | Terminal / Command | Local URL |
| :--- | :--- | :--- |
| **PostgreSQL Database** | PostgreSQL 18 Service (auto-runs or started via Windows Services) | `localhost:5432` (`day8_internship`) |
| **Laravel REST API** | `cd intern-week-1/day-08/laravel-api; & "C:\Users\LENOVO\tools\php\php.exe" artisan serve --port=8000` | `http://localhost:8000/api` |
| **FacilityOps Dashboard** | `cd intern-week-1/day-08/dashboard; npm run dev` | `http://localhost:5173` |

---

## 10. Verification & Test Summary

All testing was actually executed and verified on the local system:

1. **Automated Laravel Feature & Unit Tests:**
   - Command: `php artisan test`
   - Result: **27 passed (105 assertions)** in 2.04 seconds.
   - Coverage: `AuthApiTest` (7 tests), `FacilityApiTest` (8 tests), `InspectionApiTest` (5 tests), `ComplaintApiTest` (5 tests), `ExampleTest` (2 tests).

2. **Frontend TypeScript & Vite Production Build:**
   - Command: `npm run build` (`tsc -b && vite build`)
   - Result: **Zero errors**, successfully bundled `dist/assets/index-DnLWbVjp.js` (315 kB) and `dist/assets/index-DpnVfL7A.css` (12.5 kB).

3. **Live Database Integration Verification:**
   - Verified active connection to PostgreSQL 18 database `day8_internship`.
   - Verified `GET /api/stats` endpoint returns live aggregate calculations (6 facilities, 8 audits, 10 tickets).
   - Verified `GET /api/inspectors` returns active staff users.
   - Verified CORS configuration accepts cross-origin pre-flight requests (`OPTIONS`) from `http://localhost:5173`.

---

## 11. Cloud Deployment Guide (Backend on Render & Frontend on Vercel)

Both the Laravel backend and Vite frontend are pre-configured for zero-error production deployment to cloud hosting.

```
┌─────────────────────────────────┐       HTTPS REST API       ┌─────────────────────────────────┐
│         Vercel (Frontend)       │ ─────────────────────────> │         Render (Backend)        │
│    React 19 + TypeScript + Vite │                            │   Laravel 11 + Docker Container │
│   https://<app>.vercel.app      │ <───────────────────────── │   https://<api>.onrender.com    │
└─────────────────────────────────┘        CORS: "*"           └────────────────┬────────────────┘
                                                                                │
                                                                   PostgreSQL   │ Internal URL / Pool
                                                                                ▼
                                                               ┌─────────────────────────────────┐
                                                               │    Render / Neon PostgreSQL     │
                                                               │        `day8_internship`        │
                                                               └─────────────────────────────────┘
```

---

### Step A: Deploy Backend & PostgreSQL on Render

#### 1. Create PostgreSQL Database on Render
1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **PostgreSQL**.
3. Set:
   - **Name:** `facilityops-db`
   - **Database:** `day8_internship`
   - **User:** `postgres`
   - **Region:** Choose closest region (e.g., Oregon or Frankfurt).
   - **Plan:** Free
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (e.g., `postgres://postgres:password@dpg-xxx-a:5432/day8_internship`).

#### 2. Create Laravel Web Service on Render
1. In Render, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository: `snehal-async/10-day-internship-training`.
3. Configure service settings:
   - **Name:** `facilityops-api` (or your choice)
   - **Region:** Same region as your database
   - **Branch:** `main`
   - **Root Directory:** `intern-week-1/day-08/laravel-api`
   - **Runtime:** **Docker** *(Render detects the included production `Dockerfile` automatically)*
   - **Plan:** Free
4. Under **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `APP_NAME` | `FacilityOpsAPI` | Application name |
| `APP_ENV` | `production` | Production mode |
| `APP_DEBUG` | `false` | Disable debug stack traces |
| `APP_KEY` | `base64:XG8dF4w73Q8m3Fq9L5k1...` | Run `php artisan key:generate --show` locally to generate |
| `DB_CONNECTION` | `pgsql` | PostgreSQL driver |
| `DATABASE_URL` | *(Paste Render Internal Database URL)* | Auto-maps to Laravel pgsql configuration |
| `RUN_MIGRATIONS` | `true` | Automatically executes `migrate --force --seed` on startup |

5. Under **Health Check Path**, enter: `/api/health`.
6. Click **Create Web Service**.
7. Render will build the Docker container, run migrations, seed tables, and make the API live at:
   👉 **`https://facilityops-api.onrender.com`**
   *(Test health: `https://facilityops-api.onrender.com/api/health`)*

---

### Step B: Deploy Frontend Dashboard on Vercel

1. Log into [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import the GitHub repository: `snehal-async/10-day-internship-training`.
4. Configure the project parameters:
   - **Project Name:** `facilityops-dashboard`
   - **Framework Preset:** **Vite**
   - **Root Directory:** Click **Edit** and select:
     👉 **`intern-week-1/day-08/dashboard`**
   - **Build & Development Settings:** Leave default (`npm run build` with output `dist`, guided by `vercel.json`).
5. Open the **Environment Variables** panel and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://facilityops-api.onrender.com/api` *(Your Render backend URL + `/api`)* |

6. Click **Deploy**.
7. Vercel will install dependencies, compile the TypeScript bundle, and launch your live dashboard:
   👉 **`https://facilityops-dashboard.vercel.app`**


