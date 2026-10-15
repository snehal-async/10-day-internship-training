# NumPy & Pandas Practice Modules

This folder contains foundational scripts demonstrating essential data science and machine learning data manipulation techniques using **NumPy** and **Pandas**.

---

## 1. NumPy Practice (`numpy_practice.py`)

Demonstrates vectorization, multi-dimensional array manipulation, and linear algebra fundamentals:
- **Array Initialization:** 1D/2D arrays, `zeros`, `ones`, `arange`, and `linspace`.
- **Dimensions & Properties:** Inspecting `.shape`, `.ndim`, `.size`, and `.dtype`.
- **Reshaping:** Reorganizing dimensions with `.reshape()` and flattening to 1D.
- **Indexing & Slicing:** Element access, multi-row/column slices, and boolean masking without explicit loops.
- **Arithmetic & Broadcasting:** Element-wise math and dimension expansion across scalars and vectors.
- **Statistical Aggregations:** `sum()`, `mean()`, `std()`, `min()`, `max()`, and multi-axis operations (`axis=0`, `axis=1`).

### How to Run:
```bash
python intern-week-1/day-03/analysis/numpy_practice.py
```

---

## 2. Pandas Practice (`pandas_practice.py`)

Demonstrates tabular data management, cleaning primitives, and exploratory data analysis (EDA):
- **Data Structures:** Instantiating `pd.Series` and `pd.DataFrame`.
- **CSV Ingestion & Inspection:** Loading raw CSV files and examining schema (`.head()`, `.info()`, `.describe()`).
- **Filtering & Slicing:** Applying compound boolean conditions and query masks.
- **Sorting:** Multi-column ordering (`.sort_values()`).
- **Grouping & Aggregation:** `.groupby()` with multi-metric aggregation (`count`, `mean`, `sum`).
- **Missing & Duplicate Auditing:** Inspecting `.isna()`, imputation with `.fillna()`, detecting duplicates with `.duplicated()`, and pruning via `.drop_duplicates()`.
- **Feature Engineering:** Applying conditional classification rules with `.apply()` and vectorized string manipulation.

### How to Run:
```bash
python intern-week-1/day-03/analysis/pandas_practice.py
```