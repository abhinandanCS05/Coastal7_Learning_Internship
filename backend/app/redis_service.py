import json
from typing import Any
import redis.asyncio as redis
from app.config import settings

redis_client = redis.from_url(settings.redis_url, decode_responses=True)

async def get_json(key: str) -> Any | None:
    value = await redis_client.get(key)
    return json.loads(value) if value else None

async def set_json(key: str, value: Any, ttl: int = 60) -> None:
    await redis_client.set(key, json.dumps(value), ex=ttl)

async def delete_key(key: str) -> None:
    await redis_client.delete(key)

def cart_key(user_id: int) -> str:
    return f"cart:{user_id}"

def product_cache_key() -> str:
    return "products:list"
