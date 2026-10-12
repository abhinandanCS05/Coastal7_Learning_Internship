"""Day 21 Redis utilities: best-effort response cache and per-user limits."""
import hashlib
import json
import logging
import os
from redis import Redis
from redis.exceptions import RedisError
from fastapi import HTTPException

logger = logging.getLogger(__name__)

def _redis():
    return Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"), decode_responses=True, socket_connect_timeout=1, socket_timeout=1)

def cache_key(namespace: str, payload: str) -> str:
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return f"shopflow:day21:cache:{namespace}:{digest}"

def cache_get(key: str):
    try:
        value = _redis().get(key)
        return json.loads(value) if value else None
    except (RedisError, ValueError, TypeError):
        logger.warning("Day 21 cache read unavailable; continuing without cache")
        return None

def cache_set(key: str, value, ttl_seconds: int = 300) -> None:
    try:
        _redis().setex(key, max(1, ttl_seconds), json.dumps(value, ensure_ascii=False))
    except (RedisError, TypeError, ValueError):
        logger.warning("Day 21 cache write unavailable; continuing without cache")

def enforce_user_limit(user_id: int, action: str = "ai", limit: int = 20, window_seconds: int = 60) -> None:
    """Limit an authenticated user/action pair; fail open if Redis is unavailable."""
    key = f"shopflow:day21:rate:{action}:{int(user_id)}"
    try:
        client = _redis()
        with client.pipeline() as pipe:
            pipe.incr(key)
            pipe.ttl(key)
            count, ttl = pipe.execute()
        if count == 1 or ttl < 0:
            client.expire(key, max(1, window_seconds))
        if count > limit:
            raise HTTPException(status_code=429, detail="AI request limit reached. Please try again shortly.", headers={"Retry-After": str(max(1, ttl))})
    except HTTPException:
        raise
    except RedisError:
        logger.warning("Day 21 rate limiter unavailable; allowing request")
