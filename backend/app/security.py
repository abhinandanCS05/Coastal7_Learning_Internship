from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User


# ============================================================
# PASSWORD HASHING
# ============================================================

ph = PasswordHash.recommended()

bearer = HTTPBearer()


def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(
    password: str,
    hashed_password: str,
) -> bool:
    return ph.verify(
        password,
        hashed_password,
    )


# ============================================================
# JWT
# ============================================================


def make_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "exp": (
            datetime.now(timezone.utc)
            + timedelta(minutes=60)
        ),
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm="HS256",
    )


def current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=["HS256"],
        )

        user_id = int(payload["sub"])

    except (
        jwt.PyJWTError,
        KeyError,
        TypeError,
        ValueError,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
        )

    user = db.get(
        User,
        user_id,
    )

    if not user or not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
        )

    return user


# ============================================================
# ROLE PROTECTION
# ============================================================


def require_admin(
    user: User = Depends(current_user),
) -> User:

    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return user