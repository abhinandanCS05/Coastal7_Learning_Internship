import json
from types import SimpleNamespace
from app import day21_plus_router as plus

def test_cached_answer_skips_provider(monkeypatch):
    cached = {"answer": "Mock cached answer", "provider": "mock", "cached": False}
    monkeypatch.setattr(plus, "_moderate", lambda text: {"allowed": True, "category": "test"})
    monkeypatch.setattr(plus, "enforce_user_limit", lambda *a, **k: None)
    monkeypatch.setattr(plus, "cache_key", lambda *a, **k: "test-key")
    monkeypatch.setattr(plus, "cache_get", lambda key: dict(cached))
    monkeypatch.setattr(plus, "_complete_with_fallback", lambda *a, **k: (_ for _ in ()).throw(AssertionError("Provider should not be called")))
    result = plus.cached_ai_answer(
        plus.AskRequest(message="Recommend a laptop"),
        user=SimpleNamespace(id=987654),
        db=None,
    )
    assert result["answer"] == "Mock cached answer"
    assert result["cached"] is True

def test_unknown_agent_tool_is_rejected():
    result = plus._run_tool("delete_order", {}, None)
    assert "error" in result

def test_invalid_product_id_is_handled_safely():
    result = plus._run_tool("get_product", {"product_id": "not-a-number"}, None)
    assert "error" in result

def test_search_tool_rejects_short_query():
    result = plus._run_tool("search_products", {"query": "x"}, None)
    assert "error" in result

def test_agent_returns_answer_without_tool_calls(monkeypatch):
    fake_message = SimpleNamespace(content="Here are some shopping tips.", tool_calls=[])
    fake_response = SimpleNamespace(choices=[SimpleNamespace(message=fake_message)])
    monkeypatch.setattr(plus, "_moderate", lambda text: {"allowed": True, "category": "test"})
    monkeypatch.setattr(plus, "enforce_user_limit", lambda *a, **k: None)
    monkeypatch.setattr(plus, "_complete_with_fallback", lambda *a, **k: (fake_response, "mock-provider"))
    result = plus.shopping_agent(
        plus.AgentRequest(message="How should I choose a laptop?"),
        user=SimpleNamespace(id=987655),
        db=None,
    )
    assert result["answer"] == "Here are some shopping tips."
    assert result["provider"] == "mock-provider"
    assert result["tool_calls"] == 0
