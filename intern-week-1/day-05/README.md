# Day 05: JavaScript Employee Management Dashboard

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)  
**Submission Folder:** `intern-week-1/day-05/`

---

## 1. Project Overview & Objective

Day 05 focuses on practical, production-ready frontend software engineering using **Vanilla JavaScript (ES6+)**, **HTML5**, and **CSS3** without external framework dependencies.

The **Employee Management Dashboard** is a responsive, single-page web application (SPA) featuring:
- Dynamic data rendering with safe DOM APIs (preventing XSS vulnerabilities).
- Real-time multi-field search (First name, Last name, Email, Department, Designation).
- Compound filtering (Department and Employment Status) working harmoniously with multi-directional sorting (Name, Department, Date, Salary).
- Full CRUD workflows: View Employee Profile modal, Add Employee form with inline validation, Edit Employee, and Delete with safety confirmation.
- Persistent client-side data storage using `localStorage` initialized from a 22-record sample dataset (`data/employees.json`), with a single-click demo data reset button.

---

## 2. Technology Stack
- **HTML5:** Semantic document structuring (`<main>`, `<header>`, `<section>`, `<table>`, `<dialog>` patterns).
- **CSS3:** Custom modern design system utilizing CSS Custom Properties (variables), Flexbox, CSS Grid, backdrop-filter blur, micro-animations, and full mobile/tablet responsive breakpoints.
- **JavaScript (ES6+):** Pure Vanilla JavaScript (`const`/`let`, arrow functions, array operations like `.map()`, `.filter()`, `.find()`, `.sort()`, `async`/`await`, `fetch`, DOM Event Listeners, and `localStorage` API).
- **Zero Third-Party Libraries:** Built without React, Vue, jQuery, Tailwind, or Bootstrap to ensure fundamental DOM mastery.

---

## 3. Project Structure

```text
intern-week-1/day-05/
├── index.html                         # Semantic HTML5 single-page dashboard structure
├── README.md                          # Comprehensive documentation & execution guide
├── css/
│   └── styles.css                     # Modern admin dashboard design system & responsive styling
├── js/
│   ├── api.js                         # Data access layer managing localStorage & fallback seeding
│   ├── validation.js                  # Defensive form validation rules & uniqueness checks
│   ├── ui.js                          # Safe DOM node construction, modal handlers & toast alerts
│   └── app.js                         # Main controller coordinating state, filters, and user events
└── data/
    └── employees.json                 # Seed dataset containing 22 realistic employee records
```

---

## 4. Architecture & Data Persistence Design

### Where is the data stored?
Because Day 05 is a pure client-side frontend project without a dedicated server-side database (such as MongoDB or MySQL), data persistence is managed via the **Browser's `localStorage`**:

1. **First-Time Boot:**
   - On initial load, `api.js` checks if `localStorage['day05_employee_records']` exists.
   - If not found, it asynchronously fetches `data/employees.json` (or uses the embedded fallback seed if opened directly via `file://` where browser CORS restricts local file fetching).
   - The 22 records are serialized into `localStorage`.
2. **CRUD Operations:**
   - All additions, edits, and deletions directly update the `localStorage` payload.
   - Refreshing the browser (`F5`) or reopening the tab preserves all user changes.
3. **Reset Demonstration Data:**
   - A dedicated **"Reset Demo Data"** button in the header allows evaluators to restore the original 22 records at any time.

---

## 5. Key Functional Features

### A. Summary Metric Cards
Automatically calculates and displays live counters reflecting the active dataset:
- **Total Employees**
- **Active Staff**
- **Inactive / On Leave**
- **Departments Represented**

### B. Live Multi-Field Search
Searches case-insensitively across:
- First Name & Last Name
- Full Name combinations
- Email address
- Department
- Designation / Title
- Includes a quick-clear (`✕`) button.

### C. Filtering & Sorting Engine
- **Department Filter:** Dynamically populated from active unique department values.
- **Status Filter:** Filter by `Active` or `Inactive`.
- **Sorting:** Multi-directional sorting supporting:
  - Name (A → Z and Z → A)
  - Department (A → Z)
  - Joining Date (Newest and Oldest)
  - Salary (High to Low and Low to High)
- **Compound Execution:** Search, department filter, status filter, and sort operate together without overwriting each other.

### D. Validation Rules (`validation.js`)
- **First & Last Name:** Required, minimum 2 characters.
- **Work Email:** Required, valid RFC-compliant email format, must be unique across all existing staff records.
- **Phone:** Required, minimum 7 digits.
- **Department & Designation:** Required non-empty selections.
- **Status:** Validated to either `Active` or `Inactive`.
- **Joining Date:** Valid non-future date.
- **Annual Salary:** Positive number greater than 0.

### E. Safe DOM Rendering (`ui.js`)
To eliminate Cross-Site Scripting (XSS) risks, employee records are generated programmatically using `document.createElement()` and `textContent` rather than interpolating raw user inputs into `innerHTML`.

---

## 6. How to Run the Project (Windows)

### Option A: Using Python Built-in Web Server (Recommended)
Python is already installed on your system. Run from PowerShell:

```powershell
# 1. Navigate to the Day 05 folder
cd intern-week-1/day-05

# 2. Start lightweight local HTTP server
python -m http.server 8085

# 3. Open your browser and navigate to:
# http://localhost:8085/
```

### Option B: Using VS Code Live Server Extension
1. Open the folder `intern-week-1/day-05` in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option C: Direct Browser Opening
Double-click `index.html` to open it in Chrome, Edge, or Firefox. The built-in fallback data layer ensures the dashboard operates even under strict `file://` CORS policies.

---

## 7. Testing & Verification Checklist

| Test Case | Steps Performed | Result |
|---|---|---|
| **Initial Load** | Opened dashboard on `http://localhost:8085/` | ✅ PASSED (22 records rendered, counters match) |
| **Search Filter** | Typed `"Engineering"` in search input | ✅ PASSED (Filtered down to 8 engineering records) |
| **Clear Search** | Clicked `"✕"` button | ✅ PASSED (Restored full table view) |
| **Department Filter** | Selected `"Design"` from dropdown | ✅ PASSED (Displayed only 3 Design records) |
| **Status Filter** | Selected `"Inactive"` from dropdown | ✅ PASSED (Displayed 3 inactive records with gray badges) |
| **Compound Filters** | Combined search `"Engineering"` + status `"Inactive"` | ✅ PASSED (Displayed single matching DevOps engineer) |
| **Clear All Filters** | Clicked `"Clear Filters"` button | ✅ PASSED (Reset all dropdowns and search input) |
| **Sorting** | Selected `"Salary (High to Low)"` | ✅ PASSED (Aarav Sharma $125k sorted to top) |
| **Form Validation** | Clicked `"+ Add Employee"`, submitted empty form | ✅ PASSED (Inline red error messages displayed on all required fields) |
| **Duplicate Email** | Entered existing email `aarav.sharma@example.com` | ✅ PASSED (Rejected with `"This email address is already registered"`) |
| **Create Employee** | Added valid new employee `"Rohan K"` | ✅ PASSED (Total counter updated to 23, toast shown) |
| **View Details** | Clicked `"👁️ View"` on employee row | ✅ PASSED (Modal rendered complete employee profile card) |
| **Edit Employee** | Updated designation from Details/Edit modal | ✅ PASSED (Row updated in real-time, persisted to storage) |
| **Delete Employee** | Clicked `"🗑️ Delete"`, confirmed deletion | ✅ PASSED (Record removed, total counter dropped to 22) |
| **Cancel Delete** | Clicked `"Cancel"` in delete dialog | ✅ PASSED (No record removed) |
| **Persistence (F5)** | Added test record, refreshed browser | ✅ PASSED (Record persisted across browser reload) |
| **Demo Reset** | Clicked `"🔄 Reset Demo Data"` | ✅ PASSED (Restored initial 22 sample records) |

---

## 8. Limitations & Future Improvements
- **Current Limitations:** Data is local to the user''s browser instance (`localStorage`). Other devices cannot access saved records without a centralized backend.
- **Future Improvements:** Connect to a RESTful Node.js/Express API with JWT authentication and a persistent MongoDB/PostgreSQL database (scheduled for Week 2).