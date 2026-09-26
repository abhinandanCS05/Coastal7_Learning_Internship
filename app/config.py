from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


class Settings(BaseSettings):
    app_name: str = "Day 9 Real-Time File Service"
    max_upload_size: int = 5 * 1024 * 1024
    max_image_width: int = 1024
    max_image_height: int = 1024
    upload_dir: Path = UPLOAD_DIR
    allowed_extensions: tuple[str, ...] = ("jpg", "jpeg", "png", "webp")
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
