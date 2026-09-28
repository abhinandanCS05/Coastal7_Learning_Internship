from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=6)
    role: str = Field(pattern="^(user|admin)$")

class Token(BaseModel):
    access_token: str
    token_type: str


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""
    price: float = Field(gt=0)
    stock: int = Field(ge=0)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
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


class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class CartOut(BaseModel):
    items: list[CartItem]
    total_items: int


class OrderCreate(BaseModel):
    items: list[CartItem] = Field(min_length=1)


class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class OrderOut(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemOut]


