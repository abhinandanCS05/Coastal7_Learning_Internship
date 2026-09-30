from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# AUTHENTICATION
# ============================================================


class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ============================================================
# PRODUCTS
# ============================================================


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: float = Field(gt=0)
    stock: int = Field(ge=0)


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    price: float
    stock: int
    image_filename: str | None = None


# ============================================================
# CART
# ============================================================


class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class CartOut(BaseModel):
    items: list[CartItem]
    total_items: int


# ============================================================
# ORDERS
# ============================================================


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str | None = None
    quantity: int
    unit_price: float

    @property
    def subtotal(self) -> float:
        return self.quantity * self.unit_price


class OrderOut(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemOut]


# ============================================================
# ADMIN ORDER MANAGEMENT
# ============================================================


class AdminOrderItemOut(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float


class AdminOrderOut(BaseModel):
    id: int
    user_id: int
    user_email: str
    total_amount: float
    status: str
    created_at: datetime
    items: list[AdminOrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str


# ============================================================
# WEBSOCKET EVENTS
# ============================================================


class OrderStatusEvent(BaseModel):
    event: str
    order_id: int
    status: str


class AdminOrderEvent(BaseModel):
    event: str
    order_id: int
    user_id: int
    user_email: str
    status: str