-- ============================================================================
-- Day 08: Relational Database Design - Facility & Employee Management System
-- Database Engine: PostgreSQL
-- File: 02-seed-data.sql
-- Description: Realistic fictional seed dataset for testing relational integrity,
--              complex joins, aggregations, subqueries, and window functions.
-- ============================================================================

-- Reset sequence IDs and wipe existing table data safely
TRUNCATE TABLE complaints, inspections, facilities, employees, departments, users RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Seed: users
-- Passwords: All hashed using standard Laravel bcrypt for "Password123!"
-- Hash: $2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W
-- ----------------------------------------------------------------------------
INSERT INTO users (name, email, password, role, is_active, created_at, updated_at) VALUES
('Sarah Jenkins', 'sarah.admin@enterprise.local', '$2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W', 'admin', TRUE, '2026-01-10 08:00:00+00', '2026-01-10 08:00:00+00'),
('Marcus Vance', 'marcus.inspector@enterprise.local', '$2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W', 'inspector', TRUE, '2026-01-12 09:30:00+00', '2026-01-12 09:30:00+00'),
('Elena Rostova', 'elena.inspector@enterprise.local', '$2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W', 'inspector', TRUE, '2026-01-15 10:15:00+00', '2026-01-15 10:15:00+00'),
('David Kim', 'david.manager@enterprise.local', '$2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W', 'manager', TRUE, '2026-02-01 08:45:00+00', '2026-02-01 08:45:00+00'),
('Amina Al-Mansoor', 'amina.staff@enterprise.local', '$2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W', 'staff', TRUE, '2026-02-15 11:00:00+00', '2026-02-15 11:00:00+00'),
('Carlos Mendez', 'carlos.technician@enterprise.local', '$2y$12$K8KqA9p2hQ8R6.yG5S6Gye7j9XF4cYb2O1uU9U1RkCg6cE5aG6A7W', 'staff', TRUE, '2026-03-01 09:00:00+00', '2026-03-01 09:00:00+00');

-- ----------------------------------------------------------------------------
-- 2. Seed: departments
-- ----------------------------------------------------------------------------
INSERT INTO departments (name, code, description, budget, created_at, updated_at) VALUES
('Engineering & Infrastructure', 'DEPT-ENG', 'Facility engineering, HVAC, structural maintenance, and electrical works', 850000.00, '2026-01-01 00:00:00+00', '2026-01-01 00:00:00+00'),
('Environmental Health & Safety', 'DEPT-EHS', 'OSHA compliance, hazardous material management, and workplace safety audits', 520000.00, '2026-01-01 00:00:00+00', '2026-01-01 00:00:00+00'),
('Information Technology', 'DEPT-IT', 'Network infrastructure, server rooms, data center facilities, and security systems', 980000.00, '2026-01-01 00:00:00+00', '2026-01-01 00:00:00+00'),
('Operations & Logistics', 'DEPT-OPS', 'Supply chain distribution, fleet management, and warehouse inventory operations', 640000.00, '2026-01-01 00:00:00+00', '2026-01-01 00:00:00+00');

-- ----------------------------------------------------------------------------
-- 3. Seed: employees
-- ----------------------------------------------------------------------------
INSERT INTO employees (department_id, first_name, last_name, email, job_title, salary, hire_date, status, created_at, updated_at) VALUES
(1, 'Robert', 'Sterling', 'r.sterling@enterprise.local', 'Lead Mechanical Engineer', 98000.00, '2021-03-15', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Grace', 'Hopper', 'g.hopper@enterprise.local', 'Electrical Systems Specialist', 87500.00, '2022-07-01', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Thomas', 'Edison', 't.edison@enterprise.local', 'HVAC Maintenance Technician', 62000.00, '2023-01-10', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Rachel', 'Carson', 'r.carson@enterprise.local', 'Chief Safety Officer', 105000.00, '2020-05-18', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'John', 'Muir', 'j.muir@enterprise.local', 'Environmental Compliance Auditor', 76000.00, '2022-09-20', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Leila', 'Nazari', 'l.nazari@enterprise.local', 'Hazardous Materials Coordinator', 69000.00, '2023-11-05', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Alan', 'Turing', 'a.turing@enterprise.local', 'Principal Infrastructure Architect', 135000.00, '2019-11-01', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Ada', 'Lovelace', 'a.lovelace@enterprise.local', 'Data Center Operations Lead', 112000.00, '2021-02-14', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Linus', 'Torvalds', 'l.torvalds@enterprise.local', 'Systems Administrator', 89000.00, '2022-06-15', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Henry', 'Ford', 'h.ford@enterprise.local', 'Logistics Director', 102000.00, '2020-08-01', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Margaret', 'Hamilton', 'm.hamilton@enterprise.local', 'Warehouse Operations Supervisor', 74000.00, '2022-04-12', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Frank', 'Sinatra', 'f.sinatra@enterprise.local', 'Dispatch Coordinator', 51000.00, '2024-02-01', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------------------
-- 4. Seed: facilities
-- ----------------------------------------------------------------------------
INSERT INTO facilities (name, facility_code, facility_type, address, city, state, postal_code, condition_rating, status, capacity, created_at, updated_at) VALUES
('Metropolis Corporate HQ', 'FAC-HQ-01', 'office', '100 Enterprise Way', 'Seattle', 'WA', '98101', 'excellent', 'operational', 1500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pacific Northwest Logistics Depot', 'FAC-WH-02', 'warehouse', '450 Harbor Boulevard', 'Tacoma', 'WA', '98421', 'good', 'operational', 350, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cascade BioChemical Research Lab', 'FAC-LAB-03', 'laboratory', '720 Science Parkway', 'Bellevue', 'WA', '98004', 'fair', 'operational', 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Olympus Tier IV Data Center', 'FAC-DAT-04', 'datacenter', '880 Cloud Ridge Rd', 'Redmond', 'WA', '98052', 'excellent', 'operational', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rainier Industrial Foundry', 'FAC-MFG-05', 'manufacturing', '1200 Ruston Way', 'Tacoma', 'WA', '98402', 'poor', 'under_maintenance', 450, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pioneer Square Annex Depot', 'FAC-STG-06', 'warehouse', '310 1st Avenue South', 'Seattle', 'WA', '98104', 'critical', 'closed', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------------------
-- 5. Seed: inspections
-- Inspector 2 is Marcus Vance, Inspector 3 is Elena Rostova
-- ----------------------------------------------------------------------------
INSERT INTO inspections (facility_id, inspector_id, inspection_number, inspection_date, result, score, notes, follow_up_required, follow_up_date, created_at, updated_at) VALUES
(1, 2, 'INSP-2026-001', '2026-01-15', 'passed', 96, 'All fire suppressions, emergency exits, and ADA pathways fully compliant.', FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'INSP-2026-002', '2026-02-10', 'passed', 88, 'Forklift lanes clearly marked. Minor wear on dock bumpers noted.', FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'INSP-2026-003', '2026-02-28', 'conditional_pass', 72, 'Fume hood ventilation filter nearing saturation. Chemical storage signage faded.', TRUE, '2026-04-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 3, 'INSP-2026-004', '2026-03-05', 'passed', 99, 'Dual-loop redundant cooling operating at optimal delta T. Clean room rating sustained.', FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 2, 'INSP-2026-005', '2026-03-18', 'failed', 48, 'Primary furnace pressure sensor calibrating erratically. Multiple emergency lights unpowered.', TRUE, '2026-04-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 3, 'INSP-2026-006', '2026-04-02', 'critical_failure', 35, 'Roof structural beam shows noticeable deflection above assembly line 2. Immediate cessation recommended.', TRUE, '2026-04-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, 'INSP-2026-007', '2026-01-20', 'critical_failure', 22, 'Asbestos ceiling panel disruption and water intrusion in basement. Building declared unfit.', TRUE, '2026-02-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 3, 'INSP-2026-008', '2026-04-10', 'passed', 94, 'Semi-annual sprinkler pressure review passed. Elevator cables inspected and certified.', FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------------------
-- 6. Seed: complaints
-- Reporter IDs: 4 (David Kim), 5 (Amina Al-Mansoor), NULL (Anonymous)
-- Assignee IDs: 6 (Carlos Mendez - technician), 2 (Marcus Vance)
-- ----------------------------------------------------------------------------
INSERT INTO complaints (facility_id, reporter_id, assigned_to_id, ticket_number, title, description, severity, status, resolution_notes, resolved_at, created_at, updated_at) VALUES
(1, 5, 6, 'CMP-2026-001', '7th Floor Chilled Water Leak', 'Slow condensation drip from ceiling tile near boardroom 7B causing carpet water damage.', 'medium', 'resolved', 'Replaced condensation drain pan pipe and restored ceiling tiles.', '2026-03-02 14:00:00+00', '2026-02-28 09:15:00+00', '2026-03-02 14:00:00+00'),
(2, 4, 6, 'CMP-2026-002', 'Dock Leveler Hydraulic Fault', 'Bay 4 loading dock hydraulic ramp fails to lift to trailer tailgate height.', 'high', 'in_progress', 'Replacement hydraulic solenoid on order with vendor.', NULL, '2026-03-10 11:30:00+00', '2026-03-10 11:30:00+00'),
(3, 5, 2, 'CMP-2026-003', 'Solvent Smell in East Corridor', 'Noticeable chemical solvent odor detected during afternoon distillation run.', 'urgent', 'in_progress', 'Exhaust blower belt tension checked; scheduled for deep duct evacuation.', NULL, '2026-03-15 15:45:00+00', '2026-03-15 15:45:00+00'),
(4, NULL, 6, 'CMP-2026-004', 'CRAC Unit 3 Vibration Warning', 'Secondary computer room air conditioner unit producing audible harmonic resonance.', 'low', 'open', NULL, NULL, '2026-03-22 08:20:00+00', '2026-03-22 08:20:00+00'),
(5, 4, 6, 'CMP-2026-005', 'Assembly Bay Overheating', 'Ambient temperatures inside smelting bay exceeding 38 degrees Celsius due to louver failure.', 'urgent', 'in_progress', 'Emergency portable air circulators deployed; primary louvers undergoing rewiring.', NULL, '2026-03-25 10:10:00+00', '2026-03-25 10:10:00+00'),
(5, NULL, 2, 'CMP-2026-006', 'Cracked Load-Bearing Beam', 'Staff observed fresh plaster cracks along ceiling girder after high winds.', 'urgent', 'open', 'Assigned to senior inspector Marcus Vance for immediate structural review.', NULL, '2026-04-01 13:00:00+00', '2026-04-01 13:00:00+00'),
(6, NULL, NULL, 'CMP-2026-007', 'Vandalism on Perimeter Fence', 'Rear security perimeter fence chain-link cut near decommissioned railway spur.', 'medium', 'open', NULL, NULL, '2026-04-05 07:45:00+00', '2026-04-05 07:45:00+00'),
(1, 5, 6, 'CMP-2026-008', 'East Stairwell Light Out', 'Emergency battery backup light flickers and fails in east stairwell between levels 2 and 3.', 'low', 'resolved', 'Replaced ballast and LED tube unit.', '2026-04-08 16:30:00+00', '2026-04-07 14:10:00+00', '2026-04-08 16:30:00+00'),
(2, 4, 6, 'CMP-2026-009', 'Overhead Rollup Door Sticking', 'Warehouse main access rollup door jams at 2-meter mark intermittently.', 'medium', 'open', NULL, NULL, '2026-04-12 09:00:00+00', '2026-04-12 09:00:00+00'),
(5, 5, 2, 'CMP-2026-010', 'Oil Sheen in Drainage Runoff', 'Minor hydrocarbon sheen noted around rainwater retention basin near foundry wash bay.', 'high', 'in_progress', 'Absorbent booms placed; investigation into oil/water separator functioning ongoing.', NULL, '2026-04-14 11:20:00+00', '2026-04-14 11:20:00+00');
