# Entity-Relationship (ER) Diagram & Architecture

**Domain:** Enterprise Facility & Employee Management System  
**Database Engine:** PostgreSQL 18.x (ANSI SQL:2016 Compliant)  
**Normalization:** Third Normal Form (3NF)

---

## 1. Visual Entity-Relationship Diagram

```mermaid
erDiagram
    DEPARTMENTS ||--o{ EMPLOYEES : "employs (1:N)"
    FACILITIES ||--o{ INSPECTIONS : "undergoes (1:N)"
    FACILITIES ||--o{ COMPLAINTS : "logs (1:N)"
    USERS ||--o{ INSPECTIONS : "conducts (1:N)"
    USERS ||--o{ COMPLAINTS : "reports (0..1:N)"
    USERS ||--o{ COMPLAINTS : "assigned_to (0..1:N)"

    USERS {
        bigint id PK "Auto-incrementing surrogate ID"
        varchar name "Full name"
        varchar email UK "Unique login email"
        varchar password "Bcrypt password hash"
        varchar role "admin, inspector, staff, manager"
        boolean is_active "Account state"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Update timestamp"
    }

    DEPARTMENTS {
        bigint id PK "Auto-incrementing surrogate ID"
        varchar name UK "Unique department name"
        varchar code UK "Short business code (DEPT-ENG)"
        text description "Operational scope"
        numeric budget "Annual budget (CHECK >= 0)"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Update timestamp"
    }

    EMPLOYEES {
        bigint id PK "Auto-incrementing surrogate ID"
        bigint department_id FK "References departments.id"
        varchar first_name "First name"
        varchar last_name "Last name"
        varchar email UK "Corporate email address"
        varchar job_title "HR payroll title"
        numeric salary "Salary (CHECK >= 0)"
        date hire_date "Employment start date"
        varchar status "active, inactive, on_leave, terminated"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Update timestamp"
    }

    FACILITIES {
        bigint id PK "Auto-incrementing surrogate ID"
        varchar name "Facility building name"
        varchar facility_code UK "Unique code (FAC-HQ-01)"
        varchar facility_type "office, warehouse, lab, datacenter, mfg"
        varchar address "Street address"
        varchar city "City"
        varchar state "State / Province"
        varchar postal_code "Postal code"
        varchar condition_rating "excellent, good, fair, poor, critical"
        varchar status "operational, under_maintenance, decommissioned, closed"
        integer capacity "Max occupant capacity"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Update timestamp"
    }

    INSPECTIONS {
        bigint id PK "Auto-incrementing surrogate ID"
        bigint facility_id FK "References facilities.id (ON DELETE CASCADE)"
        bigint inspector_id FK "References users.id (ON DELETE RESTRICT)"
        varchar inspection_number UK "Unique audit number (INSP-2026-001)"
        date inspection_date "Audit execution date"
        varchar result "passed, conditional_pass, failed, critical_failure"
        integer score "Score 0 to 100 (CHECK)"
        text notes "Inspector observations"
        boolean follow_up_required "Flag for remediation"
        date follow_up_date "Deadline for follow-up audit"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Update timestamp"
    }

    COMPLAINTS {
        bigint id PK "Auto-incrementing surrogate ID"
        bigint facility_id FK "References facilities.id (ON DELETE CASCADE)"
        bigint reporter_id FK "References users.id (ON DELETE SET NULL)"
        bigint assigned_to_id FK "References users.id (ON DELETE SET NULL)"
        varchar ticket_number UK "Unique ticket number (CMP-2026-001)"
        varchar title "Issue summary"
        text description "Detailed problem narrative"
        varchar severity "low, medium, high, urgent"
        varchar status "open, in_progress, resolved, closed, rejected"
        text resolution_notes "Remediation record"
        timestamptz resolved_at "Resolution timestamp"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Update timestamp"
    }
```

---

## 2. Relational Cardinality & Cascade Rules

| Relationship | Type | Foreign Key | Cascade / Delete Rule | Justification |
| :--- | :--- | :--- | :--- | :--- |
| `departments` → `employees` | 1-to-Many | `employees.department_id` | `ON DELETE RESTRICT` | Prevents accidental deletion of a department while employees are actively assigned to it. |
| `facilities` → `inspections` | 1-to-Many | `inspections.facility_id` | `ON DELETE CASCADE` | Inspections are child records of a physical facility. If a facility is purged, its audit logs delete with it. |
| `facilities` → `complaints` | 1-to-Many | `complaints.facility_id` | `ON DELETE CASCADE` | Maintenance tickets belong to a facility; purging the facility removes associated tickets. |
| `users` → `inspections` | 1-to-Many | `inspections.inspector_id` | `ON DELETE RESTRICT` | Regulatory audit compliance: cannot delete an inspector user account if signed inspection records exist. |
| `users` → `complaints` (reporter) | 0..1-to-Many | `complaints.reporter_id` | `ON DELETE SET NULL` | Tickets remain intact as historical records even if the reporter leaves or deletes their account. Supports anonymous submissions (`NULL`). |
| `users` → `complaints` (assignee) | 0..1-to-Many | `complaints.assigned_to_id` | `ON DELETE SET NULL` | If an assigned technician user account is deleted, the ticket becomes unassigned (`NULL`) rather than deleted. |

---

## 3. Normalization Verification (1NF to 3NF)

1. **First Normal Form (1NF):**
   - Every column contains atomic (indivisible) scalar values (no JSON arrays or comma-delimited strings used for relational links).
   - Every table possesses a clear surrogate primary key (`id BIGSERIAL`).
   - All rows in each relation are unique.

2. **Second Normal Form (2NF):**
   - Satisfies 1NF.
   - All non-key attributes are fully functionally dependent on the entire primary key (no partial key dependencies since all primary keys are single-column surrogate keys).

3. **Third Normal Form (3NF):**
   - Satisfies 2NF.
   - No transitive functional dependencies exist: non-key attributes depend only on the primary key, never on other non-key attributes (e.g., department budget and code live in `departments`, not duplicated in `employees`).
