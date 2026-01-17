"""Authentication-related Pydantic schemas."""
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Login request schema."""
    aadhar: str = Field(..., min_length=12, max_length=20, description="Aadhar card number (e.g., ABC123456789)")


class OTPRequest(BaseModel):
    """OTP verification request schema."""
    aadhar: str = Field(..., min_length=12, max_length=20, description="Aadhar card number (e.g., ABC123456789)")
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
