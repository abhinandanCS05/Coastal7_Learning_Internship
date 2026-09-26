import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.main import app


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "upload_dir", tmp_path)
    tmp_path.mkdir(parents=True, exist_ok=True)

    # Update the StaticFiles mount used by the application.
    for route in app.routes:
        if getattr(route, "name", None) == "static":
            route.app.directory = str(tmp_path)

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_image() -> bytes:
    from io import BytesIO

    from PIL import Image

    buffer = BytesIO()
    Image.new("RGB", (1600, 900), "white").save(buffer, format="PNG")
    return buffer.getvalue()
