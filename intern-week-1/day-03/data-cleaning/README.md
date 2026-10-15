# Facility Data Cleaning Workflow

This module implements an automated, reproducible data cleansing pipeline for facility inspection logs.

---

## 1. Cleaning Objectives & Pipeline Steps

The script `clean_data.py` executes 6 sequential cleaning stages:

1. **Duplicate Pruning:**
   - **Definition:** Records matching on `[facility_id, inspection_date]` are treated as duplicate audit submissions.
   - **Action:** First occurrence is preserved; subsequent duplicates are removed.
2. **Schema & Date Parsing:**
   - Standardizes data types into numeric and datetime objects.
   - Detects malformed/invalid date formats (e.g., `2026-99-99`) and discards corrupted rows.
3. **Range & Boundary Constraint Enforcement:**
   - `cleanliness_score` must reside within $[0.0, 100.0]$.
   - `odor_score` must reside within $[1, 5]$.
   - `complaints` and `footfall` must be non-negative integers ($\ge 0$).
   - Rows violating physical bounds are pruned.
4. **Missing Value Imputation Strategy:**
   - Categorical fields (`waste_level`, `water_availability`) are imputed with the column **mode**.
   - Numerical metrics (`odor_score`, `cleanliness_score`) are imputed with the column **median** to minimize skew.
5. **Outlier Detection via IQR Method:**
   - Uses the Interquartile Range ($IQR = Q_3 - Q_1$).
   - Bounds: $[Q_1 - 1.5 \times IQR, Q_3 + 1.5 \times IQR]$.
   - Extreme footfall values are capped to the upper threshold (Winsorization) to retain operational history without distorting statistical variance.
6. **Persistence:**
   - Outputs cleaned records to `dataset/cleaned/cleaned_facility_inspections.csv` without modifying the original raw CSV.

---

## 2. Execution Instructions

Execute the cleaning pipeline from the workspace root:

```bash
python intern-week-1/day-03/data-cleaning/clean_data.py
```

### Expected Output Summary:
```text
=================================================================
          DATA CLEANING SUMMARY REPORT
=================================================================
  Initial Records           : 130
  Duplicate Records Removed : 2
  Invalid Dates Removed     : 1
  Invalid Values Removed    : 2
  Outliers Adjusted (IQR)   : 1
  Final Clean Records Saved : 125
=================================================================
```