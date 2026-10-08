from dotenv import load_dotenv
load_dotenv()

import os
from pathlib import Path

class Settings:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./shopflow.db")
    jwt_secret = os.getenv("JWT_SECRET", "shopflow-dev-secret-change-in-production")
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads"))
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
