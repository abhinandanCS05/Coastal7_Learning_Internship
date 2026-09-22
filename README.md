# Day 5 – FastAPI, Pydantic V2, SQLAlchemy 2.0 & Alembic

Day 1 already covered the basic FastAPI setup, routes and API testing. Day 5 therefore focuses on the new backend/database concepts instead of repeating them.

## FastAPI Setup — FastAPI is a Python framework for building APIs with automatic OpenAPI/Swagger documentation.
Basic routing is retained from Day 1 and organized into routers.

## Pydantic V2 — Pydantic validates request data using typed schemas.
This project uses `Field()`, `field_validator`, `model_validator`, and separate request/response schemas.

## SQLAlchemy 2.0 — SQLAlchemy is an ORM for working with database tables through Python models.
This project uses `DeclarativeBase`, relationships, an async engine and `AsyncSession`.

## Alembic — Alembic manages database schema changes through versioned migrations.
Use `alembic revision --autogenerate -m "create users and products"` and `alembic upgrade head`.

## CRUD — CRUD means Create, Read, Update and Delete.
Users and Products each have basic CRUD endpoints.

## Colab
Install: `pip install -r requirements.txt`
Create DB: `sudo -u postgres psql -c "CREATE DATABASE day5_fastapi;"`
Set `DATABASE_URL` to the PostgreSQL async URL.
Run migrations, then start with:
`uvicorn app.main:app --host 0.0.0.0 --port 8000`
Swagger: `/docs`
