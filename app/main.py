from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator

from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.connection_manager import ConnectionManager
from app.image_service import validate_and_save_image

manager = ConnectionManager()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.mount(
    "/static",
    StaticFiles(directory=settings.upload_dir),
    name="static",
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.app_name,
    }


@app.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
) -> dict[str, object]:
    result = await validate_and_save_image(file)

    await manager.broadcast(
        {
            "event": "file_uploaded",
            "filename": str(result["filename"]),
            "message": f"New image uploaded: {result['original_filename']}",
        }
    )

    return {
        "message": "Image uploaded successfully",
        "file_url": f"/static/{result['filename']}",
        **result,
    }


@app.get("/files/{filename}")
async def get_file(filename: str) -> FileResponse:
    file_path = Path(settings.upload_dir) / filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    return FileResponse(file_path)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)

    try:
        await websocket.send_json(
            {
                "event": "connected",
                "message": "WebSocket connection established",
            }
        )

        while True:
            message = await websocket.receive_text()

            await websocket.send_json(
                {
                    "event": "echo",
                    "message": message,
                }
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket)

    except Exception:
        manager.disconnect(websocket)
