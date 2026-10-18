-- ============================================================================
-- Day 08: Relational Database Design - Consolidated Schema DDL
-- Database Engine: PostgreSQL (Compatible with PostgreSQL 14 - 18+)
-- File: database/schema.sql
-- Description: Complete consolidated DDL for the Facility & Employee Management System.
-- ============================================================================

-- Clean up existing tables in reverse dependency order
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'inspector', 'staff', 'manager')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'System authentication principals with role-based access control';
COMMENT ON COLUMN users.role IS 'Security role: admin, inspector, staff, or manager';
COMMENT ON COLUMN users.is_active IS 'Account status flag for access revocation';

-- ----------------------------------------------------------------------------
-- 2. Table: departments
-- ----------------------------------------------------------------------------
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    budget NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0.00),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE departments IS 'Organizational cost centers and operational divisions';
COMMENT ON COLUMN departments.code IS 'Unique code identifier (e.g. DEPT-ENG, DEPT-IT)';
COMMENT ON COLUMN departments.budget IS 'Annual operational budget, constrained to non-negative';

-- ----------------------------------------------------------------------------
-- 3. Table: employees
-- ----------------------------------------------------------------------------
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    job_title VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL CHECK (salary >= 0.00),
    hire_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employees_department
        FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE employees IS 'HR personnel records linked to departmental hierarchies';
COMMENT ON COLUMN employees.salary IS 'Monthly/annual salary, constrained to non-negative';
COMMENT ON COLUMN employees.department_id IS 'Foreign key to departments table';

-- ----------------------------------------------------------------------------
-- 4. Table: facilities
-- ----------------------------------------------------------------------------
CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    facility_code VARCHAR(30) NOT NULL UNIQUE,
    facility_type VARCHAR(50) NOT NULL CHECK (facility_type IN ('office', 'warehouse', 'laboratory', 'datacenter', 'manufacturing')),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    condition_rating VARCHAR(20) NOT NULL DEFAULT 'good' CHECK (condition_rating IN ('excellent', 'good', 'fair', 'poor', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'under_maintenance', 'decommissioned', 'closed')),
    capacity INTEGER CHECK (capacity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE facilities IS 'Physical buildings, infrastructure sites, and production facilities';
COMMENT ON COLUMN facilities.facility_code IS 'Unique facility identifier code';
COMMENT ON COLUMN facilities.condition_rating IS 'Structural rating (excellent, good, fair, poor, critical)';

-- ----------------------------------------------------------------------------
-- 5. Table: inspections
-- ----------------------------------------------------------------------------
CREATE TABLE inspections (
    id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    inspector_id BIGINT NOT NULL,
    inspection_number VARCHAR(50) NOT NULL UNIQUE,
    inspection_date DATE NOT NULL,
    result VARCHAR(20) NOT NULL CHECK (result IN ('passed', 'conditional_pass', 'failed', 'critical_failure')),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    notes TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inspections_facility
        FOREIGN KEY (facility_id)
        REFERENCES facilities (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_inspections_inspector
        FOREIGN KEY (inspector_id)
        REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE inspections IS 'Compliance and safety audits performed on facilities';
COMMENT ON COLUMN inspections.score IS 'Standardized inspection score between 0 and 100';

-- ----------------------------------------------------------------------------
-- 6. Table: complaints
-- ----------------------------------------------------------------------------
CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    reporter_id BIGINT NULL,
    assigned_to_id BIGINT NULL,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'rejected')),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_facility
        FOREIGN KEY (facility_id)
        REFERENCES facilities (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_complaints_reporter
        FOREIGN KEY (reporter_id)
        REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_complaints_assigned_to
        FOREIGN KEY (assigned_to_id)
        REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

COMMENT ON TABLE complaints IS 'Maintenance and safety tickets lodged against facilities';

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX idx_employees_department_id ON employees (department_id);
CREATE INDEX idx_inspections_facility_id ON inspections (facility_id);
CREATE INDEX idx_inspections_inspector_id ON inspections (inspector_id);
CREATE INDEX idx_complaints_facility_id ON complaints (facility_id);
CREATE INDEX idx_complaints_reporter_id ON complaints (reporter_id);
CREATE INDEX idx_complaints_assigned_to_id ON complaints (assigned_to_id);

CREATE INDEX idx_employees_salary ON employees (salary DESC);
CREATE INDEX idx_employees_hire_date ON employees (hire_date);
CREATE INDEX idx_facilities_condition ON facilities (condition_rating);
CREATE INDEX idx_facilities_status ON facilities (status);
CREATE INDEX idx_inspections_date ON inspections (inspection_date DESC);
CREATE INDEX idx_complaints_facility_status ON complaints (facility_id, status);
CREATE INDEX idx_complaints_severity_status ON complaints (severity, status);
