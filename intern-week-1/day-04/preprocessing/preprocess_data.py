"""
preprocess_data.py - Data cleaning, feature engineering, and preprocessing pipeline.

Responsibilities:
1. Cleans the raw facility hygiene dataset (duplicates, range limits, data types)
2. Exports sanitized dataset to dataset/processed/facility_hygiene_cleaned.csv
3. Defines reusable scikit-learn ColumnTransformer for preprocessing
4. Implements stratified train/test split preventing data leakage
"""
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer


# Feature definitions (Excluding identifiers like facility_id and dates to prevent data leakage)
NUMERICAL_FEATURES = [
    "cleanliness_score",
    "odor_score",
    "complaints",
    "footfall",
    "hours_since_cleaning"
]

CATEGORICAL_FEATURES = [
    "waste_level"
]

TARGET_COLUMN = "hygiene_risk"


def get_default_paths():
    """Resolve file paths relative to script directory."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    raw_path = os.path.normpath(os.path.join(base_dir, "..", "dataset", "raw", "facility_hygiene_raw.csv"))
    cleaned_path = os.path.normpath(os.path.join(base_dir, "..", "dataset", "processed", "facility_hygiene_cleaned.csv"))
    return raw_path, cleaned_path


def clean_raw_dataset(raw_path: str = None, cleaned_path: str = None) -> pd.DataFrame:
    """
    Cleans raw inspection dataset:
    - Prunes duplicate records
    - Enforces numeric types and valid range constraints
    - Imputes missing values safely
    - Saves clean output
    """
    default_raw, default_clean = get_default_paths()
    raw_path = raw_path or default_raw
    cleaned_path = cleaned_path or default_clean

    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw dataset file not found at: {raw_path}")

    df = pd.read_csv(raw_path)
    initial_count = len(df)

    # 1. Deduplication
    df = df.drop_duplicates(subset=["facility_id", "inspection_date"], keep="first").copy()
    dup_removed = initial_count - len(df)

    # 2. Convert to numeric
    for col in NUMERICAL_FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # 3. Filter invalid out-of-boundary values
    valid_cleanliness = (df["cleanliness_score"].isna()) | ((df["cleanliness_score"] >= 0) & (df["cleanliness_score"] <= 100))
    valid_odor = (df["odor_score"].isna()) | ((df["odor_score"] >= 1) & (df["odor_score"] <= 5))
    valid_complaints = (df["complaints"].isna()) | (df["complaints"] >= 0)
    valid_hours = (df["hours_since_cleaning"].isna()) | (df["hours_since_cleaning"] >= 0)
    valid_waste = df["waste_level"].isna() | df["waste_level"].isin(["Low", "Medium", "High"])

    valid_mask = valid_cleanliness & valid_odor & valid_complaints & valid_hours & valid_waste
    invalid_removed = int((~valid_mask).sum())
    df = df[valid_mask].copy()

    # 4. Impute missing values for clean baseline
    for num_col in NUMERICAL_FEATURES:
        if df[num_col].isna().sum() > 0:
            median_val = df[num_col].median()
            df[num_col] = df[num_col].fillna(median_val)

    if df["waste_level"].isna().sum() > 0:
        mode_val = df["waste_level"].mode()[0]
        df["waste_level"] = df["waste_level"].fillna(mode_val)

    # Ensure integer fields
    df["odor_score"] = df["odor_score"].round().astype(int)
    df["complaints"] = df["complaints"].round().astype(int)
    df["footfall"] = df["footfall"].round().astype(int)

    # Export sanitized dataset
    os.makedirs(os.path.dirname(cleaned_path), exist_ok=True)
    df.to_csv(cleaned_path, index=False, encoding="utf-8")

    print("=" * 65)
    print("      DATA PREPROCESSING & CLEANING SUMMARY")
    print("=" * 65)
    print(f"  Raw records loaded         : {initial_count}")
    print(f"  Duplicates removed         : {dup_removed}")
    print(f"  Invalid records dropped    : {invalid_removed}")
    print(f"  Final clean records saved  : {len(df)}")
    print(f"  Clean dataset saved to     : {os.path.relpath(cleaned_path)}")
    print("=" * 65)
    return df


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs a ColumnTransformer pipeline:
    - Numerical: Median imputation + StandardScaler
    - Categorical: Most-frequent imputation + OneHotEncoder
    """
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERICAL_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES)
        ]
    )
    return preprocessor


def prepare_train_test_split(df: pd.DataFrame = None, test_size: float = 0.2, random_state: int = 42):
    """
    Splits data into stratified train and test sets.
    Returns: X_train, X_test, y_train, y_test
    """
    if df is None:
        _, cleaned_path = get_default_paths()
        df = pd.read_csv(cleaned_path)

    # Features and Target
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES].copy()
    y = df[TARGET_COLUMN].copy()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )
    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    clean_raw_dataset()