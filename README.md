# Day 6 - Authentication & Security

Learning-focused FastAPI implementation covering password hashing, JWT access/refresh tokens, OAuth2PasswordBearer, Depends(), role-based access, CORS, and pydantic-settings.

## Why each component is used
- Password hashing: passwords must not be stored as plain text; bcrypt creates a one-way hash that can be verified later.
- JWT: carries authenticated identity between requests; access tokens are short-lived and refresh tokens obtain new access tokens.
- OAuth2PasswordBearer: extracts a Bearer token from the Authorization header.
- Depends(): reuses authentication/authorization logic before protected endpoints.
- Role-based access: separates authentication (who are you?) from authorization (what can you do?).
- CORS: controls which browser frontend origins may call the API.
- pydantic-settings/.env: keeps secrets and environment configuration outside source code.

## Run
pip install -r requirements.txt
Copy .env.example to .env and set JWT_SECRET_KEY.
uvicorn app.main:app --reload

Endpoints:
POST /register
POST /login
GET /me
POST /refresh
GET /products
POST /products (admin only)
PUT /products/{product_id} (admin only)

This version intentionally uses an in-memory user store to keep the implementation simple for the Day 6 security concepts. It can be connected to the Day 5 SQLAlchemy/PostgreSQL models later.
