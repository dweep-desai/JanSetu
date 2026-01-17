"""Authentication-related Pydantic schemas."""
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Login request schema."""
    phone: str = Field(..., min_length=10, max_length=10, description="10-digit phone number")


class OTPRequest(BaseModel):
    """OTP verification request schema."""
    phone: str = Field(..., min_length=10, max_length=10, description="10-digit phone number")
    otp_id: str = Field(..., description="OTP ID returned from login")
    otp_code: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")


class OTPResponse(BaseModel):
    """OTP generation response schema."""
    otp_id: str
    message: str = "OTP sent successfully"
    expires_in: int = 300  # seconds


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
