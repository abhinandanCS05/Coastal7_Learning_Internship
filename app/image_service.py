from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from app.config import settings


async def validate_and_save_image(file: UploadFile) -> dict[str, str | int]:
    """Validate an image, resize it, and save a normalized JPEG."""

    original_name = file.filename or "unnamed"
    extension = Path(original_name).suffix.lower().lstrip(".")

    if extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image extension",
        )

    if file.content_type not in {
        "image/jpeg",
        "image/png",
        "image/webp",
    }:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image content type",
        )

    data = await file.read(settings.max_upload_size + 1)

    if len(data) > settings.max_upload_size:
        raise HTTPException(
            status_code=413,
            detail="Image is too large",
        )

    try:
        verified_image = Image.open(BytesIO(data))
        verified_image.verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image",
        )

    source_image = Image.open(BytesIO(data))

    source_image.thumbnail((settings.max_image_width, settings.max_image_height))

    if source_image.mode != "RGB":
        processed_image = source_image.convert("RGB")
    else:
        processed_image = source_image.copy()

    output_name = f"{uuid4().hex}.jpg"
    output_path = settings.upload_dir / output_name

    processed_image.save(
        output_path,
        format="JPEG",
        quality=85,
        optimize=True,
    )

    return {
        "filename": output_name,
        "original_filename": original_name,
        "size": output_path.stat().st_size,
        "width": processed_image.width,
        "height": processed_image.height,
    }
