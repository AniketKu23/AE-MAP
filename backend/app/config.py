from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "AE-MAP API"
    api_prefix: str = "/api/v1"
    backend_root: Path = Path(__file__).resolve().parents[1]
    data_dir: Path = backend_root / "data"
    raw_data_dir: Path = data_dir / "raw"
    processed_data_dir: Path = data_dir / "processed"
    output_dir: Path = data_dir / "outputs"
    checkpoint_dir: Path = backend_root / "models" / "checkpoints"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    for directory in (
        settings.raw_data_dir,
        settings.processed_data_dir,
        settings.output_dir,
        settings.checkpoint_dir,
    ):
        directory.mkdir(parents=True, exist_ok=True)
    return settings
