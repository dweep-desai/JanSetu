"""JWT token creation and verification."""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from ..config import settings
from ..models.user import RoleType


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


def create_token_for_user(user_id: int, phone: str, role: RoleType) -> str:
    """Create token for a user."""
    data = {
        "sub": str(user_id),
        "phone": phone,
        "role": role.value
    }
    return create_access_token(data)
