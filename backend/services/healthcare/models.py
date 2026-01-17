"""Healthcare service models."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()


class AppointmentStatus(str, enum.Enum):
    """Appointment status."""
    AVAILABLE = "AVAILABLE"
    BOOKED = "BOOKED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Appointment(Base):
    """Appointment model."""
    __tablename__ = "healthcare_appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String(200), nullable=False)
    specialty = Column(String(100), nullable=False)
    date_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.AVAILABLE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    bookings = relationship("Booking", back_populates="appointment")


class Booking(Base):
    """Booking model."""
    __tablename__ = "healthcare_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("healthcare_appointments.id"), nullable=False)
    user_id = Column(Integer, nullable=False)  # User ID from platform
    user_phone = Column(String(15), nullable=False)
    patient_name = Column(String(200), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    appointment = relationship("Appointment", back_populates="bookings")
