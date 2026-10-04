```markdown
# ShopFlow — Full-Stack E-Commerce Platform

A full-stack e-commerce platform developed as part of the Coastal7 Knowledge Factory Internship, progressively built and enhanced from **Day 10 through Day 14**.

ShopFlow combines a FastAPI backend with a modern React frontend and demonstrates authentication, product management, cart and wishlist workflows, order processing, admin operations, state management, server-state caching, optimistic updates, infinite scrolling and frontend performance optimization.

---

## Project Overview

ShopFlow is designed as a realistic e-commerce application supporting both customer and administrator workflows.

### Customer Features

- User registration and login
- JWT-based authentication
- Protected routes
- Product browsing
- Product search
- Category and subcategory filtering
- Price filtering
- Product sorting
- Product details
- Wishlist management
- Shopping cart
- Optimistic cart updates
- Address management
- Checkout
- Multiple payment-method selection
- Order placement
- Order history
- Low-stock indicators
- Offers and discounts
- Responsive interface
- Dark/light theme

### Admin Features

- Admin authentication
- Admin dashboard
- Order management
- Order status updates
- Customer/order information
- Product creation
- Product editing
- Product archiving
- Product image upload
- Drag-and-drop image upload
- Image replacement/removal
- Product price and MRP management
- Stock management
- Category/subcategory management
- Offer/badge management

---

# Technology Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- PyJWT
- Argon2 password hashing
- Pydantic
- Uvicorn

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React
- TanStack Query
- Zustand

## Development & Performance

- React Context API
- Custom React Hooks
- React.memo
- useMemo
- useCallback
- useDebounce
- React.lazy
- Suspense
- TanStack Query caching
- Optimistic updates
- Infinite scrolling
- Lighthouse performance auditing
- Production Vite builds

---

# Architecture

```text
                    ┌──────────────────────────┐
                    │        ShopFlow UI        │
                    │     React + Tailwind      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      React Router        │
                    │   Protected Navigation   │
                    └────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       React Context          Zustand        TanStack Query
       Authentication       Client State      Server State
              │                  │                  │
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │        Axios API         │
                    │    JWT Interceptors      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       FastAPI API        │
                    │ Authentication / Orders  │
                    │ Products / Cart / Admin   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       SQLAlchemy          │
                    │          SQLite            │
                    └──────────────────────────┘
```

---

# Project Structure

```text
ShopFlow_Day10_Day13_Complete/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── seed_data.py
│   │
│   ├── uploads/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCart.js
│   │   │   ├── useDebounce.js
│   │   │   └── useProducts.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── queries/
│   │   │   └── queryClient.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── store/
│   │   │   └── cartStore.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── DAY13_REQUIREMENTS.md
│   └── TECHNICAL_REVIEW.md
│
├── .gitignore
├── README.md
├── RUN_BACKEND.ps1
└── RUN_FRONTEND.ps1
```

---

# Day 10 — E-Commerce Backend

The project initially evolved into a complete FastAPI e-commerce backend.

### Implemented

- JWT authentication
- User roles
- Product CRUD
- Product image uploads
- Cart management
- Redis integration
- Order processing
- Stock validation
- Celery background processing
- WebSocket-based order updates
- API testing
- Swagger/OpenAPI documentation

### Backend Concepts

- FastAPI dependency injection
- SQLAlchemy models
- JWT authentication
- Password hashing
- Role-based authorization
- Redis caching
- Celery background tasks
- WebSockets
- API validation
- Automated testing

---

# Day 11 — React Fundamentals & Integration

The backend was integrated with a React frontend.

### Implemented

- React components
- JSX
- Props
- State management
- `useState`
- `useEffect`
- `useRef`
- React Router
- Nested routes
- Protected routes
- Axios service layer
- Axios JWT interceptor
- FastAPI integration

### Result

The application became a functional multi-page React e-commerce frontend communicating with the FastAPI backend.

---

# Day 12 — UI, Forms & Validation

The frontend was refined into a more complete e-commerce interface.

### Implemented

- Tailwind CSS
- Responsive layouts
- Dark/light mode
- Reusable UI components
- Login/Register forms
- Product forms
- Image preview/upload
- Validation
- Product management
- Cart and checkout interface
- Customer/admin workflows
- Admin Command Center
- Product image management
- Order management

The interface was redesigned around the **ShopFlow** e-commerce experience.

---

# Day 13 — E-Commerce Frontend

Day 13 expanded ShopFlow into a complete e-commerce experience.

### Product Catalog

- 120 seeded products
- 6 major categories
- 17 subcategories
- Search
- Filtering
- Sorting
- Product details
- Product images
- Ratings
- Stock indicators

### Categories

```text
Electronics
├── Phones
├── Laptops
├── Televisions
├── Home Gadgets
└── Accessories

Clothing
├── Men
├── Women
└── Kids

Home & Kitchen
├── Kitchen Appliances
├── Cookware
└── Home Essentials

Beauty & Personal Care
├── Skincare
└── Hair Care

Sports & Fitness
├── Fitness
└── Outdoor

Books & Stationery
├── Books
└── Stationery
```

### Customer Workflow

```text
Login/Register
      ↓
Product Discovery
      ↓
Search / Filter / Sort
      ↓
Product Details
      ↓
Wishlist / Cart
      ↓
Address
      ↓
Checkout
      ↓
Payment Method
      ↓
Order
      ↓
Order History
```

### Admin Workflow

```text
Admin Login
     ↓
Admin Command Center
     ├── Orders
     ├── Customers
     ├── Products
     ├── Inventory
     └── Product Images
```

---

# Day 14 — State Management, React Query & Performance

Day 14 focused on optimizing the existing ShopFlow application rather than creating another separate application.

## State Management

Three different state-management approaches were evaluated conceptually and used according to responsibility.

### React Context API

Used for:

- Authentication state
- Current user
- Login/logout
- Session information

### Zustand

Used for lightweight client-side global state.

Current implementation includes:

- Cart count
- Cart UI state
- Cart open/close actions
- Cart reset
- Increment/decrement operations

### Redux

Redux was evaluated as an alternative architecture for larger applications.

It was not added to ShopFlow because the current application did not require Redux's additional reducer/action architecture.

---

# TanStack Query

TanStack Query was introduced for server-state management.

### Query Client

A centralized `QueryClient` was created with:

- Query caching
- Stale-time configuration
- Garbage-collection configuration
- Retry configuration
- Window-focus refetch control

Example configuration:

```javascript
staleTime: 60 * 1000
gcTime: 5 * 60 * 1000
retry: 1
refetchOnWindowFocus: false
```

---

# Product Server-State Management

Products are now fetched using a reusable custom hook:

```text
useInfiniteProducts()
        ↓
TanStack useInfiniteQuery
        ↓
FastAPI /products
        ↓
Paginated response
        ↓
Cached product pages
```

The product endpoint supports:

- Search
- Category
- Subcategory
- Price range
- Sorting
- Pagination

---

# Infinite Scrolling

Product discovery was changed from loading the complete catalog at once to paginated loading.

The frontend requests:

```text
page = 1
page_size = 20
```

and loads additional pages when the user approaches the bottom of the product list.

This allows ShopFlow to handle larger product catalogs more efficiently.

---

# Debounced Search

A reusable `useDebounce` hook was introduced.

```text
User types
    ↓
Wait for short delay
    ↓
Search value stabilizes
    ↓
API query executes
```

This reduces unnecessary API requests while typing.

---

# Optimistic Updates

Cart quantity changes and item removal use TanStack Query mutations with optimistic updates.

### Flow

```text
User changes cart
       ↓
Cancel active query
       ↓
Save previous cache
       ↓
Update UI immediately
       ↓
Send API request
       ↓
 ┌───────────────┐
 │               │
 ▼               ▼
Success         Error
 │               │
 ▼               ▼
Refresh       Rollback
cache         previous state
```

This provides a faster user experience while maintaining rollback safety.

---

# React Performance Patterns

The product interface uses several React performance techniques.

### React.memo

Product cards are memoized to avoid unnecessary rendering when their props do not change.

### useMemo

Used for derived values such as:

- Product filters
- Computed product collections
- Derived UI data

### useCallback

Used for stable event handlers such as:

- Wishlist actions
- Add-to-cart actions
- Filter reset actions

### Lazy Loading

Routes are loaded using:

```javascript
React.lazy()
```

with:

```javascript
Suspense
```

This separates large application sections into individual chunks.

---

# Code Splitting

The following areas are lazy-loaded:

- Dashboard
- Products
- Product Details
- Cart
- Checkout
- Orders
- Wishlist
- Admin
- Layout
- ProtectedRoute

This reduces the amount of JavaScript required during the initial application load.

---

# Performance Audit

Production performance was measured using Lighthouse.

### Final measured result

```text
Performance Score: 81 / 100
```

The score improved from the earlier production baseline of:

```text
77 / 100
```

to:

```text
81 / 100
```

after frontend optimization and code splitting.

### Final measurements

```text
First Contentful Paint: ~1.69 s
Largest Contentful Paint: ~1.69 s
Total Blocking Time: ~743 ms
Cumulative Layout Shift: 0
Speed Index: ~1.82 s
```

The project intentionally records the **measured 81/100 result** rather than claiming an unverified 90+ score.

---

# Production Build

The final Vite production build successfully completed.

```text
Vite: 7.3.6

Modules transformed: 1712

Main JavaScript:
351.08 kB

Gzipped:
114.22 kB
```

Code splitting generated separate chunks for major application sections.

---

# Backend API

Important API groups include:

```text
/auth/register
/auth/login
/me
/me/address

/categories

/products
/products/{id}

/wishlist
/wishlist/{product_id}

/cart
/cart/items
/cart/items/{product_id}

/offers

/orders

/admin/orders
/admin/orders/{id}/status

/admin/products
/admin/products/{id}
/admin/products/{id}/image

/health
```

---

# Authentication

ShopFlow uses JWT-based authentication.

### Authentication Flow

```text
Login
  ↓
FastAPI validates credentials
  ↓
JWT generated
  ↓
Token stored by frontend
  ↓
Axios interceptor attaches token
  ↓
Protected API request
```

The frontend uses an Axios interceptor to automatically attach the JWT:

```text
Authorization: Bearer <token>
```

---

# Role-Based Access

Two primary roles are supported:

```text
user
admin
```

### Customer

Customers can:

- Browse products
- Manage wishlist
- Manage cart
- Manage address
- Checkout
- Place orders
- View orders

### Admin

Admins can:

- Manage products
- Manage product images
- Manage inventory
- Manage orders
- View customer/order information

Customer-only operations such as checkout and order placement are protected on the backend.

---

# Offers & Inventory

ShopFlow includes demonstration offers such as:

- 10% discount above ₹999
- ₹500 discount above ₹7999
- Free shipping above ₹499

Products with stock below 10 units display a low-stock indicator.

---

# Payment Methods

Checkout supports payment-method selection including:

- Cash on Delivery
- UPI
- Net Banking
- Card

These methods are currently **modeled as application options**.

No real payment gateway or financial transaction processing is implemented.

---

# Running the Project

## Backend

Navigate to:

```powershell
cd backend
```

Create/activate the virtual environment if required and install dependencies:

```powershell
pip install -r requirements.txt
```

Start FastAPI:

```powershell
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend

Navigate to:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start development server:

```powershell
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Demo Accounts

## Customer

```text
Email: demo@shopflow.com
Password: Demo@123
```

## Admin

```text
Email: admin@shopflow.com
Password: Admin@123
```

---

# Development Verification

The project was verified through:

- FastAPI startup
- Frontend development server
- Production Vite build
- Customer authentication
- Admin authentication
- Product browsing
- Search
- Filtering
- Sorting
- Infinite scrolling
- Product details
- Wishlist
- Cart
- Optimistic cart updates
- Checkout
- Orders
- Admin product management
- Admin order management
- Product image upload/replacement
- Production Lighthouse audit

---

# Git Branch Progression

The project was developed progressively through separate internship-day branches.

```text
day10-ecommerce
      ↓
day11-react-ecommerce
      ↓
day12-RefineUI
      ↓
day13-Fronted-part1
      ↓
day14-state-react-query-performance
```

Day 14 branch:

```text
day14-state-react-query-performance
```

Day 14 commit:

```text
Day 14: State management, React Query and performance optimization
```

---

# Day 14 Learning Outcome

By completing Day 14, the ShopFlow frontend progressed from a functional React application into a more structured and performance-aware frontend architecture.

### Key concepts implemented

- Context API
- Zustand
- TanStack Query
- Query caching
- Server-state management
- Custom hooks
- Infinite queries
- Infinite scrolling
- Optimistic updates
- Query invalidation
- Rollback handling
- Debounced search
- React.memo
- useMemo
- useCallback
- React.lazy
- Suspense
- Code splitting
- Lighthouse performance analysis

---

# Important Technical Notes

This project is an internship learning and demonstration project.

The current implementation is not intended to represent production-scale Amazon/Flipkart infrastructure.

Potential production improvements include:

- PostgreSQL instead of SQLite
- Database-level pagination and sorting
- Redis-backed production caching
- Real payment gateway integration
- Object storage for product images
- Background workers
- Database migrations
- Stronger rate limiting
- Production CORS configuration
- Secure deployment secrets
- CDN integration
- Advanced observability
- Automated CI/CD
- Comprehensive end-to-end testing
- Further bundle optimization

The current backend pagination implementation retrieves matching records before applying sorting and slicing in Python. For a production-scale catalog, sorting and pagination should be delegated to the database using `ORDER BY`, `OFFSET`, and `LIMIT`.

---

# Project Status

```text
Day 10  → E-Commerce Backend                 ✅
Day 11  → React Fundamentals & Integration   ✅
Day 12  → UI, Forms & Validation             ✅
Day 13  → E-Commerce Frontend                ✅
Day 14  → State & Performance Optimization   ✅
```

## Current Status

**ShopFlow Day 10–14 implementation completed and verified successfully.**

The project now demonstrates a complete full-stack e-commerce workflow together with modern React state management, server-state caching, optimistic interactions, infinite product loading and frontend performance optimization.
```

