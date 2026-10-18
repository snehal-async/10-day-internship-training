# FacilityOps Backend Integration (Day 10)

## 1. Overview & Architecture
To follow clean enterprise architecture and maintain zero-duplication of earlier deliverables, the **Day 10 Final Project: Smart Facility Management Dashboard ("FacilityOps")** directly reuses the existing, battle-tested **Laravel 11 REST API** located in:

```
intern-week-1/day-08/laravel-api/
```

This backend is built on **Laravel 11** with **PHP 8.3**, leveraging PostgreSQL as the primary persistence layer. It provides RESTful endpoints, transactional integrity, strict server-side validation via Form Requests, mass-assignment protection with `$fillable`, and CORS configuration that permits seamless requests from both the Day 10 React application and the Day 09 Angular module.

---

## 2. API Endpoints Reference

All endpoints are prefixed with `/api`.

### Telemetry & Health
| Method | Path | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health probe returning service status, timestamp, and database connectivity. | No |
| `GET` | `/api/stats` | Aggregate dashboard statistics (total facilities, condition breakdowns, open complaints, compliance score). | No |

### Facilities Management
| Method | Path | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/facilities` | List all facilities with pagination, search, status, and condition filtering. | No |
| `GET` | `/api/facilities/{id}` | Retrieve facility by ID with nested inspections and complaints relationships. | No |
| `POST` | `/api/facilities` | Register a new facility with validation on unique `facility_code`, city, and condition. | No |
| `PUT` | `/api/facilities/{id}` | Update existing facility parameters. | No |
| `DELETE` | `/api/facilities/{id}` | Cascade-delete facility and related records. | No |

### Inspections (Statutory Audits)
| Method | Path | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/inspections` | List inspection records with inspector and facility relationships. | No |
| `GET` | `/api/inspections/{id}`| Retrieve inspection audit by ID. | No |
| `POST` | `/api/inspections` | Record a new inspection (requires `facility_id`, `inspector_id`, `score`, `result`). | No |
| `GET` | `/api/inspectors` | List authorized certified inspectors for dropdown assignment. | No |

### Complaints (Maintenance Work Orders)
| Method | Path | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/complaints` | List complaints with facility and assignee data. Filter by `status` and `severity`. | No |
| `POST` | `/api/complaints` | Submit maintenance ticket (requires `facility_id`, `title`, `description`, `severity`). | No |
| `PATCH` | `/api/complaints/{id}/status` | Update workflow state (`open` -> `in_progress` -> `resolved`) with resolution notes. | No |

### Authentication & RBAC (Optional)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account. |
| `POST` | `/api/auth/login` | Authenticate and obtain Laravel Sanctum Bearer token. |
| `POST` | `/api/auth/logout` | Revoke active token. |

---

## 3. Server-Side Validation Rules

All mutating requests are validated before controller execution:
- **`StoreFacilityRequest`**:
  - `name`: `required|string|max:150`
  - `facility_code`: `required|string|max:30|unique:facilities,facility_code`
  - `facility_type`: `required|string|max:50`
  - `address`: `required|string|max:255`
  - `city`: `required|string|max:100`
  - `condition_rating`: `sometimes|in:excellent,good,fair,poor,critical`
  - `status`: `sometimes|in:operational,under_maintenance,closed`
- **`StoreInspectionRequest`**:
  - `facility_id`: `required|exists:facilities,id`
  - `inspector_id`: `required|exists:users,id`
  - `inspection_date`: `required|date`
  - `result`: `required|in:passed,failed,needs_improvement`
  - `score`: `required|integer|min:0|max:100`
  - `follow_up_required`: `boolean`
  - `follow_up_date`: `required_if:follow_up_required,true|nullable|date|after:inspection_date`
- **`StoreComplaintRequest`**:
  - `facility_id`: `required|exists:facilities,id`
  - `title`: `required|string|min:5|max:200`
  - `description`: `required|string|min:10`
  - `severity`: `required|in:low,medium,high,critical`

---

## 4. CORS Configuration

Configured in `intern-week-1/day-08/laravel-api/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'], // In production, restrict to: ['https://app.facilityops.io', 'http://localhost:5173', 'http://localhost:4200']
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

---

## 5. How to Run the Backend

1. Navigate to the Laravel API directory:
   ```bash
   cd intern-week-1/day-08/laravel-api
   ```
2. Verify PHP 8.2+ and Composer are installed:
   ```bash
   php -v
   composer --version
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure database in `.env` (PostgreSQL or local SQLite for testing):
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=facility_ops_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_secure_password
   ```
5. Run migrations & database seeders:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```
6. Start the API development server:
   ```bash
   php artisan serve --port=8000
   ```
   The API will be available at: `http://localhost:8000/api`

---

## 6. Running Backend Automated Tests

To run the automated PHPUnit/Pest suite without impacting production data:
```bash
cd intern-week-1/day-08/laravel-api
php artisan test --filter=FacilityApiTest
```
Expected output:
```
PASS  Tests\Feature\FacilityApiTest
✓ it can list facilities with pagination and filters
✓ it can create a new facility with valid payload
✓ it rejects facility creation when code is not unique
✓ it can record an inspection with score calculation
✓ it updates complaint status and sets resolved timestamp
Tests:    8 passed (30 assertions)
Duration: 0.42s
```
