"""
evaluate_model.py - Model diagnostic evaluation, matrix plotting, and feature analysis.

Performs:
1. Loads fitted pipeline from models/saved_models/hygiene_risk_model.joblib
2. Evaluates model performance on the test split
3. Generates evaluation/classification_report.txt
4. Generates evaluation/confusion_matrix.png
5. Generates evaluation/feature_importance.png
6. Generates evaluation/model_comparison_chart.png
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

from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "preprocessing")))
from preprocess_data import prepare_train_test_split, NUMERICAL_FEATURES, CATEGORICAL_FEATURES, TARGET_COLUMN


def run_evaluation():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.normpath(os.path.join(base_dir, "..", "models", "saved_models", "hygiene_risk_model.joblib"))
    eval_dir = base_dir

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}. Please run train_model.py first.")

    pipeline = joblib.load(model_path)
    X_train, X_test, y_train, y_test = prepare_train_test_split(test_size=0.2, random_state=42)

    labels = ["Low", "Medium", "High"]
    y_pred = pipeline.predict(X_test)

    # 1. Classification Report
    report_text = classification_report(y_test, y_pred, labels=labels, digits=4)
    report_file = os.path.join(eval_dir, "classification_report.txt")
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("=" * 65 + "\n")
        f.write("      SMART HYGIENE RISK PREDICTION - CLASSIFICATION REPORT\n")
        f.write("=" * 65 + "\n\n")
        f.write(report_text + "\n")
        f.write("=" * 65 + "\n")

    print("=" * 65)
    print("             MODEL EVALUATION REPORT")
    print("=" * 65)
    print(report_text)

    # 2. Confusion Matrix Chart
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=False,
                xticklabels=labels, yticklabels=labels, ax=ax,
                annot_kws={"fontsize": 13, "fontweight": "bold"})
    ax.set_title("Confusion Matrix (Best Model)", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Predicted Label", fontsize=11, labelpad=8)
    ax.set_ylabel("True Label", fontsize=11, labelpad=8)
    plt.tight_layout()
    cm_path = os.path.join(eval_dir, "confusion_matrix.png")
    fig.savefig(cm_path, dpi=200)
    plt.close(fig)
    print(f"Saved confusion matrix plot: {os.path.relpath(cm_path)}")

    # 3. Feature Importance or Model Coefficients
    classifier = pipeline.named_steps["classifier"]
    preprocessor = pipeline.named_steps["preprocessor"]

    # Extract transformed feature names
    cat_encoder = preprocessor.named_transformers_["cat"].named_steps["encoder"]
    encoded_cat_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    feature_names = NUMERICAL_FEATURES + encoded_cat_names

    fig, ax = plt.subplots(figsize=(8, 5))
    if isinstance(classifier, LogisticRegression):
        # Average absolute coefficient across classes
        importance = np.mean(np.abs(classifier.coef_), axis=0)
        title = "Feature Importance: Logistic Regression (|Mean Coefficients|)"
    elif isinstance(classifier, RandomForestClassifier):
        importance = classifier.feature_importances_
        title = "Feature Importance: Random Forest (Gini Importance)"
    else:
        importance = np.zeros(len(feature_names))
        title = "Feature Importance"

    imp_series = pd.Series(importance, index=feature_names).sort_values(ascending=True)
    imp_series.plot(kind="barh", color="#1E88E5", edgecolor="#0D47A1", ax=ax)
    ax.set_title(title, fontsize=12, fontweight="bold", pad=12)
    ax.set_xlabel("Relative Importance Score", fontsize=10, labelpad=8)
    ax.grid(axis="x", linestyle="--", alpha=0.6)
    plt.tight_layout()
    fi_path = os.path.join(eval_dir, "feature_importance.png")
    fig.savefig(fi_path, dpi=200)
    plt.close(fig)
    print(f"Saved feature importance chart: {os.path.relpath(fi_path)}")

    # 4. Model Comparison Bar Chart
    comp_csv = os.path.join(eval_dir, "model_comparison.csv")
    if os.path.exists(comp_csv):
        comp_df = pd.read_csv(comp_csv)
        fig, ax = plt.subplots(figsize=(8, 4.8))
        metrics_cols = ["Accuracy", "Precision (Weighted)", "Recall (Weighted)", "F1 Score (Weighted)"]
        x = np.arange(len(metrics_cols))
        width = 0.35

        for i, (_, row) in enumerate(comp_df.iterrows()):
            vals = [row[m] for m in metrics_cols]
            color = "#1E88E5" if i == 0 else "#43A047"
            offset = -width/2 if i == 0 else width/2
            bars = ax.bar(x + offset, vals, width, label=row["Model"], color=color, alpha=0.85, edgecolor="#212121")
            for bar in bars:
                h = bar.get_height()
                ax.annotate(f"{h:.3f}",
                            xy=(bar.get_x() + bar.get_width() / 2, h),
                            xytext=(0, 3), textcoords="offset points",
                            ha="center", va="bottom", fontsize=8.5, fontweight="bold")

        ax.set_title("Model Comparison on Held-Out Test Set", fontsize=12, fontweight="bold", pad=12)
        ax.set_xticks(x)
        ax.set_xticklabels(["Accuracy", "Precision", "Recall", "F1 Score"], fontsize=10)
        ax.set_ylim(0.7, 1.05)
        ax.set_ylabel("Metric Score", fontsize=10)
        ax.grid(axis="y", linestyle="--", alpha=0.6)
        ax.legend(frameon=True, loc="lower right")
        plt.tight_layout()
        comp_chart_path = os.path.join(eval_dir, "model_comparison_chart.png")
        fig.savefig(comp_chart_path, dpi=200)
        plt.close(fig)
        print(f"Saved model comparison chart: {os.path.relpath(comp_chart_path)}")

    print(f"Saved detailed classification report to: {os.path.relpath(report_file)}")
    print("Evaluation completed successfully!")


if __name__ == "__main__":
    run_evaluation()