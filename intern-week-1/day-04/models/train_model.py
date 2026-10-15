"""
train_model.py - Model training, hyperparameter validation, and pipeline persistence.

Performs:
1. Loads processed dataset and executes stratified train/test split
2. Builds complete end-to-end pipelines (Preprocessor + Classifier)
3. Trains Logistic Regression and Random Forest Classifiers
4. Evaluates performance on held-out test data
5. Saves the winning pipeline to models/saved_models/hygiene_risk_model.joblib
6. Exports model comparison summary to evaluation/model_comparison.csv
7. Generates EDA visualization charts (class distribution, correlation heatmap)
"""
import os
import sys
import joblib
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.pipeline import Pipeline

# Import preprocessing helpers
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "preprocessing")))
from preprocess_data import build_preprocessor, prepare_train_test_split, NUMERICAL_FEATURES, TARGET_COLUMN


def generate_eda_charts(df: pd.DataFrame, output_dir: str):
    """Generate exploratory data analysis visualizations."""
    os.makedirs(output_dir, exist_ok=True)
    palette = ["#43A047", "#FB8C00", "#E53935"]

    # 1. Target Class Distribution
    fig, ax = plt.subplots(figsize=(7, 4.5))
    order = ["Low", "Medium", "High"]
    counts = df[TARGET_COLUMN].value_counts().reindex(order)
    bars = ax.bar(counts.index, counts.values, color=palette, edgecolor="#212121", alpha=0.85)
    ax.set_title("Hygiene Risk Class Distribution (Target)", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Hygiene Risk Level", fontsize=11, labelpad=8)
    ax.set_ylabel("Number of Facilities", fontsize=11, labelpad=8)
    ax.grid(axis="y", linestyle="--", alpha=0.6)

    for bar in bars:
        h = bar.get_height()
        ax.annotate(f"{int(h)} ({h/len(df)*100:.1f}%)",
                    xy=(bar.get_x() + bar.get_width() / 2, h),
                    xytext=(0, 4), textcoords="offset points",
                    ha="center", va="bottom", fontsize=10, fontweight="bold")

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "class_distribution.png"), dpi=200)
    plt.close(fig)

    # 2. Correlation Heatmap
    fig, ax = plt.subplots(figsize=(7.5, 5.5))
    corr_df = df[NUMERICAL_FEATURES].corr()
    sns.heatmap(corr_df, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.8, ax=ax, cbar_kws={"shrink": 0.8})
    ax.set_title("Feature Correlation Matrix (Numerical)", fontsize=13, fontweight="bold", pad=12)
    plt.xticks(rotation=25, ha="right")
    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "correlation_heatmap.png"), dpi=200)
    plt.close(fig)


def train_and_evaluate_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    cleaned_path = os.path.normpath(os.path.join(base_dir, "..", "dataset", "processed", "facility_hygiene_cleaned.csv"))
    models_dir = os.path.normpath(os.path.join(base_dir, "saved_models"))
    eval_dir = os.path.normpath(os.path.join(base_dir, "..", "evaluation"))
    eda_dir = os.path.normpath(os.path.join(base_dir, "..", "reports", "eda_charts"))

    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(eval_dir, exist_ok=True)

    df = pd.read_csv(cleaned_path)
    print(f"Loaded clean dataset: {len(df)} records.")
    
    # Generate EDA charts
    generate_eda_charts(df, eda_dir)
    print(f"Generated EDA charts in: {os.path.relpath(eda_dir)}")

    # Split data
    X_train, X_test, y_train, y_test = prepare_train_test_split(df, test_size=0.2, random_state=42)
    print(f"Train split: {len(X_train)} samples | Test split: {len(X_test)} samples")

    # Define Candidate Models with Pipeline
    models = {
        "Logistic Regression": Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("classifier", LogisticRegression(max_iter=1000, random_state=42, C=1.0))
        ]),
        "Random Forest Classifier": Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("classifier", RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
        ])
    }

    results = []
    trained_pipelines = {}

    print("\n" + "=" * 65)
    print("           MODEL TRAINING AND EVALUATION")
    print("=" * 65)

    for name, pipeline in models.items():
        print(f"\nTraining {name}...")
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        # Predictions on test set
        y_pred = pipeline.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
        rec = recall_score(y_test, y_pred, average="weighted", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

        results.append({
            "Model": name,
            "Accuracy": round(acc, 4),
            "Precision (Weighted)": round(prec, 4),
            "Recall (Weighted)": round(rec, 4),
            "F1 Score (Weighted)": round(f1, 4)
        })

        print(f"  Accuracy  : {acc * 100:.2f}%")
        print(f"  Precision : {prec:.4f}")
        print(f"  Recall    : {rec:.4f}")
        print(f"  F1 Score  : {f1:.4f}")

    results_df = pd.DataFrame(results)
    comparison_csv_path = os.path.join(eval_dir, "model_comparison.csv")
    results_df.to_csv(comparison_csv_path, index=False)
    print(f"\nSaved model comparison table to: {os.path.relpath(comparison_csv_path)}")

    # Select Best Model based on F1 Score
    best_row = results_df.sort_values(by="F1 Score (Weighted)", ascending=False).iloc[0]
    best_model_name = best_row["Model"]
    best_pipeline = trained_pipelines[best_model_name]

    print("\n" + "=" * 65)
    print(f"  SELECTED BEST MODEL: {best_model_name}")
    print(f"  Test Accuracy: {best_row['Accuracy']*100:.2f}% | F1: {best_row['F1 Score (Weighted)']:.4f}")
    print("=" * 65)

    # Persist the best trained pipeline (including fitted scaler, imputer, encoder, classifier)
    saved_model_path = os.path.join(models_dir, "hygiene_risk_model.joblib")
    joblib.dump(best_pipeline, saved_model_path)
    print(f"Saved complete end-to-end pipeline to: {os.path.relpath(saved_model_path)}")

    return trained_pipelines, X_test, y_test, results_df


if __name__ == "__main__":
    train_and_evaluate_models()