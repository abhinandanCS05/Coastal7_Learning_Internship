Yes. Keep the README **only about this ShopFlow Day 10–13 project**, 
# ShopFlow — Full-Stack E-Commerce Platform

A complete full-stack e-commerce application built with FastAPI and React, covering customer shopping workflows and an admin management system.

## Features

### Customer
- User registration and login
- JWT authentication
- Product browsing
- Search, filtering and sorting
- Category and subcategory navigation
- Product details
- Wishlist
- Shopping cart
- Stock-aware purchasing
- Low-stock indicators
- Address management
- Checkout
- Cash on Delivery, UPI, Net Banking and Card payment selection
- Order history
- Order status tracking

### Product Catalog
- 120+ seeded products
- Multiple categories and subcategories
- Product images
- Product ratings and reviews
- Discounts and offers
- Product badges
- Stock management
- "Only X left" low-stock indicator

### Admin
- Admin-only product management
- Create products
- Edit product details
- Update price, MRP and stock
- Update category and subcategory
- Update offers and badges
- Archive products
- Order management
- Order status updates
- Product image upload
- Drag-and-drop image upload
- Image replacement
- Image preview
- Image removal

## Technology Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT
- Argon2 password hashing
- WebSockets
- Pillow
- Uvicorn

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

## Project Structure

```text
ShopFlow_Day10_Day13_Complete/
├── backend/
│   ├── app/
│   ├── uploads/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
├── RUN_BACKEND.ps1
├── RUN_FRONTEND.ps1
├── README.md
└── .gitignore
```

## Backend API

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Frontend

Frontend:

```text
http://localhost:5173
```

## Run Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

## Demo Accounts

### Customer

```text
Email: demo@shopflow.com
Password: Demo@123
```

### Admin

```text
Email: admin@shopflow.com
Password: Admin@123
```

## Order Flow

```text
Product Discovery
        ↓
Product Details
        ↓
Wishlist / Cart
        ↓
Address
        ↓
Checkout
        ↓
Order Placement
        ↓
Admin Order Management
        ↓
Order Status Updates
```

## Admin Product Image Flow

```text
Choose File / Drag & Drop
        ↓
Image Preview
        ↓
Save Product
        ↓
Upload to FastAPI
        ↓
Store Image
        ↓
Update Product Image URL
        ↓
Refresh Product Data
```

Supported image formats:

```text
JPG
PNG
WebP
```

Maximum image size:

```text
5 MB
```

## Notes

- Payment methods are implemented as checkout selections; no real payment gateway is connected.
- Product images can be uploaded and replaced from the admin panel.
- Local development uses SQLite.
- The project is intended as an internship-scale e-commerce implementation.

```