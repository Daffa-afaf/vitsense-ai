"""
app/ml/model.py
Singleton loader — model & artifacts dimuat sekali saat startup,
bukan setiap request. Ini kritis untuk performa FastAPI.
"""

import pickle
import json
import logging
import pandas as pd
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger(__name__)


class ModelArtifacts:
    """
    Container untuk semua ML artifacts.
    Di-load sekali saat aplikasi start via lifespan event.
    """
    def __init__(self):
        self.model        = None
        self.le_dict      = None
        self.scaler       = None
        self.meta         = None
        self.exercise_map = None
        self.food_db      = None
        self.gym_db       = None
        self._loaded      = False

    def load(self) -> None:
        """Load semua artifacts dari disk. Dipanggil sekali saat startup."""
        if self._loaded:
            return

        logger.info("Loading ML artifacts...")

        # ── Validasi semua file ada sebelum load ───────────────────
        required = {
            "obesity_model":    settings.MODEL_PATH,
            "label_encoders":   settings.LABEL_ENCODERS_PATH,
            "scaler":           settings.SCALER_PATH,
            "model_meta":       settings.MODEL_META_PATH,
            "food_db":          settings.FOOD_DB_PATH,
            "gym_db":           settings.GYM_DB_PATH,
            "exercise_map":     settings.EXERCISE_MAP_PATH,
        }
        missing = [name for name, path in required.items() if not path.exists()]
        if missing:
            raise FileNotFoundError(
                f"Artifact tidak ditemukan: {missing}\n"
                f"Jalankan notebook 02–04 terlebih dahulu."
            )

        # ── Load ───────────────────────────────────────────────────
        with open(settings.MODEL_PATH, "rb") as f:
            self.model = pickle.load(f)

        with open(settings.LABEL_ENCODERS_PATH, "rb") as f:
            self.le_dict = pickle.load(f)

        with open(settings.SCALER_PATH, "rb") as f:
            self.scaler = pickle.load(f)

        with open(settings.MODEL_META_PATH) as f:
            self.meta = json.load(f)

        with open(settings.EXERCISE_MAP_PATH) as f:
            self.exercise_map = json.load(f)

        food_path = (
            settings.FOOD_DB_TRANSLATED_PATH
            if settings.FOOD_DB_TRANSLATED_PATH.exists()
            else settings.FOOD_DB_PATH
        )
        gym_path = (
            settings.GYM_DB_TRANSLATED_PATH
            if settings.GYM_DB_TRANSLATED_PATH.exists()
            else settings.GYM_DB_PATH
        )
        self.food_db = pd.read_csv(food_path)
        self.gym_db  = pd.read_csv(gym_path)

        self._loaded = True
        logger.info(
            f"Artifacts loaded — model={type(self.model).__name__}, "
            f"food={self.food_db.shape} ({food_path.name}), "
            f"gym={self.gym_db.shape} ({gym_path.name})"
        )

    @property
    def features(self) -> list[str]:
        return self.meta["features"]

    @property
    def target(self) -> str:
        return self.meta["target"]

    @property
    def classes(self) -> list[str]:
        return self.meta["classes"]

    @property
    def le_target(self):
        return self.le_dict[self.target]


# ── Global singleton — di-import oleh services ────────────────────
artifacts = ModelArtifacts()