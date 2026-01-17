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
    phone: str = Field(..., min_length=10, max_length=15)


class UserCreate(UserBase):
    """User creation schema."""
    role: RoleType = RoleType.CITIZEN


class UserResponse(UserBase):
    """User response schema."""
    id: int
    role: RoleSchema
    created_at: datetime
    
    model_config = {"from_attributes": True}
