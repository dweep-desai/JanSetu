"""Service Provider Registration Router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
import uuid
import random
from typing import Optional
from pydantic import BaseModel
from ..database import get_db
from ..config import settings

router = APIRouter(prefix="/sp-registration", tags=["service-provider-registration"])


class SPRegistrationRequest(BaseModel):
    aadhar: str
    request_type: str  # ESANJEEVANI, MKISAN
    organization_name: Optional[str] = None
    registration_number: Optional[str] = None
    
    # e-Sanjeevani fields
    provider_type: Optional[str] = None  # DOCTOR, NURSE, etc.
    specialization: Optional[str] = None
    years_of_experience: Optional[int] = None
    
    # mKisan fields
    provider_category: Optional[str] = None
    business_license: Optional[str] = None
    gst_number: Optional[str] = None
    years_in_business: Optional[int] = None


@router.post("/register")
async def register_service_provider(
    request: SPRegistrationRequest,
    db: Session = Depends(get_db)
):
    """Register as service provider - creates request for admin approval."""
    try:
        # Validate request type
        if request.request_type not in ['ESANJEEVANI', 'MKISAN']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="request_type must be 'ESANJEEVANI' or 'MKISAN'"
            )
        
        # Validate mKisan provider_category
        if request.request_type == 'MKISAN':
            if not request.provider_category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="provider_category is required for MKISAN registration"
                )
            if request.provider_category != 'BUYER':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="provider_category must be 'BUYER' for MKISAN registration"
                )
        
        # Look up citizen by Aadhaar
        aadhaar_hash = hashlib.sha256(request.aadhar.encode()).hexdigest()
        
        if settings.DATABASE_URL.startswith('sqlite'):
            citizen_query = text("""
                SELECT citizen_id, aadhaar_hash, full_name, phone, gender, date_of_birth, age, address
                FROM citizens
                WHERE aadhaar_hash = :aadhaar_hash
            """)
        else:
            citizen_query = text("""
                SELECT citizen_id, aadhaar_hash, full_name, phone, gender, date_of_birth, age, address
                FROM citizens
                WHERE aadhaar_hash = :aadhaar_hash
            """)
        
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Citizen not found. Please ensure you are registered as a citizen first."
            )
        
        citizen_id, aadhaar_hash_db, full_name, phone, gender, date_of_birth, age, address = citizen_result
        
        # Check if service provider already exists
        if settings.DATABASE_URL.startswith('sqlite'):
            sp_check_query = text("""
                SELECT service_provider_id FROM service_providers WHERE aadhaar_hash = :aadhaar_hash
            """)
        else:
            sp_check_query = text("""
                SELECT service_provider_id FROM service_providers WHERE aadhaar_hash = :aadhaar_hash
            """)
        
        existing_sp = db.execute(sp_check_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if existing_sp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Service provider already registered with this Aadhaar"
            )
        
        # Create service_provider entry
        service_provider_id = str(uuid.uuid4())
        
        if settings.DATABASE_URL.startswith('sqlite'):
            insert_sp_query = text("""
                INSERT INTO service_providers 
                (service_provider_id, aadhaar_hash, full_name, phone, gender, date_of_birth, age, address, organization_name, registration_number, isSP)
                VALUES (:service_provider_id, :aadhaar_hash, :full_name, :phone, :gender, :date_of_birth, :age, :address, :organization_name, :registration_number, 1)
            """)
        else:
            insert_sp_query = text("""
                INSERT INTO service_providers 
                (service_provider_id, aadhaar_hash, full_name, phone, gender, date_of_birth, age, address, organization_name, registration_number, isSP)
                VALUES (:service_provider_id, :aadhaar_hash, :full_name, :phone, :gender, :date_of_birth, :age, :address, :organization_name, :registration_number, TRUE)
            """)
        
        db.execute(insert_sp_query, {
            "service_provider_id": service_provider_id,
            "aadhaar_hash": aadhaar_hash,
            "full_name": full_name,
            "phone": phone,
            "gender": gender,
            "date_of_birth": str(date_of_birth),
            "age": age,
            "address": address,
            "organization_name": request.organization_name,
            "registration_number": request.registration_number
        })
        
        # Get random admin
        if settings.DATABASE_URL.startswith('sqlite'):
            admin_query = text("SELECT admin_id, username, full_name FROM admins")
        else:
            admin_query = text("SELECT admin_id, username, full_name FROM admins")
        
        admins = db.execute(admin_query).fetchall()
        
        if not admins:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No admins available. Please contact system administrator."
            )
        
        # Select random admin
        selected_admin = random.choice(admins)
        admin_id = str(selected_admin[0])
        admin_username = selected_admin[1]
        admin_full_name = selected_admin[2]
        
        # Print admin assignment to terminal
        print(f"\n{'='*60}")
        print(f"NEW SERVICE PROVIDER REGISTRATION REQUEST")
        print(f"{'='*60}")
        print(f"Request ID: {uuid.uuid4()}")
        print(f"Citizen Aadhaar: {request.aadhar}")
        print(f"Citizen Name: {full_name}")
        print(f"Request Type: {request.request_type}")
        print(f"Assigned Admin: {admin_full_name} ({admin_username})")
        print(f"Admin ID: {admin_id}")
        if request.request_type == 'ESANJEEVANI':
            print(f"Provider Type: {request.provider_type}")
            print(f"Specialization: {request.specialization}")
            print(f"Years of Experience: {request.years_of_experience}")
        elif request.request_type == 'MKISAN':
            print(f"Provider Category: {request.provider_category}")
            print(f"Business License: {request.business_license}")
            print(f"GST Number: {request.gst_number}")
        print(f"{'='*60}\n")
        
        # Create registration request
        request_id = str(uuid.uuid4())
        
        if settings.DATABASE_URL.startswith('sqlite'):
            insert_request_query = text("""
                INSERT INTO sp_registration_requests 
                (request_id, service_provider_id, request_type, status, aadhaar_hash, full_name, phone, gender, 
                 date_of_birth, address, organization_name, registration_number, provider_type, specialization, 
                 years_of_experience, provider_category, business_license, gst_number, years_in_business)
                VALUES (:request_id, :service_provider_id, :request_type, 'PENDING', :aadhaar_hash, :full_name, :phone, 
                        :gender, :date_of_birth, :address, :organization_name, :registration_number, :provider_type, 
                        :specialization, :years_of_experience, :provider_category, :business_license, :gst_number, :years_in_business)
            """)
        else:
            insert_request_query = text("""
                INSERT INTO sp_registration_requests 
                (request_id, service_provider_id, request_type, status, aadhaar_hash, full_name, phone, gender, 
                 date_of_birth, address, organization_name, registration_number, provider_type, specialization, 
                 years_of_experience, provider_category, business_license, gst_number, years_in_business)
                VALUES (:request_id, :service_provider_id, :request_type, 'PENDING', :aadhaar_hash, :full_name, :phone, 
                        :gender, :date_of_birth, :address, :organization_name, :registration_number, :provider_type, 
                        :specialization, :years_of_experience, :provider_category, :business_license, :gst_number, :years_in_business)
            """)
        
        db.execute(insert_request_query, {
            "request_id": request_id,
            "service_provider_id": service_provider_id,
            "request_type": request.request_type,
            "aadhaar_hash": aadhaar_hash,
            "full_name": full_name,
            "phone": phone,
            "gender": gender,
            "date_of_birth": str(date_of_birth),
            "address": address,
            "organization_name": request.organization_name,
            "registration_number": request.registration_number,
            "provider_type": request.provider_type,
            "specialization": request.specialization,
            "years_of_experience": request.years_of_experience,
            "provider_category": request.provider_category,
            "business_license": request.business_license,
            "gst_number": request.gst_number,
            "years_in_business": request.years_in_business
        })
        
        db.commit()
        
        return {
            "message": "Service provider registration request submitted successfully",
            "request_id": request_id,
            "assigned_admin": {
                "admin_id": admin_id,
                "username": admin_username,
                "full_name": admin_full_name
            },
            "status": "PENDING"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering service provider: {str(e)}"
        )
