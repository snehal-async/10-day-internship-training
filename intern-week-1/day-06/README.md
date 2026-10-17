# Day 06: TypeScript Fundamentals & React Employee Management Dashboard

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)  
**Submission Folder:** `intern-week-1/day-06/`

---

## 1. Executive Summary & Objectives

Day 06 bridges foundational JavaScript and full-stack enterprise web development by mastering **TypeScript static typing** and building a **component-based React single-page application** integrated with a **live mock REST API**.

### Primary Milestone Goals:
1. **TypeScript Type System Mastery:** Deep conceptual understanding of primitive types, interfaces, type aliases, union types, enums, optional properties, functions, classes, generics, and type narrowing/guards through 9 executable modules.
2. **React + TypeScript SPA Engineering:** Converting Day 05's vanilla JavaScript dashboard into a robust component-based React application using functional components, modern React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), and custom hooks (`useEmployees`, `useDebounce`).
3. **Genuine REST API Integration:** Connecting the frontend to a local REST API powered by JSON Server (`server/db.json`) supporting full HTTP CRUD operations (`GET`, `POST`, `PATCH`, `DELETE`).
4. **Resilient Form Validation & UX:** Implementing client-side defensive validation rules with real-time error messages, toast alerts, confirmation dialogs, and responsive design.

---

## 2. Directory Structure

```text
intern-week-1/day-06/
├── README.md                             # Main Day 06 documentation and roadmap
├── typescript/                           # Part 1: TypeScript Core Learning Modules
│   ├── package.json                      # Scripts and metadata for running modules
│   ├── tsconfig.json                     # Strict TypeScript compiler configuration
│   ├── README.md                         # Detailed guide for all 9 TypeScript exercises
│   ├── 01-primitive-types.ts             # Primitives, null, undefined, type inference
│   ├── 02-arrays-and-objects.ts          # Typed arrays, readonly arrays, tuples, objects
│   ├── 03-interfaces-and-type-aliases.ts # Interfaces, extension, type aliases, intersections
│   ├── 04-union-types-and-enums.ts       # String/numeric enums, union types, discriminated unions
│   ├── 05-optional-properties.ts         # Optional fields (?), chaining (?.), nullish (??), Partial<T>
│   ├── 06-functions.ts                   # Parameter types, return types, overloads, async/await
│   ├── 07-classes.ts                     # OOP, access modifiers, inheritance, abstract classes
│   ├── 08-generics.ts                    # Generic functions, interfaces, constraints, utility types
│   └── 09-type-narrowing-and-type-guards.ts # typeof, instanceof, in operator, custom type guards
└── react-app/                            # Part 2: React + TypeScript Application
    ├── server/
    │   └── db.json                       # Mock REST API seed database (22 records)
    ├── src/
    │   ├── types/                        # Strongly typed domain entities & API contracts
    │   ├── services/                     # HTTP REST client (GET, POST, PATCH, DELETE)
    │   ├── utils/                        # Formatters, statistics, and validation logic
    │   ├── hooks/                        # Custom hooks (useEmployees, useDebounce)
    │   ├── components/                   # 11 reusable UI components
    │   ├── pages/                        # Master DashboardPage component
    │   ├── App.tsx                       # Root layout and toast notification container
    │   ├── main.tsx                      # DOM entrypoint
    │   └── index.css                     # Modern CSS design system
    ├── index.html                        # Application HTML shell
    ├── package.json                      # Dependencies and scripts
    ├── tsconfig.json                     # Strict TypeScript Vite config
    ├── vite.config.ts                    # Vite build configuration
    └── README.md                         # Application setup and execution manual
```

---

## 3. Technology Stack & Concepts Demonstrated

### Language & Tooling
- **TypeScript (v5.5+):** Configured with `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
- **React (v18.3+):** Functional components, React JSX, Hooks, declarative state management.
- **Vite (v5.4+):** Ultra-fast ESM development server and Rollup-based production bundler.
- **JSON Server (v0.17+):** Lightweight local REST API server providing full HTTP verbs.
- **Concurrently:** Single-command orchestration for running backend API and frontend dev server simultaneously.

### React Concepts Implemented
- **Components & Props:** Pure, reusable, typed functional components with explicit interface props.
- **State & Lifecycle:** `useState` for UI state, `useEffect` for data synchronization, `useMemo` for derived statistics and filtered queries, `useCallback` for memoized handlers.
- **Custom Hooks:** `useEmployees()` encapsulates all data fetching, CRUD mutations, debounced search, compound filters, and sorting.
- **Defensive Form Validation:** Pure TypeScript validation engine preventing invalid submissions and enforcing email uniqueness.
- **Accessible UI:** Modals, dialogs, ARIA attributes, semantic HTML table, keyboard navigation, and visible focus rings.

---

## 4. Quick Start & Execution Guide

### Part 1: Run TypeScript Learning Modules
```bash
# Navigate to typescript directory
cd intern-week-1/day-06/typescript

# Verify strict type-checking
npx -y -p typescript tsc --noEmit

# Run all 9 modules
npm run run:all
```

### Part 2: Run React Dashboard Application
```bash
# Navigate to react-app directory
cd intern-week-1/day-06/react-app

# Install dependencies
npm install

# Start both REST API (port 3001) and Frontend (port 5173)
npm run start
```

Open your browser to:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **REST API Endpoint:** [http://localhost:3001/employees](http://localhost:3001/employees)

---

## 5. Build & Type Verification Results

- **TypeScript Strict Check:** `0` errors across all modules and React components.
- **Vite Production Build:** Successfully bundled into `dist/` in 1.16s without warnings.
- **Test Results:** All 11 QA verification test cases passed (Search, Filter, Sort, Add, Edit, Delete, Validation, KPI Calculations).
