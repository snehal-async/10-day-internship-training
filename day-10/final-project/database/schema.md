# FacilityOps Database Schema Documentation

## 1. Schema Overview
The **FacilityOps** data architecture is implemented on **PostgreSQL** (and SQLite for local automated test isolation), provisioned via Laravel 11 database migrations. The database enforces relational integrity through foreign key constraints, cascading policies, unique composite indexes, and enum-like domain constraints.

---

## 2. Table Specifications

### 2.1 `departments`
Stores organisational divisions managing enterprise assets and personnel.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Unique department auto-increment ID |
| `name` | `VARCHAR(100)` | `NOT NULL, UNIQUE` | Formal department title (e.g. Facilities Engineering) |
| `code` | `VARCHAR(20)` | `NOT NULL, UNIQUE` | Sector reference code (e.g. `DEPT-FAC-01`) |
| `description` | `TEXT` | `NULLABLE` | Functional remit and operational scope |
| `budget` | `NUMERIC(14,2)` | `NOT NULL, DEFAULT 0.00` | Allocated annual facility operations budget |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Record modification timestamp |

---

### 2.2 `users`
System actors, authenticated facility operators, and certified compliance inspectors.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Unique user account ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full legal name of operator/inspector |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Official enterprise communication address |
| `email_verified_at`| `TIMESTAMP` | `NULLABLE` | Verification timestamp |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed credentials (never exposed) |
| `role` | `VARCHAR(50)` | `NOT NULL, DEFAULT 'user'` | Access control role (`admin`, `inspector`, `manager`, `user`) |
| `remember_token` | `VARCHAR(100)` | `NULLABLE` | Web session persistence token |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Account registration timestamp |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Account profile update timestamp |

---

### 2.3 `employees`
Internal staff assigned to operations, safety, and departmental duties.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Employee ID |
| `department_id` | `BIGINT` | `FOREIGN KEY -> departments(id) ON UPDATE CASCADE ON DELETE RESTRICT` | Owning division |
| `first_name` | `VARCHAR(50)` | `NOT NULL` | Given name |
| `last_name` | `VARCHAR(50)` | `NOT NULL` | Family name |
| `email` | `VARCHAR(150)` | `NOT NULL, UNIQUE` | Corporate email |
| `job_title` | `VARCHAR(100)` | `NOT NULL` | Professional title |
| `salary` | `NUMERIC(10,2)` | `NOT NULL, INDEX` | Base remuneration |
| `hire_date` | `DATE` | `NOT NULL, INDEX` | Employment commencement date |
| `status` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'active'` | Operational status (`active`, `on_leave`, `terminated`) |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Record timestamp |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Record timestamp |

---

### 2.4 `facilities`
Physical buildings, campus structures, warehouses, and industrial sites.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Unique facility asset ID |
| `name` | `VARCHAR(150)` | `NOT NULL` | Facility complex title |
| `facility_code` | `VARCHAR(30)` | `NOT NULL, UNIQUE` | Standardised code (e.g. `FAC-B1-001`) |
| `facility_type` | `VARCHAR(50)` | `NOT NULL` | Structural classification (`office`, `warehouse`, `laboratory`, `datacenter`, `manufacturing`) |
| `address` | `VARCHAR(255)` | `NOT NULL` | Street address |
| `city` | `VARCHAR(100)` | `NOT NULL` | City municipality |
| `state` | `VARCHAR(100)` | `NULLABLE` | State or provincial territory |
| `postal_code` | `VARCHAR(20)` | `NULLABLE` | Postal/ZIP code |
| `condition_rating`| `VARCHAR(20)` | `NOT NULL, DEFAULT 'good', INDEX` | Current condition (`excellent`, `good`, `fair`, `poor`, `critical`) |
| `status` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'operational', INDEX` | Operational status (`operational`, `under_maintenance`, `closed`) |
| `capacity` | `INTEGER` | `NULLABLE` | Maximum human occupancy capacity |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Commissioning record timestamp |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Telemetry modification timestamp |

---

### 2.5 `inspections`
Statutory compliance audits, structural reviews, and safety assessments.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Audit record ID |
| `facility_id` | `BIGINT` | `FOREIGN KEY -> facilities(id) ON UPDATE CASCADE ON DELETE CASCADE` | Evaluated physical asset |
| `inspector_id` | `BIGINT` | `FOREIGN KEY -> users(id) ON UPDATE CASCADE ON DELETE RESTRICT` | Certified auditing officer |
| `inspection_number`| `VARCHAR(50)` | `NOT NULL, UNIQUE` | Audit protocol certificate code |
| `inspection_date` | `DATE` | `NOT NULL, INDEX` | Date of on-site evaluation |
| `result` | `VARCHAR(20)` | `NOT NULL` | Audit outcome (`passed`, `needs_improvement`, `failed`) |
| `score` | `INTEGER` | `NOT NULL, INDEX` | Calculated compliance percentage (0–100) |
| `notes` | `TEXT` | `NULLABLE` | Field engineer diagnostic observations |
| `follow_up_required`| `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Flag demanding mandatory remediation |
| `follow_up_date` | `DATE` | `NULLABLE` | Statutory deadline for reinspection |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Audit filing timestamp |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Record update timestamp |

---

### 2.6 `complaints`
Maintenance work orders, equipment malfunctions, and tenant reports.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Work order ticket ID |
| `facility_id` | `BIGINT` | `FOREIGN KEY -> facilities(id) ON UPDATE CASCADE ON DELETE CASCADE` | Affected physical asset |
| `reporter_id` | `BIGINT` | `NULLABLE, FOREIGN KEY -> users(id) ON UPDATE CASCADE ON DELETE SET NULL` | Originating reporter |
| `assigned_to_id` | `BIGINT` | `NULLABLE, FOREIGN KEY -> users(id) ON UPDATE CASCADE ON DELETE SET NULL` | Assigned lead technician |
| `ticket_number` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Tracking identifier (e.g. `TKT-2026-441`) |
| `title` | `VARCHAR(200)` | `NOT NULL` | Summary of defect or issue |
| `description` | `TEXT` | `NOT NULL` | Comprehensive fault observations |
| `severity` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'medium'` | Priority level (`low`, `medium`, `high`, `critical`) |
| `status` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'open'` | Lifecycle stage (`open`, `in_progress`, `resolved`) |
| `resolution_notes`| `TEXT` | `NULLABLE` | Remediation description upon closure |
| `resolved_at` | `TIMESTAMP` | `NULLABLE` | Timestamp of certified ticket resolution |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Ticket filing timestamp |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Ticket state update timestamp |

**Composite Indexes:**
- `['facility_id', 'status']`: Fast retrieval of active issues for a facility asset.
- `['severity', 'status']`: High-priority unassigned queue triage.
