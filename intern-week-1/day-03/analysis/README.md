# Analysis & Visualizations Module

This module contains data manipulation and statistical visualization scripts for facility inspection datasets using **NumPy**, **Pandas**, and **Matplotlib**.

---

## 1. Module Overview

| Script | Responsibility | Primary Libraries |
|---|---|---|
| `numpy_practice.py` | Vectorization, matrix operations, indexing, and aggregations | `numpy` |
| `pandas_practice.py` | DataFrames, filtering, sorting, group aggregations, and transformations | `pandas` |
| `analyze_data.py` | Production statistical analysis, correlation, report generation, and 5 Matplotlib visualizations | `pandas`, `numpy`, `matplotlib` |

---

## 2. Statistical Analysis & Visualization Engine (`analyze_data.py`)

### Execution:
```bash
python intern-week-1/day-03/analysis/analyze_data.py
```

### Visualizations Generated (`visualizations/`):
1. **`01_avg_cleanliness_by_location.png`:** Bar chart comparing average cleanliness scores across all 5 facility zones.
2. **`02_complaints_by_location.png`:** Bar chart detailing total citizen complaints logged per zone.
3. **`03_cleanliness_score_distribution.png`:** Histogram illustrating score distribution with mean and median markers.
4. **`04_cleanliness_vs_complaints_scatter.png`:** Scatter plot correlating cleanliness score with complaint counts, colored by odor severity with a regression trendline.
5. **`05_inspection_trends_over_time.png`:** Time series tracking daily inspection cleanliness variations across September 2026.

### Reports Generated (`reports/`):
- `facility_analysis_report.json`: Machine-readable statistics and correlation matrix.
- `facility_analysis_report.txt`: Human-readable formatted summary table and data insights.