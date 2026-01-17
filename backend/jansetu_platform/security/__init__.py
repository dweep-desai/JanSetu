"""Security Module."""
from .jwt import create_access_token, verify_token, create_token_for_user
from .otp import generate_otp, store_otp, verify_otp, delete_otp
from .dependencies import (
    get_current_user,
    require_role,
    require_citizen,
    require_service_provider,
    require_admin,
    require_authenticated,
)

__all__ = [
    "create_access_token",
    "verify_token",
    "create_token_for_user",
    "generate_otp",
    "store_otp",
    "verify_otp",
    "delete_otp",
    "get_current_user",
    "require_role",
    "require_citizen",
    "require_service_provider",
    "require_admin",
    "require_authenticated",
]
