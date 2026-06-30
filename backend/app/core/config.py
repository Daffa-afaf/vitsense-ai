"""
app/core/config.py
Centralized configuration — semua path & konstanta di satu tempat.
"""

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Project info ───────────────────────────────────────────────
    APP_NAME: str    = "AI Personal Health & Nutrition Advisor"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool      = False

    # ── CORS ───────────────────────────────────────────────────────
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # ── Paths ──────────────────────────────────────────────────────
    BASE_DIR:    Path = Path(__file__).resolve().parents[3]   # project root
    MODELS_DIR:  Path = BASE_DIR / "models"
    DATA_DIR:    Path = BASE_DIR / "data" / "processed"

    # ── Model artifacts ────────────────────────────────────────────
    MODEL_PATH:          Path = MODELS_DIR / "obesity_model.pkl"
    LABEL_ENCODERS_PATH: Path = MODELS_DIR / "label_encoders.pkl"
    SCALER_PATH:         Path = MODELS_DIR / "scaler.pkl"
    MODEL_META_PATH:     Path = MODELS_DIR / "model_meta.json"

    # ── Data artifacts ─────────────────────────────────────────────
    FOOD_DB_PATH:         Path = DATA_DIR / "food_clean.csv"
    GYM_DB_PATH:          Path = DATA_DIR / "gym_clean.csv"
    EXERCISE_MAP_PATH:    Path = DATA_DIR / "obesity_to_exercise_map.json"

    # ── Recommendation defaults ────────────────────────────────────
    DEFAULT_N_FOOD_PER_MEAL: int   = 3
    DEFAULT_N_WORKOUT:       int   = 6
    CALORIE_TOLERANCE:       float = 0.25

    MEAL_CALORIE_RATIO: dict = {
        "breakfast": 0.25,
        "lunch":     0.35,
        "dinner":    0.30,
        "snack":     0.10,
    }

    # Calorie modifier per obesity class
    # >1.0 = surplus (weight gain), <1.0 = deficit (weight loss)
    OBESITY_CALORIE_MODIFIER: dict = {
        "Insufficient_Weight": 1.15,
        "Normal_Weight":       1.00,
        "Overweight_Level_I":  0.90,
        "Overweight_Level_II": 0.85,
        "Obesity_Type_I":      0.80,
        "Obesity_Type_II":     0.75,
        "Obesity_Type_III":    0.70,
    }

    # Body part focus per obesity class — urut prioritas
    OBESITY_BODYPART_PRIORITY: dict = {
        "Insufficient_Weight": ["chest", "back", "shoulders", "biceps", "triceps", "legs"],
        "Normal_Weight":       ["abdominals", "chest", "back", "legs", "shoulders"],
        "Overweight_Level_I":  ["abdominals", "cardio", "legs", "back"],
        "Overweight_Level_II": ["cardio", "abdominals", "legs"],
        "Obesity_Type_I":      ["cardio", "abdominals", "legs"],
        "Obesity_Type_II":     ["cardio", "abdominals"],
        "Obesity_Type_III":    ["stretching", "abdominals"],
    }

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()