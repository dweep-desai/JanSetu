"""DigiLocker service models."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.sql import func
from .database import Base

class DigiLockerAccount(Base):
    """DigiLocker account link model."""
    __tablename__ = "digilocker_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False)
    digilocker_id = Column(String(100), unique=True, nullable=False)
    linked_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

class DigiLockerDocument(Base):
    """DigiLocker document model."""
    __tablename__ = "digilocker_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("digilocker_accounts.user_id"), nullable=False)
    title = Column(String(200), nullable=False)
    doc_type = Column(String(100), nullable=False)
    issuer = Column(String(200), nullable=False)
    issued_date = Column(String(50), nullable=True)
    size = Column(String(50), nullable=True)
    file_url = Column(String(500), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
