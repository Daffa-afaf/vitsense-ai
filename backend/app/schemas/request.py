"""
app/schemas/request.py
Pydantic schema untuk validasi input user.
Kolom sesuai exact dengan Obesity Dataset yang digunakan training.
"""

from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Literal
from enum import Enum


class GenderEnum(str, Enum):
    male   = "Male"
    female = "Female"


class YesNoEnum(str, Enum):
    yes = "yes"
    no  = "no"


class CAECEnum(str, Enum):
    no          = "no"
    sometimes   = "Sometimes"
    frequently  = "Frequently"
    always      = "Always"


class CALCEnum(str, Enum):
    no          = "no"
    sometimes   = "Sometimes"
    frequently  = "Frequently"
    always      = "Always"


class MTRANSEnum(str, Enum):
    automobile           = "Automobile"
    bike                 = "Bike"
    motorbike            = "Motorbike"
    public_transportation = "Public_Transportation"
    walking              = "Walking"


class PredictRequest(BaseModel):
    """
    Input user untuk prediksi & rekomendasi.
    Semua field sesuai kolom Obesity Dataset original.
    """

    # ── Anthropometric ─────────────────────────────────────────────
    Gender: GenderEnum = Field(..., description="Jenis kelamin")
    Age:    float      = Field(..., ge=10, le=100, description="Usia (tahun)")
    Height: float      = Field(..., ge=1.0, le=2.5, description="Tinggi badan (meter)")
    Weight: float      = Field(..., ge=20.0, le=300.0, description="Berat badan (kg)")

    # ── Riwayat & kebiasaan makan ──────────────────────────────────
    family_history_with_overweight: YesNoEnum = Field(
        ..., description="Riwayat keluarga dengan berat badan berlebih"
    )
    FAVC: YesNoEnum = Field(..., description="Sering konsumsi makanan kalori tinggi?")
    FCVC: float     = Field(..., ge=1, le=3, description="Frekuensi konsumsi sayur/buah (1=jarang, 3=selalu)")
    NCP:  float     = Field(..., ge=1, le=4, description="Jumlah makan utama per hari")
    CAEC: CAECEnum  = Field(..., description="Konsumsi makanan di antara waktu makan")

    # ── Gaya hidup ─────────────────────────────────────────────────
    SMOKE: YesNoEnum = Field(..., description="Merokok?")
    CH2O:  float     = Field(..., ge=1, le=3, description="Konsumsi air harian (liter, 1=<1L, 3=>2L)")
    SCC:   YesNoEnum = Field(..., description="Monitor kalori yang dikonsumsi?")
    FAF:   float     = Field(..., ge=0, le=3, description="Frekuensi aktivitas fisik (0=tidak pernah, 3=setiap hari)")
    TUE:   float     = Field(..., ge=0, le=2, description="Waktu penggunaan perangkat teknologi (jam/hari)")
    CALC:  CALCEnum  = Field(..., description="Konsumsi alkohol")
    MTRANS: MTRANSEnum = Field(..., description="Transportasi yang biasa digunakan")

    # ── Recommendation params (opsional) ───────────────────────────
    n_food_per_meal: int = Field(default=3, ge=1, le=5, description="Jumlah rekomendasi makanan per meal")
    n_workout:       int = Field(default=6, ge=1, le=10, description="Jumlah rekomendasi latihan")

    @field_validator("Height")
    @classmethod
    def height_in_meters(cls, v: float) -> float:
        """Guard: pastikan user tidak input dalam cm (misal 175 bukan 1.75)."""
        if v > 2.5:
            raise ValueError(
                f"Height harus dalam meter (contoh: 1.75), bukan cm. Diterima: {v}"
            )
        return round(v, 2)

    @model_validator(mode="after")
    def validate_bmi_range(self) -> "PredictRequest":
        """Soft warning jika BMI di luar range yang masuk akal."""
        bmi = self.Weight / (self.Height ** 2)
        if bmi < 10 or bmi > 70:
            raise ValueError(
                f"BMI terhitung {bmi:.1f} — kombinasi Height/Weight tidak valid. "
                f"Periksa kembali nilai yang diinput."
            )
        return self

    def to_ml_dict(self) -> dict:
        """Convert ke dict yang siap diproses ML pipeline."""
        return {
            "Gender":                          self.Gender.value,
            "Age":                             self.Age,
            "Height":                          self.Height,
            "Weight":                          self.Weight,
            "family_history_with_overweight":  self.family_history_with_overweight.value,
            "FAVC":                            self.FAVC.value,
            "FCVC":                            self.FCVC,
            "NCP":                             self.NCP,
            "CAEC":                            self.CAEC.value,
            "SMOKE":                           self.SMOKE.value,
            "CH2O":                            self.CH2O,
            "SCC":                             self.SCC.value,
            "FAF":                             self.FAF,
            "TUE":                             self.TUE,
            "CALC":                            self.CALC.value,
            "MTRANS":                          self.MTRANS.value,
        }

    model_config = {
        "json_schema_extra": {
            "example": {
                "Gender": "Male",
                "Age": 25,
                "Height": 1.75,
                "Weight": 70,
                "family_history_with_overweight": "no",
                "FAVC": "no",
                "FCVC": 2,
                "NCP": 3,
                "CAEC": "Sometimes",
                "SMOKE": "no",
                "CH2O": 2,
                "SCC": "no",
                "FAF": 2,
                "TUE": 1,
                "CALC": "Sometimes",
                "MTRANS": "Public_Transportation",
                "n_food_per_meal": 3,
                "n_workout": 6
            }
        }
    }