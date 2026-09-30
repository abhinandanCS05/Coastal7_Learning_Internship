import os
from pathlib import Path


class Settings:
    database_url = os.getenv(
        "DATABASE_URL",
        "sqlite:///./ecommerce.db",
    )

    redis_url = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0",
    )

    celery_broker_url = os.getenv(
        "CELERY_BROKER_URL",
        "",
    )

    celery_result_backend = os.getenv(
        "CELERY_RESULT_BACKEND",
        "",
    )

    jwt_secret = os.getenv(
        "JWT_SECRET",
        "change-this-secret",
    )

    upload_dir = Path("uploads")


settings = Settings()
