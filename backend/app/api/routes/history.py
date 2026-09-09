"""Progress history endpoints for the anonymous local profile."""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query, status

from app.core.database import get_connection, row_to_dict
from app.schemas.history import WeightHistoryResponse, WeightLog, WeightLogCreate

router = APIRouter(tags=["Progress"])


@router.post(
    "/weights",
    response_model=WeightLog,
    status_code=status.HTTP_201_CREATED,
)
async def create_weight_log(payload: WeightLogCreate):
    bmi = None
    if payload.height_m:
        bmi = round(payload.weight_kg / (payload.height_m ** 2), 2)

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO weight_logs
                (profile_id, weight_kg, height_m, bmi, note, source, recorded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.profile_id,
                payload.weight_kg,
                payload.height_m,
                bmi,
                payload.note,
                payload.source,
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        row = connection.execute(
            "SELECT * FROM weight_logs WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

    return row_to_dict(row)


@router.get("/weights", response_model=WeightHistoryResponse)
async def get_weight_history(
    profile_id: str = Query(..., min_length=8, max_length=80),
    limit: int = Query(default=30, ge=1, le=100),
):
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT * FROM weight_logs
            WHERE profile_id = ?
            ORDER BY recorded_at ASC, id ASC
            LIMIT ?
            """,
            (profile_id, limit),
        ).fetchall()

    entries = [WeightLog.model_validate(row_to_dict(row)) for row in rows]
    weights = [entry.weight_kg for entry in entries]
    start = weights[0] if weights else None
    latest = weights[-1] if weights else None

    return WeightHistoryResponse(
        entries=entries,
        start_weight_kg=start,
        latest_weight_kg=latest,
        change_kg=round(latest - start, 2) if start is not None and latest is not None else None,
    )


@router.delete("/weights/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_weight_log(log_id: int, profile_id: str = Query(..., min_length=8, max_length=80)):
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM weight_logs WHERE id = ? AND profile_id = ?",
            (log_id, profile_id),
        )

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Catatan berat tidak ditemukan")
