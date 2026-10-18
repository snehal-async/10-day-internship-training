# Database Design & Schema Architecture Guide

**Domain:** Enterprise Facility & Employee Management System  
**Engine:** PostgreSQL 18.x (ANSI SQL:2016 Compliant)  
**Location:** `intern-week-1/day-08/database/`

---

## 📂 Deliverables in this Directory

```text
intern-week-1/day-08/database/
├── README.md                          # Comprehensive database design guide & setup
├── schema.sql                         # Consolidated PostgreSQL DDL schema & indexes
├── seed.sql                           # Complete realistic seed data script
└── er-diagram.md                      # Mermaid ER diagram, cardinality, & normalization breakdown
```

---

## 🏗️ Relational Architecture & Normalization

This database is built for **enterprise reliability**, **data consistency**, and **high-throughput querying**. It adheres strictly to **Third Normal Form (3NF)** to eliminate redundancy and update anomalies.

### Core Tables

1. **`users`**: System security principals used for API authentication and auditing. Supports roles (`admin`, `inspector`, `staff`, `manager`).
2. **`departments`**: Organizational units responsible for operating facilities and budgets.
3. **`employees`**: Payroll and workforce personnel linked to departments. Includes employment status and compensation.
4. **`facilities`**: Physical real estate, branches, laboratories, and warehouses tracked by structural health (`condition_rating`) and operational status.
5. **`inspections`**: Comprehensive safety and regulatory audits executed on facilities by certified inspectors (users).
6. **`complaints`**: Maintenance requests and hazard incident reports tied to facilities, with optional reporter and assigned technician tracking.

### The Architectural Separation: Users vs. Employees

A common database design flaw in beginner systems is conflating system login accounts (`users`) with personnel (`employees`). We deliberately separate them:
- **`users`** represents *who can log in to software systems*. A user possesses an email, encrypted password hash, API tokens, and access roles. Some users are external inspectors or auditors who do not receive a corporate paycheck.
- **`employees`** represents *who works for the corporation in an HR/payroll capacity*. An employee has a salary, hire date, job title, and department. Not all employees have a software account, and sensitive compensation data is strictly separated from authentication tables.

---

## 🛠️ Step-by-Step pgAdmin 4 Setup Guide

### 1. Launch pgAdmin and Connect to PostgreSQL 18
1. Start **pgAdmin 4** on your machine.
2. In the left-hand navigation tree, expand **Servers** and double-click **PostgreSQL 18** (or your local server instance).
3. Enter your superuser (`postgres`) password when prompted.

### 2. Create the Internship Database
1. Right-click on **Databases** → **Create** → **Database...**.
2. Set **Database** to `internship_day08`.
3. Set **Owner** to `postgres`.
4. Click **Save**.

### 3. Apply Schema DDL (`schema.sql`)
1. In the tree, click on `internship_day08` to select it.
2. Open the **Query Tool** (`Tools` → `Query Tool` from the top menu).
3. Click the **Open File** icon (`Ctrl+O`), navigate to `intern-week-1/day-08/database/schema.sql`, and open it.
4. Click the **Execute / Refresh** icon (`F5` or the play button).
5. Ensure the message pane displays `CREATE TABLE` and `Query returned successfully`.

### 4. Load Initial Seed Data (`seed.sql`)
1. In the Query Tool, click **Open File** (`Ctrl+O`) and select `intern-week-1/day-08/database/seed.sql`.
2. Click **Execute** (`F5`).
3. You will see `INSERT 0 6`, `INSERT 0 4`, `INSERT 0 12`, etc., confirming data population.

### 5. Inspect Tables in pgAdmin
1. In the left browser tree, expand:
   `internship_day08` → `Schemas` → `public` → `Tables`.
2. You will see all 6 tables: `complaints`, `departments`, `employees`, `facilities`, `inspections`, and `users`.
3. Right-click any table (e.g. `facilities`) → **View/Edit Data** → **All Rows** to view populated rows and verify foreign keys.

---

## 💻 CLI Alternative via `psql`

If you prefer terminal administration:

```powershell
# Create database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE internship_day08;"

# Apply schema
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/database/schema.sql"

# Seed data
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/database/seed.sql"
```
