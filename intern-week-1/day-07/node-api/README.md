# Day 07: Node.js + Express TypeScript REST API

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Directory:** `intern-week-1/day-07/node-api/`  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)

---

## 1. Architecture & Design Principles

The `node-api` backend is a layered **TypeScript Express RESTful service** designed with clean architecture principles:

```text
HTTP Request
     ↓
CORS & Body Parser Middleware
     ↓
Request Logging Middleware
     ↓
Route Definitions (src/routes/)
     ↓
Validation & Auth Middleware (src/middleware/)
     ↓
Controllers (src/controllers/)
     ↓
Business Logic Services (src/services/)
     ↓
Data Layer & Repository (src/models/)
     ↓
Persistent File Store (data/employees.json)
```

### Key Engineering Features:
- **Layered Architecture:** Clear separation of routes, controllers, business services, models, and middleware.
- **Server-Side Validation:** Enforced using `zod` schemas (`validateCreateEmployee`, `validateUpdateEmployee`).
- **Defensive Error Handling:** Centralized Express error handler catches validation errors, JSON syntax errors, duplicate emails, and 404s.
- **Atomic File Persistence:** Reads and writes to `data/employees.json` using temporary file write + rename to guarantee crash-resilient persistence.
- **Educational Demo Authentication:** `requireDemoAuth` middleware protects sensitive mutation endpoints (`DELETE /api/employees/:id`) requiring `Authorization: Bearer intern-auth-token-2026`.

---

## 2. API Endpoints Reference

| Method | Endpoint | Description | Auth Required? | Success Code |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/health` | Service health status and uptime | No | `200 OK` |
| `GET` | `/api/employees/stats` | Dashboard aggregate KPI metrics | No | `200 OK` |
| `GET` | `/api/employees` | List employees (filters: search, dept, status, sort) | No | `200 OK` |
| `GET` | `/api/employees/:id` | Retrieve single employee by ID | No | `200 OK` |
| `POST` | `/api/employees` | Create employee (validated with Zod) | No | `201 Created` |
| `PUT` | `/api/employees/:id` | Update employee (validated with Zod) | No | `200 OK` |
| `DELETE` | `/api/employees/:id` | Permanently remove employee | **Yes (Bearer Token)** | `200 OK` |

---

## 3. Local Setup & Execution Guide

### 1. Install Dependencies
```bash
# Inside intern-week-1/day-07/node-api/
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Starts Express server on **`http://localhost:4000`** with live reloading via `tsx`.

### 3. Run Automated Test Suite
```bash
npm test
```
Executes all 11 integration tests covering health, listing, search, validation errors, duplicate emails, CRUD, and auth rejection.

### 4. Production Build & Start
```bash
npm run build
npm start
```