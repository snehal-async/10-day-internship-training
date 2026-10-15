"""
clean_data.py - Data cleaning pipeline for Facility Inspection records.

Performs:
1. Schema & dimension auditing
2. Missing value detection & documented imputation
3. Duplicate identification & deduplication
4. Invalid data constraint enforcement (scores, negative counts, date format)
5. Outlier detection using the Interquartile Range (IQR) method
6. Exporting sanitized dataset to dataset/cleaned/cleaned_facility_inspections.csv
"""
import os
import sys
import pandas as pd
import numpy as np


class FacilityDataCleaner:
    """Manages the full audit, cleaning, and export lifecycle for facility inspections."""

    def __init__(self, raw_path: str = None, cleaned_path: str = None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if raw_path is None:
            raw_path = os.path.join(base_dir, "..", "dataset", "raw", "facility_inspections.csv")
        if cleaned_path is None:
            cleaned_path = os.path.join(base_dir, "..", "dataset", "cleaned", "cleaned_facility_inspections.csv")

        self.raw_path = os.path.normpath(raw_path)
        self.cleaned_path = os.path.normpath(cleaned_path)
        self.audit_log = {}

    def load_data(self) -> pd.DataFrame:
        """Load raw CSV and perform initial shape inspection."""
        if not os.path.exists(self.raw_path):
            raise FileNotFoundError(f"Raw dataset not found at: {self.raw_path}")

        df = pd.read_csv(self.raw_path)
        self.audit_log["initial_rows"] = len(df)
        self.audit_log["initial_cols"] = len(df.columns)
        return df

    def run_pipeline(self) -> pd.DataFrame:
        """Execute all sequential data cleaning transformations."""
        print("=" * 65)
        print("     FACILITY DATA CLEANING PIPELINE")
        print("=" * 65)

        df = self.load_data()
        print(f"Loaded raw dataset: {os.path.basename(self.raw_path)}")
        print(f"  Initial Records : {self.audit_log['initial_rows']}")
        print(f"  Initial Columns : {self.audit_log['initial_cols']}")

        # Step 1: Detect and Remove Duplicates
        print("\n[Step 1] Auditing Duplicates...")
        # Definition: A duplicate is a record having the identical facility_id and inspection_date
        duplicates = df[df.duplicated(subset=["facility_id", "inspection_date"], keep="first")]
        dup_count = len(duplicates)
        self.audit_log["duplicates_removed"] = dup_count
        df = df.drop_duplicates(subset=["facility_id", "inspection_date"], keep="first").copy()
        print(f"  Removed {dup_count} duplicate record(s). Rows remaining: {len(df)}")

        # Step 2: Parse and Validate Data Types
        print("\n[Step 2] Validating Data Types and Converting...")
        df["cleanliness_score"] = pd.to_numeric(df["cleanliness_score"], errors="coerce")
        df["odor_score"] = pd.to_numeric(df["odor_score"], errors="coerce")
        df["footfall"] = pd.to_numeric(df["footfall"], errors="coerce")
        df["complaints"] = pd.to_numeric(df["complaints"], errors="coerce")
        
        # Date parsing: invalid dates become NaT
        parsed_dates = pd.to_datetime(df["inspection_date"], format="%Y-%m-%d", errors="coerce")
        invalid_dates_count = int(parsed_dates.isna().sum())
        self.audit_log["invalid_dates_removed"] = invalid_dates_count
        if invalid_dates_count > 0:
            print(f"  Found {invalid_dates_count} invalid date string(s). Filtering them out.")
            df = df[parsed_dates.notna()].copy()
            df["inspection_date"] = parsed_dates[parsed_dates.notna()].dt.strftime("%Y-%m-%d")

        # Step 3: Handle Invalid Ranges (Business Rule Constraints)
        print("\n[Step 3] Enforcing Value Boundary Rules...")
        # Cleanliness score must be between 0.0 and 100.0
        invalid_cleanliness = (df["cleanliness_score"] < 0) | (df["cleanliness_score"] > 100)
        # Odor score must be between 1 and 5
        invalid_odor = (df["odor_score"] < 1) | (df["odor_score"] > 5)
        # Complaints cannot be negative
        invalid_complaints = df["complaints"] < 0
        # Footfall cannot be negative
        invalid_footfall = df["footfall"] < 0

        invalid_mask = invalid_cleanliness | invalid_odor | invalid_complaints | invalid_footfall
        invalid_rows_count = int(invalid_mask.sum())
        self.audit_log["invalid_values_removed"] = invalid_rows_count
        print(f"  Removed {invalid_rows_count} record(s) violating range constraints (e.g. score > 100 or negative counts).")
        df = df[~invalid_mask].copy()

        # Step 4: Handle Missing Values (Imputation Strategy)
        print("\n[Step 4] Handling Missing Values...")
        missing_counts = df.isna().sum()
        self.audit_log["missing_before_imputation"] = missing_counts[missing_counts > 0].to_dict()

        # Impute categorical variables with mode
        if df["waste_level"].isna().sum() > 0:
            mode_waste = df["waste_level"].mode()[0]
            df["waste_level"] = df["waste_level"].fillna(mode_waste)
            print(f"  Imputed missing 'waste_level' with mode: '{mode_waste}'")

        if df["water_availability"].isna().sum() > 0:
            mode_water = df["water_availability"].mode()[0]
            df["water_availability"] = df["water_availability"].fillna(mode_water)
            print(f"  Imputed missing 'water_availability' with mode: '{mode_water}'")

        # Impute numeric variables with median (robust against outliers)
        if df["odor_score"].isna().sum() > 0:
            med_odor = int(df["odor_score"].median())
            df["odor_score"] = df["odor_score"].fillna(med_odor)
            print(f"  Imputed missing 'odor_score' with median: {med_odor}")

        if df["cleanliness_score"].isna().sum() > 0:
            med_clean = round(df["cleanliness_score"].median(), 1)
            df["cleanliness_score"] = df["cleanliness_score"].fillna(med_clean)
            print(f"  Imputed missing 'cleanliness_score' with median: {med_clean}")

        # Step 5: Detect Outliers (IQR Method)
        print("\n[Step 5] Auditing Numerical Outliers (IQR Method)...")
        # Evaluate footfall outliers: Q1 - 1.5*IQR to Q3 + 1.5*IQR
        q1 = df["footfall"].quantile(0.25)
        q3 = df["footfall"].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        outliers = df[(df["footfall"] < lower_bound) | (df["footfall"] > upper_bound)]
        outlier_count = len(outliers)
        self.audit_log["footfall_outliers_detected"] = outlier_count
        print(f"  Footfall IQR bounds: [{lower_bound:.1f}, {upper_bound:.1f}]")
        print(f"  Detected {outlier_count} severe footfall outlier(s):")
        for _, row in outliers.iterrows():
            print(f"    - {row['facility_id']} at {row['location']}: Footfall = {row['footfall']:.0f}")

        # Handling outliers: Cap footfall to upper bound (Winsorization) to preserve inspection record
        df["footfall"] = df["footfall"].clip(lower=max(0, lower_bound), upper=upper_bound)
        print(f"  Capped extreme footfall outliers to upper IQR threshold ({upper_bound:.1f}) to preserve record integrity.")

        # Ensure correct final data types
        df["odor_score"] = df["odor_score"].astype(int)
        df["complaints"] = df["complaints"].astype(int)
        df["footfall"] = df["footfall"].round(0).astype(int)

        self.audit_log["final_clean_rows"] = len(df)
        self.audit_log["final_clean_cols"] = len(df.columns)

        # Step 6: Save Cleaned Dataset
        print("\n[Step 6] Saving Cleaned Dataset...")
        os.makedirs(os.path.dirname(self.cleaned_path), exist_ok=True)
        df.to_csv(self.cleaned_path, index=False, encoding="utf-8")
        print(f"  Cleaned dataset saved successfully to: {os.path.relpath(self.cleaned_path)}")

        self.print_summary()
        return df

    def print_summary(self):
        print("\n" + "=" * 65)
        print("          DATA CLEANING SUMMARY REPORT")
        print("=" * 65)
        print(f"  Initial Records           : {self.audit_log.get('initial_rows')}")
        print(f"  Duplicate Records Removed : {self.audit_log.get('duplicates_removed')}")
        print(f"  Invalid Dates Removed     : {self.audit_log.get('invalid_dates_removed')}")
        print(f"  Invalid Values Removed    : {self.audit_log.get('invalid_values_removed')}")
        print(f"  Outliers Adjusted (IQR)   : {self.audit_log.get('footfall_outliers_detected')}")
        print(f"  Final Clean Records Saved : {self.audit_log.get('final_clean_rows')}")
        print("=" * 65)


def main():
    cleaner = FacilityDataCleaner()
    cleaner.run_pipeline()


if __name__ == "__main__":
    main()