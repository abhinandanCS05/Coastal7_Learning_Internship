import pytest
from types import SimpleNamespace
from fastapi import HTTPException
from app import day21_plus_router as plus

def test_moderation_returns_structured_result():
    result = plus._moderate("Recommend a laptop for college")
    assert isinstance(result["allowed"], bool)
    assert "category" in result

def test_provider_fallback_uses_next_provider(monkeypatch):
    class FakeOpenAI:
        calls = 0
        def __init__(self, **kwargs):
            self.chat = self
            self.completions = self
        def create(self, **kwargs):
            FakeOpenAI.calls += 1
            if FakeOpenAI.calls == 1:
                raise RuntimeError("simulated provider failure")
            return SimpleNamespace(
                choices=[
                    SimpleNamespace(
                        message=SimpleNamespace(
                            content="Mock answer",
                            tool_calls=None
                        )
                    )
                ]
            )

    FakeOpenAI.calls = 0
    monkeypatch.setattr(plus, "OpenAI", FakeOpenAI)
    monkeypatch.setattr(plus, "provider_configs", lambda: [
        {"name": "first", "key": "fake", "base_url": "https://example.invalid", "model": "fake"},
        {"name": "second", "key": "fake", "base_url": "https://example.invalid", "model": "fake"},
    ])
    response, provider = plus._complete_with_fallback([{"role": "user", "content": "hello"}])
    assert provider == "second"
    assert response.choices[0].message.content == "Mock answer"

def test_all_providers_fail_with_503(monkeypatch):
    class FailedOpenAI:
        def __init__(self, **kwargs):
            self.chat = self
            self.completions = self
        def create(self, **kwargs):
            raise RuntimeError("simulated provider outage")

    monkeypatch.setattr(plus, "OpenAI", FailedOpenAI)
    monkeypatch.setattr(plus, "provider_configs", lambda: [
        {"name": "offline", "key": "fake", "base_url": "https://example.invalid", "model": "fake"},
    ])
    with pytest.raises(HTTPException) as exc:
        plus._complete_with_fallback([{"role": "user", "content": "hello"}])
    assert exc.value.status_code == 503



