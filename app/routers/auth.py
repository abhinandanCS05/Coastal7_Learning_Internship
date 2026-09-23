from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError

from ..auth import get_current_user
from ..config import settings
from ..models import users, User
from ..schemas import RegisterRequest, TokenResponse, RefreshRequest, UserResponse
from ..security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(data: RegisterRequest):
    if data.username in users:
        raise HTTPException(status_code=409, detail="Username already exists")
    users[data.username] = User(data.username, hash_password(data.password), "user")
    return users[data.username]

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users.get(form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    return {
        "access_token": create_access_token(user.username, user.role, settings.jwt_secret_key, settings.access_token_expire_minutes),
        "refresh_token": create_refresh_token(user.username, user.role, settings.jwt_secret_key, settings.refresh_token_expire_days),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest):
    try:
        payload = decode_token(data.refresh_token, settings.jwt_secret_key)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Refresh token required")
        username = payload.get("sub")
        if not username or username not in users:
            raise HTTPException(status_code=401, detail="User not found")
        user = users[username]
        return {
            "access_token": create_access_token(user.username, user.role, settings.jwt_secret_key, settings.access_token_expire_minutes),
            "refresh_token": data.refresh_token,
            "token_type": "bearer",
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
