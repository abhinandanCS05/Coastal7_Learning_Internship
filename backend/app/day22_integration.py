import asyncio
import json
import os
import time
from collections import defaultdict, deque
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/ai/day22", tags=["Day 22 AI Integration"])

# These are process-local safeguards. Use Redis-backed counters for
# consistent quotas across multiple backend workers/instances.
_usage = defaultdict(lambda: {"requests": 0, "estimated_tokens": 0})
_request_times = defaultdict(deque)
_order_connections = defaultdict(set)
_cache = {}
_cache_lock = asyncio.Lock()


class AskRequest(BaseModel):
    question: str = Field(min_length=2, max_length=1200)
    user_id: str = Field(min_length=1, max_length=128)


class SearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=500)
    limit: int = Field(default=5, ge=1, le=20)


class DescriptionRequest(BaseModel):
    product_name: str = Field(min_length=1, max_length=200)
    product_details: str = Field(min_length=1, max_length=3000)


class OrderStatusRequest(BaseModel):
    order_id: str = Field(min_length=1, max_length=128)
    status: str = Field(min_length=1, max_length=80)


async def _redis():
    try:
        from redis.asyncio import Redis
        client = Redis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            decode_responses=True,
            socket_connect_timeout=1,
            socket_timeout=1,
        )
        await client.ping()
        return client
    except Exception:
        return None


async def _cached(key: str):
    async with _cache_lock:
        item = _cache.get(key)
        if item and item["expires"] > time.time():
            return item["value"]
        _cache.pop(key, None)

    client = await _redis()
    if client:
        try:
            value = await client.get("shopflow:day22:" + key)
            if value is not None:
                await client.aclose()
                return json.loads(value)
        except Exception:
            pass
        finally:
            try:
                await client.aclose()
            except Exception:
                pass
    return None


async def _cache_value(key: str, value: Any, ttl: int = 180):
    async with _cache_lock:
        _cache[key] = {"value": value, "expires": time.time() + ttl}

    client = await _redis()
    if client:
        try:
            await client.setex("shopflow:day22:" + key, ttl, json.dumps(value))
        except Exception:
            pass
        finally:
            try:
                await client.aclose()
            except Exception:
                pass


def _check_rate(user_id: str, limit: int = 20):
    now = time.time()
    events = _request_times[user_id]
    while events and events[0] < now - 60:
        events.popleft()
    if len(events) >= limit:
        raise HTTPException(status_code=429, detail="AI request limit reached; retry later.")
    events.append(now)


def _record_usage(user_id: str, text: str):
    _usage[user_id]["requests"] += 1
    _usage[user_id]["estimated_tokens"] += max(1, len(text) // 4)


async def _retrieve_catalogue(question: str, limit: int = 5):
    """Retrieve matching active products using the existing semantic-search service."""
    import inspect
    from app.database import SessionLocal
    from app.models import Product
    from app.ai_service import semantic_search_products

    db = SessionLocal()
    try:
        query = db.query(Product)
        if hasattr(Product, "is_active"):
            query = query.filter(Product.is_active.is_(True))

        products = query.all()
        if not products:
            return []

        result = semantic_search_products(
            question,
            products,
            top_k=max(1, min(int(limit), 20)),
        )
        if inspect.isawaitable(result):
            result = await result

        return list(result or [])[:limit]
    finally:
        db.close()


async def _generate(question: str, context: list):
    # Prefer existing configured provider integration rather than hard-coding keys.
    try:
        from app import ai_service
        for name in ("answer_question", "generate_answer", "chat_completion"):
            fn = getattr(ai_service, name, None)
            if fn:
                try:
                    result = fn(question=question, context=context)
                except TypeError:
                    result = fn(question)
                if hasattr(result, "__await__"):
                    result = await result
                if isinstance(result, str) and result.strip():
                    return result
                if isinstance(result, dict):
                    answer = result.get("answer") or result.get("content")
                    if answer:
                        return str(answer)
    except Exception:
        pass

    # OpenAI-compatible provider fallback. No provider is called unless configured.
    from openai import AsyncOpenAI

    providers = [
        ("GROQ_API_KEY", "https://api.groq.com/openai/v1",
         os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")),
        ("MISTRAL_API_KEY", "https://api.mistral.ai/v1",
         os.getenv("MISTRAL_MODEL", "mistral-small-latest")),
    ]
    google_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if google_key:
        providers.append((
            "GEMINI_API_KEY", "https://generativelanguage.googleapis.com/v1beta/openai/",
            os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        ))

    context_text = json.dumps(context, default=str)[:12000]
    messages = [
        {"role": "system", "content":
         "You are ShopFlow's product assistant. Answer using the supplied catalogue context. "
         "If the context does not support an answer, explicitly say so. Do not invent product "
         "prices, stock, delivery promises, or order statuses. Cite product names or IDs used."},
        {"role": "user", "content":
         f"Catalogue context:\n{context_text}\n\nQuestion: {question}"}
    ]

    errors = []
    for env_name, base_url, model in providers:
        key = google_key if env_name == "GEMINI_API_KEY" else os.getenv(env_name)
        if not key:
            continue
        try:
            client = AsyncOpenAI(api_key=key, base_url=base_url, timeout=20)
            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.2,
                max_tokens=700,
            )
            answer = response.choices[0].message.content
            if answer and answer.strip():
                return answer.strip()
            errors.append(f"{model}: empty response")
        except Exception as exc:
            errors.append(f"{model}: {type(exc).__name__}")

    raise HTTPException(
        status_code=503,
        detail="AI providers are unavailable or not configured. Please retry later."
    )


@router.post("/ask")
async def ask(request: AskRequest):
    _check_rate(request.user_id)
    key = "ask:" + str(hash(request.question.strip().lower()))
    cached = await _cached(key)
    if cached:
        return {"answer": cached["answer"], "sources": cached["sources"], "cached": True}

    products = await _retrieve_catalogue(request.question)
    answer = await _generate(request.question, products)
    sources = [
        {
            "product": str(p.get("name") or p.get("title") or "Catalogue item"),
            "id": str(p.get("id") or p.get("product_id") or "")
        }
        for p in products if isinstance(p, dict)
    ]
    result = {"answer": answer, "sources": sources, "cached": False}
    _record_usage(request.user_id, answer)
    await _cache_value(key, result, 180)
    return result


@router.post("/stream")
async def stream(request: AskRequest):
    _check_rate(request.user_id)

    async def events():
        try:
            products = await _retrieve_catalogue(request.question)
            answer = await _generate(request.question, products)
            sources = [
                {"product": str(p.get("name") or p.get("title") or "Catalogue item"),
                 "id": str(p.get("id") or p.get("product_id") or "")}
                for p in products if isinstance(p, dict)
            ]
            # This streams chunks of a completed answer. True token-by-token streaming
            # requires a streaming-capable provider integration.
            for offset in range(0, len(answer), 24):
                yield "data: " + json.dumps({
                    "type": "token",
                    "content": answer[offset:offset + 24]
                }) + "\n\n"
            yield "data: " + json.dumps({"type": "sources", "sources": sources}) + "\n\n"
            yield "data: " + json.dumps({"type": "done"}) + "\n\n"
            _record_usage(request.user_id, answer)
        except Exception as exc:
            detail = exc.detail if isinstance(exc, HTTPException) else "Assistant temporarily unavailable."
            yield "data: " + json.dumps({"type": "error", "message": detail}) + "\n\n"

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


@router.post("/search")
async def semantic_search(request: SearchRequest):
    key = "search:" + str(hash(request.query.lower())) + ":" + str(request.limit)
    cached = await _cached(key)
    if cached is not None:
        return {"results": cached, "cached": True}

    results = await _retrieve_catalogue(request.query, request.limit)
    await _cache_value(key, results, 120)
    return {"results": results, "cached": False}


@router.post("/descriptions")
async def generate_description(request: DescriptionRequest):
    prompt = (
        "Write a clear, factual e-commerce product description using only these details. "
        "Do not invent specifications, certifications, warranties, or performance claims.\n"
        f"Product: {request.product_name}\nDetails: {request.product_details}"
    )
    description = await _generate(prompt, [])
    _record_usage("description-generation", description)
    return {"description": description, "saved": False}


@router.get("/usage")
async def usage():
    # Process-local estimates, not a provider billing statement.
    return {
        "usage": dict(_usage),
        "note": "Approximate in-process usage estimates; configure provider billing/quota "
                "monitoring and shared Redis counters for production."
    }


@router.websocket("/orders/{order_id}")
async def order_updates(websocket: WebSocket, order_id: str):
    # Production must validate the user's session/token and ownership of this order
    # before accepting the connection.
    await websocket.accept()
    _order_connections[order_id].add(websocket)
    try:
        await websocket.send_json({
            "type": "connected",
            "order_id": order_id,
            "message": "Connected. Waiting for order-status updates."
        })
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        _order_connections[order_id].discard(websocket)


@router.post("/orders/publish")
async def publish_order_status(request: OrderStatusRequest):
    # Internal/admin-only in production: protect this endpoint with authorization.
    payload = {
        "type": "order_status",
        "order_id": request.order_id,
        "status": request.status,
        "event_id": str(uuid4()),
        "timestamp": time.time()
    }
    connections = list(_order_connections.get(request.order_id, set()))
    failed = []
    for connection in connections:
        try:
            await connection.send_json(payload)
        except Exception:
            failed.append(connection)
    for connection in failed:
        _order_connections[request.order_id].discard(connection)
    return {"sent": len(connections) - len(failed), "event": payload}


@router.post("/tasks/description")
async def enqueue_description(request: DescriptionRequest):
    # Uses Celery if the project has a compatible task registered.
    try:
        from app.celery_app import celery_app
        task = celery_app.send_task(
            "shopflow.generate_product_description",
            args=[request.product_name, request.product_details]
        )
        return {"queued": True, "task_id": task.id}
    except Exception:
        # Do not pretend work was queued when no worker/task is configured.
        raise HTTPException(
            status_code=503,
            detail="Description background task is not configured. Configure a Celery app, "
                   "broker, worker and registered task first."
        )
