# CSV/JSON Data Analysis & Audit Tool

A Python data-quality auditing and statistics engine designed to parse employee CSV datasets, detect anomalies (missing fields, duplicates, malformed salaries), compute department and salary metrics, and export reports in human-readable and machine-readable formats.

---

## Features

- **Schema Validation:** Verifies existence of required columns (`id`, `name`, `department`, `salary`).
- **Data Quality Auditing:**
  - Identifies rows with empty/blank required attributes.
  - Flags duplicate employee records by ID.
  - Flags non-numeric, negative, or infinite salaries without application crash.
- **Statistical Aggregation:** Computes count, average, min, max salaries on clean data.
- **Department Breakdown:** Analyzes workforce distribution across departments.
- **Automated Reporting:** Generates text summary and structured JSON in `reports/`.

---

## Sample Dataset Schema

The synthetic dataset located at `data/sample_employees.csv` includes:

```csv
id,name,department,salary
EMP101,Alice Johnson,Engineering,85000.00
...
EMP101,Alice Johnson,Engineering,85000.00   # Duplicate ID intentional audit test
EMP111,Kevin Bacon,,55000.00               # Missing Department intentional audit test
EMP112,Laura Croft,Operations,NOT_A_NUMBER # Invalid Salary intentional audit test
```

---

## Running the Analysis

Run on the default sample dataset:

```bash
python main.py
```

Or pass a custom CSV file path:

```bash
python main.py path/to/custom_dataset.csv
```

---

## Generated Reports

Output reports are saved in `reports/`:
- `<dataset>_report.txt`: Formatted human-readable audit table.
- `<dataset>_report.json`: JSON payload containing machine-readable metrics.

---

## Running Automated Tests

Run unit tests via `unittest`:

```bash
python -m unittest discover -s tests
```