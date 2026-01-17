"""User and Role models."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class RoleType(str, enum.Enum):
    """User role types."""
    CITIZEN = "CITIZEN"
    SERVICE_PROVIDER = "SERVICE_PROVIDER"
    ADMIN = "ADMIN"


class Role(Base):
    """Role model."""
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(SQLEnum(RoleType), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    users = relationship("User", back_populates="role")


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, nullable=True, index=True)  # Made nullable for backward compatibility
    aadhar = Column(String(20), unique=True, nullable=False, index=True)  # Aadhar card number
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    role = relationship("Role", back_populates="users")
    services = relationship("Service", back_populates="provider")
    onboarding_requests = relationship("ServiceOnboardingRequest", foreign_keys="ServiceOnboardingRequest.provider_id", back_populates="provider")
