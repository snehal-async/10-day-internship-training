-- ============================================================================
-- Day 08: Relational Database Design - Facility & Employee Management System
-- Database Engine: PostgreSQL
-- File: 03-basic-queries.sql
-- Description: Basic query execution, filtering, sorting, and safe CRUD operations.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 1: List all employees with their department names
-- Concept: Two-table INNER JOIN matching primary key to foreign key.
-- ----------------------------------------------------------------------------
SELECT 
    e.id AS employee_id,
    e.first_name || ' ' || e.last_name AS full_name,
    e.job_title,
    e.email,
    e.salary,
    d.name AS department_name,
    d.code AS department_code
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY d.name ASC, e.last_name ASC;

-- ----------------------------------------------------------------------------
-- QUERY 2: Find employees in a selected department using WHERE
-- Concept: Conditional filtering on department code/name using WHERE clause.
-- ----------------------------------------------------------------------------
SELECT 
    e.id,
    e.first_name,
    e.last_name,
    e.job_title,
    e.salary,
    e.hire_date,
    d.name AS department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.code = 'DEPT-ENG' AND e.status = 'active'
ORDER BY e.hire_date ASC;

-- ----------------------------------------------------------------------------
-- QUERY 3: Sort employees by salary using ORDER BY
-- Concept: Ascending and Descending ordering with NULLS LAST guarantee.
-- ----------------------------------------------------------------------------
-- 3A: Highest paid to lowest paid (Descending)
SELECT 
    e.id,
    e.first_name || ' ' || e.last_name AS full_name,
    d.name AS department,
    e.job_title,
    TO_CHAR(e.salary, '$999,999.00') AS formatted_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC NULLS LAST;

-- 3B: Lowest paid to highest paid (Ascending)
SELECT 
    e.id,
    e.first_name || ' ' || e.last_name AS full_name,
    e.job_title,
    e.salary
FROM employees e
ORDER BY e.salary ASC;

-- ----------------------------------------------------------------------------
-- QUERY 14: Safe CRUD Demonstrations (INSERT, SELECT, UPDATE, DELETE)
-- Demonstrating proper parameter usage, returning clauses, and safe deletion.
-- ----------------------------------------------------------------------------

-- 14.1: INSERT - Safely onboarding a new facility
INSERT INTO facilities (
    name, facility_code, facility_type, address, city, state, postal_code, condition_rating, status, capacity
) VALUES (
    'Spokane Regional Distribution Hub',
    'FAC-WH-07',
    'warehouse',
    '1540 E Trent Avenue',
    'Spokane',
    'WA',
    '99202',
    'good',
    'operational',
    200
)
RETURNING id, name, facility_code, status, created_at;

-- 14.2: SELECT - Targeted projection with specific conditions
SELECT 
    facility_code,
    name,
    facility_type,
    city,
    condition_rating,
    capacity
FROM facilities
WHERE facility_code = 'FAC-WH-07';

-- 14.3: UPDATE - Safely updating facility condition and status with WHERE clause
-- Note: Always include a specific primary key or unique key in WHERE to prevent bulk updates.
UPDATE facilities
SET 
    condition_rating = 'fair',
    capacity = 220,
    updated_at = CURRENT_TIMESTAMP
WHERE facility_code = 'FAC-WH-07'
RETURNING id, facility_code, condition_rating, capacity, updated_at;

-- 14.4: DELETE - Safe deletion using primary or unique key
-- Note: If child records exist (inspections/complaints), foreign key CASCADE handles them
-- or RESTRICT blocks deletion based on relational design.
DELETE FROM facilities
WHERE facility_code = 'FAC-WH-07'
RETURNING id, facility_code, name;
