# Day 04: Machine Learning — Smart Hygiene Risk Prediction System

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)  
**Submission Folder:** `intern-week-1/day-04/`

---

## 1. Project Overview & Problem Statement

Maintaining public health and sanitary standards across high-density facilities (airports, transit hubs, universities) requires rapid, predictive intervention rather than reactive complaint triage. When cleaning crews are deployed only after visitor complaints spike, facilities experience prolonged hygiene degradation, severe odors, and public health risks.

The **Smart Hygiene Risk Prediction System** is a supervised machine learning classification pipeline that ingests operational facility telemetry (inspection scores, odor levels, waste fullness, footfall, complaints, and elapsed time since last service) and predicts the multi-class hygiene risk tier: **Low**, **Medium**, or **High**. 

---

## 2. Project Objectives
1. **End-to-End ML Pipeline:** Implement a leak-free Machine Learning workflow from raw data cleaning to feature transformation, model training, evaluation, and inference.
2. **Defensive Preprocessing:** Build unified `scikit-learn` `Pipeline` and `ColumnTransformer` modules that handle missing values (median/mode) and scale features without data leakage.
3. **Algorithm Comparison:** Train and benchmark two complementary classification paradigms:
   - **Logistic Regression** (Linear baseline with calibrated probabilities).
   - **Random Forest Classifier** (Non-linear ensemble with decision trees).
4. **Diagnostic Evaluation:** Assess models using multi-class metrics (Accuracy, Precision, Recall, F1-Score, Confusion Matrix) on a held-out test set ($N=71$).
5. **Operational Inference Engine:** Create an isolated prediction utility (`predict.py`) that validates incoming facility telemetry, predicts risk tiers, and outputs confidence percentages.

---

## 3. Technology Stack
- **Language:** Python 3.12+ / 3.13+ (Tested on Windows 11)
- **Machine Learning:** `scikit-learn` ($\ge 1.4.0$)
- **Model Serialization:** `joblib` ($\ge 1.3.0$)
- **Data Manipulation:** `pandas` ($\ge 2.0$), `numpy` ($\ge 1.26$)
- **Visualization:** `matplotlib` ($\ge 3.8$), `seaborn` ($\ge 0.13$)

---

## 4. Fundamental Machine Learning Concepts Explained

### A. AI vs. Machine Learning vs. Deep Learning
- **Artificial Intelligence (AI):** The broad field of computer science focused on creating machines capable of performing tasks that typically require human cognition.
- **Machine Learning (ML):** A subset of AI where systems learn statistical patterns directly from data rather than following explicitly hardcoded rules.
- **Deep Learning (DL):** A specialized branch of ML utilizing multi-layered artificial neural networks capable of learning hierarchical feature representations from raw high-dimensional data (e.g., images, audio).

### B. Supervised vs. Unsupervised Learning
- **Supervised Learning (Used in Day 04):** Algorithms are trained on input features paired with ground-truth target labels ($X \rightarrow y$), learning a mapping function to predict labels on unseen data.
- **Unsupervised Learning:** Algorithms discover underlying structures, clusters, or distributions within unlabeled datasets ($X$ only, e.g., K-Means clustering, PCA).

### C. Classification vs. Regression
- **Classification (Day 04 Core Task):** Predicting a discrete category or class label (`Low`, `Medium`, `High` risk).
- **Regression:** Predicting a continuous numeric quantity (e.g., predicting exact minutes until next complaint). Metrics like MAE, MSE, and RMSE apply strictly to regression tasks, whereas Accuracy, Precision, Recall, and F1 apply to classification.

### D. Features vs. Labels
- **Features ($X$):** The measurable explanatory variables fed into the model (`cleanliness_score`, `odor_score`, `waste_level`, `complaints`, `footfall`, `hours_since_cleaning`).
- **Labels ($y$):** The target outcome the model is tasked with predicting (`hygiene_risk`).

### E. Training, Validation, and Testing Sets
- **Training Set (80%, $N=284$):** Data utilized by the algorithm to adjust internal weights, coefficients, and split points.
- **Held-Out Test Set (20%, $N=71$):** Completely unseen data used once to verify the model''s true generalization performance without optimistic bias.

### F. Overfitting vs. Underfitting
- **Overfitting:** The model memorizes training noise and fails to generalize to test data (high train score, low test score).
- **Underfitting:** The model is too simplistic to capture underlying patterns (poor train score, poor test score).

### G. Bias-Variance Tradeoff
- **Bias:** Error stemming from overly simplistic assumptions (e.g., underfitted linear models).
- **Variance:** Error stemming from sensitivity to minor fluctuations in training data (e.g., unconstrained deep decision trees).

### H. Preventing Data Leakage
Data leakage occurs when information from outside the training dataset (such as the target label or future test set statistics) inadvertently influences model fitting.
- **Leakage Prevention in Day 04:**
  1. Identifiers (`facility_id`) and temporal timestamps (`inspection_date`) were excluded from feature matrices.
  2. The `ColumnTransformer` (scaling and imputation) was fitted **strictly on `X_train`** inside the scikit-learn `Pipeline`, and only applied via `.transform()` to `X_test` and new inference queries.

---

## 5. Dataset Description & Synthetic Data Disclaimer

> **Transparency Disclosure:** The dataset located at `dataset/raw/facility_hygiene_raw.csv` is a **synthetic educational dataset** created for this training module. It illustrates how hygiene telemetry maps to risk tiers under simulated operating rules. It is not collected from live clinical or municipal sensors.

### Features & Schema:
| Feature | Type | Valid Range | Role |
|---|---|---|---|
| `facility_id` | String | `FAC-001` to `FAC-350` | Identifier (Excluded from ML) |
| `cleanliness_score` | Float | $0.0 - 100.0$ | Predictive Feature |
| `odor_score` | Integer | $1 - 5$ | Predictive Feature |
| `waste_level` | Categorical | `Low`, `Medium`, `High` | Predictive Feature |
| `complaints` | Integer | $\ge 0$ | Predictive Feature |
| `footfall` | Integer | $\ge 0$ | Predictive Feature |
| `hours_since_cleaning` | Float | $\ge 0.0$ | Predictive Feature |
| `hygiene_risk` | Categorical | `Low`, `Medium`, `High` | **Target Label ($y$)** |
| `inspection_date` | Date | `YYYY-MM-DD` | Metadata (Excluded from ML) |

---

## 6. Project Structure

```text
intern-week-1/day-04/
├── README.md                           # Master Day 04 documentation
├── requirements.txt                    # Python dependencies
├── .gitignore                          # Python cache ignoring
├── dataset/
│   ├── raw/
│   │   └── facility_hygiene_raw.csv    # Raw dataset with test anomalies (361 rows)
│   └── processed/
│       └── facility_hygiene_cleaned.csv# Cleaned dataset (355 rows)
├── preprocessing/
│   └── preprocess_data.py             # Data cleansing & ColumnTransformer pipeline
├── models/
│   ├── train_model.py                 # Multi-algorithm training & comparison script
│   └── saved_models/
│       └── hygiene_risk_model.joblib  # Serialized production pipeline
├── evaluation/
│   ├── evaluate_model.py              # Diagnostic evaluation & visual plotting
│   ├── model_comparison.csv           # Quantitative benchmark table
│   ├── classification_report.txt      # Precision, recall, and F1 per class
│   ├── confusion_matrix.png           # Heatmap of true vs predicted labels
│   ├── feature_importance.png         # Model coefficient / importance chart
│   └── model_comparison_chart.png     # Benchmark bar chart (LR vs RF)
├── predictions/
│   ├── predict.py                     # Inference engine with probability scoring
│   └── sample_predictions.csv         # Batch inference output across 4 scenarios
├── reports/
│   ├── findings.md                    # Detailed engineering findings & takeaway notes
│   └── eda_charts/
│       ├── class_distribution.png     # Target label frequency distribution
│       └── correlation_heatmap.png    # Feature cross-correlation matrix
└── notebooks/
    └── day04_hygiene_risk_analysis.ipynb # Interactive end-to-end Jupyter analysis
```

---

## 7. Model Comparison & Actual Evaluation Results

Both models were evaluated on the exact same held-out test split ($N = 71$, 20% stratified test sample):

| Model | Accuracy | Precision (Weighted) | Recall (Weighted) | F1 Score (Weighted) | Selected? |
|---|---|---|---|---|---|
| **Logistic Regression** | **95.77%** | **0.9589** | **0.9577** | **0.9581** | **YES (Winner)** |
| **Random Forest Classifier** | 92.96% | 0.9422 | 0.9296 | 0.9311 | Baseline Alternative |

### Detailed Classification Report (Logistic Regression):
```text
              precision    recall  f1-score   support

         Low     0.9500    0.9500    0.9500        20
      Medium     0.9167    0.9565    0.9362        23
        High     1.0000    0.9643    0.9818        28

    accuracy                         0.9577        71
   macro avg     0.9556    0.9569    0.9560        71
weighted avg     0.9589    0.9577    0.9581        71
```

### Confusion Matrix Highlights:
- **Low Risk:** 19/20 correctly predicted ($95.0\%$).
- **Medium Risk:** 22/23 correctly predicted ($95.7\%$).
- **High Risk:** 27/28 correctly predicted ($96.4\%$). Zero High risk facilities were mistakenly classified as Low risk.

---

## 8. Key Empirical Findings

1. **Cleanliness and Odor are Dominant Risk Factors:**
   Feature importance diagnostics show `cleanliness_score` (negative coefficient) and `odor_score` (positive coefficient) possess the largest weight magnitudes. Facilities scoring $<70.0$ in cleanliness consistently trigger High risk.
2. **Elapsed Time is an Exponential Risk Multiplier:**
   When `hours_since_cleaning` exceeds $8.0$ hours, risk tier probability escalates rapidly due to waste bin saturation and odor buildup.
3. **Calibrated Probabilistic Scoring:**
   Logistic Regression provides well-calibrated class probabilities, allowing operations teams to intervene proactively on borderline facilities ($P(\text{High}) > 40\%$).

---

## 9. How to Run the Project (Windows PowerShell)

```powershell
# 1. Navigate to the Day 04 directory
cd intern-week-1/day-04

# 2. (Optional) Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3. Install required packages
python -m pip install -r requirements.txt

# 4. Run Data Preprocessing & Sanitization
python preprocessing/preprocess_data.py

# 5. Train and Benchmark Models
python models/train_model.py

# 6. Run Diagnostic Evaluations & Generate Metric Charts
python evaluation/evaluate_model.py

# 7. Execute Sample Inference Predictions
python predictions/predict.py
```

---

## 10. How to Make Predictions Using Python

```python
from predictions.predict import HygieneRiskPredictor

# Initialize predictor (loads serialized pipeline automatically)
predictor = HygieneRiskPredictor()

facility = {
    "cleanliness_score": 92.5,
    "odor_score": 1,
    "waste_level": "Low",
    "complaints": 0,
    "footfall": 1200,
    "hours_since_cleaning": 2.0
}

result = predictor.predict_single(facility)
print(f"Risk Tier: {result['predicted_risk']}")
print(f"Confidence Probabilities: {result['probabilities']}")
# Output: Risk Tier: Low | Probabilities: {'Low': 99.1%, 'Medium': 0.9%, 'High': 0.0%}
```

---

## 11. Problems Encountered and Engineering Resolutions

1. **Data Leakage from Identifier Columns:**
   - *Problem:* Including non-causal columns like `facility_id` and `inspection_date` creates spurious memorization.
   - *Resolution:* Explicitly segregated input feature sets, ensuring only causal operational telemetry enters the `ColumnTransformer`.
2. **Missing Value Imputation in Production Inference:**
   - *Problem:* Manually imputing missing fields before prediction risks training/serving skew.
   - *Resolution:* Packaged `SimpleImputer` inside the serialized `Pipeline`, ensuring identical imputation logic across training, testing, and production inference.
3. **Headless Visual Plotting:**
   - *Problem:* GUI backend errors in automated PowerShell environments.
   - *Resolution:* Enforced `matplotlib.use("Agg")` prior to importing `pyplot` across all training and evaluation scripts.

---

## 12. Limitations & Future Improvements
- **Limitations:** The model operates on cross-sectional survey snapshots rather than continuous real-time IoT air-quality or optical waste sensors.
- **Future Improvements:** Integrate automated hyperparameter tuning via `GridSearchCV`, explore gradient boosting algorithms (`XGBoost`, `LightGBM`), and package the predictor into a lightweight REST endpoint (e.g., FastAPI) when web deployments are introduced in Week 2.

---

## 13. Educational Prototype Disclaimer
> **Important:** This system is an educational prototype developed as part of an engineering assessment program. It is not calibrated or approved for clinical, sanitary certification, or official public-health compliance decisions.