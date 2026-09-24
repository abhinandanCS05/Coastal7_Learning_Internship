import os
os.environ["DATABASE_URL"] = "sqlite:///./test_day7.db"
os.environ["JWT_SECRET_KEY"] = "test-secret"
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

engine = create_engine("sqlite:///./test_day7.db", connect_args={"check_same_thread": False})
SessionTest = sessionmaker(bind=engine)
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

def override_db():
    db = SessionTest()
    try: yield db
    finally: db.close()

app.dependency_overrides[get_db] = override_db
client = TestClient(app)

def test_register_login_project():
    assert client.post("/auth/register", json={"username": "testuser", "password": "TestPass123"}).status_code == 201
    login = client.post("/auth/login", json={"username": "testuser", "password": "TestPass123"})
    assert login.status_code == 200
    token = login.json()["access_token"]
    response = client.post("/projects", json={"name": "Demo"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201

def test_unauthenticated_projects():
    assert client.get("/projects").status_code == 401
