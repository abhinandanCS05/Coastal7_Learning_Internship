from pathlib import Path

from fastapi import Depends, FastAPI, File, HTTPException, Query, UploadFile, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.celery_app import send_order_confirmation
from app.config import settings
from app.database import Base, SessionLocal, engine, get_db
from app.models import Order, OrderItem, Product, User
from app.schemas import (
    AdminOrderOut,
    CartOut,
    OrderCreate,
    OrderItemOut,
    OrderOut,
    ProductCreate,
    ProductOut,
    ProductUpdate,
    Token,
    UserCreate,
)
from app.security import (
    current_user,
    hash_password,
    make_token,
    require_admin,
    verify_password,
)


# ============================================================
# APP SETUP
# ============================================================

app = FastAPI(
    title="ShopFlow E-Commerce API",
    version="2.0.0",
    description="Day 12 E-Commerce Backend with Admin Order Management",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)

settings.upload_dir.mkdir(parents=True, exist_ok=True)

app.mount(
    "/files",
    StaticFiles(directory=str(settings.upload_dir)),
    name="files",
)


# ============================================================
# IN-MEMORY CART
# ============================================================
# Cart is intentionally kept simple for the Day 12 learning
# project. Redis can be integrated later without changing the
# order-management API design.

carts: dict[int, dict[int, int]] = {}


# ============================================================
# WEBSOCKET CONNECTION MANAGEMENT
# ============================================================

user_connections: dict[int, list[WebSocket]] = {}
admin_connections: list[WebSocket] = []


async def connect_user_websocket(
    user_id: int,
    websocket: WebSocket,
) -> None:
    await websocket.accept()

    user_connections.setdefault(user_id, []).append(websocket)


def disconnect_user_websocket(
    user_id: int,
    websocket: WebSocket,
) -> None:
    connections = user_connections.get(user_id, [])

    if websocket in connections:
        connections.remove(websocket)

    if not connections:
        user_connections.pop(user_id, None)


async def send_to_user(
    user_id: int,
    message: dict,
) -> None:
    connections = user_connections.get(user_id, [])

    disconnected = []

    for websocket in connections:
        try:
            await websocket.send_json(message)
        except Exception:
            disconnected.append(websocket)

    for websocket in disconnected:
        disconnect_user_websocket(user_id, websocket)


async def connect_admin_websocket(
    websocket: WebSocket,
) -> None:
    await websocket.accept()
    admin_connections.append(websocket)


def disconnect_admin_websocket(
    websocket: WebSocket,
) -> None:
    if websocket in admin_connections:
        admin_connections.remove(websocket)


async def broadcast_admin(
    message: dict,
) -> None:
    disconnected = []

    for websocket in admin_connections:
        try:
            await websocket.send_json(message)
        except Exception:
            disconnected.append(websocket)

    for websocket in disconnected:
        disconnect_admin_websocket(websocket)


# ============================================================
# HEALTH
# ============================================================


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ShopFlow E-Commerce API",
        "version": "2.0.0",
    }


# ============================================================
# AUTHENTICATION
# ============================================================


@app.post(
    "/auth/register",
    response_model=Token,
)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="user",
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": make_token(user),
        "token_type": "bearer",
    }


@app.post(
    "/auth/login",
    response_model=Token,
)
def login(
    payload: UserCreate,
    role: str = Query(
        default="user",
        pattern="^(user|admin)$",
    ),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        payload.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if user.role != role:
        raise HTTPException(
            status_code=403,
            detail=f"This account is not registered as {role}",
        )

    return {
        "access_token": make_token(user),
        "token_type": "bearer",
    }


# ============================================================
# PRODUCTS
# ============================================================


def product_to_dict(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "image_filename": product.image_filename,
    }


@app.get(
    "/products",
    response_model=list[ProductOut],
)
def list_products(
    db: Session = Depends(get_db),
):
    products = (
        db.query(Product)
        .order_by(Product.id)
        .all()
    )

    return [
        product_to_dict(product)
        for product in products
    ]


@app.get(
    "/products/{product_id}",
    response_model=ProductOut,
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product_to_dict(product)


@app.post(
    "/products",
    response_model=ProductOut,
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    product = Product(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock=payload.stock,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product_to_dict(product)


@app.put(
    "/products/{product_id}",
    response_model=ProductOut,
)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    updates = payload.model_dump(
        exclude_unset=True,
    )

    for key, value in updates.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product_to_dict(product)


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully",
        "product_id": product_id,
    }


# ============================================================
# PRODUCT IMAGE UPLOAD
# ============================================================


@app.post("/products/{product_id}/image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    allowed_types = {
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/webp",
    }

    extension = Path(file.filename or "").suffix.lower()

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".jfif",
        ".png",
        ".webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG and WEBP images are allowed",
        )

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Invalid image extension. Use JPG, JPEG, PNG or WEBP.",
        )

    if extension in {".jpeg", ".jfif"}:
        extension = ".jpg"

    filename = f"product_{product_id}{extension}"

    settings.upload_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    destination = settings.upload_dir / filename

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty",
        )

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 5 MB",
        )

    destination.write_bytes(content)

    product.image_filename = filename

    db.commit()
    db.refresh(product)

    return {
        "message": "Product image uploaded successfully",
        "filename": filename,
        "url": f"/files/{filename}",
    }

@app.get(
    "/cart",
    response_model=CartOut,
)
def get_cart(
    user: User = Depends(current_user),
):
    cart = get_user_cart(user.id)

    items = [
        {
            "product_id": product_id,
            "quantity": quantity,
        }
        for product_id, quantity in cart.items()
    ]

    return {
        "items": items,
        "total_items": sum(cart.values()),
    }


@app.post(
    "/cart/items",
    response_model=CartOut,
)
def add_cart_item(
    item: dict,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    product_id = item.get("product_id")
    quantity = item.get("quantity")

    if not isinstance(product_id, int):
        raise HTTPException(
            status_code=400,
            detail="product_id must be an integer",
        )

    if not isinstance(quantity, int) or quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="quantity must be greater than zero",
        )

    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    cart = get_user_cart(user.id)

    existing_quantity = cart.get(product_id, 0)

    if existing_quantity + quantity > product.stock:
        raise HTTPException(
            status_code=400,
            detail=f"Only {product.stock} units available",
        )

    cart[product_id] = existing_quantity + quantity

    return {
        "items": [
            {
                "product_id": pid,
                "quantity": qty,
            }
            for pid, qty in cart.items()
        ],
        "total_items": sum(cart.values()),
    }


@app.delete("/cart")
def clear_cart(
    user: User = Depends(current_user),
):
    carts[user.id] = {}

    return {
        "message": "Cart cleared successfully",
    }


# ============================================================
# ORDER SERIALIZATION
# ============================================================


def customer_order_response(
    order: Order,
    db: Session,
) -> dict:
    items = []

    for item in order.items:
        product = db.get(
            Product,
            item.product_id,
        )

        product_name = (
            product.name
            if product
            else f"Product #{item.product_id}"
        )

        items.append(
            {
                "product_id": item.product_id,
                "product_name": product_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
            }
        )

    return {
        "id": order.id,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "items": items,
    }


def admin_order_response(
    order: Order,
    db: Session,
) -> dict:
    items = []

    for item in order.items:
        product = db.get(
            Product,
            item.product_id,
        )

        product_name = (
            product.name
            if product
            else f"Product #{item.product_id}"
        )

        subtotal = (
            item.quantity * item.unit_price
        )

        items.append(
            {
                "product_id": item.product_id,
                "product_name": product_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": subtotal,
            }
        )

    return {
        "id": order.id,
        "user_id": order.user_id,
        "user_email": order.user.email,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "items": items,
    }


# ============================================================
# CREATE ORDER
# ============================================================


@app.post(
    "/orders",
    response_model=OrderOut,
)
async def create_order(
    payload: OrderCreate,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    cart = get_user_cart(user.id)

    if not cart:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty",
        )

    # --------------------------------------------------------
    # Validate requested products
    # --------------------------------------------------------

    validated_items = []

    total_amount = 0.0

    for item in payload.items:
        product = db.get(
            Product,
            item.product_id,
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found",
            )

        if item.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for "
                    f"{product.name}. "
                    f"Available: {product.stock}"
                ),
            )

        subtotal = (
            product.price * item.quantity
        )

        total_amount += subtotal

        validated_items.append(
            (
                product,
                item.quantity,
            )
        )

    # --------------------------------------------------------
    # Create order
    # --------------------------------------------------------

    order = Order(
        user_id=user.id,
        total_amount=total_amount,
        status="PLACED",
    )

    db.add(order)
    db.flush()

    for product, quantity in validated_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            unit_price=product.price,
        )

        db.add(order_item)

        product.stock -= quantity

    db.commit()
    db.refresh(order)

    # --------------------------------------------------------
    # Clear customer cart
    # --------------------------------------------------------

    carts[user.id] = {}

    # --------------------------------------------------------
    # Notify customer
    # --------------------------------------------------------

    await send_to_user(
        user.id,
        {
            "event": "ORDER_STATUS",
            "order_id": order.id,
            "status": "PLACED",
            "message": (
                f"Order #{order.id} has been placed"
            ),
        },
    )

    # --------------------------------------------------------
    # Notify connected admins
    # --------------------------------------------------------

    await broadcast_admin(
        {
            "event": "NEW_ORDER",
            "order_id": order.id,
            "user_id": user.id,
            "user_email": user.email,
            "status": "PLACED",
            "message": (
                f"New order #{order.id} "
                f"received from {user.email}"
            ),
        }
    )

    # --------------------------------------------------------
    # Background confirmation email
    #
    # Celery/Redis failure MUST NOT fail the order.
    # --------------------------------------------------------

    try:
        send_order_confirmation.delay(
            user.email,
            order.id,
        )
    except Exception as exc:
        print(
            "Celery unavailable. "
            f"Order #{order.id} was still created. "
            f"Reason: {exc}"
        )

    return customer_order_response(
        order,
        db,
    )


# ============================================================
# CUSTOMER ORDERS
# ============================================================


@app.get(
    "/orders",
    response_model=list[OrderOut],
)
def get_customer_orders(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.id.desc())
        .all()
    )

    return [
        customer_order_response(
            order,
            db,
        )
        for order in orders
    ]


# ============================================================
# ADMIN ORDER MANAGEMENT
# ============================================================


@app.get(
    "/admin/orders",
    response_model=list[AdminOrderOut],
)
def get_all_orders(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .order_by(Order.id.desc())
        .all()
    )

    return [
        admin_order_response(
            order,
            db,
        )
        for order in orders
    ]


@app.patch(
    "/admin/orders/{order_id}/status",
)
async def update_order_status(
    order_id: int,
    status: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    allowed_statuses = {
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
    }

    status = status.upper().strip()

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. "
                "Allowed values: "
                "PLACED, PROCESSING, SHIPPED, DELIVERED"
            ),
        )

    order = db.get(Order, order_id)

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    current_status = order.status

    status_order = {
        "PLACED": 0,
        "PROCESSING": 1,
        "SHIPPED": 2,
        "DELIVERED": 3,
    }

    # Do not allow moving backwards.
    if status_order[status] < status_order[current_status]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Order cannot move from "
                f"{current_status} back to {status}"
            ),
        )

    order.status = status

    db.commit()
    db.refresh(order)

    # --------------------------------------------------------
    # Send live update to customer
    # --------------------------------------------------------

    await send_to_user(
        order.user_id,
        {
            "event": "ORDER_STATUS",
            "order_id": order.id,
            "status": order.status,
            "message": (
                f"Order #{order.id} "
                f"is now {order.status}"
            ),
        },
    )

    # --------------------------------------------------------
    # Send update to all admins
    # --------------------------------------------------------

    await broadcast_admin(
        {
            "event": "ORDER_STATUS_UPDATED",
            "order_id": order.id,
            "user_id": order.user_id,
            "user_email": order.user.email,
            "status": order.status,
            "message": (
                f"Order #{order.id} "
                f"updated to {order.status}"
            ),
        }
    )

    return {
        "message": "Order status updated successfully",
        "order_id": order.id,
        "status": order.status,
    }


# ============================================================
# CUSTOMER WEBSOCKET
# ============================================================


@app.websocket("/ws/orders")
async def customer_order_websocket(
    websocket: WebSocket,
):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(
            code=1008,
            reason="Authentication token required",
        )
        return

    db = SessionLocal()

    try:
        import jwt

        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret,
                algorithms=["HS256"],
            )

            user_id = int(payload["sub"])

        except Exception:
            await websocket.close(
                code=1008,
                reason="Invalid authentication token",
            )
            return

        user = db.get(User, user_id)

        if not user or not user.is_active:
            await websocket.close(
                code=1008,
                reason="Invalid user",
            )
            return

        if user.role != "user":
            await websocket.close(
                code=1008,
                reason="Customer account required",
            )
            return

        await connect_user_websocket(
            user.id,
            websocket,
        )

        await websocket.send_json(
            {
                "event": "CONNECTED",
                "message": (
                    "Order tracking connection established"
                ),
            }
        )

        while True:
            await websocket.receive_text()

    except Exception:
        pass

    finally:
        try:
            disconnect_user_websocket(
                user_id,
                websocket,
            )
        except Exception:
            pass

        db.close()


# ============================================================
# ADMIN WEBSOCKET
# ============================================================


@app.websocket("/ws/admin")
async def admin_websocket(
    websocket: WebSocket,
):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(
            code=1008,
            reason="Authentication token required",
        )
        return

    db = SessionLocal()

    try:
        import jwt

        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret,
                algorithms=["HS256"],
            )

            user_id = int(payload["sub"])

        except Exception:
            await websocket.close(
                code=1008,
                reason="Invalid authentication token",
            )
            return

        user = db.get(User, user_id)

        if not user or not user.is_active:
            await websocket.close(
                code=1008,
                reason="Invalid user",
            )
            return

        if user.role != "admin":
            await websocket.close(
                code=1008,
                reason="Admin access required",
            )
            return

        await connect_admin_websocket(
            websocket,
        )

        await websocket.send_json(
            {
                "event": "CONNECTED",
                "message": (
                    "Admin order notification connection established"
                ),
            }
        )

        while True:
            await websocket.receive_text()

    except Exception:
        pass

    finally:
        disconnect_admin_websocket(
            websocket,
        )

        db.close()

