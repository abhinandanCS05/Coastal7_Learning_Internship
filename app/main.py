from contextlib import asynccontextmanager
from typing import AsyncIterator

import jwt
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.cart_service import clear_cart, get_cart, save_cart
from app.celery_app import send_order_confirmation
from app.config import settings
from app.connection_manager import manager
from app.database import Base, engine, get_db
from app.image_service import validate_and_save_image
from app.models import Order, OrderItem, Product, User
from app.redis_service import delete_key, get_json, product_cache_key, set_json
from app.schemas import (
    CartItem,
    CartOut,
    LoginRequest,
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
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Day 10 E-Commerce Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def order_response(order: Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        total_amount=order.total_amount,
        status=order.status,
        created_at=order.created_at,
        items=[
            OrderItemOut(
                product_id=i.product_id,
                quantity=i.quantity,
                unit_price=i.unit_price,
            )
            for i in order.items
        ],
    )


@app.get("/files/{filename}")
def get_file(filename: str) -> FileResponse:
    path = settings.upload_dir / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path)


@app.post("/auth/register", response_model=Token, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> Token:
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return Token(
        access_token=create_access_token(user.id, user.role),
        token_type="bearer",
    )


@app.post("/auth/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> Token:
    user = db.scalar(select(User).where(User.email == payload.email))

    if not user or not verify_password(
        payload.password,
        user.hashed_password,
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.role != payload.role:
        raise HTTPException(status_code=401, detail="Invalid role")

    return Token(
        access_token=create_access_token(user.id, user.role),
        token_type="bearer",
    )


@app.post("/products", response_model=ProductOut, status_code=201)
async def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ProductOut:
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)

    await delete_key(product_cache_key())

    return ProductOut.model_validate(product)


@app.get("/products", response_model=list[ProductOut])
async def list_products(db: Session = Depends(get_db)) -> list[ProductOut]:
    cached = await get_json(product_cache_key())

    if cached is not None:
        return [ProductOut.model_validate(item) for item in cached]

    products = list(db.scalars(select(Product).order_by(Product.id)).all())
    data = [ProductOut.model_validate(p).model_dump() for p in products]

    await set_json(product_cache_key(), data, ttl=60)

    return [ProductOut.model_validate(item) for item in data]


@app.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)) -> ProductOut:
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductOut.model_validate(product)


@app.put("/products/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ProductOut:
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    await delete_key(product_cache_key())

    return ProductOut.model_validate(product)


@app.delete("/products/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    await delete_key(product_cache_key())


@app.post("/products/{product_id}/image", response_model=ProductOut)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ProductOut:
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.image_filename = await validate_and_save_image(file)

    db.commit()
    db.refresh(product)

    await delete_key(product_cache_key())

    return ProductOut.model_validate(product)


@app.get("/cart", response_model=CartOut)
async def read_cart(user: User = Depends(get_current_user)) -> CartOut:
    items = await get_cart(user.id)

    return CartOut(
        items=[CartItem(**i) for i in items],
        total_items=sum(i["quantity"] for i in items),
    )


@app.post("/cart/items", response_model=CartOut)
async def add_cart_item(
    item: CartItem,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CartOut:
    product = db.get(Product, item.product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if item.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    items = await get_cart(user.id)

    for existing in items:
        if existing["product_id"] == item.product_id:
            if existing["quantity"] + item.quantity > product.stock:
                raise HTTPException(
                    status_code=400,
                    detail="Insufficient stock",
                )

            existing["quantity"] += item.quantity
            break
    else:
        items.append(item.model_dump())

    await save_cart(user.id, items)

    return CartOut(
        items=[CartItem(**i) for i in items],
        total_items=sum(i["quantity"] for i in items),
    )


@app.delete("/cart", status_code=204)
async def empty_cart(user: User = Depends(get_current_user)) -> None:
    await clear_cart(user.id)


@app.post("/orders", response_model=OrderOut, status_code=201)
async def place_order(
    payload: OrderCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> OrderOut:
    total = 0.0
    order_items: list[OrderItem] = []

    for requested in payload.items:
        product = db.get(Product, requested.product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {requested.product_id} not found",
            )

        if requested.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product {product.id}",
            )

        product.stock -= requested.quantity
        total += product.price * requested.quantity

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=requested.quantity,
                unit_price=product.price,
            )
        )

    order = Order(
        user_id=user.id,
        total_amount=total,
        status="PLACED",
        items=order_items,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    await clear_cart(user.id)
    await delete_key(product_cache_key())

    send_order_confirmation.delay(order.id, user.email, total)

    await manager.send_to_user(
        user.id,
        {
            "event": "order_status",
            "order_id": order.id,
            "status": order.status,
        },
    )

    return order_response(order)


@app.get("/orders", response_model=list[OrderOut])
def list_orders(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[OrderOut]:
    orders = list(
        db.scalars(
            select(Order).where(Order.user_id == user.id).order_by(Order.id)
        ).all()
    )

    return [order_response(o) for o in orders]


@app.patch("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: int,
    status: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> OrderOut:
    order = db.get(Order, order_id)

    if not order or order.user_id != user.id:
        raise HTTPException(status_code=404, detail="Order not found")

    allowed = {
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    }

    if status not in allowed:
        raise HTTPException(status_code=400, detail="Invalid order status")

    order.status = status
    db.commit()
    db.refresh(order)

    await manager.send_to_user(
        user.id,
        {
            "event": "order_status",
            "order_id": order.id,
            "status": order.status,
        },
    )

    return order_response(order)


@app.websocket("/ws/orders")
async def order_websocket(websocket: WebSocket) -> None:
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, TypeError, ValueError):
        await websocket.close(code=1008)
        return

    await manager.connect(user_id, websocket)

    try:
        await websocket.send_json(
            {
                "event": "connected",
                "user_id": user_id,
            }
        )

        while True:
            message = await websocket.receive_text()
            await websocket.send_json(
                {
                    "event": "echo",
                    "message": message,
                }
            )
    except Exception:
        manager.disconnect(user_id, websocket)
