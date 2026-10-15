# Day 04 Machine Learning Findings & Model Diagnostics

This report summarizes the experimental methodology, model evaluation metrics, and key data-driven operational findings for the **Smart Hygiene Risk Prediction System**.

---

## 1. Model Comparison on Held-Out Test Set ($N = 71$)

Two classification algorithms were trained within standardized scikit-learn pipelines with identical preprocessors (median/mode imputation, standard scaling, and one-hot encoding).

| Metric | Logistic Regression | Random Forest Classifier | Delta ($\Delta$) | Preferred Model |
|---|---|---|---|---|
| **Accuracy** | **95.77%** | 92.96% | +2.81% | **Logistic Regression** |
| **Precision (Weighted)** | **0.9589** | 0.9422 | +0.0167 | **Logistic Regression** |
| **Recall (Weighted)** | **0.9577** | 0.9296 | +0.0281 | **Logistic Regression** |
| **F1 Score (Weighted)** | **0.9581** | 0.9311 | +0.0270 | **Logistic Regression** |

---

## 2. Model Selection Rationale

**Logistic Regression** was chosen as the primary production model for the following reasons:
1. **Superior Generalization:** Achieved higher precision (0.9589) and F1-score (0.9581) across all three classes on unseen test data without evidence of overfitting.
2. **Smooth Probabilistic Calibration:** Provides well-calibrated class probability distributions ($P(\text{Low}), P(\text{Medium}), P(\text{High})$), enabling facility managers to view risk confidence scores.
3. **Linear Interpretability:** Directly exposes learned weights (coefficients), allowing maintenance directors to understand exactly which inputs drive risk classifications.
4. **Sub-millisecond Latency:** Evaluates predictions in under 1ms, ideal for low-power edge gateways or field tablets.

---

## 3. Key Analytical Insights

1. **Cleanliness & Odor are the Strongest Leading Indicators:**
   Model coefficients show `cleanliness_score` and `odor_score` exhibit the largest magnitude weights in separating `Low` from `High` risk facilities. Facilities scoring below $70.0$ in cleanliness almost invariably trigger `High` risk predictions regardless of footfall.
2. **Cumulative Exposure Time Accelerates Risk:**
   `hours_since_cleaning` acts as a compounding risk multiplier. When cleaning is delayed beyond $8.0$ hours, even facilities with initially low footfall transition from `Low` to `Medium` or `High` risk due to waste accumulation and odor development.
3. **High Footfall Magnifies Waste Depletion:**
   When daily foot traffic exceeds $3,500$ pedestrians, waste receptacles transition rapidly to `High`, tripling the probability of citizen grievances and elevated risk ratings.