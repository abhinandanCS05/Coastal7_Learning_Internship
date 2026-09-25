# Day 8 – Async Programming, Redis Caching & Celery

## Overview
Day 8 focuses on building high-performance FastAPI services using asynchronous programming, Redis caching and rate limiting, and Celery-based background processing.

The project demonstrates the difference between lightweight FastAPI `BackgroundTasks` and a distributed task queue using Celery, along with scheduled tasks through Celery Beat and task monitoring through Flower.

## Learning Objectives

- Understand the event loop, coroutines, and `async def` vs `def`
- Use `asyncio.gather()` for concurrent I/O operations
- Implement Redis cache-aside with TTL and cache invalidation
- Implement sliding-window rate limiting with Redis sorted sets
- Use Celery workers for long-running background jobs
- Configure Celery retries and task states
- Schedule periodic tasks with Celery Beat
- Monitor workers and tasks using Flower
- Understand when to use FastAPI `BackgroundTasks` vs Celery

## Project Structure

```text
Day_8_Async_Redis_Celery_API/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── redis_client.py
│   ├── celery_app.py
│   ├── tasks.py
│   ├── services.py
│   ├── rate_limit.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   └── test_api.py
├── docs/
│   └── API_TEST_CHECKLIST.md
├── postman/
│   └── Day_8_Async_Redis_Celery.postman_collection.json
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Technologies Used

- Python
- FastAPI
- Uvicorn
- HTTPX
- Redis
- Upstash Redis (remote Redis used for development)
- Celery
- Celery Beat
- Flower
- Pydantic Settings
- Pytest
- Postman

## Setup

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create `.env` from `.env.example` and configure the Redis and Celery connection settings.

For a TLS Redis provider such as Upstash, the Celery URLs should include the required TLS parameter, for example:

```text
rediss://default:<PASSWORD>@<HOST>:6379/0?ssl_cert_reqs=required
```

**Never commit `.env`, Redis passwords, tokens, or other credentials.**

## Run FastAPI

From the project root:

```powershell
python -m uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger/OpenAPI:

```text
http://127.0.0.1:8000/docs
```

## Run Celery Worker

For Windows development, use the `solo` pool:

```powershell
celery -A app.celery_app.celery_app worker --loglevel=info --pool=solo
```

The worker executes tasks such as `process_report` and scheduled health-check tasks.

## Run Celery Beat

Start the scheduler in a separate terminal:

```powershell
celery -A app.celery_app.celery_app beat --loglevel=info
```

The project schedules `health_check_task` periodically. Beat places the scheduled task on the Celery queue, and the worker executes it.

## Run Flower

Start Flower in a separate terminal:

```powershell
celery -A app.celery_app.celery_app flower
```

Flower dashboard:

```text
http://127.0.0.1:5555
```

Flower is used to monitor workers, task execution and task states.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/async-fetch` | Fetch multiple URLs concurrently using async I/O |
| GET | `/cached-data` | Read data using Redis cache-aside logic |
| DELETE | `/cached-data/{key}` | Invalidate cached data |
| POST | `/background-task` | Demonstrate FastAPI BackgroundTasks |
| POST | `/celery-task` | Queue a Celery report-processing task |
| GET | `/celery-task/{task_id}` | Check Celery task status/result |

## Redis Features

### Cache-Aside Pattern

The API checks Redis first. If the requested value is not available, the service obtains the data and stores it in Redis with a TTL.

```text
Request
   ↓
Check Redis
   ├── Cache hit → Return cached data
   └── Cache miss → Fetch data → Store in Redis → Return data
```

### TTL

Cached entries use a configurable TTL through:

```text
CACHE_TTL
```

### Cache Invalidation

Cached values can be explicitly removed through:

```text
DELETE /cached-data/{key}
```

### Sliding-Window Rate Limiting

Redis sorted sets are used to track request timestamps within a configurable time window. Requests above the configured limit receive HTTP `429 Too Many Requests`.

Configuration:

```text
RATE_LIMIT_REQUESTS
RATE_LIMIT_WINDOW
```

## Async Programming

The `/async-fetch` endpoint uses:

- `async def`
- `httpx.AsyncClient`
- `asyncio.gather()`

This allows independent I/O-bound requests to execute concurrently instead of waiting for each request sequentially.

## BackgroundTasks vs Celery

### FastAPI BackgroundTasks

Suitable for small tasks that can run after the HTTP response, such as lightweight notifications or simple local processing.

### Celery

Suitable for longer-running, retryable, worker-based jobs that should be processed outside the API request lifecycle.

In this project, `process_report` is implemented as a Celery task with retry/backoff configuration.

## Testing

### Postman

The provided Postman collection was used for final API verification:

```text
postman/Day_8_Async_Redis_Celery.postman_collection.json
```

Verified API flows include:

- Health check
- Concurrent async fetch
- Redis cache read
- Cache invalidation
- FastAPI background task
- Celery task submission
- Celery task status/result
- Rate limiting behavior

Celery Beat and Flower were also verified separately through their scheduler/worker logs and Flower dashboard.

### Pytest

Run the automated tests with:

```powershell
pytest
```

## Final Day 8 Outcome

The project demonstrates a complete FastAPI workflow combining:

```text
FastAPI
   │
   ├── Async I/O ────────────────┐
   │                             │
   ├── Redis Cache + TTL         │
   │                             │
   ├── Rate Limiting             │
   │                             ▼
   ├── BackgroundTasks      Redis / Celery
   │                             │
   └── Celery API ───────→ Worker
                                 │
                           Celery Beat
                                 │
                              Flower
```

The application was manually verified through Swagger/Postman, with Celery Worker, Beat, and Flower running as separate services during development.

## Security Notes

- Keep `.env` out of Git.
- Never commit Redis passwords, tokens, API keys, or connection strings.
- Use environment variables for credentials and deployment-specific configuration.
