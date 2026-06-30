"""
app/services/recommender.py
Service layer untuk food & workout recommendation.
Logic sesuai exact dengan notebook 04_recommendation_engine.ipynb.
"""

import logging
from app.ml.model import artifacts
from app.core.config import settings

logger = logging.getLogger(__name__)


def recommend_food(
    obesity_class: str,
    daily_calorie_target: int,
    n_per_meal: int = 3,
    random_state: int = 42,
) -> dict:
    """
    Filter food_clean.csv berdasarkan meal_type & rentang kalori target.

    Distribusi kalori: breakfast 25%, lunch 35%, dinner 30%, snack 10%.
    Kalori target di-adjust dengan obesity modifier (deficit/surplus).
    Fallback: jika filter ketat tidak match, ambil n closest by calorie delta.

    Returns:
        adjusted_daily_calories, calorie_modifier, meal_targets,
        recommendations {meal: [food_items]}, total_recommended_calories
    """
    cfg      = settings
    modifier = cfg.OBESITY_CALORIE_MODIFIER.get(obesity_class, 1.0)
    adjusted = int(daily_calorie_target * modifier)

    meal_targets = {
        meal: int(adjusted * ratio)
        for meal, ratio in cfg.MEAL_CALORIE_RATIO.items()
    }

    food_db       = artifacts.food_db
    tolerance     = cfg.CALORIE_TOLERANCE
    recommendations = {}
    total_rec_cal   = 0

    for meal, target_cal in meal_targets.items():
        low  = target_cal * (1 - tolerance)
        high = target_cal * (1 + tolerance)

        # Filter: meal_type match + rentang kalori
        mask = (
            food_db["meal_type"].str.contains(meal, case=False, na=False)
            & food_db["calories"].between(low, high)
        )
        filtered = food_db[mask].copy()

        # Fallback: relax kalori filter, sort by delta terdekat
        if len(filtered) < n_per_meal:
            fallback = food_db[
                food_db["meal_type"].str.contains(meal, case=False, na=False)
            ].copy()
            fallback["_delta"] = (fallback["calories"] - target_cal).abs()
            filtered = fallback.nsmallest(n_per_meal * 3, "_delta").drop(columns="_delta")

        # Sort by health_score DESC, sample untuk variasi
        selected = (
            filtered
            .sort_values("health_score", ascending=False)
            .head(n_per_meal * 3)
            .sample(min(n_per_meal, len(filtered)), random_state=random_state)
        )

        cols = [
            c for c in
            ["food_name", "calories", "protein_g", "carbs_g",
             "fat_g", "fiber_g", "meal_type", "health_score"]
            if c in selected.columns
        ]
        recommendations[meal] = selected[cols].to_dict(orient="records")
        total_rec_cal += int(selected["calories"].sum())

    logger.debug(
        f"Food recs for {obesity_class}: "
        f"adjusted={adjusted} kcal, total_rec={total_rec_cal} kcal"
    )

    return {
        "adjusted_daily_calories":    adjusted,
        "calorie_modifier":           modifier,
        "meal_targets":               meal_targets,
        "recommendations":            recommendations,
        "total_recommended_calories": total_rec_cal,
    }


def recommend_workout(
    obesity_class: str,
    n_recommendations: int = 6,
    random_state: int = 42,
) -> dict:
    """
    Filter gym_clean.csv berdasarkan level & type dari obesity_to_exercise_map.json.
    Susun rekomendasi berdasarkan body part priority per obesity class.

    Kolom gym_db yang dipakai: Level, Type, BodyPart, Title, Equipment, Rating
    (TitleCase sesuai gym_clean.csv aktual)

    Returns:
        recommended_level, preferred_types, note,
        by_bodypart {bp: [exercises]}, full_list [exercises]
    """
    exercise_map  = artifacts.exercise_map
    gym_db        = artifacts.gym_db
    bp_priority_map = settings.OBESITY_BODYPART_PRIORITY

    mapping = exercise_map.get(obesity_class, exercise_map["Normal_Weight"])
    level   = mapping["level"]
    types   = mapping["preferred_type"]
    note    = mapping["note"]

    # Filter: level + type
    mask = (gym_db["Level"] == level) & (gym_db["Type"].isin(types))
    filtered = gym_db[mask].copy()

    # Fallback: kalau kurang, relax ke level saja
    if len(filtered) < n_recommendations:
        filtered = gym_db[gym_db["Level"] == level].copy()

    bp_priority = bp_priority_map.get(obesity_class, [])
    cols = [
        c for c in ["Title", "Type", "BodyPart", "Equipment", "Level", "Rating"]
        if c in filtered.columns
    ]

    by_bodypart  = {}
    used_titles  = set()
    n_per_bp     = max(1, n_recommendations // max(len(bp_priority), 1))

    for bp in bp_priority:
        pool = filtered[
            filtered["BodyPart"].str.contains(bp, case=False, na=False)
            & ~filtered["Title"].isin(used_titles)
        ]
        if len(pool) == 0:
            continue

        selected = (
            pool
            .sort_values("Rating", ascending=False)
            .head(n_per_bp * 3)
            .sample(min(n_per_bp, len(pool)), random_state=random_state)
        )
        by_bodypart[bp] = selected[cols].to_dict(orient="records")
        used_titles.update(selected["Title"].tolist())

    # Flatten urut prioritas
    full_list = [ex for bp in bp_priority for ex in by_bodypart.get(bp, [])]

    # Tambah sisa jika masih kurang
    if len(full_list) < n_recommendations:
        extra_pool = gym_db[~gym_db["Title"].isin(used_titles)]
        if len(extra_pool) > 0:
            extra = extra_pool.sample(
                min(n_recommendations - len(full_list), len(extra_pool)),
                random_state=random_state,
            )
            full_list.extend(extra[cols].to_dict(orient="records"))

    logger.debug(
        f"Workout recs for {obesity_class}: "
        f"level={level}, types={types}, n={len(full_list[:n_recommendations])}"
    )

    return {
        "recommended_level": level,
        "preferred_types":   types,
        "note":              note,
        "by_bodypart":       by_bodypart,
        "full_list":         full_list[:n_recommendations],
    }