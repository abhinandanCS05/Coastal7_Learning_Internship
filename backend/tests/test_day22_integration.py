from fastapi.testclient import TestClient


def test_day22_usage_endpoint():
    from app.main import app
    client = TestClient(app)
    response = client.get("/ai/day22/usage")
    assert response.status_code == 200
    assert "usage" in response.json()


def test_day22_semantic_search_validates_query():
    from app.main import app
    client = TestClient(app)
    response = client.post("/ai/day22/search", json={"query": "x", "limit": 5})
    assert response.status_code == 422
