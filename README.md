# Day 11 – React Fundamentals, Hooks & Router Integration

## Relationship to Day 10

Day 11 is the **frontend integration layer for Day 10**. Day 10 remains the FastAPI e-commerce backend. Day 11 adds a React client that consumes the Day 10 JWT-authenticated APIs.

```text
React 19 + React Router v6
        |
        | Axios service layer + JWT interceptors
        v
FastAPI Day 10 backend
   |        |        |        |
 SQLite    Redis    Celery   WebSocket
```

The ZIP contains both `frontend/` and an integrated `backend/` copy so the complete stack can be run and reviewed together.

## Day 11 requirements covered

- React components and JSX
- Props through reusable UI components
- Component composition
- Conditional rendering
- List rendering
- `useState`
- `useEffect`
- `useRef`
- Controlled inputs and event handling
- React Router v6
- Nested routes and `Outlet`
- `useParams` in product details
- `useNavigate` after login/order actions
- Axios service layer
- Axios request interceptor for Bearer JWT
- Axios response interceptor for 401 handling
- Login and registration UI
- Protected route component
- JWT-authenticated FastAPI calls
- Product listing, details, create, update, delete and image upload
- Redis-backed cart interaction
- Order placement and order history
- WebSocket order-status updates

## Project structure

```text
Day_11_React_ECommerce_Integration/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Orders.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── backend/
    └── Day 10 FastAPI integration
```

## Frontend setup

Open a terminal in `frontend`:

```powershell
npm install
copy .env.example .env
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend must be available at:

```text
http://127.0.0.1:8000
```

If your backend uses another host/port, update `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000
```

## Backend setup

Open another terminal in `backend`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

For Redis/Celery features, configure Redis in `.env`. Hosted Upstash Redis supports database 0 in this project, so the broker and result backend should use `/0`.

Start the Celery worker in a separate terminal:

```powershell
.\.venv\Scripts\python.exe -m celery -A app.celery_app.celery_app worker --loglevel=info --pool=solo
```

## Authentication flow

### Register

The frontend registration page calls:

```text
POST /auth/register
```

Registration creates a normal `user` account and stores the returned JWT.

### Login

The login page sends:

```json
{
  "email": "user@example.com",
  "password": "Test123456",
  "role": "user"
}
```

The backend verifies that the requested role matches the stored role before issuing the JWT.

### Axios request interceptor

Every authenticated API request automatically receives:

```text
Authorization: Bearer <JWT>
```

The React components therefore do not manually attach the token to every request.

### Axios response interceptor

A `401 Unauthorized` response clears the stored token and redirects the user to `/login`.

## React Router structure

```text
/
├── /login
├── /register
└── /app                 protected layout
    ├── /app             dashboard
    ├── /app/products    product list
    ├── /app/products/:productId  product details
    ├── /app/cart        Redis cart
    └── /app/orders      order history + WebSocket
```

`AppLayout` uses `<Outlet />` for nested route rendering. `ProductDetails` uses `useParams()` and navigation uses `useNavigate()`.

## End-to-end demo

1. Start FastAPI.
2. Start Celery if order background processing is required.
3. Start React with `npm run dev`.
4. Open `http://localhost:5173`.
5. Register a new user.
6. Sign in as `user`.
7. Confirm the protected dashboard loads.
8. Open Products and create a product.
9. Open the product details page.
10. Upload an image and verify it is served by FastAPI.
11. Add the product to the cart.
12. Open Cart and place an order.
13. Open Orders and verify the order.
14. Keep the Orders page open and update an order status; the WebSocket event appears in the Live events panel.
15. Log out and verify protected pages redirect to `/login`.

## Day 11 expected outcome

A multi-page React application with reusable components, hooks, nested Router v6 routes, centralized Axios communication, JWT request/response interceptors, protected routes, and authenticated calls into the Day 10 FastAPI backend.
