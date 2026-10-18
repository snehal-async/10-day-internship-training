-- ============================================================================
-- Day 08: Relational Database Design - Facility & Employee Management System
-- Database Engine: PostgreSQL
-- File: 06-transactions.sql
-- Description: ACID properties, atomic multi-table workflows, SAVEPOINTS,
--              and rollback demonstrations.
-- ============================================================================

-- ============================================================================
-- TRANSACTION SCENARIO 1: ATOMIC INSPECTION & AUTOMATED INCIDENT ESCALATION
-- Purpose: When an inspector records a failed/critical audit, the system must:
--   1. Insert the new inspection record.
--   2. Downgrade the facility's condition rating and set status to 'under_maintenance'.
--   3. Automatically file an urgent complaint ticket for the engineering team.
-- All 3 steps must succeed together or fail together (Atomicity).
-- ============================================================================

BEGIN TRANSACTION;

-- Step 1: Record inspection finding
INSERT INTO inspections (
    facility_id, inspector_id, inspection_number, inspection_date,
    result, score, notes, follow_up_required, follow_up_date
) VALUES (
    3, -- Cascade BioChemical Research Lab
    2, -- Marcus Vance
    'INSP-2026-099',
    CURRENT_DATE,
    'failed',
    45,
    'Main chemical containment chamber exhaust gasket degraded. Toxic vapor leakage risk.',
    TRUE,
    CURRENT_DATE + INTERVAL '7 days'
);

-- Step 2: Update facility condition and operational status
UPDATE facilities
SET 
    condition_rating = 'poor',
    status = 'under_maintenance',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 3;

-- Step 3: Automatically open urgent maintenance ticket
INSERT INTO complaints (
    facility_id, reporter_id, assigned_to_id, ticket_number,
    title, description, severity, status
) VALUES (
    3,
    2, -- Reported by Inspector Marcus Vance
    6, -- Assigned to technician Carlos Mendez
    'CMP-2026-AUTOGEN-01',
    'URGENT: Chemical Exhaust Gasket Failure',
    'Automatically generated from failed inspection INSP-2026-099. Replace containment exhaust gasket.',
    'urgent',
    'open'
);

-- Verify results within the uncommitted transaction view
SELECT 
    f.name AS facility,
    f.condition_rating,
    f.status,
    i.inspection_number,
    c.ticket_number
FROM facilities f
JOIN inspections i ON i.inspection_number = 'INSP-2026-099'
JOIN complaints c ON c.ticket_number = 'CMP-2026-AUTOGEN-01'
WHERE f.id = 3;

-- If all steps succeeded, commit the transaction permanently
COMMIT;


-- ============================================================================
-- TRANSACTION SCENARIO 2: INTENTIONAL ERROR & ROLLBACK DEMONSTRATION
-- Purpose: Demonstrate how ROLLBACK protects database consistency when
--          a validation or business constraint fails midway through execution.
-- ============================================================================

BEGIN TRANSACTION;

-- Step 1: Insert a temporary facility
INSERT INTO facilities (
    name, facility_code, facility_type, address, city, state, postal_code, condition_rating, status, capacity
) VALUES (
    'Temporary Testing Shed',
    'FAC-TEMP-99',
    'warehouse',
    '999 Testing Way',
    'Olympia',
    'WA',
    '98501',
    'fair',
    'operational',
    50
);

-- Step 2: Attempt an invalid inspection insert with an illegal score (> 100)
-- PostgreSQL CHECK constraint (score >= 0 AND score <= 100) will reject this statement!
-- In PostgreSQL, when a statement within a transaction causes an error,
-- the entire transaction enters an aborted state until ROLLBACK is executed.
INSERT INTO inspections (
    facility_id, inspector_id, inspection_number, inspection_date,
    result, score, notes
) VALUES (
    (SELECT id FROM facilities WHERE facility_code = 'FAC-TEMP-99'),
    2,
    'INSP-INVALID-001',
    CURRENT_DATE,
    'passed',
    150, -- VIOLATION of CHECK (score <= 100)
    'This should fail'
);

-- Because step 2 failed, we execute ROLLBACK to undo Step 1 cleanly
ROLLBACK;

-- Verification: Verify that 'FAC-TEMP-99' was NOT persisted to the database
SELECT * FROM facilities WHERE facility_code = 'FAC-TEMP-99';
-- Output: 0 rows returned. Atomicity preserved!


-- ============================================================================
-- TRANSACTION SCENARIO 3: PARTIAL ROLLBACK USING SAVEPOINTS
-- Purpose: Roll back part of a transaction without losing earlier valid work.
-- ============================================================================

BEGIN;

-- Valid operation 1: Increase budget for Department of Engineering
UPDATE departments
SET budget = budget + 50000.00
WHERE code = 'DEPT-ENG';

-- Set a checkpoint
SAVEPOINT budget_updated;

-- Attempt an invalid operation: negative budget violating CHECK (budget >= 0)
UPDATE departments
SET budget = -1000.00
WHERE code = 'DEPT-EHS';

-- Roll back to savepoint (reverts only the invalid EHS update, retains ENG update)
ROLLBACK TO SAVEPOINT budget_updated;

-- Commit the valid portion
COMMIT;

/*
===============================================================================
ACID PROPERTIES EXPLAINED IN THIS ARCHITECTURE
===============================================================================
1. Atomicity:
   - "All or nothing". Either the inspection, facility update, and complaint
     are all permanently written, or none of them are.
2. Consistency:
   - The database moves from one valid state to another. Constraints
     (Foreign keys, CHECK score <= 100, NOT NULL, UNIQUE facility_code)
     are never violated.
3. Isolation:
   - Concurrent user queries do not see uncommitted intermediate states.
     PostgreSQL uses MVCC (Multi-Version Concurrency Control) at the default
     Read Committed or Serializable isolation levels.
4. Durability:
   - Once a transaction reports COMMIT, the write-ahead log (WAL) guarantees
     changes survive crashes, power outages, and server restarts.
===============================================================================
*/
