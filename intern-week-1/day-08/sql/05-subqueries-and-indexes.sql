-- ============================================================================
-- Day 08: Relational Database Design - Facility & Employee Management System
-- Database Engine: PostgreSQL
-- File: 05-subqueries-and-indexes.sql
-- Description: Subqueries (scalar, multi-row, correlated), CTEs, and Index optimization.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 6: Find the highest-paid employee
-- Concept: Scalar subquery comparing employee salary to the MAX(salary).
-- ----------------------------------------------------------------------------
SELECT 
    e.id,
    e.first_name || ' ' || e.last_name AS employee_name,
    e.job_title,
    d.name AS department_name,
    e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary = (
    SELECT MAX(salary) 
    FROM employees 
    WHERE status = 'active'
);

-- Alternative using Common Table Expression (CTE) and Window Function (DENSE_RANK)
WITH RankedSalaries AS (
    SELECT 
        e.id,
        e.first_name || ' ' || e.last_name AS employee_name,
        e.job_title,
        d.name AS department_name,
        e.salary,
        DENSE_RANK() OVER (ORDER BY e.salary DESC) AS salary_rank
    FROM employees e
    INNER JOIN departments d ON e.department_id = d.id
    WHERE e.status = 'active'
)
SELECT employee_name, job_title, department_name, salary
FROM RankedSalaries
WHERE salary_rank = 1;

-- ----------------------------------------------------------------------------
-- QUERY 7: Find facilities whose condition or inspection results indicate poor facilities
-- Demonstrating union / subquery logic:
-- Condition 1: Direct facility condition_rating IN ('poor', 'critical')
-- Condition 2: Inspection history has 'failed' or 'critical_failure' or score < 60
-- ----------------------------------------------------------------------------
SELECT 
    f.id,
    f.facility_code,
    f.name AS facility_name,
    f.facility_type,
    f.condition_rating,
    f.status,
    (
        SELECT COUNT(*) 
        FROM inspections i 
        WHERE i.facility_id = f.id AND i.result IN ('failed', 'critical_failure')
    ) AS critical_inspection_count,
    (
        SELECT COUNT(*) 
        FROM complaints c 
        WHERE c.facility_id = f.id AND c.severity = 'urgent'
    ) AS urgent_complaint_count
FROM facilities f
WHERE 
    f.condition_rating IN ('poor', 'critical')
    OR f.id IN (
        SELECT DISTINCT facility_id 
        FROM inspections 
        WHERE result IN ('failed', 'critical_failure') OR score < 60
    )
ORDER BY 
    CASE f.condition_rating
        WHEN 'critical' THEN 1
        WHEN 'poor' THEN 2
        WHEN 'fair' THEN 3
        ELSE 4
    END,
    f.name;

-- ----------------------------------------------------------------------------
-- QUERY 11: Comprehensive Subquery Demonstrations
-- ----------------------------------------------------------------------------

-- 11.1: Correlated Subquery
-- Find employees who earn MORE than the average salary of their own department.
SELECT 
    e.first_name || ' ' || e.last_name AS employee_name,
    d.name AS department_name,
    e.salary,
    ROUND(dept_avg.avg_dept_sal, 2) AS department_average,
    ROUND(e.salary - dept_avg.avg_dept_sal, 2) AS surplus_over_average
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
CROSS JOIN LATERAL (
    SELECT AVG(e2.salary) AS avg_dept_sal
    FROM employees e2
    WHERE e2.department_id = e.department_id AND e2.status = 'active'
) dept_avg
WHERE e.salary > dept_avg.avg_dept_sal
ORDER BY surplus_over_average DESC;

-- 11.2: Subquery with EXISTS
-- Find facilities that currently have at least one unresolved urgent complaint.
SELECT 
    f.facility_code,
    f.name AS facility_name,
    f.city
FROM facilities f
WHERE EXISTS (
    SELECT 1 
    FROM complaints c
    WHERE c.facility_id = f.id 
      AND c.severity = 'urgent' 
      AND c.status IN ('open', 'in_progress')
);

-- ----------------------------------------------------------------------------
-- QUERY 12: Indexes Demonstration and Query Cost Analysis
-- ----------------------------------------------------------------------------

-- 12.1: Demonstrating query execution plan with EXPLAIN
-- Without index on a high-cardinality search, the database must execute a sequential scan.
-- With our index idx_complaints_facility_status ON complaints(facility_id, status),
-- PostgreSQL performs an efficient Bitmap Index Scan / Index Scan.
EXPLAIN (FORMAT TEXT)
SELECT * 
FROM complaints 
WHERE facility_id = 5 AND status = 'in_progress';

-- 12.2: Demonstrating index usage for range and sorting queries
EXPLAIN (FORMAT TEXT)
SELECT id, first_name, last_name, salary 
FROM employees 
WHERE salary >= 90000.00
ORDER BY salary DESC;

/*
===============================================================================
THEORY & BEST PRACTICES: WHEN DO INDEXES HELP AND WHEN DO THEY HURT?
===============================================================================
1. When Indexes Help:
   - Primary Keys & Foreign Keys: Avoids full-table lockups during foreign key checks
     and speeds up JOIN conditions (e.g. employees.department_id).
   - High-cardinality filters: Columns with many distinct values (e.g. ticket_number, email).
   - ORDER BY / GROUP BY clauses: Allows the query engine to read pre-sorted data,
     avoiding in-memory or on-disk quicksorts.
   - Covering Indexes: Compound indexes that contain all queried columns allow
     "Index-Only Scans" without hitting the heap table.

2. When Indexes Hurt:
   - Write Overhead (INSERT / UPDATE / DELETE): Every write requires updating
     all associated B-trees, increasing disk I/O and transaction latency.
   - Low-cardinality columns: Indexing a boolean flag or a column with 2 distinct values
     on large tables often gets ignored by the query planner in favor of a fast sequential scan.
   - Storage Bloat: Indexes consume RAM (buffer cache) and disk space.
   - Table Churn: High-update tables with indexes experience table and index page splits.
===============================================================================
*/
