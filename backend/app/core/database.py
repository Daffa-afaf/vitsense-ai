"""SQLite storage for lightweight user progress history."""

import sqlite3
from pathlib import Path

from app.core.config import settings


CREATE_WEIGHT_LOGS = """
CREATE TABLE IF NOT EXISTS weight_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    weight_kg REAL NOT NULL,
    height_m REAL,
    bmi REAL,
    note TEXT,
    source TEXT NOT NULL DEFAULT 'manual',
    recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
"""


def get_connection() -> sqlite3.Connection:
    settings.DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(settings.DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(CREATE_WEIGHT_LOGS)
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_weight_logs_profile_date "
            "ON weight_logs(profile_id, recorded_at)"
        )


def row_to_dict(row: sqlite3.Row) -> dict:
    return dict(row)
