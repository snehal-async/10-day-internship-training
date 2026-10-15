# Employee Management System (CLI)

An interactive, modular, menu-driven command-line application built with Node.js. Provides full lifecycle management of employee records, rigorous data validation, case-insensitive querying, payroll analytics, and resilient JSON file persistence.

---

## 🚀 Application Overview

The Employee Management CLI enables organizations to manage employee rosters directly from the terminal without external databases or heavy framework overhead.

### Key Architecture Highlights
- **Separation of Concerns:** Distinct separation between Validation (`validators.js`), Data Access & Persistence (`employee-store.js`), Domain Business Logic (`employee-service.js`), and User Interface (`menu.js`).
- **Resilient Persistence:** Loads and writes records to `data/employees.json`. If the data file is absent, it initializes cleanly. If the file is corrupted, it refuses to overwrite it, preventing data loss.
- **Pure JavaScript:** Built using native Node.js core modules (`readline`, `fs`, `path`).

---

## 🌟 Core Features

| # | Feature | Description |
|---|---------|-------------|
| **1** | **Add Employee** | Registers an employee after validating unique ID, non-empty name, non-empty department, and positive numeric salary. |
| **2** | **Update Employee** | Updates existing records by ID. Allows modifying individual fields while preserving current values if input is blank. |
| **3** | **Delete Employee** | Removes an employee from records after explicit user confirmation (`y/n`). |
| **4** | **Search Employee** | Supports dual search modes: exact case-insensitive ID search, and case-insensitive substring name search. |
| **5** | **List All Employees** | Formats all registered employees into a clean, aligned tabular view. |
| **6** | **Highest Salary** | Finds the highest earner. Fully handles ties by listing all employees sharing the maximum salary. |
| **7** | **Average Salary** | Computes the average salary and total payroll. Safely handles empty rosters (returns 0 without `NaN` or crashes). |
| **8** | **Department Filter** | Filters employees belonging to a specific department using case-insensitive matching. |

---

## 📊 Data Model

Each employee record is stored as a structured JSON object:

```json
{
  "id": "EMP101",
  "name": "Jane Doe",
  "department": "Engineering",
  "salary": 85000.00
}
```

### Field Definitions & Validation Rules
- **`id` (string):** Non-empty, trimmed identifier. Must be unique across all active employee records (case-insensitive uniqueness check).
- **`name` (string):** Non-empty, trimmed string containing at least one non-whitespace character.
- **`department` (string):** Non-empty, trimmed string representing the organizational department.
- **`salary` (number):** Positive, finite numeric value (`> 0`). Stored rounded to two decimal places for currency consistency.

---

## 💾 Persistence Approach

Employee records are stored in `data/employees.json`:
- **Auto-Initialization:** If `data/employees.json` does not exist when starting the CLI, an empty collection is created.
- **Git Safety:** `data/*.json` is excluded via `.gitignore` to prevent committing runtime records. The directory is tracked via `data/.gitkeep`.
- **Corruption Safeguard:** If the file is modified externally and becomes invalid JSON, the loader catches the parsing error and aborts with a descriptive message rather than silently destroying the file.

---

## 💻 How to Run the Application

### 1. From the `day-01` directory:
```bash
npm start
```

### 2. From the `employee-management` directory:
```bash
cd intern-week-1/day-01/employee-management
node src/index.js
```

---

## 🧪 How to Run Automated Tests

The application is thoroughly verified using Node.js's native test runner (`node:test`):

```bash
# Run CLI integration tests
npm test
```

Tests run against an isolated temporary data file created in the OS temp directory, ensuring your local `data/employees.json` is never mutated during test runs.

---

## 📝 Example Menu Workflow

```text
====================================================
         EMPLOYEE MANAGEMENT SYSTEM (CLI)
====================================================
 1. Add Employee
 2. Update Employee
 3. Delete Employee
 4. Search Employee (by ID or Name)
 5. List All Employees
 6. View Highest Salary Employee(s)
 7. View Average Salary
 8. Filter Employees by Department
 9. Exit Application
====================================================

Enter your choice (1-9): 1

--- [1] Add New Employee ---
Enter Employee ID (e.g., EMP001): EMP001
Enter Employee Name: Alice Johnson
Enter Department: Engineering
Enter Monthly Salary: 95000

[✓] Successfully added employee: Alice Johnson (ID: EMP001)

Press [Enter] to return to main menu...
```

### Example Listing Output:
```text
+----------+----------------------+--------------------+----------------+
| ID       | Name                 | Department         | Salary ($)     |
+----------+----------------------+--------------------+----------------+
| EMP001   | Alice Johnson        | Engineering        |      95,000.00 |
| EMP002   | Bob Smith            | Marketing          |      78,000.00 |
| EMP003   | Carlos Rivera        | Engineering        |      95,000.00 |
+----------+----------------------+--------------------+----------------+
Total Records: 3
```

### Example Highest Salary Output (with Ties):
```text
Highest Salary Recorded: $95,000.00
Note: A tie of 2 employees share this maximum salary.

+----------+----------------------+--------------------+----------------+
| ID       | Name                 | Department         | Salary ($)     |
+----------+----------------------+--------------------+----------------+
| EMP001   | Alice Johnson        | Engineering        |      95,000.00 |
| EMP003   | Carlos Rivera        | Engineering        |      95,000.00 |
+----------+----------------------+--------------------+----------------+
Total Records: 2
```

---

## 🛡️ Error Handling & Edge Cases

- **Duplicate Employee IDs:** Rejected with `Error: Employee ID "..." already exists`.
- **Blank Names / Departments:** Rejected with `RangeError: ... cannot be empty or blank`.
- **Negative / Zero / Non-numeric Salary:** Rejected with `TypeError` or `RangeError`.
- **Updating Nonexistent Employee:** Friendly notification without mutating state.
- **Deleting with Abort:** If the user enters anything other than `y` or `yes` to the confirmation prompt, the record is kept intact.
- **Empty Roster Calculations:** Average salary returns `0` and displays an informative notice instead of computing `0 / 0 = NaN`.
