"""Authenticated Day 20 streaming RAG chat API."""
import json
import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from .database import get_db
from .models import Product, User
from .security import current_user
from .ai_service import build_prompt, retrieve_products, stream_answer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["AI Assistant"])


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=1200)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1500)
    history: list[ChatMessage] = Field(default_factory=list, max_length=12)


def _sse(event: dict[str, Any]) -> str:
    return "data: " + json.dumps(event, ensure_ascii=False) + "\n\n"


@router.get("/status")
def ai_status(user: User = Depends(current_user)):
    """Return configuration status without exposing credentials."""
    import os
    return {
        "configured_providers": [
            name for name, key in (
                ("groq", os.getenv("GROQ_API_KEY")),
                ("gemini", os.getenv("GEMINI_API_KEY")),
                ("mistral", os.getenv("MISTRAL_API_KEY")),
            ) if key and key.strip()
        ],
        "rag": "ChromaDB product catalogue",
        "streaming": "Server-Sent Events",
    }


@router.post("/chat/stream")
def chat_stream(
    request: ChatRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    question = request.message.strip()
    if not question:
        raise HTTPException(status_code=422, detail="Message cannot be empty")

    # Use active catalogue rows only. No customer/order/private account data is indexed.
    products = db.query(Product).filter(Product.is_active == True).all()
    try:
        sources = retrieve_products(question, products, top_k=5)
    except Exception:
        logger.exception("Product catalogue retrieval failed")
        raise HTTPException(status_code=503, detail="Product catalogue retrieval is temporarily unavailable.")

    history = [{"role": item.role, "content": item.content} for item in request.history]
    prompt = build_prompt(question, history, sources)

    def generate():
        yield _sse({"type": "sources", "sources": [
            {k: source[k] for k in ("product_id", "name", "category", "price", "stock", "distance")}
            for source in sources
        ]})
        for event in stream_answer(prompt):
            yield _sse(event)

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
