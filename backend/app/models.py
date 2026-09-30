from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(500), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    full_name = Column(String(120), default="")
    phone = Column(String(30), default="")
    address_line = Column(String(255), default="")
    city = Column(String(100), default="")
    state = Column(String(100), default="")
    pincode = Column(String(20), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    category = Column(String(80), nullable=False)
    subcategory = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    mrp = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String(500), default="")
    badge = Column(String(80), default="")
    offer_text = Column(String(150), default="")
    rating = Column(Float, default=4.2)
    reviews = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total = Column(Float, default=0)
    payment_method = Column(String(40), nullable=False)
    payment_status = Column(String(40), default="PENDING")
    status = Column(String(40), default="PLACED")
    address_snapshot = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, nullable=False)
    product_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
