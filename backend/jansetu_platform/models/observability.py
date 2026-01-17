"""Observability models for request logging and metrics."""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class RequestLog(Base):
    """Request log model for observability."""
    __tablename__ = "request_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(200), nullable=False, index=True)
    service_id = Column(String(100), nullable=False, index=True)
    endpoint = Column(String(500), nullable=False)
    method = Column(String(10), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    response_time = Column(Float, nullable=False)  # in seconds
    status_code = Column(Integer, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Additional metadata
    request_size = Column(Integer, nullable=True)
    response_size = Column(Integer, nullable=True)
    error_message = Column(String(1000), nullable=True)
    
    user = relationship("User")
    
    __table_args__ = (
        Index('idx_service_timestamp', 'service_id', 'timestamp'),
        Index('idx_user_timestamp', 'user_id', 'timestamp'),
    )
