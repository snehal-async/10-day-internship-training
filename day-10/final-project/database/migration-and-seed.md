# Database Provisioning: Migrations & Seeders Guide

## 1. Prerequisites
- **PostgreSQL 14+** (e.g. Local PostgreSQL service or cloud-hosted instance such as Render/Neon/Supabase)
- **PHP 8.2+** with `pdo_pgsql` extension enabled (or `pdo_sqlite` for automated test suites)
- **Composer 2.x**

---

## 2. Environment Configuration

1. In the Laravel API root (`intern-week-1/day-08/laravel-api`), create or verify `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your database connection in `.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=facility_ops_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_secure_password
   ```
   > **Note:** For rapid zero-configuration testing, you can also use SQLite:
   > ```env
   > DB_CONNECTION=sqlite
   > DB_DATABASE=/absolute/path/to/database.sqlite
   > ```

---

## 3. Running Database Migrations

Apply the non-destructive migrations in sequence:

```bash
cd intern-week-1/day-08/laravel-api
php artisan migrate
```

### Migration Execution Sequence
1. `0001_01_01_000000_create_users_table.php` -> User accounts & auth tokens
2. `0001_01_01_000001_create_cache_table.php` -> Telemetry caching table
3. `0001_01_01_000002_create_jobs_table.php` -> Queue workers
4. `2026_01_01_000010_create_departments_table.php` -> Divisions & budgets
5. `2026_01_01_000020_create_employees_table.php` -> Personnel records
6. `2026_01_01_000030_create_facilities_table.php` -> Physical buildings & sites
7. `2026_01_01_000040_create_inspections_table.php` -> Statutory audits
8. `2026_01_01_000050_create_complaints_table.php` -> Work orders & maintenance
9. `2026_01_01_000060_create_personal_access_tokens_table.php` -> Sanctum API tokens

> **SAFETY RULE:** Never execute `php artisan migrate:fresh` on existing databases, as this drops all tables and wipes historical records.

---

## 4. Seeding Production Telemetry Data

To populate realistic sample facilities, compliance audits, and maintenance work orders:

```bash
cd intern-week-1/day-08/laravel-api
php artisan db:seed
```

### What the Seeders Populate:
- **`UserSeeder`**: System administrator (`admin@facilityops.io`), certified inspectors (`marcus.v@facilityops.io`, `elena.r@facilityops.io`), and facility operators.
- **`DepartmentSeeder`**: Logistics & Supply Chain, Biomedical Research, Data Infrastructure, Executive Facilities.
- **`FacilitySeeder`**: Multi-state enterprise estate across warehouses, research laboratories, offices, and primary data centers.
- **`InspectionSeeder`**: Historical statutory compliance evaluations spanning 2024 through 2026 with realistic pass/fail scores.
- **`ComplaintSeeder`**: Critical, high, and medium priority maintenance tickets across HVAC, electrical risers, fire suppression systems, and cleanroom airlocks.

---

## 5. Verification Command
To verify that tables are populated and indexed properly:

```bash
php artisan tinker --execute="echo 'Facilities: ' . \App\Models\Facility::count() . ', Inspections: ' . \App\Models\Inspection::count() . ', Complaints: ' . \App\Models\Complaint::count() . PHP_EOL;"
```
Expected output:
```
Facilities: 8, Inspections: 12, Complaints: 10
```
