# Day 12 Final — ShopFlow E-Commerce

This package is the continuous Day 10 → Day 11 → Day 12 application.

## Day 10
FastAPI e-commerce backend: JWT auth, user/admin roles, product CRUD, image upload,
cart, stock validation, orders, Redis/Celery/WebSocket architecture and OpenAPI.

## Day 11
React + Vite frontend: React components/hooks, Router, Axios service/interceptors,
JWT protected routes, product/cart/order screens and user WebSocket tracking.

## Day 12
The SAME application is upgraded with Tailwind CSS, responsive premium UI, dark mode,
interactive dialogs/toasts/dropdowns, validated forms, dynamic product variants,
multi-step product workflow, image upload/preview, accessibility-focused controls,
and an admin order command center.

## New requested flow
Customer → Add to Cart → Checkout → Place Order
→ FastAPI validates stock → creates order → clears cart
→ Admin receives an immediate WebSocket notification.

## Run
Backend:
    cd backend
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    uvicorn app.main:app --reload

Frontend:
    cd frontend
    npm install
    npm run dev

Frontend: http://localhost:5173
Backend:  http://127.0.0.1:8000/docs

Use your existing Day 10 Upstash Redis/Celery .env values when enabling those services.
Never commit real secrets.
