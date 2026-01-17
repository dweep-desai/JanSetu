"""User-related Pydantic schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from ..models.user import RoleType


class RoleSchema(BaseModel):
    """Role schema."""
    id: int
    name: RoleType
    created_at: datetime
    
    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    """Base user schema."""
    phone: Optional[str] = Field(None, min_length=10, max_length=15)  # Optional for backward compatibility
    aadhar: str = Field(..., min_length=12, max_length=20)


class UserCreate(UserBase):
    """User creation schema."""
    role: RoleType = RoleType.CITIZEN


class UserResponse(UserBase):
    """User response schema."""
    id: int
    role: RoleSchema
    created_at: datetime
    
    model_config = {"from_attributes": True}
    
    @classmethod
    def model_validate(cls, obj):
        """Override to handle backward compatibility with phone field."""
        if hasattr(obj, 'phone') and obj.phone is None:
            # If phone is None, we can still create the response
            pass
        return super().model_validate(obj)