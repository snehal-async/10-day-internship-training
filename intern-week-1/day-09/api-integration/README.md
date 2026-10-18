# Day 9 — API Integration Architecture & Specification

This document details the API integration layer between the **Day 9 Angular 22 Facility Inspection Dashboard** and the **Day 8 Laravel REST API backend**. It serves as the official integration guide, contract specification, and connection manual for local and cloud environments.

---

## 1. Architectural Overview

The Angular application utilizes a dual-mode service architecture designed to operate seamlessly whether the Day 8 Laravel backend is running live or offline:

```
┌─────────────────────────────────────────────────────────────┐
│               Angular 22 Inspection Dashboard               │
│                                                             │
│   [Dashboard]  [Facilities]  [Facility Details] [New Audit] │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Angular Core Domain Services                │
│    (FacilityService, InspectionService, ComplaintService)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  ApiService (HTTP Client)                   │
│   • Auto-fallback to offline mock dataset on connection loss│
│   • Bearer Token Authentication Injector                    │
│   • Standardized Error Normalization                        │
└──────────────────┬───────────────────────┬──────────────────┘
                   │                       │
      (Backend Online / Configured)   (Backend Offline / Demo Mode)
                   │                       │
                   ▼                       ▼
      ┌─────────────────────────┐  ┌─────────────────────────┐
      │  Day 8 Laravel REST API │  │ Local Statutory Dataset │
      │  (PostgreSQL + Sanctum) │  │ (In-memory Mock Store)  │
      └─────────────────────────┘  └─────────────────────────┘
```

---

## 2. Expected API Endpoints & Contract Matrix

The frontend interfaces with the following Day 8 Laravel API endpoints located under `/api/`:

| Method | Endpoint | Description | Real API Integration | Demo Fallback |
|---|---|---|---|---|
| `GET` | `/api/health` | Backend status & PostgreSQL database ping | ✅ Live Probe | Mock status (`ok`) |
| `GET` | `/api/stats` | Aggregated metrics (facilities, audits, tickets) | ✅ Live Probe | Mock KPI metrics |
| `GET` | `/api/facilities` | List of facilities with search & filter parameters | ✅ Live Probe | 5 Statutory Facilities |
| `GET` | `/api/facilities/{id}` | Detailed facility record with relationships | ✅ Live Probe | Enriched Facility Mock |
| `GET` | `/api/inspections` | Inspection history & audit log list | ✅ Live Probe | 5 Compliance Audits |
| `POST` | `/api/inspections` | Submit new statutory inspection audit | ✅ Live Probe | In-Memory Local Append |
| `GET` | `/api/inspectors` | Lead auditor registry & credentials | ✅ Live Probe | 4 Certified Auditors |
| `GET` | `/api/complaints` | Citizen & facility maintenance work orders | ✅ Live Probe | 4 Maintenance Tickets |

---

## 3. Request & Response Payload Examples

### 3.1 `GET /api/facilities`
**Query Parameters (Optional):**
- `search`: Filter by name, code, or address string
- `type`: Filter by facility classification (`hospital`, `water_treatment`, `school`, `power_plant`, etc.)
- `status`: Filter by operational status (`operational`, `under_maintenance`, `closed`)

**Sample 200 OK Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Central District General Hospital",
      "code": "FAC-HOSP-001",
      "type": "hospital",
      "address": "450 Healthcare Blvd, Metro Sector 4",
      "status": "operational",
      "created_at": "2026-01-10T08:30:00.000000Z",
      "updated_at": "2026-03-15T10:15:00.000000Z",
      "department": {
        "id": 1,
        "name": "Public Health & Safety",
        "code": "DHS-01"
      },
      "inspections_count": 8,
      "open_complaints_count": 1
    }
  ],
  "meta": {
    "total": 1,
    "current_page": 1,
    "last_page": 1
  }
}
```

---

### 3.2 `GET /api/facilities/{id}`
Returns the comprehensive facility record including relational collections (`inspections`, `complaints`, and `department`).

**Sample 200 OK Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Central District General Hospital",
    "code": "FAC-HOSP-001",
    "type": "hospital",
    "address": "450 Healthcare Blvd, Metro Sector 4",
    "status": "operational",
    "department": {
      "id": 1,
      "name": "Public Health & Safety",
      "code": "DHS-01"
    },
    "inspections": [
      {
        "id": 1,
        "facility_id": 1,
        "inspector_id": 101,
        "inspection_number": "INS-2026-001",
        "inspection_date": "2026-03-15",
        "result": "passed",
        "score": 94,
        "notes": "Sterilization units and emergency power backup compliant with ISO 9001.",
        "follow_up_required": false,
        "inspector": {
          "id": 101,
          "name": "Dr. Sarah Mitchell",
          "badge_number": "AUD-7741",
          "specialization": "Clinical Safety & Biohazards"
        }
      }
    ],
    "complaints": [
      {
        "id": 201,
        "facility_id": 1,
        "ticket_number": "CMP-2026-041",
        "category": "HVAC",
        "priority": "medium",
        "status": "in_progress",
        "description": "Secondary surgical wing chiller pressure drop reported.",
        "reported_at": "2026-03-14T09:00:00Z"
      }
    ]
  }
}
```

---

### 3.3 `POST /api/inspections`
Creates a statutory inspection audit in the system.

**Request Payload:**
```json
{
  "facility_id": 2,
  "inspector_id": 102,
  "inspection_number": "INS-2026-088",
  "inspection_date": "2026-03-18",
  "result": "passed",
  "score": 88,
  "notes": "Secondary clarification tanks calibrated. Flow telemetry transmitting normally.",
  "follow_up_required": false,
  "follow_up_date": null
}
```

**Validation Rules:**
- `facility_id`: Required, numeric, must exist in `facilities` table.
- `inspector_id`: Required, numeric, must exist in `inspectors` table.
- `inspection_number`: Required, string, unique, minimum 4 characters.
- `inspection_date`: Required, valid ISO date string (`YYYY-MM-DD`).
- `result`: Required, enum: `passed`, `needs_improvement`, `failed`.
- `score`: Required, numeric, between `0` and `100`.
- `notes`: Required, string, minimum 10 characters.
- `follow_up_required`: Boolean.
- `follow_up_date`: Required if `follow_up_required` is true, valid ISO date.

**Sample 201 Created Response:**
```json
{
  "success": true,
  "message": "Inspection successfully logged.",
  "data": {
    "id": 6,
    "facility_id": 2,
    "inspector_id": 102,
    "inspection_number": "INS-2026-088",
    "inspection_date": "2026-03-18",
    "result": "passed",
    "score": 88,
    "notes": "Secondary clarification tanks calibrated. Flow telemetry transmitting normally.",
    "follow_up_required": false,
    "created_at": "2026-03-18T11:45:00.000000Z"
  }
}
```

---

## 4. How to Configure the API Base URL

The application manages environment configurations via Angular's environment files:

### Local Development
File: [`src/environments/environment.ts`](../angular-app/src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  useDemoFallback: true,
  requestTimeoutMs: 5000
};
```

### Production / Deployed Backend
File: [`src/environments/environment.prod.ts`](../angular-app/src/environments/environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://facilityops-api.onrender.com/api',
  useDemoFallback: true,
  requestTimeoutMs: 10000
};
```

To point to any custom or remote API without modifying code, simply adjust the `apiUrl` property.

---

## 5. CORS Requirements

If running the Angular application on `http://localhost:4200` and the Laravel backend on `http://localhost:8000`:
1. Ensure `config/cors.php` in the Laravel backend allows requests from `http://localhost:4200` (and `http://127.0.0.1:4200`):
   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'allowed_methods' => ['*'],
   'allowed_origins' => ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:5173'],
   'allowed_headers' => ['*'],
   'supports_credentials' => true,
   ```
2. The Angular app automatically handles CORS pre-flight `OPTIONS` requests via `HttpClient`.

---

## 6. How to Connect to the Day 8 Laravel API

To run the full stack locally with the live backend:

1. **Start the Day 8 Laravel API Server:**
   ```bash
   cd intern-week-1/day-08/laravel-api
   php artisan serve --port=8000
   ```
2. **Verify Database Connectivity:**
   Test `http://127.0.0.1:8000/api/health` in your browser. It should return:
   ```json
   { "status": "ok", "database": "connected" }
   ```
3. **Start the Day 9 Angular App:**
   ```bash
   cd intern-week-1/day-09/angular-app
   npm start
   ```
4. **Observe Live Connection:**
   The navbar in the Angular application will show a green badge **"● Live Backend Connected"**.

---

## 7. Real API vs. Demo/Mock Mode Matrix

| Feature | When Backend is Available | When Backend is Offline / Unreachable |
|---|---|---|
| **Dashboard Metrics** | Fetched from `/api/stats` and calculated live | Calculated dynamically from in-memory statutory mock dataset |
| **Facility Search & Filtering** | Live server-side query with query params | Instant client-side RxJS filter over cached/mock registry |
| **Facility Detail Lookup** | Real PostgreSQL relational query | In-memory relational lookup by facility ID |
| **New Audit Submission** | Sent via HTTP `POST /api/inspections` | Saved to local in-memory store so it appears in history immediately |
| **Inspector Directory** | Fetched from `/api/inspectors` | Preloaded certified inspectors (Lead Auditor, Safety Inspector, etc.) |
| **Offline Resilience** | Automatic failover with user notification | No crash; dashboard functions 100% interactively |
