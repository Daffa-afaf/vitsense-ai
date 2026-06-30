"""
app/api/routes/predict.py
FastAPI route handlers — tipis, hanya orchestrate service calls.
Business logic ada di services/, bukan di sini.
"""

import logging
from fastapi import APIRouter, HTTPException, status

from app.schemas.request  import PredictRequest
from app.schemas.response import PredictResponse, HealthResponse, ErrorResponse
from app.services.predictor   import predict_obesity_class, bmi_category
from app.services.recommender import recommend_food, recommend_workout
from app.ml.model import artifacts
from app.core.config import settings

logger = APIRouter()


@logger.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check & model status",
    tags=["System"],
)
async def health_check():
    """
    Verifikasi bahwa API berjalan dan model sudah ter-load.
    Gunakan endpoint ini untuk monitoring / readiness probe.
    """
    loaded = artifacts._loaded
    return HealthResponse(
        status       = "ok",
        app          = settings.APP_NAME,
        version      = settings.APP_VERSION,
        model_loaded = loaded,
        model_type   = type(artifacts.model).__name__ if loaded else None,
        n_classes    = len(artifacts.classes)         if loaded else None,
        food_db_size = len(artifacts.food_db)         if loaded else None,
        gym_db_size  = len(artifacts.gym_db)          if loaded else None,
    )


@logger.post(
    "/predict",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict obesity class & get recommendations",
    tags=["Prediction"],
    responses={
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def predict(request: PredictRequest):
    """
    Pipeline utama:
    1. Validasi input (Pydantic)
    2. Feature engineering + ML prediction
    3. Food recommendation (berdasarkan kalori target & obesity class)
    4. Workout recommendation (berdasarkan obesity class & body part priority)

    **Input:** 16 kolom profil user + optional n_food_per_meal & n_workout

    **Output:** prediksi kelas obesitas, analisis BMI, target kalori,
    rekomendasi makanan per meal, rekomendasi latihan per body part.
    """
    try:
        user_dict = request.to_ml_dict()

        # Step 1 — Prediksi ML
        pred = predict_obesity_class(user_dict)

        # Step 2 — Food recommendation
        food_recs = recommend_food(
            obesity_class        = pred["obesity_class"],
            daily_calorie_target = pred["daily_calorie_target"],
            n_per_meal           = request.n_food_per_meal,
        )

        # Step 3 — Workout recommendation
        workout_recs = recommend_workout(
            obesity_class     = pred["obesity_class"],
            n_recommendations = request.n_workout,
        )

        return PredictResponse(
            status = "success",

            prediction = {
                "obesity_class":       pred["obesity_class"],
                "confidence_pct":      pred["confidence_pct"],
                "class_probabilities": pred["class_probabilities"],
            },

            bmi_analysis = {
                "bmi":            pred["bmi"],
                "bmi_category":   bmi_category(pred["bmi"]),
                "bmr":            pred["bmr"],
                "activity_level": pred["activity_level"],
            },

            health_status = {
                "obesity_class":           pred["obesity_class"],
                "daily_calorie_target":    pred["daily_calorie_target"],
                "adjusted_daily_calories": food_recs["adjusted_daily_calories"],
                "calorie_modifier":        food_recs["calorie_modifier"],
                "meal_targets":            food_recs["meal_targets"],
            },

            food_recommendations = {
                "total_recommended_calories": food_recs["total_recommended_calories"],
                "meals":                      food_recs["recommendations"],
            },

            workout_recommendations = {
                "level":          workout_recs["recommended_level"],
                "preferred_type": workout_recs["preferred_types"],
                "note":           workout_recs["note"],
                "exercises":      workout_recs["full_list"],
            },
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        import logging as _log
        _log.getLogger(__name__).exception("Unexpected error in /predict")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error: {str(e)}",
        )