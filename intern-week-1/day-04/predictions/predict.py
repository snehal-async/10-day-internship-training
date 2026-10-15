"""
predict.py - Inference engine for predicting facility hygiene risk using trained pipeline.

Features:
1. Loads fitted pipeline from models/saved_models/hygiene_risk_model.joblib
2. Validates user input schema and numerical ranges
3. Generates class predictions and class probability distributions
4. Evaluates a sample batch of real-world scenarios
5. Exports inference results to predictions/sample_predictions.csv
"""
import os
import sys
import joblib
import pandas as pd
from typing import Dict, Any, List, Union


class HygieneRiskPredictor:
    """Production inference wrapper around the trained scikit-learn pipeline."""

    def __init__(self, model_path: str = None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.normpath(
                os.path.join(base_dir, "..", "models", "saved_models", "hygiene_risk_model.joblib")
            )
        self.model_path = model_path
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Trained model not found at '{self.model_path}'. "
                "Please run models/train_model.py before attempting predictions."
            )
        self.pipeline = joblib.load(self.model_path)
        self.classes = list(self.pipeline.classes_)

    def validate_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Validate single record against expected schema and ranges."""
        required = ["cleanliness_score", "odor_score", "waste_level", "complaints", "footfall", "hours_since_cleaning"]
        missing = [f for f in required if f not in record]
        if missing:
            raise ValueError(f"Missing required input features: {', '.join(missing)}")

        try:
            clean = float(record["cleanliness_score"])
            odor = int(record["odor_score"])
            complaints = int(record["complaints"])
            footfall = int(record["footfall"])
            hours = float(record["hours_since_cleaning"])
        except (ValueError, TypeError) as err:
            raise ValueError(f"Invalid numerical value in record: {err}")

        waste = str(record["waste_level"]).strip().capitalize()
        if waste not in ["Low", "Medium", "High"]:
            raise ValueError(f"Invalid waste_level '{record['waste_level']}'. Expected 'Low', 'Medium', or 'High'.")

        if not (0 <= clean <= 100):
            raise ValueError(f"cleanliness_score must be between 0 and 100, got {clean}")
        if not (1 <= odor <= 5):
            raise ValueError(f"odor_score must be between 1 and 5, got {odor}")
        if complaints < 0:
            raise ValueError(f"complaints cannot be negative, got {complaints}")
        if footfall < 0:
            raise ValueError(f"footfall cannot be negative, got {footfall}")
        if hours < 0:
            raise ValueError(f"hours_since_cleaning cannot be negative, got {hours}")

        return {
            "cleanliness_score": clean,
            "odor_score": odor,
            "waste_level": waste,
            "complaints": complaints,
            "footfall": footfall,
            "hours_since_cleaning": hours
        }

    def predict_single(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Predict hygiene risk and class probabilities for a single facility."""
        valid_record = self.validate_record(record)
        df_input = pd.DataFrame([valid_record])

        pred_class = self.pipeline.predict(df_input)[0]

        prob_dict = {}
        if hasattr(self.pipeline, "predict_proba"):
            probs = self.pipeline.predict_proba(df_input)[0]
            for cls_name, prob in zip(self.classes, probs):
                prob_dict[cls_name] = round(float(prob) * 100, 1)

        return {
            "predicted_risk": pred_class,
            "probabilities": prob_dict,
            "validated_input": valid_record
        }

    def predict_batch(self, records: List[Dict[str, Any]]) -> pd.DataFrame:
        """Batch predict for a collection of facility records."""
        results = []
        for rec in records:
            fac_id = rec.get("facility_id", "N/A")
            try:
                out = self.predict_single(rec)
                probs = out["probabilities"]
                results.append({
                    "facility_id": fac_id,
                    "cleanliness_score": out["validated_input"]["cleanliness_score"],
                    "odor_score": out["validated_input"]["odor_score"],
                    "waste_level": out["validated_input"]["waste_level"],
                    "complaints": out["validated_input"]["complaints"],
                    "footfall": out["validated_input"]["footfall"],
                    "hours_since_cleaning": out["validated_input"]["hours_since_cleaning"],
                    "predicted_risk": out["predicted_risk"],
                    "prob_Low_%": probs.get("Low", 0.0),
                    "prob_Medium_%": probs.get("Medium", 0.0),
                    "prob_High_%": probs.get("High", 0.0)
                })
            except Exception as e:
                results.append({
                    "facility_id": fac_id,
                    "predicted_risk": "ERROR",
                    "error": str(e)
                })
        return pd.DataFrame(results)


def main():
    print("=" * 65)
    print("    SMART HYGIENE RISK PREDICTION ENGINE - INFERENCE")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    predictor = HygieneRiskPredictor()

    # Define diverse real-world scenario test cases
    sample_facilities = [
        {
            "facility_id": "TEST-01 (Newly Sanitized)",
            "cleanliness_score": 96.5,
            "odor_score": 1,
            "waste_level": "Low",
            "complaints": 0,
            "footfall": 950,
            "hours_since_cleaning": 1.0
        },
        {
            "facility_id": "TEST-02 (Standard Concourse)",
            "cleanliness_score": 79.0,
            "odor_score": 2,
            "waste_level": "Medium",
            "complaints": 3,
            "footfall": 2200,
            "hours_since_cleaning": 5.5
        },
        {
            "facility_id": "TEST-03 (High-Footfall Shift End)",
            "cleanliness_score": 68.5,
            "odor_score": 4,
            "waste_level": "High",
            "complaints": 7,
            "footfall": 3800,
            "hours_since_cleaning": 9.0
        },
        {
            "facility_id": "TEST-04 (Severe Neglect)",
            "cleanliness_score": 54.0,
            "odor_score": 5,
            "waste_level": "High",
            "complaints": 12,
            "footfall": 4100,
            "hours_since_cleaning": 14.5
        }
    ]

    print("\nRunning sample predictions across 4 benchmark operational scenarios:\n")
    for fac in sample_facilities:
        res = predictor.predict_single(fac)
        risk = res["predicted_risk"]
        probs = res["probabilities"]
        print(f"  Facility: {fac['facility_id']}")
        print(f"    Inputs : Cleanliness={fac['cleanliness_score']}, Odor={fac['odor_score']}, Waste={fac['waste_level']}, Complaints={fac['complaints']}, Hours={fac['hours_since_cleaning']}")
        print(f"    -> PREDICTED RISK : [{risk.upper()}]")
        print(f"    -> Confidence     : Low={probs.get('Low', 0)}%, Medium={probs.get('Medium', 0)}%, High={probs.get('High', 0)}%\n")

    # Save batch predictions to CSV
    batch_df = predictor.predict_batch(sample_facilities)
    output_csv = os.path.join(base_dir, "sample_predictions.csv")
    batch_df.to_csv(output_csv, index=False)
    print(f"Saved batch prediction results to: {os.path.relpath(output_csv)}")


if __name__ == "__main__":
    main()