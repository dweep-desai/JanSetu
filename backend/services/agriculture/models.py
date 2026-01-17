"""Agriculture service models."""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Advisory(Base):
    """Agricultural advisory model."""
    __tablename__ = "agriculture_advisories"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_type = Column(String(100), nullable=False, index=True)
    region = Column(String(100), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    weather_data = Column(Text, nullable=True)  # JSON string of weather data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    subscriptions = relationship("Subscription", back_populates="advisory")


class Subscription(Base):
    """Advisory subscription model."""
    __tablename__ = "agriculture_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    user_phone = Column(String(15), nullable=False)
    crop_type = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    advisory_id = Column(Integer, ForeignKey("agriculture_advisories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    advisory = relationship("Advisory", back_populates="subscriptions")
