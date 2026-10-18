# Day 08 — FacilityOps Web Dashboard

A responsive web application built with **React 19**, **TypeScript**, and **Vite** that connects to the **Laravel 11 REST API** and **PostgreSQL 18** database developed in Day 8.

---

## 🎯 Architecture & Features

### 1. Executive Overview
- **Real-Time KPI Cards:** Instant counts of total facilities, completed safety audits, maintenance tickets, and overall resolution rate calculated directly from PostgreSQL aggregates.
- **Critical Facility Alerts:** Highlights facilities rated in *poor* or *critical* condition.
- **Recent Activity Streams:** Displays latest 5 safety audits and maintenance complaints with quick links to full details.

### 2. Facilities Directory
- **Listing & Search:** Real-time client and server-assisted search by name, code, city, and street address.
- **Multi-parameter Filtering:** Filter by facility classification (*Corporate Office*, *Warehouse*, *R&D Laboratory*, *Data Center*, *Manufacturing Foundry*) and health rating (*Excellent*, *Good*, *Fair*, *Poor*, *Critical*).
- **CRUD Modals:** Complete Create, Read, Update, and Delete workflows with field validation.
- **Cascade Previews:** Detailed modal showing building specifications, capacity, location, and its embedded safety inspection history and complaint tickets.

### 3. Inspections & Safety Audits
- **Safety Audit Directory:** Displays inspection numbers, assigned inspector, facility reference, inspection date, and result.
- **Dynamic Score Meters:** Visual color-coded compliance gauges (0–100) reflecting inspection severity.
- **Audit Logging:** Modal to log new inspections with inspector selection, date picker, result criteria, score enforcement, and follow-up scheduling.
- **Audit Detail View:** Full inspection notes, hazard findings, and follow-up status.

### 4. Complaints & Maintenance Tickets
- **Work Order Directory:** List tickets with facility, description, severity, status, and report dates.
- **Severity Badging:** Color-coded severity tiers (*Urgent*, *High*, *Medium*, *Low*).
- **In-line Quick Status Updater:** Update ticket lifecycle (*Open* ➔ *In Progress* ➔ *Resolved* ➔ *Closed*) in one click.
- **Ticket Management:** Create, edit, and delete maintenance complaints with technician assignment.

### 5. API Security & Authentication
- **Bearer Token Authentication:** Integrated with Laravel Sanctum.
- **One-Click Demo Admin:** Fast testing switch pre-configured with seeded administrator (`sarah.admin@enterprise.local` / `Password123!`).
- **Options Pre-flight CORS:** Seamless cross-origin request handling between `localhost:5173` (Vite) and `localhost:8000` (Laravel).

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20.x` or higher (verified with `v24.18.0`)
- npm `v10.x` or higher (verified with `11.13.0`)
- Laravel API running on `http://localhost:8000`
- PostgreSQL 18 service running with database `day8_internship`

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure the API URL points to your running Laravel API:
```ini
VITE_API_URL=http://localhost:8000/api
```

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The dashboard will be available at:
👉 **`http://localhost:5173`**

### Production Build
```bash
npm run build
```

---

## 🔗 Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service and PostgreSQL health status |
| `GET` | `/api/stats` | Aggregated dashboard totals and recent activity |
| `GET` | `/api/inspectors` | Active inspector / staff directory for dropdowns |
| `GET` | `/api/facilities` | Paginated facility listings with filter query parameters |
| `POST` | `/api/facilities` | Create facility (*Protected*) |
| `PUT` | `/api/facilities/{id}` | Update facility (*Protected*) |
| `DELETE` | `/api/facilities/{id}` | Delete facility (*Protected*) |
| `GET` | `/api/inspections` | Inspection audits directory |
| `POST` | `/api/inspections` | Record safety inspection (*Protected*) |
| `PUT` | `/api/inspections/{id}` | Update safety inspection (*Protected*) |
| `DELETE` | `/api/inspections/{id}` | Delete safety inspection (*Protected*) |
| `GET` | `/api/complaints` | Maintenance complaints directory |
| `POST` | `/api/complaints` | Log maintenance ticket (*Protected*) |
| `PUT` | `/api/complaints/{id}` | Update ticket or status (*Protected*) |
| `DELETE` | `/api/complaints/{id}` | Delete ticket (*Protected*) |
| `POST` | `/api/auth/login` | Authenticate user and receive Bearer token |
| `POST` | `/api/auth/logout` | Revoke active token (*Protected*) |
