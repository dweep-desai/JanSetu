"""Healthcare service routers."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from .models import Appointment, Booking, AppointmentStatus, Base
from .database import get_db, engine

router = APIRouter()


# Initialize database
Base.metadata.create_all(bind=engine)


@router.get("/appointments")
async def list_appointments(
    specialty: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """List available appointments."""
    query = db.query(Appointment).filter(Appointment.status == AppointmentStatus.AVAILABLE)
    
    if specialty:
        query = query.filter(Appointment.specialty.ilike(f"%{specialty}%"))
    
    if date_from:
        query = query.filter(Appointment.date_time >= date_from)
    
    if date_to:
        query = query.filter(Appointment.date_time <= date_to)
    
    appointments = query.order_by(Appointment.date_time).all()
    
    return {
        "appointments": [
            {
                "id": apt.id,
                "doctor_name": apt.doctor_name,
                "specialty": apt.specialty,
                "date_time": apt.date_time.isoformat(),
                "status": apt.status.value
            }
            for apt in appointments
        ]
    }


@router.post("/appointments/book")
async def book_appointment(
    appointment_id: int,
    patient_name: str,
    user_id: int,
    user_phone: str,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Book an appointment."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if appointment.status != AppointmentStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment is not available"
        )
    
    # Create booking
    booking = Booking(
        appointment_id=appointment_id,
        user_id=user_id,
        user_phone=user_phone,
        patient_name=patient_name,
        notes=notes
    )
    
    # Update appointment status
    appointment.status = AppointmentStatus.BOOKED
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    return {
        "booking_id": booking.id,
        "appointment": {
            "id": appointment.id,
            "doctor_name": appointment.doctor_name,
            "specialty": appointment.specialty,
            "date_time": appointment.date_time.isoformat()
        },
        "patient_name": patient_name,
        "message": "Appointment booked successfully"
    }


@router.get("/appointments/my-bookings")
async def get_my_bookings(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get bookings for a user."""
    bookings = db.query(Booking).filter(Booking.user_id == user_id).order_by(Booking.created_at.desc()).all()
    
    return {
        "bookings": [
            {
                "id": booking.id,
                "appointment": {
                    "id": booking.appointment.id,
                    "doctor_name": booking.appointment.doctor_name,
                    "specialty": booking.appointment.specialty,
                    "date_time": booking.appointment.date_time.isoformat(),
                    "status": booking.appointment.status.value
                },
                "patient_name": booking.patient_name,
                "notes": booking.notes,
                "created_at": booking.created_at.isoformat()
            }
            for booking in bookings
        ]
    }
