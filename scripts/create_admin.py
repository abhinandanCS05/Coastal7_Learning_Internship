from getpass import getpass
from sqlalchemy import select
from app.database import SessionLocal
from app.models import User, UserRole
from app.security import hash_password

username = input("Admin username: ").strip()
password = getpass("Admin password: ")
db = SessionLocal()
try:
    if db.scalar(select(User).where(User.username == username)):
        print("Username already exists.")
    elif len(username) < 3 or len(password) < 8:
        print("Username must be 3+ chars and password 8+ chars.")
    else:
        db.add(User(username=username, password_hash=hash_password(password), role=UserRole.ADMIN))
        db.commit()
        print(f"Admin '{username}' created successfully.")
finally:
    db.close()
