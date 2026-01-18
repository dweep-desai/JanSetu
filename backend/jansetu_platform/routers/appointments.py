"""Appointments/Consultation router for e-Sanjeevani."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
import uuid
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..security import get_current_user
from ..models.user import User, RoleType
from ..config import settings

router = APIRouter(prefix="/appointments", tags=["appointments"])


class AppointmentRequest(BaseModel):
    esanjeevani_provider_id: str
    appointment_date: str
    appointment_time: str
    symptoms: Optional[str] = None
    medical_history: Optional[str] = None


class AppointmentResponse(BaseModel):
    consultation_id: str
    citizen_id: str
    esanjeevani_provider_id: str
    appointment_date: str
    appointment_time: str
    status: str
    symptoms: Optional[str]
    medical_history: Optional[str]
    rejection_reason: Optional[str]
    provider_notes: Optional[str]
    created_at: str
    updated_at: str
    # Include provider info for display
    provider_name: Optional[str] = None
    specialization: Optional[str] = None
    # Include citizen info for provider view
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None
    citizen_gender: Optional[str] = None
    citizen_age: Optional[int] = None
    citizen_date_of_birth: Optional[str] = None
    citizen_address: Optional[str] = None


class ProviderResponse(BaseModel):
    esanjeevani_provider_id: str
    service_provider_id: str
    full_name: str
    specialization: str
    provider_type: str
    years_of_experience: Optional[int]
    phone: Optional[str]


@router.get("/providers/esanjeevani", response_model=List[ProviderResponse])
async def get_approved_esanjeevani_providers(
    db: Session = Depends(get_db)
):
    """Get all approved e-Sanjeevani service providers."""
    try:
        # Get all approved e-Sanjeevani providers
        # Show providers that either:
        # 1. Have an APPROVED registration request, OR
        # 2. Don't have a registration request (seeded data - treat as approved)
        query_str = """
            SELECT DISTINCT
                esp.esanjeevani_provider_id,
                esp.service_provider_id,
                sp.full_name,
                esp.specialization,
                esp.provider_type,
                esp.years_of_experience,
                sp.phone
            FROM esanjeevani_service_providers esp
            JOIN service_providers sp ON esp.service_provider_id = sp.service_provider_id
            LEFT JOIN sp_registration_requests sr ON sp.service_provider_id = sr.service_provider_id 
                AND sr.request_type = 'ESANJEEVANI'
            WHERE sr.status = 'APPROVED' OR sr.status IS NULL
            ORDER BY sp.full_name
        """
        query = text(query_str)
        result = db.execute(query)
        rows = result.fetchall()
        
        providers = []
        for row in rows:
            providers.append(ProviderResponse(
                esanjeevani_provider_id=str(row[0]),
                service_provider_id=str(row[1]),
                full_name=str(row[2]),
                specialization=str(row[3]),
                provider_type=str(row[4]),
                years_of_experience=row[5],
                phone=str(row[6]) if row[6] else None
            ))
        
        return providers
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch providers: {str(e)}"
        )


@router.post("/book", response_model=AppointmentResponse)
async def book_appointment(
    request: AppointmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Book an appointment with an e-Sanjeevani provider."""
    if current_user.role.name != RoleType.CITIZEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only citizens can book appointments"
        )
    
    try:
        # Get citizen_id from aadhaar
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Citizen profile not found"
            )
        
        citizen_id = str(citizen_result[0])
        
        # Generate consultation_id
        consultation_id = str(uuid.uuid4())
        
        # Insert appointment request
        if settings.DATABASE_URL.startswith('sqlite'):
            insert_query = text("""
                INSERT INTO consultation_requests (
                    consultation_id, citizen_id, esanjeevani_provider_id,
                    appointment_date, appointment_time, status,
                    symptoms, medical_history, created_at, updated_at
                ) VALUES (
                    :consultation_id, :citizen_id, :esanjeevani_provider_id,
                    :appointment_date, :appointment_time, 'PENDING',
                    :symptoms, :medical_history, datetime('now'), datetime('now')
                )
            """)
        else:
            insert_query = text("""
                INSERT INTO consultation_requests (
                    consultation_id, citizen_id, esanjeevani_provider_id,
                    appointment_date, appointment_time, status,
                    symptoms, medical_history, created_at, updated_at
                ) VALUES (
                    :consultation_id, :citizen_id, :esanjeevani_provider_id,
                    :appointment_date, :appointment_time, 'PENDING',
                    :symptoms, :medical_history, NOW(), NOW()
                )
            """)
        
        db.execute(insert_query, {
            "consultation_id": consultation_id,
            "citizen_id": citizen_id,
            "esanjeevani_provider_id": request.esanjeevani_provider_id,
            "appointment_date": request.appointment_date,
            "appointment_time": request.appointment_time,
            "symptoms": request.symptoms,
            "medical_history": request.medical_history
        })
        db.commit()
        
        # Fetch the created appointment
        fetch_query = text("""
            SELECT consultation_id, citizen_id, esanjeevani_provider_id,
                   appointment_date, appointment_time, status,
                   symptoms, medical_history, rejection_reason, provider_notes,
                   created_at, updated_at
            FROM consultation_requests
            WHERE consultation_id = :consultation_id
        """)
        result = db.execute(fetch_query, {"consultation_id": consultation_id}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create appointment"
            )
        
        return AppointmentResponse(
            consultation_id=str(result[0]),
            citizen_id=str(result[1]),
            esanjeevani_provider_id=str(result[2]),
            appointment_date=str(result[3]),
            appointment_time=str(result[4]),
            status=str(result[5]),
            symptoms=result[6],
            medical_history=result[7],
            rejection_reason=result[8],
            provider_notes=result[9],
            created_at=str(result[10]),
            updated_at=str(result[11])
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to book appointment: {str(e)}"
        )


@router.get("/my-appointments", response_model=List[AppointmentResponse])
async def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointments for the current citizen."""
    if current_user.role.name != RoleType.CITIZEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only citizens can view their appointments"
        )
    
    try:
        # Get citizen_id
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            return []
        
        citizen_id = str(citizen_result[0])
        
        # Fetch appointments with provider info
        query = text("""
            SELECT 
                cr.consultation_id, cr.citizen_id, cr.esanjeevani_provider_id,
                cr.appointment_date, cr.appointment_time, cr.status,
                cr.symptoms, cr.medical_history, cr.rejection_reason, cr.provider_notes,
                cr.created_at, cr.updated_at,
                sp.full_name as provider_name, esp.specialization
            FROM consultation_requests cr
            JOIN esanjeevani_service_providers esp ON cr.esanjeevani_provider_id = esp.esanjeevani_provider_id
            JOIN service_providers sp ON esp.service_provider_id = sp.service_provider_id
            WHERE cr.citizen_id = :citizen_id
            ORDER BY cr.appointment_date DESC, cr.created_at DESC
        """)
        
        result = db.execute(query, {"citizen_id": citizen_id})
        rows = result.fetchall()
        
        appointments = []
        for row in rows:
            appointments.append(AppointmentResponse(
                consultation_id=str(row[0]),
                citizen_id=str(row[1]),
                esanjeevani_provider_id=str(row[2]),
                appointment_date=str(row[3]),
                appointment_time=str(row[4]),
                status=str(row[5]),
                symptoms=row[6],
                medical_history=row[7],
                rejection_reason=row[8],
                provider_notes=row[9],
                created_at=str(row[10]),
                updated_at=str(row[11]),
                provider_name=str(row[12]) if row[12] else None,
                specialization=str(row[13]) if row[13] else None
            ))
        
        return appointments
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch appointments: {str(e)}"
        )


@router.get("/provider/appointments", response_model=List[AppointmentResponse])
async def get_provider_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointment requests for the current service provider."""
    if current_user.role.name != RoleType.SERVICE_PROVIDER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only service providers can view their appointments"
        )
    
    try:
        # Get service provider's e-Sanjeevani provider ID
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        provider_query = text("""
            SELECT esp.esanjeevani_provider_id
            FROM esanjeevani_service_providers esp
            JOIN service_providers sp ON esp.service_provider_id = sp.service_provider_id
            WHERE sp.aadhaar_hash = :aadhaar_hash
        """)
        provider_result = db.execute(provider_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not provider_result:
            return []
        
        esanjeevani_provider_id = str(provider_result[0])
        
        # Fetch appointments with citizen info
        query = text("""
            SELECT 
                cr.consultation_id, cr.citizen_id, cr.esanjeevani_provider_id,
                cr.appointment_date, cr.appointment_time, cr.status,
                cr.symptoms, cr.medical_history, cr.rejection_reason, cr.provider_notes,
                cr.created_at, cr.updated_at,
                c.full_name as citizen_name, c.phone as citizen_phone,
                c.gender as citizen_gender, c.age as citizen_age,
                c.date_of_birth as citizen_date_of_birth, c.address as citizen_address
            FROM consultation_requests cr
            JOIN citizens c ON cr.citizen_id = c.citizen_id
            WHERE cr.esanjeevani_provider_id = :esanjeevani_provider_id
            ORDER BY cr.appointment_date DESC, cr.created_at DESC
        """)
        
        result = db.execute(query, {"esanjeevani_provider_id": esanjeevani_provider_id})
        rows = result.fetchall()
        
        appointments = []
        for row in rows:
            appointments.append(AppointmentResponse(
                consultation_id=str(row[0]),
                citizen_id=str(row[1]),
                esanjeevani_provider_id=str(row[2]),
                appointment_date=str(row[3]),
                appointment_time=str(row[4]),
                status=str(row[5]),
                symptoms=row[6],
                medical_history=row[7],
                rejection_reason=row[8],
                provider_notes=row[9],
                created_at=str(row[10]),
                updated_at=str(row[11]),
                citizen_name=str(row[12]) if row[12] else None,
                citizen_phone=str(row[13]) if row[13] else None,
                citizen_gender=str(row[14]) if row[14] else None,
                citizen_age=int(row[15]) if row[15] is not None else None,
                citizen_date_of_birth=str(row[16]) if row[16] else None,
                citizen_address=str(row[17]) if row[17] else None
            ))
        
        return appointments
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch appointments: {str(e)}"
        )


class AppointmentActionRequest(BaseModel):
    action: str  # "APPROVE" or "REJECT"
    rejection_reason: Optional[str] = None
    provider_notes: Optional[str] = None


@router.put("/provider/appointments/{consultation_id}/action")
async def handle_appointment_action(
    consultation_id: str,
    action_request: AppointmentActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Approve or reject an appointment request."""
    if current_user.role.name != RoleType.SERVICE_PROVIDER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only service providers can manage appointments"
        )
    
    if action_request.action not in ['APPROVE', 'REJECT']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action must be 'APPROVE' or 'REJECT'"
        )
    
    if action_request.action == 'REJECT' and not action_request.rejection_reason:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rejection reason is required when rejecting an appointment"
        )
    
    try:
        # Verify this appointment belongs to the provider
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        verify_query = text("""
            SELECT cr.consultation_id
            FROM consultation_requests cr
            JOIN esanjeevani_service_providers esp ON cr.esanjeevani_provider_id = esp.esanjeevani_provider_id
            JOIN service_providers sp ON esp.service_provider_id = sp.service_provider_id
            WHERE cr.consultation_id = :consultation_id
            AND sp.aadhaar_hash = :aadhaar_hash
        """)
        verify_result = db.execute(verify_query, {
            "consultation_id": consultation_id,
            "aadhaar_hash": aadhaar_hash
        }).fetchone()
        
        if not verify_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found or you don't have permission to manage it"
            )
        
        # Update appointment status
        if settings.DATABASE_URL.startswith('sqlite'):
            if action_request.action == 'APPROVE':
                update_query = text("""
                    UPDATE consultation_requests
                    SET status = 'APPROVED',
                        provider_notes = :provider_notes,
                        updated_at = datetime('now')
                    WHERE consultation_id = :consultation_id
                """)
                db.execute(update_query, {
                    "consultation_id": consultation_id,
                    "provider_notes": action_request.provider_notes
                })
            else:  # REJECT
                update_query = text("""
                    UPDATE consultation_requests
                    SET status = 'REJECTED',
                        rejection_reason = :rejection_reason,
                        updated_at = datetime('now')
                    WHERE consultation_id = :consultation_id
                """)
                db.execute(update_query, {
                    "consultation_id": consultation_id,
                    "rejection_reason": action_request.rejection_reason
                })
        else:
            if action_request.action == 'APPROVE':
                update_query = text("""
                    UPDATE consultation_requests
                    SET status = 'APPROVED',
                        provider_notes = :provider_notes,
                        updated_at = NOW()
                    WHERE consultation_id = :consultation_id
                """)
                db.execute(update_query, {
                    "consultation_id": consultation_id,
                    "provider_notes": action_request.provider_notes
                })
            else:  # REJECT
                update_query = text("""
                    UPDATE consultation_requests
                    SET status = 'REJECTED',
                        rejection_reason = :rejection_reason,
                        updated_at = NOW()
                    WHERE consultation_id = :consultation_id
                """)
                db.execute(update_query, {
                    "consultation_id": consultation_id,
                    "rejection_reason": action_request.rejection_reason
                })
        
        db.commit()
        
        return {"message": f"Appointment {action_request.action.lower()}ed successfully", "consultation_id": consultation_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update appointment: {str(e)}"
        )
