# Day 07: Next.js 14 Employee Management Dashboard (App Router)

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Directory:** `intern-week-1/day-07/nextjs-app/`  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)

---

## 1. Overview & Architecture

The `nextjs-app` is a modern **Next.js 14 single-page application** powered by the **App Router**, **React 18 Server & Client Components**, and **TypeScript**. It connects via real HTTP requests to the companion **Node.js/Express REST API** (`node-api/`).

```text
Next.js 14 App Router
  ├── Server Components (app/page.tsx, app/employees/[id]/page.tsx)
  │     ↳ Direct server-side data fetching via lib/api.ts
  ├── Client Components (components/EmployeeTable.tsx, components/EmployeeForm.tsx)
  │     ↳ Interactive state, client validation, search, modals, form submission
  └── Typed API Service (lib/api.ts)
        ↳ HTTP Fetch client communicating with http://localhost:4000/api
```

---

## 2. Implemented Routes & Navigation

| Route | Type | Description |
| :--- | :---: | :--- |
| `/` | Server Component | Dashboard overview with KPI statistics, department breakdown, and recent employees |
| `/employees` | Client Component | Employee directory with live search, department and status filters, and sorting |
| `/employees/create` | Client Component | Form to onboard new employee with inline and server validation |
| `/employees/[id]` | Server Component | Dynamic route rendering individual employee profile |
| `/employees/[id]/edit` | Client Component | Form pre-populated with employee data for updates |
| `loading.tsx` | UI Fallback | Global suspense spinner during route transitions |
| `error.tsx` | Error Boundary | Catch-all error interface with retry action |
| `not-found.tsx` | 404 Handler | Custom page for unknown routes or nonexistent employee IDs |

---

## 3. Server Components vs Client Components

- **Server Components (Default):** Used for initial page rendering (`app/page.tsx`, `app/employees/[id]/page.tsx`) to maximize SEO, minimize client bundle size, and fetch data close to the source without extra client watermarks.
- **Client Components (`"use client"`):** Used specifically where user interactivity is required (`components/Navbar.tsx` for route highlighting, `components/EmployeeTable.tsx` for client-side sorting and modal toggling, and `components/EmployeeForm.tsx` for real-time input validation).

---

## 4. Local Execution & Build Instructions

### 1. Install Dependencies
```bash
# Inside intern-week-1/day-07/nextjs-app/
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` if custom configuration is needed (defaults to port 4000):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_DEMO_API_KEY=intern-auth-token-2026
```

### 3. Run Development Server
```bash
npm run dev
```
Starts Next.js on **`http://localhost:3000`**.

### 4. Production Build & Start
```bash
npm run build
npm start
```