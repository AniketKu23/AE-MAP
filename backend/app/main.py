from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_analytics, routes_preprocessing, routes_training, routes_visualization
from app.config import get_settings
from app.utils.logging import configure_logging


configure_logging()
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="AutoEncoder Multi-omics Analytics Pipeline API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_preprocessing.router, prefix=settings.api_prefix)
app.include_router(routes_training.router, prefix=settings.api_prefix)
app.include_router(routes_analytics.router, prefix=settings.api_prefix)
app.include_router(routes_visualization.router, prefix=settings.api_prefix)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
