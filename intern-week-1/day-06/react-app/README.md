# Day 06: React + TypeScript Employee Management Dashboard

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Directory:** `intern-week-1/day-06/react-app/`  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)

---

## 1. Project Overview & Architecture

Day 06 advances the Day 05 JavaScript Employee Dashboard into a **component-based React + TypeScript Single-Page Application (SPA)** backed by a **live mock REST API** powered by JSON Server.

### Key Objectives Achieved:
- **Component-Driven Architecture:** Modular, decoupled functional components (`DashboardStats`, `EmployeeTable`, `EmployeeForm`, `SearchBar`, `FilterControls`, `EmployeeDetails`, `ConfirmDialog`, `LoadingState`, `ErrorMessage`, `ToastNotification`, `Navbar`).
- **Strict Static Typing:** Comprehensive domain types (`Employee`, `DepartmentName`, `EmploymentStatus`, `EmployeeFormData`, `FilterState`, `DashboardStatistics`, `ApiClientError`). Zero `any` types.
- **Custom React Hooks:** `useEmployees` encapsulates all API side-effects, state synchronization, CRUD mutations, debounced search, compound filtering, and sorting.
- **Defensive Client-Side Validation:** Reusable validation logic (`validateEmployeeForm`) validating required inputs, regex patterns, positive salary constraints, and email uniqueness across active records.
- **Genuine HTTP REST API Integration:** Uses native `fetch` inside `src/services/api.ts` communicating with JSON Server on `http://localhost:3001` with full CRUD operations (`GET`, `POST`, `PATCH`, `DELETE`).

---

## 2. Project Directory Structure

```text
intern-week-1/day-06/react-app/
├── server/
│   └── db.json                          # Seed database (22 records matching Day 5)
├── src/
│   ├── types/
│   │   ├── employee.ts                  # Employee, DepartmentName, Form, Filters, Stats
│   │   └── api.ts                       # ApiResponse, ToastMessage, ApiState contracts
│   ├── services/
│   │   └── api.ts                       # Typed REST client (GET, POST, PATCH, DELETE)
│   ├── utils/
│   │   ├── formatters.ts                # Currency, dates, avatar colors, status badges
│   │   └── validation.ts                # Client-side form validation rules
│   ├── hooks/
│   │   ├── useEmployees.ts              # Primary business logic, CRUD, filtering & stats
│   │   └── useDebounce.ts               # Custom debounce hook for search queries
│   ├── components/
│   │   ├── Navbar.tsx                   # Top header with brand and API status indicator
│   │   ├── DashboardStats.tsx           # Real-time workforce, salary, and dept KPI cards
│   │   ├── SearchBar.tsx                # Live search input with clear trigger
│   │   ├── FilterControls.tsx           # Department & Status dropdowns, Sort controls
│   │   ├── EmployeeTable.tsx            # Accessible table with avatar, badges & actions
│   │   ├── EmployeeForm.tsx             # Modal dialog for Add & Edit with inline errors
│   │   ├── EmployeeDetails.tsx          # Comprehensive profile modal view
│   │   ├── ConfirmDialog.tsx            # Safety confirmation dialog for deletion
│   │   ├── LoadingState.tsx             # Polished spinner loading state
│   │   ├── ErrorMessage.tsx             # Network error banner with Retry button
│   │   └── ToastNotification.tsx        # Auto-dismissing feedback alerts
│   ├── pages/
│   │   └── DashboardPage.tsx            # Master dashboard layout orchestrating features
│   ├── App.tsx                          # App root component coordinating toasts & layout
│   ├── index.css                        # Modern CSS design system & responsive styling
│   ├── vite-env.d.ts                    # Vite client types & environment variables
│   └── main.tsx                         # React 18 DOM mount entrypoint
├── index.html                           # HTML5 shell with Google Fonts (Inter)
├── package.json                         # Scripts & dependencies
├── tsconfig.json                        # Strict TypeScript compiler options
├── tsconfig.node.json                   # Vite configuration TypeScript options
├── vite.config.ts                       # Vite bundler configuration
├── .env.example                         # Environment variable documentation
├── .gitignore                           # Excludes node_modules and dist/
└── README.md                            # Comprehensive execution guide
```

---

## 3. Mock REST API Details

The application uses **JSON Server** to provide a real local HTTP REST API:
- **Database Location:** `server/db.json` initialized with 22 realistic employee records.
- **Default Base URL:** `http://localhost:3001` (configured via `VITE_API_BASE_URL`).
- **Endpoints:**
  - `GET /employees` — Fetches full list of employees.
  - `GET /employees/:id` — Fetches individual employee.
  - `POST /employees` — Appends a new employee record.
  - `PATCH /employees/:id` — Updates existing employee fields.
  - `DELETE /employees/:id` — Permanently removes an employee.

---

## 4. Local Execution & Build Instructions

### 1. Install Dependencies
```bash
# Inside intern-week-1/day-06/react-app/
npm install
```

### 2. Start Both REST API and React App (Concurrent)
```bash
npm run start
```
This runs `concurrently`:
- JSON Server on `http://localhost:3001`
- Vite React App on `http://localhost:5173`

### 3. Or Start Separately:
Terminal 1 (Mock API):
```bash
npm run server
```
Terminal 2 (Frontend):
```bash
npm run dev
```

### 4. TypeScript Type-Checking
```bash
npm run type-check
```

### 5. Production Build
```bash
npm run build
```
Generates an optimized bundle in `dist/`.

---

## 5. Verification & Testing Summary

| Test Category | Test Case | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **API Load** | Mount Dashboard | Loads 22 employees from `http://localhost:3001` | **PASSED** |
| **KPI Metrics** | Calculate Stats | 22 Total, ~$87,773 Avg Salary, 6 Departments | **PASSED** |
| **Search** | Filter by "Rohan" | Displays only Rohan Verma | **PASSED** |
| **Filter** | Filter by Department | Shows only selected department records | **PASSED** |
| **Sorting** | Sort by Salary Desc | Highest earners appear at top | **PASSED** |
| **Profile View** | Click Eye Icon | Displays full employee profile modal | **PASSED** |
| **Validation** | Empty Form Submit | Displays inline validation error banners | **PASSED** |
| **Add Record** | Submit Valid Form | Appends record to REST API, stats update | **PASSED** |
| **Delete Record**| Confirm Deletion | Removes record from API, stats refresh | **PASSED** |
| **Type Safety** | `tsc --noEmit` | Zero TypeScript compiler errors | **PASSED** |
| **Build** | `vite build` | Production bundle built cleanly | **PASSED** |
