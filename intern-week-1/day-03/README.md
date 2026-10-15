# Day 03: Data Analysis & Python for AI/ML — Facility Inspection Analysis

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)  
**Submission Folder:** `intern-week-1/day-03/`

---

## 1. Project Title
**Urban Facility Hygiene & Infrastructure Audit: Automated Cleansing, Exploratory Analytics, and Visual Diagnostics**

---

## 2. Project Overview
Day 03 centers on real-world data science, machine learning data preparation, and visual analytics using Python''s core analytical stack: **NumPy**, **Pandas**, and **Matplotlib**.

This project establishes an automated pipeline that audits facility maintenance logs, detects data quality flaws (missing fields, duplicate audits, range violations, extreme outliers), cleans the dataset through documented imputation and boundary clipping rules, and computes statistical summaries. Finally, the system automatically generates five publication-quality diagnostic charts and dual-format reports (JSON and human-readable text).

---

## 3. Problem Statement
Public and commercial facilities (terminals, concourses, transit hubs) generate continuous inspection streams monitoring hygiene, waste accumulation, water availability, and visitor complaints. However, raw sensor and human-entered logs often suffer from:
- Duplicate survey transmissions from field tablets.
- Inconsistent score ranges (e.g., scores > 100 or negative complaints).
- Missing values due to sensor dropouts or skipped questionnaire fields.
- Severe crowdsource reporting outliers distorting averages.

Without a structured, reproducible data cleaning and exploratory analysis pipeline, maintenance supervisors cannot accurately prioritize facility interventions or identify chronic infrastructure failure zones.

---

## 4. Learning Objectives
1. **NumPy Fundamentals:** Master multi-dimensional array operations, array slicing, vectorized arithmetic, broadcasting mechanics, and multi-axis statistical reductions (`axis=0`, `axis=1`).
2. **Pandas Data Wrangling:** Load CSV streams, perform schema validation, filter records with complex boolean conditions, compute multi-metric group aggregations (`.groupby()`), and implement feature engineering.
3. **Data Quality & Sanitization:** Implement reproducible outlier detection via the Interquartile Range (IQR) technique, handle duplicates, and execute context-aware imputation.
4. **Matplotlib Visual Storytelling:** Render publication-grade figures, configure scales, manage colorbars, render regression trendlines, and export high-DPI raster graphics without interactive display dependencies (`Agg` backend).
5. **Reproducible Engineering:** Build decoupled, modular scripts runnable across any standard operating environment without hardcoded local machine paths.

---

## 5. Technology Stack
- **Language:** Python 3.12+ / 3.13+ (Tested on Windows 11)
- **Scientific Computing:** `NumPy` ($\ge 1.26$)
- **Tabular Analytics:** `Pandas` ($\ge 2.0$)
- **Data Visualization:** `Matplotlib` ($\ge 3.8$, headless `Agg` backend)
- **Standard Library:** `csv`, `json`, `os`, `sys`, `math`, `random`

---

## 6. Project Structure

```text
intern-week-1/day-03/
├── README.md                           # Master Day 03 architectural & findings documentation
├── requirements.txt                    # Project dependency specification
├── dataset/
│   ├── raw/
│   │   └── facility_inspections.csv   # Synthetic raw dataset with intentional anomalies (130 records)
│   └── cleaned/
│       ├── .gitkeep
│       └── cleaned_facility_inspections.csv # Sanitized dataset (125 records)
├── data-cleaning/
│   ├── clean_data.py                  # End-to-end data auditing, cleaning & IQR pipeline
│   └── README.md                      # Detailed data cleaning workflow documentation
├── analysis/
│   ├── analyze_data.py                # Statistics computation & chart generation script
│   ├── numpy_practice.py              # NumPy fundamentals demonstration module
│   ├── pandas_practice.py             # Pandas manipulation & transformation module
│   └── README.md                      # Practice scripts documentation
├── visualizations/
│   ├── .gitkeep
│   ├── 01_avg_cleanliness_by_location.png       # Bar chart: Location vs Average Cleanliness
│   ├── 02_complaints_by_location.png            # Bar chart: Location vs Cumulative Complaints
│   ├── 03_cleanliness_score_distribution.png    # Histogram: Cleanliness distribution with Mean/Median
│   ├── 04_cleanliness_vs_complaints_scatter.png # Scatter: Cleanliness vs Complaints with Trendline
│   └── 05_inspection_trends_over_time.png       # Line: Daily cleanliness variations (Sept 2026)
└── reports/
    ├── .gitkeep
    ├── facility_analysis_report.json            # Machine-readable analytics & correlations
    └── facility_analysis_report.txt             # Formatted human-readable audit summary
```

---

## 7. Dataset Description & Synthetic Data Disclosure

> **Transparency Disclosure:** The dataset located at `dataset/raw/facility_inspections.csv` is a **reproducible, synthetic dataset** designed specifically to test, benchmark, and demonstrate data auditing, cleansing, and analytical techniques. It does not represent real personal data.

### Schema:
| Column | Type | Description | Valid Domain |
|---|---|---|---|
| `facility_id` | String | Unique inspection facility code | Format: `FAC-xxx` |
| `location` | String | Facility zone | `Terminal-A`, `Terminal-B`, `Central-Concourse`, `North-Gate`, `South-Hub` |
| `cleanliness_score` | Float | Hygiene audit rating | $0.0$ to $100.0$ |
| `odor_score` | Integer | Qualitative smell rating | $1$ (Fresh) to $5$ (Severe) |
| `waste_level` | Categorical | Waste bin fullness | `Low`, `Medium`, `High` |
| `water_availability`| Categorical | Running water access | `Yes`, `No` |
| `footfall` | Integer | Daily pedestrian count | Realistic: $400$ to $5,000$ |
| `complaints` | Integer | Logged visitor grievances | Non-negative integer ($\ge 0$) |
| `inspection_date` | Date | Date of physical audit | ISO 8601 (`YYYY-MM-DD`) |

---

## 8. Data-Cleaning Process

The cleaning pipeline (`clean_data.py`) executes 6 structured stages:

1. **Duplicate Pruning:** Identifies duplicate inspections submitted on the same day for the same facility (`['facility_id', 'inspection_date']`). Retains first record, pruning 2 duplicates.
2. **Schema & Date Parsing:** Enforces strict ISO date formats (`%Y-%m-%d`). Discards corrupted non-date rows (e.g. `2026-99-99`).
3. **Range & Boundary Constraint Enforcement:**
   - Filters out out-of-bound cleanliness ratings (e.g., `135.0`).
   - Filters out impossible negative grievance numbers (e.g., `-4`).
4. **Missing Value Imputation:**
   - `waste_level` and `water_availability` are imputed using the **mode**.
   - `odor_score` and `cleanliness_score` are imputed using the **median** to prevent skew.
5. **Outlier Detection via IQR Method:**
   - Evaluates `footfall` using: $IQR = Q_3 - Q_1 = 2,833.8 - 1,429.5 = 1,404.3$.
   - Upper fence: $Q_3 + 1.5 \times IQR = 4,954.0$.
   - One extreme crowdsource anomaly (`48,500` footfall) was detected and capped (Winsorized) to $4,954$, retaining the inspection event without skewing variance.
6. **Separation of Concerns:** Raw data is untouched; sanitized records are written to `dataset/cleaned/cleaned_facility_inspections.csv`.

---

## 9. Analysis Methods and Key Metrics

### Metric Summary (from Cleaned Dataset, $N = 125$ records):
- **Mean Cleanliness Score:** $79.51 \pm 10.35$ (Range: $62.1$ to $96.2$)
- **Mean Odor Score:** $2.58$ (Scale 1–5)
- **Cumulative Footfall:** $268,850$ visitors (Mean: $2,150.8$ / facility)
- **Total Complaints:** $544$ grievances (Mean: $4.35$ / facility)

### Location Breakdown:
| Location | Clean Records | Avg Cleanliness | Total Complaints | Avg Footfall |
|---|---|---|---|---|
| **Central-Concourse** | 20 | **81.8** | 61 | 2,046 |
| **South-Hub** | 31 | 80.8 | 136 | **2,353** |
| **North-Gate** | 27 | 79.5 | 108 | 2,043 |
| **Terminal-A** | 26 | 78.1 | 121 | 2,020 |
| **Terminal-B** | 21 | 77.2 | 118 | 2,253 |

---

## 10. Description of the Five Visualizations

All generated visualizations are exported to `visualizations/`:

1. **`01_avg_cleanliness_by_location.png` (Bar Chart):**
   - Highlights cleanliness scores across zones. Central-Concourse leads at 81.8, while Terminal-B lags at 77.2.
2. **`02_complaints_by_location.png` (Bar Chart):**
   - Renders total visitor complaints. South-Hub (136) and Terminal-A (121) accumulate the highest complaint volumes.
3. **`03_cleanliness_score_distribution.png` (Histogram):**
   - Displays the frequency distribution of facility hygiene scores, with dotted vertical reference lines indicating Mean (79.5) and Median (81.2).
4. **`04_cleanliness_vs_complaints_scatter.png` (Scatter Plot):**
   - Maps cleanliness score against visitor complaints, with markers colored by qualitative odor severity (Viridis colormap) and a fitted linear trendline (Slope: -0.27).
5. **`05_inspection_trends_over_time.png` (Line Chart):**
   - Tracks daily average hygiene ratings across September 2026, comparing daily scores against the monthly baseline average.

---

## 11. Key Data-Driven Insights

Based on verified empirical metrics computed from the dataset:

1. **Strong Negative Correlation Between Cleanliness and Grievances ($r = -0.749$):**
   Visitor complaints are inversely correlated with the cleanliness score. Facilities scoring above $85.0$ averaged under $1.5$ complaints, whereas facilities scoring below $72.0$ averaged $8.2$ complaints.
2. **Odor Severity Directly Tracks Hygiene Deficits ($r = -0.862$):**
   High odor scores ($4$ and $5$) almost exclusively appear in facilities with cleanliness ratings below $75.0$ and waste levels marked as `High`, pointing to trash clearance delays as the root driver of odor complaints.
3. **High Footfall Magnifies Maintenance Vulnerability:**
   While footfall alone does not cause complaints ($r = -0.104$), zones with higher visitor density (`South-Hub` and `Terminal-B`) experience rapid degradation when water availability is interrupted, producing concentrated complaint spikes.

---

## 12. Installation Instructions

Ensure Python 3.10+ is available on your machine.

```powershell
# Navigate to Day 03 folder
cd intern-week-1/day-03

# (Optional) Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install required dependencies
python -m pip install -r requirements.txt
```

---

## 13. How to Run Each Script

### A. Run NumPy & Pandas Practice Modules
```powershell
# Run NumPy practice
python intern-week-1/day-03/analysis/numpy_practice.py

# Run Pandas practice
python intern-week-1/day-03/analysis/pandas_practice.py
```

### B. Execute Data Cleaning Pipeline
```powershell
python intern-week-1/day-03/data-cleaning/clean_data.py
```

### C. Execute Data Analysis & Chart Generation
```powershell
python intern-week-1/day-03/analysis/analyze_data.py
```

---

## 14. Expected Outputs and Locations

| Artifact | File Path | Format / Content |
|---|---|---|
| Raw Dataset | `dataset/raw/facility_inspections.csv` | Original CSV (130 records) |
| Cleaned Dataset | `dataset/cleaned/cleaned_facility_inspections.csv` | Sanitized CSV (125 records) |
| Chart 1 | `visualizations/01_avg_cleanliness_by_location.png` | Bar Chart (Cleanliness by Location) |
| Chart 2 | `visualizations/02_complaints_by_location.png` | Bar Chart (Complaints by Location) |
| Chart 3 | `visualizations/03_cleanliness_score_distribution.png` | Histogram (Score Distribution) |
| Chart 4 | `visualizations/04_cleanliness_vs_complaints_scatter.png` | Scatter Plot (Cleanliness vs Complaints) |
| Chart 5 | `visualizations/05_inspection_trends_over_time.png` | Line Chart (September Inspection Timeline) |
| Analytical Report | `reports/facility_analysis_report.json` | Structured JSON Metrics & Correlations |
| Summary Report | `reports/facility_analysis_report.txt` | Formatted Text Audit Table |

---

## 15. Problems Encountered & Resolutions

1. **Matplotlib GUI Headless Display Warning:**
   - *Problem:* In non-interactive or remote shells, default GUI backends (such as TkAgg or Qt5Agg) fail or throw threading warnings when rendering charts.
   - *Resolution:* Configured `matplotlib.use("Agg")` prior to importing `pyplot`, ensuring thread-safe, pure raster generation directly to disk.
2. **Extreme Outlier Skewing Statistical Charts:**
   - *Problem:* A severe crowdsource recording error of $48,500$ footfall distorted the histogram and compressed axis scales.
   - *Resolution:* Implemented Interquartile Range (IQR) Winsorization to cap extreme outliers at $Q_3 + 1.5 \times IQR$ ($4,954$), preserving the observation while stabilizing visual distributions.
3. **Cross-Platform Path Resolution:**
   - *Problem:* Hardcoding Windows-style backslashes breaks compatibility across developer workstations.
   - *Resolution:* Resolved all paths relative to `__file__` using `os.path.normpath` and `os.path.join`.

---

## 16. Limitations
- The dataset represents cross-sectional daily snapshots rather than continuous real-time IoT sensor telemetry.
- Imputation via median/mode assumes missing data is Missing Completely at Random (MCAR), which may require model-based imputation (e.g., KNNImputer) in larger, complex industrial settings.

---

## 17. Possible Future Improvements
- Implement automated anomaly alerts triggering webhook notifications when facility cleanliness drops below $70.0$.
- Build an interactive Streamlit or Dash web dashboard for real-time facility telemetry monitoring.
- Introduce predictive machine learning models (e.g., Random Forest Regression) to forecast expected complaints based on scheduled foot traffic and water availability.