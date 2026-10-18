-- ============================================================================
-- FacilityOps Analytical & Compliance Reporting SQL Queries
-- Target Engine: PostgreSQL 14+ / 16+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Executive Telemetry Overview: Aggregate KPI Metrics
-- Calculates total sites, active sites, aggregate capacity, average audit score,
-- open maintenance tickets, and critical issues.
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(DISTINCT f.id) AS total_facilities,
    COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'operational') AS operational_facilities,
    COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'under_maintenance') AS maintenance_facilities,
    COALESCE(SUM(f.capacity), 0) AS total_human_capacity,
    COALESCE(ROUND(AVG(i.score), 1), 0.0) AS avg_compliance_score,
    (SELECT COUNT(*) FROM inspections WHERE result = 'passed') AS passed_audits_count,
    (SELECT COUNT(*) FROM complaints WHERE status = 'open') AS open_work_orders,
    (SELECT COUNT(*) FROM complaints WHERE severity = 'critical' AND status != 'resolved') AS critical_unresolved_complaints
FROM facilities f
LEFT JOIN inspections i ON f.id = i.facility_id;

-- ----------------------------------------------------------------------------
-- 2. Facility Condition Distribution & Risk Grading
-- Aggregates sites by structural condition with percentage distribution.
-- ----------------------------------------------------------------------------
SELECT 
    condition_rating,
    COUNT(*) AS facility_count,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()), 2) AS percentage_of_estate,
    SUM(capacity) AS impacted_capacity
FROM facilities
GROUP BY condition_rating
ORDER BY 
    CASE condition_rating
        WHEN 'critical' THEN 1
        WHEN 'poor' THEN 2
        WHEN 'fair' THEN 3
        WHEN 'good' THEN 4
        WHEN 'excellent' THEN 5
        ELSE 6
    END ASC;

-- ----------------------------------------------------------------------------
-- 3. High-Risk Facility Triage: Sites with Overdue Audits or Critical Complaints
-- Identifies facilities that urgently require field intervention.
-- ----------------------------------------------------------------------------
SELECT 
    f.id,
    f.facility_code,
    f.name AS facility_name,
    f.city,
    f.condition_rating,
    f.status,
    COUNT(c.id) FILTER (WHERE c.severity IN ('critical', 'high') AND c.status != 'resolved') AS urgent_complaints,
    MAX(i.inspection_date) AS last_audit_date,
    COALESCE(ROUND(AVG(i.score), 1), 0) AS avg_audit_score,
    BOOL_OR(i.follow_up_required AND i.follow_up_date < CURRENT_DATE) AS has_overdue_follow_up
FROM facilities f
LEFT JOIN complaints c ON f.id = c.facility_id
LEFT JOIN inspections i ON f.id = i.facility_id
GROUP BY f.id, f.facility_code, f.name, f.city, f.condition_rating, f.status
HAVING 
    f.condition_rating IN ('poor', 'critical')
    OR COUNT(c.id) FILTER (WHERE c.severity IN ('critical', 'high') AND c.status != 'resolved') > 0
    OR BOOL_OR(i.follow_up_required AND i.follow_up_date < CURRENT_DATE) = TRUE
ORDER BY urgent_complaints DESC, avg_audit_score ASC;

-- ----------------------------------------------------------------------------
-- 4. Inspector Productivity & Regulatory Pass Rates
-- Compares certified inspectors by volume of completed audits and pass rates.
-- ----------------------------------------------------------------------------
SELECT 
    u.id AS inspector_id,
    u.name AS inspector_name,
    u.email AS inspector_email,
    COUNT(i.id) AS total_inspections_conducted,
    COUNT(i.id) FILTER (WHERE i.result = 'passed') AS passed_count,
    COUNT(i.id) FILTER (WHERE i.result = 'needs_improvement') AS remediation_count,
    COUNT(i.id) FILTER (WHERE i.result = 'failed') AS failed_count,
    ROUND(AVG(i.score), 2) AS average_score_given,
    ROUND((COUNT(i.id) FILTER (WHERE i.result = 'passed') * 100.0 / NULLIF(COUNT(i.id), 0)), 1) AS pass_percentage
FROM users u
INNER JOIN inspections i ON u.id = i.inspector_id
GROUP BY u.id, u.name, u.email
ORDER BY total_inspections_conducted DESC;

-- ----------------------------------------------------------------------------
-- 5. Maintenance SLA & Resolution Velocity
-- Calculates average hours to resolve work order tickets by severity tier.
-- ----------------------------------------------------------------------------
SELECT 
    c.severity,
    COUNT(*) AS total_tickets_resolved,
    ROUND(AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at)) / 3600.0), 2) AS avg_resolution_hours,
    ROUND(MIN(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at)) / 3600.0), 2) AS fastest_resolution_hours,
    ROUND(MAX(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at)) / 3600.0), 2) AS longest_resolution_hours
FROM complaints c
WHERE c.status = 'resolved' AND c.resolved_at IS NOT NULL
GROUP BY c.severity
ORDER BY 
    CASE c.severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END ASC;

-- ----------------------------------------------------------------------------
-- 6. Monthly Inspection Audit Trend (Time-Series)
-- Tracks compliance audit volume and score trajectory across months.
-- ----------------------------------------------------------------------------
SELECT 
    TO_CHAR(i.inspection_date, 'YYYY-MM') AS audit_month,
    COUNT(*) AS total_audits,
    COUNT(*) FILTER (WHERE i.result = 'passed') AS passed_audits,
    COUNT(*) FILTER (WHERE i.follow_up_required = TRUE) AS follow_ups_mandated,
    ROUND(AVG(i.score), 1) AS monthly_mean_score
FROM inspections i
GROUP BY TO_CHAR(i.inspection_date, 'YYYY-MM')
ORDER BY audit_month ASC;
