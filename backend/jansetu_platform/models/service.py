"""Service and ServiceOnboardingRequest models."""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class ServiceStatus(str, enum.Enum):
    """Service status."""
    INACTIVE = "INACTIVE"
    ACTIVE = "ACTIVE"


class OnboardingStatus(str, enum.Enum):
    """Service onboarding request status."""
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"


class ServiceCategory(str, enum.Enum):
    """Service categories."""
    HEALTHCARE = "HEALTHCARE"
    AGRICULTURE = "AGRICULTURE"
    GRIEVANCE = "GRIEVANCE"
    EDUCATION = "EDUCATION"
    UTILITIES = "UTILITIES"
    OTHER = "OTHER"


class Service(Base):
    """Service model."""
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    base_url = Column(String(500), nullable=False)
    category = Column(SQLEnum(ServiceCategory), nullable=False, index=True)
    status = Column(SQLEnum(ServiceStatus), default=ServiceStatus.INACTIVE, nullable=False, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(String(100), unique=True, nullable=False, index=True)  # URL-friendly identifier
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    provider = relationship("User", back_populates="services")
    onboarding_requests = relationship("ServiceOnboardingRequest", back_populates="service")


class ServiceOnboardingRequest(Base):
    """Service onboarding request model."""
    __tablename__ = "service_onboarding_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)  # Nullable until service is created
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(OnboardingStatus), default=OnboardingStatus.PENDING, nullable=False, index=True)
    
    # Service details (stored here during request)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    base_url = Column(String(500), nullable=False)
    category = Column(SQLEnum(ServiceCategory), nullable=False)
    service_identifier = Column(String(100), nullable=False)  # URL-friendly identifier
    
    # Admin feedback
    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    provider = relationship("User", foreign_keys=[provider_id], back_populates="onboarding_requests")
    service = relationship("Service", back_populates="onboarding_requests")
    reviewer = relationship("User", foreign_keys=[reviewed_by])
