"""Schemas for progress history endpoints."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class WeightLogCreate(BaseModel):
    profile_id: str = Field(..., min_length=8, max_length=80)
    weight_kg: float = Field(..., ge=20, le=300)
    height_m: Optional[float] = Field(default=None, ge=1, le=2.5)
    note: Optional[str] = Field(default=None, max_length=240)
    source: str = Field(default="manual", pattern="^(manual|analysis)$")


class WeightLog(BaseModel):
    id: int
    profile_id: str
    weight_kg: float
    height_m: Optional[float] = None
    bmi: Optional[float] = None
    note: Optional[str] = None
    source: str
    recorded_at: datetime


class WeightHistoryResponse(BaseModel):
    entries: list[WeightLog]
    start_weight_kg: Optional[float] = None
    latest_weight_kg: Optional[float] = None
    change_kg: Optional[float] = None
