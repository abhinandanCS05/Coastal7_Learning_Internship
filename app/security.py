from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    # Why: store a one-way hash instead of the original password.
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    # Why: verify login credentials without storing plain text.
    return pwd_context.verify(password, password_hash)

def create_access_token(username, role, secret, minutes):
    # Why: short-lived credential for protected API requests.
    exp = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    return jwt.encode({"sub": username, "role": role, "type": "access", "exp": exp}, secret, algorithm=ALGORITHM)

def create_refresh_token(username, role, secret, days):
    # Why: longer-lived credential used to obtain a new access token.
    exp = datetime.now(timezone.utc) + timedelta(days=days)
    return jwt.encode({"sub": username, "role": role, "type": "refresh", "exp": exp}, secret, algorithm=ALGORITHM)

def decode_token(token, secret):
    return jwt.decode(token, secret, algorithms=[ALGORITHM])
