# Day 08: Relational Database Design & SQL Query Suite

Welcome to the **SQL & Relational Database Engineering Guide** for Day 08 of the Technical Internship Training.

This directory contains production-ready, highly normalized PostgreSQL scripts modeling an enterprise **Facility & Employee Management System**.

---

## 📁 SQL Suite Structure

```text
intern-week-1/day-08/sql/
├── README.md                          # Comprehensive guide, execution steps, query mapping
├── 01-create-tables.sql               # Normalized DDL schema with check constraints & indexes
├── 02-seed-data.sql                   # Rich fictional dataset for all 6 entities
├── 03-basic-queries.sql               # Projections, WHERE filters, ORDER BY, and safe CRUD
├── 04-joins-and-aggregations.sql      # Multi-table joins, GROUP BY, HAVING, and pivots
├── 05-subqueries-and-indexes.sql      # Scalar/correlated subqueries, CTEs, and EXPLAIN plans
└── 06-transactions.sql                # Multi-table ACID workflows, error rollback, & savepoints
```

---

## 🗄️ Database Engine & Architecture Assumptions

- **Target Database:** PostgreSQL 18.x (Compatible with PostgreSQL 14 through 18)
- **Host & Port:** `localhost:5432`
- **Recommended Database Name:** `internship_day08`
- **Default Superuser:** `postgres`
- **SQL Standards:** ANSI SQL:2016 compliant with PostgreSQL-specific optimizations (`BIGSERIAL`, `TIMESTAMPTZ`, `CHECK` regex/arrays, `COMMENT ON`, `RETURNING`, `MVCC`).

### Entity Relational Model

The database comprises six core tables designed under **Third Normal Form (3NF)**:

| Table | Primary Key | Description | Relationships & Foreign Keys |
| :--- | :--- | :--- | :--- |
| `users` | `id` (BIGSERIAL) | System authentication accounts with role-based permissions (`admin`, `inspector`, `staff`, `manager`). | Referenced by `inspections` (inspector) and `complaints` (reporter, assignee). |
| `departments` | `id` (BIGSERIAL) | Organizational cost centers and operational units. | Referenced by `employees.department_id` (`ON DELETE RESTRICT`). |
| `employees` | `id` (BIGSERIAL) | HR payroll records (salary, job title, hire date). | Belongs to `departments`. |
| `facilities` | `id` (BIGSERIAL) | Physical sites, buildings, warehouses, and data centers. | Has many `inspections` and `complaints` (`ON DELETE CASCADE`). |
| `inspections` | `id` (BIGSERIAL) | Scheduled and ad-hoc audits with score and findings. | Belongs to `facilities` and `users` (inspector). |
| `complaints` | `id` (BIGSERIAL) | Incidents and maintenance tickets. | Belongs to `facilities`, optionally reported by and assigned to `users`. |

### Architectural Distinction: Users vs. Employees

In real-world enterprise architectures, **Users** and **Employees** represent fundamentally distinct domain concerns:
1. **User Identity:** Represents authentication credentials, password hashes, security tokens, and authorization privileges (`admin`, `inspector`). A user may be an external contractor, third-party auditor, or external system.
2. **Employee Profile:** Represents organizational HR and payroll data (compensation, hire date, department budget allocation). Not all employees have access to the backend system, and system users are not necessarily organizational payroll employees.
3. **Decoupled Design:** Separating `users` and `employees` avoids mixing sensitive security credentials (passwords, tokens) with public HR directories, while supporting role assignment to facility inspectors and ticket assignees.

---

## 🚀 Execution Instructions

### Method 1: Using pgAdmin 4 (GUI)

1. Open **pgAdmin 4** on your machine.
2. Connect to your local PostgreSQL server (`PostgreSQL 18` on `localhost:5432`).
3. In the left browser tree, right-click **Databases** → **Create** → **Database...**.
4. Name the database `internship_day08` and click **Save**.
5. Select `internship_day08` in the tree.
6. Open the **Query Tool** from the top menu (`Tools` → `Query Tool` or the lightning bolt icon).
7. Open and run the scripts in order:
   - Click **Open File** (`Ctrl+O`) → Select `01-create-tables.sql` → Click **Execute** (`F5`).
   - Open `02-seed-data.sql` → Click **Execute** (`F5`).
   - Open and execute `03-basic-queries.sql`, `04-joins-and-aggregations.sql`, `05-subqueries-and-indexes.sql`, and `06-transactions.sql` to observe results.

### Method 2: Using PostgreSQL CLI (`psql`)

```bash
# Connect to PostgreSQL and create database
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE internship_day08;"

# Apply tables schema
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/sql/01-create-tables.sql"

# Load sample seed data
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/sql/02-seed-data.sql"

# Run query scripts
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/sql/03-basic-queries.sql"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/sql/04-joins-and-aggregations.sql"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/sql/05-subqueries-and-indexes.sql"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d internship_day08 -f "intern-week-1/day-08/sql/06-transactions.sql"
```

---

## 📋 Comprehensive SQL Query Reference

| Requirement # | Description | Script Location | Key SQL Features Used |
| :---: | :--- | :--- | :--- |
| **Q1** | List all employees with department names | `03-basic-queries.sql` | `INNER JOIN`, string concatenation `\|\|` |
| **Q2** | Find employees in selected department | `03-basic-queries.sql` | `WHERE d.code = 'DEPT-ENG'`, multi-condition filtering |
| **Q3** | Sort employees by salary | `03-basic-queries.sql` | `ORDER BY salary DESC NULLS LAST`, `TO_CHAR` currency |
| **Q4** | Calculate average salary per department | `04-joins-and-aggregations.sql` | `GROUP BY`, `AVG()`, `COUNT()`, `MIN()`, `MAX()`, `ROUND()` |
| **Q5** | Find departments with avg salary > threshold | `04-joins-and-aggregations.sql` | `HAVING AVG(e.salary) > 85000.00` |
| **Q6** | Find the highest-paid employee | `05-subqueries-and-indexes.sql` | Scalar Subquery `e.salary = (SELECT MAX(salary)...)`, CTE with `DENSE_RANK()` |
| **Q7** | Find poor/critical facilities | `05-subqueries-and-indexes.sql` | `WHERE condition_rating IN (...) OR id IN (SELECT ...)`, correlated subquery counts |
| **Q8** | Count complaints by facility & status | `04-joins-and-aggregations.sql` | Multi-column `GROUP BY f.id, c.status`, Pivot matrix via `CASE WHEN` |
| **Q9** | Show inspection history for facility | `04-joins-and-aggregations.sql` | Multi-table join (`facilities` + `inspections` + `users`), chronologically ordered |
| **Q10** | Demonstrate appropriate JOINs | `04-joins-and-aggregations.sql` | `INNER JOIN`, `LEFT JOIN`, `FULL OUTER JOIN`, `COALESCE()` |
| **Q11** | Demonstrate subqueries | `05-subqueries-and-indexes.sql` | `CROSS JOIN LATERAL` correlated subquery, `WHERE EXISTS` predicate |
| **Q12** | Demonstrate index cost & performance | `05-subqueries-and-indexes.sql` | `EXPLAIN`, B-Tree index scan analysis, trade-off breakdown |
| **Q13** | Demonstrate transactions with rollback | `06-transactions.sql` | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`, constraint failure recovery |
| **Q14** | Safe CRUD operations | `03-basic-queries.sql` | Parameterized `INSERT ... RETURNING`, `SELECT`, `UPDATE ... WHERE`, `DELETE` |

---

## ⚡ Index Design & Optimization Philosophy

Indexes in this database are purposefully constructed based on access patterns:
1. **Foreign Key Indexes:** In PostgreSQL, foreign keys do NOT automatically create indexes on the referencing table. We explicitly index `employees(department_id)`, `inspections(facility_id)`, `inspections(inspector_id)`, `complaints(facility_id)`, and `complaints(assigned_to_id)` to prevent sequential table scans when joining or when parents trigger cascade checks.
2. **Compound Filter Indexes:** `complaints(facility_id, status)` supports the common dashboard query of fetching open tickets for a specific facility.
3. **Range & Sort Indexes:** `employees(salary DESC)` and `inspections(inspection_date DESC)` allow the database engine to serve sorted pagination requests directly from the index leaf pages without costly quicksort operations.
