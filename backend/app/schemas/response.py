"""
app/schemas/response.py
Pydantic schema untuk response — memastikan JSON output selalu konsisten.
"""

from pydantic import BaseModel
from typing import Optional


# ── Sub-schemas ────────────────────────────────────────────────────

class PredictionResult(BaseModel):
    obesity_class:       str
    confidence_pct:      float
    class_probabilities: dict[str, float]


class BMIAnalysis(BaseModel):
    bmi:            float
    bmi_category:   str
    bmr:            float
    activity_level: int


class HealthStatus(BaseModel):
    obesity_class:           str
    daily_calorie_target:    int
    adjusted_daily_calories: int
    calorie_modifier:        float
    meal_targets:            dict[str, int]


class FoodItem(BaseModel):
    food_name:    str
    calories:     float
    protein_g:    float
    carbs_g:      float
    fat_g:        float
    fiber_g:      Optional[float] = None
    meal_type:    Optional[str]   = None
    health_score: Optional[float] = None


class FoodRecommendations(BaseModel):
    total_recommended_calories: int
    meals: dict[str, list[FoodItem]]


class ExerciseItem(BaseModel):
    Title:     str
    Type:      Optional[str] = None
    BodyPart:  Optional[str] = None
    Equipment: Optional[str] = None
    Level:     Optional[str] = None
    Rating:    Optional[float] = None


class WorkoutRecommendations(BaseModel):
    level:          str
    preferred_type: list[str]
    note:           str
    exercises:      list[ExerciseItem]


# ── Main response ──────────────────────────────────────────────────

class PredictResponse(BaseModel):
    status:                  str
    prediction:              PredictionResult
    bmi_analysis:            BMIAnalysis
    health_status:           HealthStatus
    food_recommendations:    FoodRecommendations
    workout_recommendations: WorkoutRecommendations


class HealthResponse(BaseModel):
    """Response untuk endpoint GET /health."""
    status:       str
    app:          str
    version:      str
    model_loaded: bool
    model_type:   Optional[str] = None
    n_classes:    Optional[int] = None
    food_db_size: Optional[int] = None
    gym_db_size:  Optional[int] = None


class ErrorResponse(BaseModel):
    """Response standar untuk error."""
    status:  str = "error"
    message: str
    detail:  Optional[str] = None