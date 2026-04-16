import os
import hashlib
import hmac
import secrets
import time
from typing import Optional
from datetime import datetime, timedelta, timezone

import jwt                    # pip install PyJWT
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database import get_user_by_id

# ── Config ────────────────────────────────────────────────────
SECRET_KEY  = os.getenv("JWT_SECRET_KEY", secrets.token_hex(32))   # set in .env for persistence
ALGORITHM   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 h

security = HTTPBearer(auto_error=False)


# ── Password helpers ──────────────────────────────────────────

def hash_password(password: str) -> str:
    """SHA-256 hash with a random salt, stored as  salt:hash."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(plain: str, stored: str) -> bool:
    """Verify a plain password against a stored 'salt:hash'."""
    try:
        salt, hashed = stored.split(":", 1)
        expected = hashlib.sha256((salt + plain).encode()).hexdigest()
        return hmac.compare_digest(expected, hashed)
    except Exception:
        return False


# ── JWT helpers ───────────────────────────────────────────────

def create_access_token(user_id: int, username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "username": username,
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# ── FastAPI dependency ────────────────────────────────────────

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    """
    Dependency that extracts and validates the JWT from the Authorization header.
    Raises 401 if missing / invalid / expired.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please login again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = int(payload["sub"])
    user = get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user   # returns full user dict from DB

def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Same as get_current_user but returns None instead of raising 401.
    Useful for endpoints that work both for logged-in and anonymous users.
    """
    if credentials is None:
        return None
    payload = decode_token(credentials.credentials)
    if payload is None:
        return None
    try:
        user_id = int(payload["sub"])
    except (KeyError, ValueError, TypeError):
        return None
    return get_user_by_id(user_id)