"""Service-related Pydantic schemas."""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from ..models.service import ServiceStatus, OnboardingStatus, ServiceCategory


class ServiceBase(BaseModel):
    """Base service schema."""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    base_url: str = Field(..., description="Base URL of the service")
    category: ServiceCategory
    service_id: str = Field(..., min_length=1, max_length=100, description="URL-friendly service identifier")


class ServiceOnboardingRequestCreate(ServiceBase):
    """Service onboarding request creation schema."""
    pass


class ServiceOnboardingRequestResponse(BaseModel):
    """Service onboarding request response schema."""
    id: int
    name: str
    description: Optional[str]
    base_url: str
    category: ServiceCategory
    service_id: str
    status: OnboardingStatus
    admin_notes: Optional[str]
    submitted_at: datetime
    updated_at: Optional[datetime]
    
    model_config = {"from_attributes": True}


class ServiceResponse(BaseModel):
    """Service response schema."""
    id: int
    name: str
    description: Optional[str]
    base_url: str
    category: ServiceCategory
    status: ServiceStatus
    service_id: str
    provider_id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}


class ServiceListResponse(BaseModel):
    """Service list response schema."""
    services: List[ServiceResponse]
    total: int


class OnboardingRequestUpdate(BaseModel):
    """Onboarding request update schema (for admin)."""
    status: OnboardingStatus
    admin_notes: Optional[str] = None
