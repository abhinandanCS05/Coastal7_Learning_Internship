from io import BytesIO
from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from app.config import settings

async def validate_and_save_image(file: UploadFile) -> str:
    original_name = file.filename or "unnamed"
    extension = Path(original_name).suffix.lower().lstrip(".")
    if extension not in {"jpg", "jpeg", "png", "webp"}:
        raise HTTPException(status_code=400, detail="Unsupported image extension")
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=400, detail="Unsupported image content type")
    data = await file.read(settings.max_upload_size + 1)
    if len(data) > settings.max_upload_size:
        raise HTTPException(status_code=413, detail="Image is too large")
    try:
        verified = Image.open(BytesIO(data))
        verified.verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")
    source = Image.open(BytesIO(data))
    source.thumbnail((settings.max_image_width, settings.max_image_height))
    processed = source.convert("RGB") if source.mode != "RGB" else source.copy()
    filename = f"{uuid4().hex}.jpg"
    processed.save(settings.upload_dir / filename, format="JPEG", quality=85, optimize=True)
    return filename
