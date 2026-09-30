from typing import Literal
from pydantic import BaseModel, EmailStr, Field

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=2)

class LoginIn(BaseModel):
    email: EmailStr
    password: str
    role: Literal["user", "admin"] = "user"

class AddressIn(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    pincode: str

class CartIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=20)

class CheckoutIn(BaseModel):
    payment_method: Literal["COD", "UPI", "NET_BANKING", "CARD"]
    address: AddressIn

class StatusIn(BaseModel):
    status: Literal["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
