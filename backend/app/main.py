"""
app/main.py
FastAPI application entry point.
Model di-load sekali saat startup via lifespan — bukan setiap request.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.ml.model import artifacts
from app.api.routes.predict import logger as predict_router
from app.api.routes.history import router as history_router

# ── Logging ────────────────────────────────────────────────────────
logging.basicConfig(
    level   = logging.INFO,
    format  = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt = "%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


# ── Lifespan: load model sekali saat startup ───────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load ML artifacts saat startup, release saat shutdown.
    Dengan lifespan, model hanya dimuat sekali — tidak per request.
    """
    log.info("Starting up — loading ML artifacts...")
    try:
        init_db()
        artifacts.load()
        log.info("ML artifacts loaded successfully.")
    except FileNotFoundError as e:
        log.error(f"STARTUP FAILED: {e}")
        raise

    yield  # aplikasi berjalan di sini

    log.info("Shutting down.")


# ── App instance ───────────────────────────────────────────────────
app = FastAPI(
    title       = settings.APP_NAME,
    version     = settings.APP_VERSION,
    description = """
## AI Personal Health & Nutrition Advisor

API untuk prediksi status obesitas dan rekomendasi kesehatan personal.

### Pipeline
```
User Input → ML Prediction → BMI Analysis → Calorie Target
          → Food Recommendation → Workout Recommendation
```

### Model
- **Algorithm:** Random Forest Classifier
- **Dataset:** Obesity Levels Dataset (2087 samples, 20 features)
- **Test Accuracy:** 99.3% | **F1-Macro:** 99.2%
- **Classes:** 7 obesity levels (Insufficient Weight → Obesity Type III)
""",
    lifespan    = lifespan,
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)


# ── CORS ───────────────────────────────────────────────────────────
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://vitsense-ai.vercel.app",
]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in allowed_origins:
    allowed_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = allowed_origins,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ── Routes ─────────────────────────────────────────────────────────
app.include_router(predict_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1/history")


# ── Root ───────────────────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root():
    return {
        "app":     settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs":    "/docs",
        "health":  "/api/v1/health",
        "predict": "/api/v1/predict",
    }