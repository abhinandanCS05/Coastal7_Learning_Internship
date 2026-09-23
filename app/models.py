from dataclasses import dataclass

@dataclass
class User:
    username: str
    password_hash: str
    role: str = "user"

# Simple in-memory store for learning authentication concepts.
users = {}

products = {
    1: {"id": 1, "name": "Laptop", "price": 75000},
    2: {"id": 2, "name": "Keyboard", "price": 2500},
}
from .security import hash_password

users["admin"] = User(
    username="admin",
    password_hash=hash_password("AdminPass123"),
    role="admin"
)
