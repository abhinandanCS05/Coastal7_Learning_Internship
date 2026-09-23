from app.models import users, User
from app.security import hash_password

users["admin"] = User(
    username="admin",
    password_hash=hash_password("AdminPass123"),
    role="admin"
)

print("Admin user created successfully")
print("Username: admin")
print("Role:", users["admin"].role)