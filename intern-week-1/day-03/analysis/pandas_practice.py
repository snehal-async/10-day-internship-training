"""
pandas_practice.py - Core Pandas data manipulation for Data Analysis and AI/ML.

Demonstrates:
1. Series and DataFrames creation
2. Loading CSV data with Pandas
3. Row filtering, column selection, and conditional queries
4. Sorting records (single and multi-column)
5. GroupBy operations and multi-metric aggregation
6. Detecting and handling missing data (NaN)
7. Detecting and removing duplicate records
8. Feature engineering and data transformations
"""
import os
import pandas as pd


def section(title: str):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def demonstrate_series_and_dataframes():
    section("1. SERIES & DATAFRAMES CREATION")

    # Pandas Series (1D labeled array)
    scores = pd.Series([88.5, 92.0, 75.5, 64.0], index=["FAC-1", "FAC-2", "FAC-3", "FAC-4"], name="Cleanliness")
    print("Pandas Series:\n", scores)

    # DataFrame from dictionary of lists
    data = {
        "facility_id": ["FAC-1", "FAC-2", "FAC-3", "FAC-4"],
        "location": ["Terminal-A", "Terminal-B", "Terminal-A", "Central"],
        "cleanliness_score": [88.5, 92.0, 75.5, 64.0],
        "complaints": [2, 0, 5, 8]
    }
    df = pd.DataFrame(data)
    print("\nPandas DataFrame:\n", df)
    print("\nDataFrame Info:")
    print(f"  Shape   : {df.shape}")
    print(f"  Columns : {list(df.columns)}")
    print(f"  Dtypes  :\n{df.dtypes}")


def demonstrate_csv_loading_and_inspection():
    section("2. READING CSV & INSPECTING DATA")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "..", "dataset", "raw", "facility_inspections.csv")
    csv_path = os.path.normpath(csv_path)

    df = pd.read_csv(csv_path)
    print(f"Loaded CSV from: {os.path.basename(csv_path)}")
    print(f"  Total Rows    : {len(df)}")
    print(f"  Total Columns : {len(df.columns)}")
    print("\nFirst 3 Records (head):\n", df.head(3))
    print("\nStatistical Description (describe):\n", df.describe())
    return df


def demonstrate_filtering_and_sorting(df: pd.DataFrame):
    section("3. FILTERING & SORTING")

    # Clean rows with valid numeric cleanliness for demonstration
    numeric_clean = pd.to_numeric(df["cleanliness_score"], errors="coerce")
    valid_mask = numeric_clean.notna() & (numeric_clean <= 100)
    sample_df = df[valid_mask].copy()
    sample_df["cleanliness_score"] = sample_df["cleanliness_score"].astype(float)
    sample_df["complaints"] = pd.to_numeric(sample_df["complaints"], errors="coerce")

    # Filter: High cleanliness (> 85) AND zero or low complaints (<= 2)
    high_perf = sample_df[(sample_df["cleanliness_score"] > 85) & (sample_df["complaints"] <= 2)]
    print(f"High Performing Facilities (>85 score & <=2 complaints): {len(high_perf)} records")
    print(high_perf[["facility_id", "location", "cleanliness_score", "complaints"]].head(4))

    # Sorting by cleanliness descending
    sorted_df = sample_df.sort_values(by="cleanliness_score", ascending=False)
    print("\nTop 3 Cleanest Facilities:\n", sorted_df[["facility_id", "location", "cleanliness_score"]].head(3))


def demonstrate_grouping_and_aggregation(df: pd.DataFrame):
    section("4. GROUPBY & AGGREGATIONS")

    clean_df = df.copy()
    clean_df["cleanliness_score"] = pd.to_numeric(clean_df["cleanliness_score"], errors="coerce")
    clean_df["complaints"] = pd.to_numeric(clean_df["complaints"], errors="coerce")
    clean_df["footfall"] = pd.to_numeric(clean_df["footfall"], errors="coerce")

    # Group by location and aggregate
    grouped = clean_df.groupby("location").agg(
        facility_count=("facility_id", "count"),
        avg_cleanliness=("cleanliness_score", "mean"),
        total_complaints=("complaints", "sum"),
        avg_footfall=("footfall", "mean")
    ).reset_index()

    # Round metrics for readability
    grouped["avg_cleanliness"] = grouped["avg_cleanliness"].round(2)
    grouped["avg_footfall"] = grouped["avg_footfall"].round(0)

    print("Location-Wise Summary Metrics:\n", grouped)


def demonstrate_missing_and_duplicates(df: pd.DataFrame):
    section("5. MISSING VALUES & DUPLICATES")

    # Missing value audit
    null_counts = df.isna().sum()
    print("Null Counts per Column:\n", null_counts[null_counts > 0])

    # Handling missing: fillna demonstration
    df_imputed = df.copy()
    numeric_clean = pd.to_numeric(df_imputed["cleanliness_score"], errors="coerce")
    mean_val = round(numeric_clean.mean(), 1)
    df_imputed["cleanliness_score"] = numeric_clean.fillna(mean_val)
    print(f"\nImputed missing cleanliness_score with mean ({mean_val}). Remaining NaNs: {df_imputed['cleanliness_score'].isna().sum()}")

    # Duplicate detection
    duplicates = df[df.duplicated(keep=False)]
    print(f"\nDuplicate Records Found: {len(duplicates)}")
    if not duplicates.empty:
        print(duplicates[["facility_id", "location", "inspection_date"]])

    deduped = df.drop_duplicates()
    print(f"Shape before deduplication: {df.shape} | Shape after: {deduped.shape}")


def demonstrate_transformations(df: pd.DataFrame):
    section("6. DATA TRANSFORMATION & FEATURE ENGINEERING")

    sample = df.head(6).copy()
    sample["cleanliness_score"] = pd.to_numeric(sample["cleanliness_score"], errors="coerce")

    # Conditional feature engineering using apply/lambda
    def assign_grade(score):
        if pd.isna(score):
            return "Unknown"
        elif score >= 85:
            return "Grade A (Excellent)"
        elif score >= 75:
            return "Grade B (Standard)"
        else:
            return "Grade C (Needs Attention)"

    sample["quality_grade"] = sample["cleanliness_score"].apply(assign_grade)

    # String transformations
    sample["location_code"] = sample["location"].str.upper().str.replace("-", "_")

    print("Transformed DataFrame:\n", sample[["facility_id", "location_code", "cleanliness_score", "quality_grade"]])


def main():
    print("============================================================")
    print("   PANDAS ESSENTIALS FOR DATA SCIENCE & AI/ML - Day 03")
    print("============================================================")
    demonstrate_series_and_dataframes()
    raw_df = demonstrate_csv_loading_and_inspection()
    demonstrate_filtering_and_sorting(raw_df)
    demonstrate_grouping_and_aggregation(raw_df)
    demonstrate_missing_and_duplicates(raw_df)
    demonstrate_transformations(raw_df)
    print("\nPandas practice completed successfully!")


if __name__ == "__main__":
    main()