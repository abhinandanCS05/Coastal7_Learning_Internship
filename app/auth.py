from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from .config import settings
from .models import users, User
from .security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Why: central authentication dependency for every protected route.
    error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token, settings.jwt_secret_key)
        if payload.get("type") != "access":
            raise error
        username = payload.get("sub")
        if not username or username not in users:
            raise error
    except JWTError:
        raise error
    return users[username]

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    # Why: authentication identifies the user; this adds authorization.
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
