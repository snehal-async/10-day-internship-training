# FacilityOps Entity-Relationship (ER) Diagram

## 1. Relational Architecture
The relational model reflects a decoupled, scalable enterprise facility management data model. Facilities serve as the central operational hub, anchoring statutory compliance audits (`inspections`) and maintenance tickets (`complaints`). Departments organize operational budgets and staff (`employees`), while `users` represent authenticated operators and inspectors.

```mermaid
erDiagram
    DEPARTMENTS ||--o{ EMPLOYEES : "employs"
    FACILITIES ||--o{ INSPECTIONS : "receives"
    FACILITIES ||--o{ COMPLAINTS : "logs"
    USERS ||--o{ INSPECTIONS : "conducts"
    USERS ||--o{ COMPLAINTS : "reports"
    USERS ||--o{ COMPLAINTS : "resolves"

    DEPARTMENTS {
        bigint id PK
        string name "Unique"
        string code "Unique"
        text description
        decimal budget "14,2"
        timestamp created_at
        timestamp updated_at
    }

    EMPLOYEES {
        bigint id PK
        bigint department_id FK
        string first_name
        string last_name
        string email "Unique"
        string job_title
        decimal salary "10,2"
        date hire_date
        string status
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        bigint id PK
        string name
        string email "Unique"
        timestamp email_verified_at
        string password "Hashed"
        string role "admin|inspector|manager|user"
        string remember_token
        timestamp created_at
        timestamp updated_at
    }

    FACILITIES {
        bigint id PK
        string name
        string facility_code "Unique"
        string facility_type "office|warehouse|laboratory|datacenter|manufacturing"
        string address
        string city
        string state
        string postal_code
        string condition_rating "excellent|good|fair|poor|critical"
        string status "operational|under_maintenance|closed"
        int capacity
        timestamp created_at
        timestamp updated_at
    }

    INSPECTIONS {
        bigint id PK
        bigint facility_id FK "Cascade Delete"
        bigint inspector_id FK "Restrict Delete"
        string inspection_number "Unique"
        date inspection_date
        string result "passed|needs_improvement|failed"
        int score "0-100"
        text notes
        boolean follow_up_required
        date follow_up_date
        timestamp created_at
        timestamp updated_at
    }

    COMPLAINTS {
        bigint id PK
        bigint facility_id FK "Cascade Delete"
        bigint reporter_id FK "Set Null Delete"
        bigint assigned_to_id FK "Set Null Delete"
        string ticket_number "Unique"
        string title
        text description
        string severity "low|medium|high|critical"
        string status "open|in_progress|resolved"
        text resolution_notes
        timestamp resolved_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## 2. Referential Integrity & Cascade Rules

1. **`inspections` -> `facilities` (`facility_id`)**:
   - `ON UPDATE CASCADE`
   - `ON DELETE CASCADE`: If a facility is decommissioned and deleted, historical inspections are safely purged with the asset.
2. **`inspections` -> `users` (`inspector_id`)**:
   - `ON UPDATE CASCADE`
   - `ON DELETE RESTRICT`: An inspector profile cannot be accidentally dropped while certified compliance audit records depend on it.
3. **`complaints` -> `facilities` (`facility_id`)**:
   - `ON UPDATE CASCADE`
   - `ON DELETE CASCADE`: Asset tickets are cascade-removed if the parent facility is dropped.
4. **`complaints` -> `users` (`reporter_id` & `assigned_to_id`)**:
   - `ON UPDATE CASCADE`
   - `ON DELETE SET NULL`: Preserves historical work order maintenance documentation even if a contractor or personnel account is offboarded.
5. **`employees` -> `departments` (`department_id`)**:
   - `ON UPDATE CASCADE`
   - `ON DELETE RESTRICT`: Prevents orphaned employees when altering departmental structures.
