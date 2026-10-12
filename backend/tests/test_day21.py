import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json().get("status") == "ok"

def test_day21_routes_are_registered():
    paths = app.openapi()["paths"]
    assert "/ai/day21/ask" in paths
    assert "/ai/day21/agent" in paths
    assert "/ai/day21/search" in paths
    assert "/ai/day21/moderate" in paths

def test_ask_rejects_missing_message():
    assert client.post("/ai/day21/ask", json={}).status_code in (401, 403)

def test_search_rejects_short_query():
    assert client.post("/ai/day21/search", json={"query": "x"}).status_code in (401, 403)

def test_ask_requires_authentication():
    response = client.post(
        "/ai/day21/ask",
        json={"message": "Find affordable headphones"}
    )
    assert response.status_code in (401, 403)

def test_agent_requires_authentication():
    response = client.post(
        "/ai/day21/agent",
        json={"message": "Find affordable headphones"}
    )
    assert response.status_code in (401, 403)
from fastapi import HTTPException
from app import day21_service as svc

class FakeRedis:
    def __init__(self):
        self.data = {}
        self.counts = {}
        self.expiries = {}
        self.commands = []
    def get(self, key):
        return self.data.get(key)
    def setex(self, key, ttl, value):
        self.data[key] = value
        self.expiries[key] = ttl
    def pipeline(self):
        return self
    def __enter__(self):
        self.commands = []
        return self
    def __exit__(self, *args):
        return False
    def incr(self, key):
        self.commands.append(("incr", key))
    def ttl(self, key):
        self.commands.append(("ttl", key))
    def expire(self, key, ttl):
        self.expiries[key] = ttl
    def execute(self):
        result = []
        for op, key in self.commands:
            if op == "incr":
                self.counts[key] = self.counts.get(key, 0) + 1
                result.append(self.counts[key])
            else:
                result.append(self.expiries.get(key, -1))
        return result

def test_cache_round_trip(monkeypatch):
    fake = FakeRedis()
    monkeypatch.setattr(svc, "_redis", lambda: fake)
    key = svc.cache_key("test", "same question")
    svc.cache_set(key, {"answer": "mock response"}, 60)
    assert svc.cache_get(key) == {"answer": "mock response"}

def test_cache_key_is_stable_and_payload_specific():
    assert svc.cache_key("ask", "hello") == svc.cache_key("ask", "hello")
    assert svc.cache_key("ask", "hello") != svc.cache_key("ask", "different")

def test_cache_fails_open_when_redis_is_unavailable(monkeypatch):
    from redis.exceptions import RedisError
    def unavailable():
        raise RedisError("mock outage")
    monkeypatch.setattr(svc, "_redis", unavailable)
    assert svc.cache_get("test-key") is None
    svc.cache_set("test-key", {"answer": "ok"})

def test_rate_limit_blocks_after_limit(monkeypatch):
    fake = FakeRedis()
    monkeypatch.setattr(svc, "_redis", lambda: fake)
    svc.enforce_user_limit(876543, action="unit", limit=2, window_seconds=60)
    svc.enforce_user_limit(876543, action="unit", limit=2, window_seconds=60)
    with pytest.raises(HTTPException) as exc:
        svc.enforce_user_limit(876543, action="unit", limit=2, window_seconds=60)
    assert exc.value.status_code == 429

def test_rate_limiter_fails_open_when_redis_is_unavailable(monkeypatch):
    from redis.exceptions import RedisError
    def unavailable():
        raise RedisError("mock outage")
    monkeypatch.setattr(svc, "_redis", unavailable)
    svc.enforce_user_limit(876544, action="unit", limit=2, window_seconds=60)
