-- ============================================================================
-- Day 08: Relational Database Design - Facility & Employee Management System
-- Database Engine: PostgreSQL
-- File: 04-joins-and-aggregations.sql
-- Description: Aggregations, GROUP BY, HAVING, and comprehensive JOIN strategies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 4: Calculate average salary for each department using GROUP BY
-- Demonstrating multiple aggregate functions: COUNT(), AVG(), MIN(), MAX(), SUM().
-- ----------------------------------------------------------------------------
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    d.code AS department_code,
    COUNT(e.id) AS total_employees,
    ROUND(AVG(e.salary), 2) AS average_salary,
    MIN(e.salary) AS minimum_salary,
    MAX(e.salary) AS maximum_salary,
    SUM(e.salary) AS total_payroll
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'active'
GROUP BY d.id, d.name, d.code
ORDER BY average_salary DESC;

-- ----------------------------------------------------------------------------
-- QUERY 5: Find departments whose average salary is above a selected threshold using HAVING
-- Concept: The WHERE clause filters rows BEFORE grouping.
--          The HAVING clause filters aggregated groups AFTER GROUP BY calculations.
-- Threshold selected: $85,000.00
-- ----------------------------------------------------------------------------
SELECT 
    d.name AS department_name,
    d.code AS department_code,
    COUNT(e.id) AS headcount,
    ROUND(AVG(e.salary), 2) AS average_salary
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
WHERE e.status = 'active'
GROUP BY d.id, d.name, d.code
HAVING AVG(e.salary) > 85000.00
ORDER BY average_salary DESC;

-- ----------------------------------------------------------------------------
-- QUERY 8: Count complaints by facility and complaint status
-- Demonstrating multi-column GROUP BY and PIVOT-style conditional aggregation.
-- ----------------------------------------------------------------------------
SELECT 
    f.facility_code,
    f.name AS facility_name,
    c.status AS complaint_status,
    COUNT(c.id) AS total_tickets
FROM facilities f
INNER JOIN complaints c ON f.id = c.facility_id
GROUP BY f.id, f.facility_code, f.name, c.status
ORDER BY f.facility_code, total_tickets DESC;

-- Supplementary 8B: Cross-tabulation / matrix view using conditional aggregation
SELECT 
    f.facility_code,
    f.name AS facility_name,
    COUNT(c.id) AS total_complaints,
    COUNT(CASE WHEN c.status = 'open' THEN 1 END) AS open_tickets,
    COUNT(CASE WHEN c.status = 'in_progress' THEN 1 END) AS in_progress_tickets,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) AS resolved_tickets,
    COUNT(CASE WHEN c.severity = 'urgent' THEN 1 END) AS urgent_tickets
FROM facilities f
LEFT JOIN complaints c ON f.id = c.facility_id
GROUP BY f.id, f.facility_code, f.name
ORDER BY urgent_tickets DESC, total_complaints DESC;

-- ----------------------------------------------------------------------------
-- QUERY 9: Show inspection history for a selected facility
-- Demonstrating facility details joined with audits and the inspector user account.
-- Target facility: 'FAC-MFG-05' (Rainier Industrial Foundry)
-- ----------------------------------------------------------------------------
SELECT 
    f.facility_code,
    f.name AS facility_name,
    f.condition_rating AS current_condition,
    i.inspection_number,
    i.inspection_date,
    i.score,
    i.result,
    u.name AS inspector_name,
    u.email AS inspector_email,
    i.follow_up_required,
    i.follow_up_date,
    i.notes
FROM facilities f
INNER JOIN inspections i ON f.id = i.facility_id
INNER JOIN users u ON i.inspector_id = u.id
WHERE f.facility_code = 'FAC-MFG-05'
ORDER BY i.inspection_date DESC;

-- ----------------------------------------------------------------------------
-- QUERY 10: Demonstrate appropriate JOIN variations
-- ----------------------------------------------------------------------------

-- 10.1: INNER JOIN - Returns only matched records from both tables.
-- Inspections matching existing facilities and active users.
SELECT 
    i.inspection_number,
    f.name AS facility_name,
    u.name AS inspector_name,
    i.result,
    i.score
FROM inspections i
INNER JOIN facilities f ON i.facility_id = f.id
INNER JOIN users u ON i.inspector_id = u.id;

-- 10.2: LEFT JOIN - Returns ALL records from left table, with matched or NULL right table.
-- Facilities and their complaints (includes facilities that have ZERO complaints).
SELECT 
    f.facility_code,
    f.name AS facility_name,
    COALESCE(c.ticket_number, 'NO COMPLAINTS') AS ticket_number,
    c.severity,
    COALESCE(c.status, 'N/A') AS status
FROM facilities f
LEFT JOIN complaints c ON f.id = c.facility_id
ORDER BY f.facility_code, c.ticket_number;

-- 10.3: Multiple LEFT JOINs with User attribution
-- Complaints with optional reporter (may be anonymous) and optional assignee.
SELECT 
    c.ticket_number,
    f.name AS facility_name,
    c.title,
    COALESCE(rep.name, 'Anonymous / Public') AS reported_by,
    COALESCE(asgn.name, 'Unassigned') AS assigned_technician,
    c.severity,
    c.status
FROM complaints c
INNER JOIN facilities f ON c.facility_id = f.id
LEFT JOIN users rep ON c.reporter_id = rep.id
LEFT JOIN users asgn ON c.assigned_to_id = asgn.id
ORDER BY c.created_at DESC;

-- 10.4: FULL OUTER JOIN - Shows all facilities and all inspections, highlighting any missing links.
SELECT 
    f.facility_code,
    f.name AS facility_name,
    i.inspection_number,
    i.result
FROM facilities f
FULL OUTER JOIN inspections i ON f.id = i.facility_id;
