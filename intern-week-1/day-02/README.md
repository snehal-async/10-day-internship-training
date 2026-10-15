# Day 02 — Python Development, Management System, Data Analysis & Automated Testing

Welcome to **Day 02** of the 10-Day Intern Technical Training & Domain Assessment Program.

---

## 1. Overview & Objectives

Day 02 advances software engineering and scripting practices by implementing:
- **Core Python Programming:** 7 comprehensive standalone scripts demonstrating syntax, data structures, functional features, comprehensions, robust exception handling, file I/O, and Object-Oriented Programming (OOP).
- **Employee Management System (Python):** An interactive, menu-driven CLI application with domain modeling, input validation, JSON storage persistence with atomic writes and corruption guards, search, filtering, sorting, and summary metrics.
- **CSV Data Quality & Analytics Engine:** An audit and reporting engine that parses structured employee CSV data, detects missing values, duplicate keys, and malformed salary entries without application failure, and outputs both formatted terminal tables and persistent JSON/text reports.
- **Automated Test Suite:** Complete test coverage using Python''s native `unittest` framework with isolated temporary directories and mock fixtures.

---

## 2. Python Concepts Covered

- **Variables & Dynamic Typing:** Primitive types (`int`, `float`, `str`, `bool`), type casting, truthiness, conditional logic.
- **Data Structures:** Lists (mutable sequence), tuples (immutable record), dictionaries (hash map), sets (unique elements), slicing, membership tests.
- **Functions & Scope:** Positional vs. keyword arguments, `*args`, `**kwargs`, lambda functions, closures, LEGB scope resolution.
- **Comprehensions:** List, dictionary, and set comprehensions, conditional filtering, generator expressions for memory efficiency.
- **Exception Handling:** `try` / `except` / `else` / `finally` blocks, raising custom exception classes (`ValidationError`, `StorageError`, `AnalysisError`), chained exceptions with `from`.
- **File I/O & Persistence:** Context managers (`with`), atomic file replacement (`os.replace`), JSON serialization/deserialization, encoding safety (`utf-8`).
- **Object-Oriented Programming:** Classes, `@dataclass`, encapsulation, inheritance, method overriding, properties, class methods (`@classmethod`), magic methods (`__str__`, `__init__`).

---

## 3. Project Structure

```text
intern-week-1/day-02/
├── README.md                           # Main Day 02 comprehensive documentation
├── .gitignore                          # Ignores runtime data/reports while keeping .gitkeep
├── python-exercises/                   # Task A: Python fundamental exercises
│   ├── README.md
│   ├── basics.py
│   ├── data-structures.py
│   ├── functions.py
│   ├── comprehensions.py
│   ├── exception-handling.py
│   ├── file-handling.py
│   ├── object-oriented-programming.py
│   └── run-exercises.py                # Batch test runner for all 7 exercises
├── management-system/                  # Task B: Employee Management CLI System
│   ├── README.md
│   ├── main.py                         # CLI menu and presentation
│   ├── models.py                       # Employee domain model (@dataclass)
│   ├── validators.py                   # Data validation functions & ValidationError
│   ├── storage.py                      # JSON persistence with corruption safety
│   ├── employee_service.py             # Business logic layer (CRUD, filter, sort, stats)
│   ├── requirements.txt                # Python dependencies (Standard library only)
│   ├── data/
│   │   └── .gitkeep
│   └── tests/                          # Automated unit tests
│       ├── test_models.py
│       ├── test_validators.py
│       ├── test_storage.py
│       └── test_employee_service.py
└── csv-analysis/                       # Task C: CSV Data Analysis & Auditing
    ├── README.md
    ├── main.py                         # CLI report driver
    ├── analyzer.py                     # Analysis engine & report generators
    ├── data/
    │   └── sample_employees.csv        # Synthetic dataset with test anomalies
    ├── reports/
    │   └── .gitkeep                    # Generated reports (.json / .txt)
    └── tests/
        └── test_analyzer.py            # Unit tests for audit logic & reporting
```

---

## 4. Prerequisites & Environment Setup

- **Python Version Detected:** Python 3.12.x (Anaconda distribution on Windows 11)
- **External Dependencies:** Zero! Built strictly on Python''s standard library (`dataclasses`, `json`, `csv`, `math`, `os`, `sys`, `unittest`, `tempfile`, `shutil`).

### (Optional) Virtual Environment Creation
```bash
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate
```

---

## 5. Execution Instructions

### A. Run Python Exercises
```bash
# Run all exercises in sequence:
python intern-week-1/day-02/python-exercises/run-exercises.py

# Or run individual exercises:
python intern-week-1/day-02/python-exercises/basics.py
python intern-week-1/day-02/python-exercises/data-structures.py
python intern-week-1/day-02/python-exercises/functions.py
python intern-week-1/day-02/python-exercises/comprehensions.py
python intern-week-1/day-02/python-exercises/exception-handling.py
python intern-week-1/day-02/python-exercises/file-handling.py
python intern-week-1/day-02/python-exercises/object-oriented-programming.py
```

### B. Run Employee Management System
```bash
python intern-week-1/day-02/management-system/main.py
```

#### Available Operations:
1. **Add Employee:** Prompt for ID, Name, Department, and Salary with validation.
2. **Update Employee:** Modify specific fields of an existing ID.
3. **Delete Employee:** Remove record after explicit confirmation.
4. **Search:** Case-insensitive search by ID or Name substring.
5. **Filter:** Case-insensitive filter by department name.
6. **Sort:** Ascending / descending sort by Name or Salary.
7. **Statistics:** Displays count, average, min, max salaries, and department distributions.
8. **List All:** Render all records in an ASCII table.
9. **Exit:** Clean exit.

### C. Run CSV Data Analysis & Auditing
```bash
# Run with default synthetic sample dataset:
python intern-week-1/day-02/csv-analysis/main.py

# Or pass a custom dataset path:
python intern-week-1/day-02/csv-analysis/main.py path/to/dataset.csv
```

Outputs are automatically generated in `intern-week-1/day-02/csv-analysis/reports/`:
- `sample_employees_report.txt`
- `sample_employees_report.json`

---

## 6. Automated Test Results

Run all test suites using `unittest`:

```bash
# Management System Tests (22 tests)
python -m unittest discover -s intern-week-1/day-02/management-system/tests -v

# CSV Analysis Tests (7 tests)
python -m unittest discover -s intern-week-1/day-02/csv-analysis/tests -v
```

### Actual Test Suite Execution Log:
```text
test_add_duplicate_employee_id_rejected ... ok
test_add_employee_success ... ok
test_delete_employee ... ok
test_filter_by_department_case_insensitive ... ok
test_search_by_id_and_name_case_insensitive ... ok
test_sort_by_name_and_salary ... ok
test_statistics_normal_and_empty ... ok
test_update_existing_employee ... ok
test_update_nonexistent_employee_raises ... ok
test_employee_creation ... ok
test_from_dict ... ok
test_str_representation ... ok
test_to_dict ... ok
test_malformed_json_raises_error_without_overwriting ... ok
test_missing_file_returns_empty_list ... ok
test_save_and_load_persistence ... ok
test_blank_department_rejected ... ok
test_blank_id_rejected ... ok
test_blank_name_rejected ... ok
test_invalid_salary_rejected ... ok
test_valid_fields ... ok
test_validate_employee_data_batch ... ok
----------------------------------------------------------------------
Ran 22 tests in 0.064s - OK

test_clean_dataset_analysis ... ok
test_duplicate_detection ... ok
test_empty_csv_file ... ok
test_invalid_salary_detection ... ok
test_missing_required_columns_raises_error ... ok
test_missing_required_values_detection ... ok
test_report_generation ... ok
----------------------------------------------------------------------
Ran 7 tests in 0.028s - OK

Batch Exercises Runner:
Ran 7 exercises in sequence (basics, data-structures, functions, comprehensions,
exception-handling, file-handling, object-oriented-programming) - 7/7 PASS.
Total Automated Tests: 36/36 passed (100% success rate).
```

---

## 7. Design Decisions & Engineering Tradeoffs

1. **Separation of Concerns:** Business logic (`employee_service.py`) is decoupled from CLI interaction (`main.py`) and data persistence (`storage.py`), enabling straightforward unit testing without mocking stdin/stdout.
2. **Safe Persistence & Corruption Defense:** When writing to disk, a temporary `.tmp` file is populated and atomically replaced (`os.replace`). If an existing JSON file is corrupted, the application halts with a detailed error without overwriting or destroying the corrupted file.
3. **Resilient Data Quality Pipeline:** The CSV parser isolates malformed rows (missing fields, duplicate keys, non-numeric salaries) into an audit log rather than aborting prematurely, ensuring valid records can still be analyzed.
4. **Zero Third-Party Dependencies:** Everything is implemented using Python standard libraries to ensure seamless execution on any developer machine or grading environment.

---

## 8. Challenges Encountered & Resolutions

- **Challenge: Windows Unicode Escape SyntaxError:** When Windows paths containing `\Users` were placed inside regular string docstrings in Python 3.12, Python attempted to parse `\U` as a 32-bit Unicode escape sequence.
  - *Resolution:* Replaced hardcoded Windows file paths with `python <script>` invocation instructions across all exercise docstrings.
- **Challenge: Test Isolation & State Leakage:** Tests modifying file storage could leave residual `.json` files or overwrite genuine user data.
  - *Resolution:* Utilized `tempfile.mkdtemp()` in `setUp()` and `shutil.rmtree()` in `tearDown()` across all test fixtures to guarantee test isolation.