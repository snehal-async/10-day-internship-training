# Day 07: Next.js 14 App Router + Node.js/Express Employee Management System

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)  
**Submission Folder:** `intern-week-1/day-07/`

---

## 1. Executive Summary & Program Milestone

Day 07 transitions our application architecture into an **enterprise full-stack software system** consisting of two decoupled, independently scalable applications communicating via standard HTTP REST protocols:

1. **Backend Service (`node-api/`):** A modular TypeScript Node.js/Express REST API featuring layered architecture (controllers, services, repositories), Zod schema validation, educational demo authentication, centralized error handling, and atomic file-based persistence.
2. **Frontend Client (`nextjs-app/`):** A modern Next.js 14 Single-Page Application utilizing the **App Router**, a hybrid architecture of React Server Components (RSC) and interactive Client Components, dynamic routes, and typed API integration.

---

## 2. Deliverables & Directory Structure

```text
intern-week-1/day-07/
├── README.md                             # Comprehensive Day 07 overview and guide
├── nextjs-app/                           # Part 1: Next.js 14 App Router Frontend
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with navigation and design system
│   │   ├── page.tsx                      # Dashboard home with KPI metrics and quick actions
│   │   ├── employees/
│   │   │   ├── page.tsx                  # Employee directory with search, filter, and sort
│   │   │   ├── create/
│   │   │   │   └── page.tsx              # Employee onboarding form route
│   │   │   └── [id]/
│   │   │       ├── page.tsx              # Dynamic employee profile overview route
│   │   │       └── edit/
│   │   │           └── page.tsx          # Employee profile edit route
│   │   ├── loading.tsx                   # Route transition suspense spinner
│   │   ├── error.tsx                     # Error boundary with retry action
│   │   ├── not-found.tsx                 # 404 handler for unknown routes/employees
│   │   └── globals.css                   # Modern CSS design system
│   ├── components/
│   │   ├── Navbar.tsx                    # Header with active route highlighting & API status
│   │   ├── DashboardStats.tsx            # Workforce KPI metrics cards
│   │   ├── EmployeeTable.tsx             # Interactive employee directory table
│   │   ├── EmployeeForm.tsx              # Reusable create & edit form with validation
│   │   └── ConfirmModal.tsx              # Safety confirmation dialog for deletion
│   ├── lib/
│   │   ├── api.ts                        # Strongly typed fetch client connecting to Express API
│   │   └── formatters.ts                 # Currency, date, and badge utilities
│   ├── types/
│   │   └── employee.ts                   # Core domain contracts and interfaces
│   ├── package.json                      # Next.js dependencies and scripts
│   ├── tsconfig.json                     # Next.js TypeScript configuration
│   ├── next.config.mjs                   # Next.js compiler settings
│   ├── .env.example                      # Frontend environment variable configuration
│   └── README.md                         # Frontend detailed execution manual
└── node-api/                             # Part 2: TypeScript Node.js/Express Backend
    ├── src/
    │   ├── config/
    │   │   └── environment.ts            # Environment variables and app configuration
    │   ├── controllers/
    │   │   ├── employee.controller.ts    # HTTP request/response handlers
    │   │   └── health.controller.ts      # Service health and uptime handler
    │   ├── services/
    │   │   └── employee.service.ts       # Business logic and validation enforcement
    │   ├── models/
    │   │   └── employee.model.ts         # Data models and atomic file repository
    │   ├── middleware/
    │   │   ├── validator.middleware.ts   # Zod schema validation middleware
    │   │   ├── auth.middleware.ts        # Educational demo authentication middleware
    │   │   └── error.middleware.ts       # Centralized error handler and 404 handler
    │   ├── routes/
    │   │   ├── employee.routes.ts        # /api/employees endpoints
    │   │   ├── health.routes.ts          # /api/health endpoint
    │   │   └── index.ts                  # Root router aggregating modules
    │   ├── utils/
    │   │   └── response.ts               # Standardized API response formatters
    │   ├── app.ts                        # Express app, CORS, and middleware pipeline
    │   └── server.ts                     # HTTP server startup on port 4000
    ├── data/
    │   └── employees.json                # Persistent JSON database (22 records)
    ├── tests/
    │   └── api.test.ts                   # Automated integration test suite (11 tests)
    ├── package.json                      # Express dependencies and scripts
    ├── tsconfig.json                     # NodeNext TypeScript configuration
    ├── .env.example                      # Backend environment variable template
    └── README.md                         # Backend detailed documentation
```

---

## 3. Technology Stack & Key Concepts

| Layer | Technologies Used | Key Concepts Demonstrated |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 18, TypeScript | App Router, Server Components (RSC), Client Components (`"use client"`), Dynamic Route Segments (`[id]`), Suspense (`loading.tsx`), Error Boundaries (`error.tsx`), Typed API Client |
| **Backend** | Node.js, Express, TypeScript | Layered Architecture, RESTful HTTP Verbs (`GET`, `POST`, `PUT`, `DELETE`), Zod Validation, Request Logging, Atomic File Persistence, Centralized Error Handling |
| **Security & Auth** | Bearer Token / API Key | Demo Authentication Middleware (`requireDemoAuth`), 401 Unauthorized Rejection on mutation routes |
| **Testing** | Node.js Test Runner, Supertest | 11 automated integration tests verifying health, stats, filters, validation, duplicate prevention, and auth |

---

## 4. Endpoints & Route Reference

### Node.js/Express Endpoints (Port 4000)
- `GET /api/health` — Health and uptime check.
- `GET /api/employees/stats` — Real-time aggregate dashboard metrics.
- `GET /api/employees` — List employees with search, department/status filter, and sorting.
- `GET /api/employees/:id` — Retrieve individual employee record.
- `POST /api/employees` — Onboard new employee with Zod schema validation.
- `PUT /api/employees/:id` — Update existing employee with Zod schema validation.
- `DELETE /api/employees/:id` — Delete employee (Protected by `Authorization: Bearer intern-auth-token-2026`).

### Next.js App Router Routes (Port 3000)
- `/` — Master Dashboard with KPI metric cards, department overview, and quick links.
- `/employees` — Searchable and filterable employee directory table.
- `/employees/create` — Add employee form with real-time validation.
- `/employees/[id]` — Dynamic view of an individual employee profile.
- `/employees/[id]/edit` — Dynamic edit form pre-populated with employee data.

---

## 5. Local Setup & Execution Guide

### Prerequisites
- Node.js `v18+` (Tested on `v24.18.0`)
- npm `v10+` (Tested on `11.13.0`)

### Step 1: Start the Express Backend API
```bash
# Navigate to backend directory
cd intern-week-1/day-07/node-api

# Install dependencies
npm install

# Run automated tests
npm test

# Start Express in development mode
npm run dev
```
Backend will be live at: **`http://localhost:4000`**

### Step 2: Start the Next.js Frontend Application
In a new terminal:
```bash
# Navigate to frontend directory
cd intern-week-1/day-07/nextjs-app

# Install dependencies
npm install

# Run type-check and build
npm run type-check
npm run build

# Start Next.js development server
npm run dev
```
Frontend will be live at: **`http://localhost:3000`**

---

## 6. Verification & Automated Test Summary

- **Express API Tests:** All **11/11 tests passed** (Health, Stats, Search, ID Lookup, 404, Zod Validation, Creation, Duplicate Email Prevention, Update, Unauthorized 401 Rejection, and Authorized Deletion).
- **TypeScript Static Verification:** `0` errors across both backend and frontend applications.
- **Next.js Production Build:** Compiles and statically optimizes all App Router routes cleanly.