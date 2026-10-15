# Employee Management System (Python Edition)

A modular, command-line Employee Management System written in Python featuring robust input validation, JSON persistence, comprehensive search/filtering/sorting capabilities, and department statistics.

---

## Features

1. **Add Employee:** Create records with unique IDs, validated names, departments, and positive finite salaries.
2. **Update Employee:** Modify fields of an existing employee by ID, preserving unedited fields.
3. **Delete Employee:** Safely remove an employee after explicit user confirmation.
4. **Search Employees:** Case-insensitive lookup across employee ID and name substrings.
5. **Filter by Department:** Filter records by department name (case-insensitive).
6. **Sort Records:** Sort by Name (A-Z / Z-A) or Salary (Low-High / High-Low).
7. **Aggregate Statistics:** View total headcounts, average salary, minimum/maximum salaries, and department distributions.
8. **List All:** View all records in a cleanly formatted ASCII table.
9. **JSON Persistence:** Automatic serialization to `data/employees.json` using atomic write patterns.
10. **Data Protection:** Malformed JSON files are detected and preserved without silent overwrite.

---

## Architecture & Module Structure

```text
management-system/
├── main.py              # CLI menu, table rendering, user interaction
├── models.py            # Employee dataclass with serialization methods
├── validators.py        # Field validators and custom ValidationError
├── storage.py           # Persistent JSON storage with corruption guards
├── employee_service.py  # Business logic layer (CRUD, filtering, sorting, stats)
├── requirements.txt     # Dependency specification (Standard Library only)
├── data/
│   └── .gitkeep         # Tracks data directory while ignoring runtime files
└── tests/               # Automated unit tests
    ├── test_models.py
    ├── test_validators.py
    ├── test_storage.py
    └── test_employee_service.py
```

---

## Data Model

An Employee record contains:
- **`id`** (`str`): Unique identifier (e.g. `EMP001`).
- **`name`** (`str`): Non-blank full name.
- **`department`** (`str`): Department designation.
- **`salary`** (`float`): Positive finite numeric value ($).

---

## Running the Application

Execute from the `management-system` folder:

```bash
python main.py
```

Or from the repository root:

```bash
python intern-week-1/day-02/management-system/main.py
```

---

## Automated Tests

Unit tests are built using Python''s native `unittest` framework:

```bash
python -m unittest discover -s intern-week-1/day-02/management-system/tests
```