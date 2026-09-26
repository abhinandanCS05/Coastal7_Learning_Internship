from io import BytesIO

from PIL import Image

from app.config import settings


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_upload_image_and_resize(client, sample_image):
    response = client.post(
        "/upload", files={"file": ("photo.png", sample_image, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Image uploaded successfully"
    assert data["width"] <= 1024 and data["height"] <= 1024
    assert data["filename"].endswith(".jpg")
    static_response = client.get(f"/files/{data['filename']}")
    assert static_response.status_code == 200
    assert static_response.headers["content-type"].startswith("image/jpeg")


def test_get_file_not_found(client):
    assert client.get("/files/missing.jpg").status_code == 404


def test_reject_invalid_extension(client):
    response = client.post(
        "/upload", files={"file": ("notes.txt", b"hello", "text/plain")}
    )
    assert response.status_code == 400


def test_reject_invalid_image_content(client):
    response = client.post(
        "/upload", files={"file": ("fake.png", b"not-an-image", "image/png")}
    )
    assert response.status_code == 400


def test_reject_oversized_image(client, monkeypatch):
    monkeypatch.setattr(settings, "max_upload_size", 5)
    response = client.post(
        "/upload", files={"file": ("photo.png", b"123456", "image/png")}
    )
    assert response.status_code == 413


def test_websocket_connection_and_echo(client):
    with client.websocket_connect("/ws") as websocket:
        assert websocket.receive_json()["event"] == "connected"
        websocket.send_text("hello")
        assert websocket.receive_json() == {"event": "echo", "message": "hello"}


def test_upload_broadcasts_to_websocket(client, sample_image):
    with client.websocket_connect("/ws") as websocket:
        websocket.receive_json()
        response = client.post(
            "/upload", files={"file": ("photo.png", sample_image, "image/png")}
        )
        assert response.status_code == 200
        notification = websocket.receive_json()
        assert notification["event"] == "file_uploaded"
        assert "photo.png" in notification["message"]


def test_output_image_is_valid_jpeg(client, sample_image):
    response = client.post(
        "/upload", files={"file": ("photo.png", sample_image, "image/png")}
    )
    content = client.get(f"/files/{response.json()['filename']}").content
    image = Image.open(BytesIO(content))
    assert image.format == "JPEG"
