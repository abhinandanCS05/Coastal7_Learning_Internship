# Day 10 – Mini-Project: E-Commerce Backend

## Overview

Day 10 combines the major FastAPI backend concepts developed during the previous days into one integrated e-commerce backend.

### Included
- JWT authentication
- Product CRUD
- Product image upload and Pillow processing
- Redis-backed shopping cart
- Order placement with stock validation
- Celery background order-confirmation processing
- WebSocket order-status notifications
- Redis product-list caching
- Pytest automated testing
- Swagger/OpenAPI documentation
- Postman collection
- Black, isort, Flake8, mypy and pre-commit

## Architecture

```text
Client / Postman / Swagger
            |
            v
        FastAPI API
       /     |      \
      v      v       v
 SQLite    Redis   WebSocket
 Users     Cart     Order updates
 Products  Cache
 Orders
      |
      v
    Celery
      |
      v
Order confirmation task
```

## Main Endpoints

### Authentication
- `POST /auth/register`
- `POST /auth/login`

### Products
- `POST /products`
- `GET /products`
- `GET /products/{product_id}`
- `PUT /products/{product_id}`
- `DELETE /products/{product_id}`
- `POST /products/{product_id}/image`

### Cart
- `GET /cart`
- `POST /cart/items`
- `DELETE /cart`

### Orders
- `POST /orders`
- `GET /orders`
- `PATCH /orders/{order_id}/status`

### WebSocket
- `WS /ws/orders?token=<JWT>`

### File Access
- `GET /files/{filename}`

## Authentication

Passwords are hashed with Argon2 through `pwdlib`. JWT access tokens protect product management, cart and order operations.

## Product Image Upload

The upload flow validates:
1. Extension
2. MIME type
3. Maximum file size
4. Actual image content with Pillow

Images are resized within `1024 x 1024`, normalized to RGB where required and stored as generated JPEG files.

## Redis Cart

Cart data is stored under:

```text
cart:{user_id}
```

The cart uses a one-hour TTL and is isolated per user.

## Redis Product Caching

`GET /products` uses cache-aside behavior:

```text
Request -> Redis hit -> return
             |
             miss
             v
          Database
             |
             v
        Redis set -> return
```

The product cache is invalidated after product changes and after order stock changes.

## Order Flow

```text
Order request
   ↓
Validate product
   ↓
Validate stock
   ↓
Calculate total
   ↓
Decrease stock
   ↓
Create Order + OrderItems
   ↓
Clear Redis cart
   ↓
Invalidate product cache
   ↓
Queue Celery confirmation
   ↓
Broadcast WebSocket status
```

## Celery

The order-confirmation task is:

```text
send_order_confirmation
```

For this internship project the email operation is simulated with a console log, so no real email credentials are required.

Start the worker:

```powershell
celery -A app.celery_app.celery_app worker --loglevel=info --pool=solo
```

## WebSocket Demo

Run:

```powershell
python client_websocket.py <access_token>
```

The client connects with the JWT, receives a connected event, demonstrates echo communication and then waits for order-status notifications.

## Testing

The starter suite contains **21 tests** covering:
- authentication
- protected routes
- product CRUD
- product image upload
- Redis cart
- stock validation
- order placement
- Celery task queuing
- order history
- WebSocket echo
- WebSocket order notifications
- order-status updates

Run:

```powershell
pytest
```

Coverage:

```powershell
pytest --cov=app --cov-report=term-missing
```

## Code Quality

```powershell
python -m black app tests
python -m isort app tests
python -m flake8 app tests
python -m mypy app
pre-commit run --all-files
```

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Copy `.env.example` to `.env`.

For the full Redis/Celery flow, run a Redis server locally or configure a hosted Redis provider through the environment variables.

Start the API:

```powershell
python -m uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Start Celery separately:

```powershell
celery -A app.celery_app.celery_app worker --loglevel=info --pool=solo
```

## Important Scope Notes

This is a learning mini-project designed to integrate the Day 5–9 backend concepts. The email task is intentionally simulated rather than sending real email. SQLite is used as the default local database so the project is easy to start; it can later be replaced with PostgreSQL.

## Expected Day 10 Outcome

A complete integrated e-commerce backend with authentication, product management, image uploads, Redis cart and caching, stock-aware order processing, Celery background work, WebSocket order updates, automated tests and API documentation.
