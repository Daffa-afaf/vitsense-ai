"""
app/services/predictor.py
Service layer untuk ML inference.
Memisahkan business logic dari route handler.
"""

import logging
import pandas as pd
from app.ml.model import artifacts
from app.core.config import settings

logger = logging.getLogger(__name__)


def bmi_category(bmi: float) -> str:
    if bmi < 18.5:  return "Underweight"
    elif bmi < 25:  return "Normal"
    elif bmi < 30:  return "Overweight"
    elif bmi < 35:  return "Obese Class I"
    elif bmi < 40:  return "Obese Class II"
    else:           return "Obese Class III"


def predict_obesity_class(user_input: dict) -> dict:
    """
    Jalankan ML pipeline: feature engineering → encode → scale → predict.

    Args:
        user_input: dict dengan 16 kolom raw (nilai asli, belum di-encode).
                    Gunakan PredictRequest.to_ml_dict() untuk konversi dari schema.

    Returns:
        dict: obesity_class, confidence_pct, bmi, bmr,
              daily_calorie_target, activity_level, class_probabilities
    """
    row = user_input.copy()

    h   = float(row["Height"])
    w   = float(row["Weight"])
    age = float(row["Age"])
    g   = str(row["Gender"]).strip().lower()

    # ── Feature Engineering — identik dengan notebook 02 ──────────
    row["BMI"] = round(w / (h ** 2), 2)

    h_cm = h * 100
    if "female" in g:
        row["BMR"] = round(447.593 + (9.247 * w) + (3.098 * h_cm) - (4.330 * age), 2)
    else:
        row["BMR"] = round(88.362 + (13.397 * w) + (4.799 * h_cm) - (5.677 * age), 2)

    activity_mult             = {0: 1.2, 1: 1.375, 2: 1.55, 3: 1.725}
    row["ActivityLevel"]      = min(int(round(float(row["FAF"]))), 3)
    row["DailyCalorieTarget"] = int(row["BMR"] * activity_mult[row["ActivityLevel"]])

    # ── Label Encoding ─────────────────────────────────────────────
    df_row = pd.DataFrame([row])
    for col, le in artifacts.le_dict.items():
        if col in df_row.columns and col != artifacts.target:
            df_row[col] = le.transform(df_row[col].astype(str))

    # ── Scale & Predict ────────────────────────────────────────────
    df_row    = df_row.reindex(columns=artifacts.features, fill_value=0)
    df_scaled = artifacts.scaler.transform(df_row)

    pred_idx   = artifacts.model.predict(df_scaled)[0]
    pred_proba = artifacts.model.predict_proba(df_scaled)[0]
    pred_label = artifacts.le_target.inverse_transform([pred_idx])[0]

    logger.debug(f"Predicted: {pred_label} ({float(pred_proba.max())*100:.1f}%)")

    return {
        "obesity_class":        pred_label,
        "confidence_pct":       round(float(pred_proba.max()) * 100, 1),
        "bmi":                  row["BMI"],
        "bmr":                  row["BMR"],
        "daily_calorie_target": row["DailyCalorieTarget"],
        "activity_level":       row["ActivityLevel"],
        "class_probabilities": {
            cls: round(float(p) * 100, 1)
            for cls, p in zip(artifacts.classes, pred_proba)
        },
    }