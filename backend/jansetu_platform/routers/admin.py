"""Admin router for service approval and management."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import uuid
from ..database import get_db
from ..models.service import Service, ServiceOnboardingRequest, OnboardingStatus, ServiceStatus
from ..schemas.service import ServiceOnboardingRequestResponse, OnboardingRequestUpdate, ServiceResponse
from ..security import require_admin, get_current_user
from ..models.user import User
from ..config import settings

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/onboarding-requests", response_model=List[ServiceOnboardingRequestResponse])
async def list_onboarding_requests(
    status_filter: OnboardingStatus = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all onboarding requests (admin only)."""
    query = db.query(ServiceOnboardingRequest)
    
    if status_filter:
        query = query.filter(ServiceOnboardingRequest.status == status_filter)
    
    requests = query.order_by(ServiceOnboardingRequest.submitted_at.desc()).all()
    return requests


@router.get("/onboarding-requests/{request_id}", response_model=ServiceOnboardingRequestResponse)
async def get_onboarding_request(
    request_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get a specific onboarding request (admin only)."""
    request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.id == request_id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding request not found"
        )
    
    return request


@router.put("/onboarding-requests/{request_id}/approve", response_model=ServiceOnboardingRequestResponse)
async def approve_onboarding_request(
    request_id: int,
    admin_notes: str = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Approve a service onboarding request."""
    request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.id == request_id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding request not found"
        )
    
    if request.status != OnboardingStatus.PENDING and request.status != OnboardingStatus.CHANGES_REQUESTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve request with status {request.status.value}"
        )
    
    # Update request status
    request.status = OnboardingStatus.APPROVED
    request.admin_notes = admin_notes
    request.reviewed_by = current_user.id
    request.reviewed_at = datetime.utcnow()
    
    # Create or update service
    service = db.query(Service).filter(Service.service_id == request.service_identifier).first()
    
    if not service:
        # Create new service
        service = Service(
            name=request.name,
            description=request.description,
            base_url=request.base_url,
            category=request.category,
            service_id=request.service_identifier,
            status=ServiceStatus.ACTIVE,
            provider_id=request.provider_id
        )
        db.add(service)
    else:
        # Update existing service
        service.name = request.name
        service.description = request.description
        service.base_url = request.base_url
        service.category = request.category
        service.status = ServiceStatus.ACTIVE
    
    # Link request to service
    request.service_id = service.id
    
    db.commit()
    db.refresh(request)
    
    return request


@router.put("/onboarding-requests/{request_id}/reject", response_model=ServiceOnboardingRequestResponse)
async def reject_onboarding_request(
    request_id: int,
    admin_notes: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Reject a service onboarding request."""
    if not admin_notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin notes are required for rejection"
        )
    
    request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.id == request_id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding request not found"
        )
    
    if request.status == OnboardingStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reject an already approved request"
        )
    
    request.status = OnboardingStatus.REJECTED
    request.admin_notes = admin_notes
    request.reviewed_by = current_user.id
    request.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(request)
    
    return request


@router.put("/onboarding-requests/{request_id}/request-changes", response_model=ServiceOnboardingRequestResponse)
async def request_changes(
    request_id: int,
    admin_notes: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Request changes to an onboarding request."""
    if not admin_notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin notes are required when requesting changes"
        )
    
    request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.id == request_id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding request not found"
        )
    
    if request.status == OnboardingStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot request changes for an already approved request"
        )
    
    request.status = OnboardingStatus.CHANGES_REQUESTED
    request.admin_notes = admin_notes
    request.reviewed_by = current_user.id
    request.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(request)
    
    return request


@router.get("/services", response_model=List[ServiceResponse])
async def list_all_services(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all services in the registry (admin only)."""
    from ..schemas.service import ServiceResponse
    services = db.query(Service).order_by(Service.created_at.desc()).all()
    return [ServiceResponse.model_validate(s) for s in services]


@router.put("/services/{service_id}/activate")
async def activate_service(
    service_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Activate a service."""
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    service.status = ServiceStatus.ACTIVE
    db.commit()
    
    return {"message": "Service activated", "service_id": service_id}


@router.put("/services/{service_id}/deactivate")
async def deactivate_service(
    service_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Deactivate a service."""
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    service.status = ServiceStatus.INACTIVE
    db.commit()
    
    return {"message": "Service deactivated", "service_id": service_id}


# SP Registration Requests
class SPRegistrationRequestResponse(BaseModel):
    """SP Registration Request Response Schema."""
    request_id: str
    service_provider_id: str
    request_type: str
    status: str
    full_name: str
    phone: str
    gender: str
    date_of_birth: str
    address: Optional[str]
    organization_name: Optional[str]
    registration_number: Optional[str]
    provider_type: Optional[str]
    specialization: Optional[str]
    years_of_experience: Optional[int]
    provider_category: Optional[str]
    business_license: Optional[str]
    gst_number: Optional[str]
    years_in_business: Optional[int]
    submitted_at: str
    reviewed_by: Optional[str]
    reviewed_at: Optional[str]
    admin_comments: Optional[str]
    rejection_reason: Optional[str]


@router.get("/sp-registration-requests", response_model=List[SPRegistrationRequestResponse])
async def list_sp_registration_requests(
    status_filter: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all SP registration requests (admin only)."""
    if status_filter:
        query_str = """
            SELECT request_id, service_provider_id, request_type, status, 
                   full_name, phone, gender, date_of_birth, address, 
                   organization_name, registration_number,
                   provider_type, specialization, years_of_experience,
                   provider_category, business_license, gst_number, years_in_business,
                   submitted_at, reviewed_by, reviewed_at, admin_comments, rejection_reason
            FROM sp_registration_requests
            WHERE status = :status_filter
            ORDER BY submitted_at DESC
        """
        query = text(query_str)
        result = db.execute(query, {"status_filter": status_filter})
    else:
        query_str = """
            SELECT request_id, service_provider_id, request_type, status, 
                   full_name, phone, gender, date_of_birth, address, 
                   organization_name, registration_number,
                   provider_type, specialization, years_of_experience,
                   provider_category, business_license, gst_number, years_in_business,
                   submitted_at, reviewed_by, reviewed_at, admin_comments, rejection_reason
            FROM sp_registration_requests
            ORDER BY submitted_at DESC
        """
        query = text(query_str)
        result = db.execute(query)
    
    rows = result.fetchall()
    
    requests = []
    for row in rows:
        requests.append(SPRegistrationRequestResponse(
            request_id=str(row[0]),
            service_provider_id=str(row[1]),
            request_type=str(row[2]),
            status=str(row[3]),
            full_name=str(row[4]),
            phone=str(row[5]),
            gender=str(row[6]),
            date_of_birth=str(row[7]),
            address=str(row[8]) if row[8] else None,
            organization_name=str(row[9]) if row[9] else None,
            registration_number=str(row[10]) if row[10] else None,
            provider_type=str(row[11]) if row[11] else None,
            specialization=str(row[12]) if row[12] else None,
            years_of_experience=int(row[13]) if row[13] else None,
            provider_category=str(row[14]) if row[14] else None,
            business_license=str(row[15]) if row[15] else None,
            gst_number=str(row[16]) if row[16] else None,
            years_in_business=int(row[17]) if row[17] else None,
            submitted_at=str(row[18]),
            reviewed_by=str(row[19]) if row[19] else None,
            reviewed_at=str(row[20]) if row[20] else None,
            admin_comments=str(row[21]) if row[21] else None,
            rejection_reason=str(row[22]) if row[22] else None,
        ))
    
    return requests


@router.put("/sp-registration-requests/{request_id}/approve")
async def approve_sp_registration_request(
    request_id: str,
    admin_comments: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Approve an SP registration request."""
    # Get admin ID
    admin_query = text("SELECT admin_id FROM admins WHERE username = :username")
    admin_result = db.execute(admin_query, {"username": current_user.aadhar.replace("ADMIN--", "")}).fetchone()
    
    if not admin_result:
        # Try to find admin by aadhar
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found"
        )
    
    admin_id = str(admin_result[0])
    
    # First, get the request details
    if settings.DATABASE_URL.startswith('sqlite'):
        get_request_query = text("""
            SELECT service_provider_id, request_type, provider_type, specialization, 
                   years_of_experience, provider_category, business_license, gst_number, years_in_business
            FROM sp_registration_requests
            WHERE request_id = :request_id
        """)
    else:
        get_request_query = text("""
            SELECT service_provider_id, request_type, provider_type, specialization, 
                   years_of_experience, provider_category, business_license, gst_number, years_in_business
            FROM sp_registration_requests
            WHERE request_id = :request_id
        """)
    
    request_data = db.execute(get_request_query, {"request_id": request_id}).fetchone()
    
    if not request_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SP registration request not found"
        )
    
    service_provider_id = str(request_data[0])
    request_type = str(request_data[1])
    
    # Create entry in the appropriate service provider table
    if request_type == 'ESANJEEVANI':
        provider_type = request_data[2]
        specialization = request_data[3]
        years_of_experience = request_data[4]
        
        # Check if already exists
        check_query = text("""
            SELECT esanjeevani_provider_id FROM esanjeevani_service_providers 
            WHERE service_provider_id = :service_provider_id
        """)
        existing = db.execute(check_query, {"service_provider_id": service_provider_id}).fetchone()
        
        if not existing:
            esanjeevani_provider_id = str(uuid.uuid4())
            
            if settings.DATABASE_URL.startswith('sqlite'):
                insert_query = text("""
                    INSERT INTO esanjeevani_service_providers 
                    (esanjeevani_provider_id, service_provider_id, provider_type, specialization, 
                     years_of_experience, available_slots, rating, total_consultations, isSP)
                    VALUES (:esanjeevani_provider_id, :service_provider_id, :provider_type, :specialization,
                            :years_of_experience, 0, 0.0, 0, 1)
                """)
            else:
                insert_query = text("""
                    INSERT INTO esanjeevani_service_providers 
                    (esanjeevani_provider_id, service_provider_id, provider_type, specialization, 
                     years_of_experience, available_slots, rating, total_consultations, isSP)
                    VALUES (:esanjeevani_provider_id, :service_provider_id, :provider_type, :specialization,
                            :years_of_experience, 0, 0.0, 0, TRUE)
                """)
            
            db.execute(insert_query, {
                "esanjeevani_provider_id": esanjeevani_provider_id,
                "service_provider_id": service_provider_id,
                "provider_type": provider_type,
                "specialization": specialization or "",
                "years_of_experience": years_of_experience
            })
    
    elif request_type == 'MKISAN':
        provider_category = request_data[5]
        business_license = request_data[6]
        gst_number = request_data[7]
        years_in_business = request_data[8]
        
        # Check if already exists
        check_query = text("""
            SELECT mkisan_provider_id FROM mkisan_service_providers 
            WHERE service_provider_id = :service_provider_id
        """)
        existing = db.execute(check_query, {"service_provider_id": service_provider_id}).fetchone()
        
        if not existing:
            mkisan_provider_id = str(uuid.uuid4())
            
            if settings.DATABASE_URL.startswith('sqlite'):
                insert_query = text("""
                    INSERT INTO mkisan_service_providers 
                    (mkisan_provider_id, service_provider_id, provider_category, business_license, 
                     gst_number, years_in_business, isSP)
                    VALUES (:mkisan_provider_id, :service_provider_id, :provider_category, :business_license,
                            :gst_number, :years_in_business, 1)
                """)
            else:
                insert_query = text("""
                    INSERT INTO mkisan_service_providers 
                    (mkisan_provider_id, service_provider_id, provider_category, business_license, 
                     gst_number, years_in_business, isSP)
                    VALUES (:mkisan_provider_id, :service_provider_id, :provider_category, :business_license,
                            :gst_number, :years_in_business, TRUE)
                """)
            
            db.execute(insert_query, {
                "mkisan_provider_id": mkisan_provider_id,
                "service_provider_id": service_provider_id,
                "provider_category": provider_category,
                "business_license": business_license,
                "gst_number": gst_number,
                "years_in_business": years_in_business
            })
    
    # Update request status
    if settings.DATABASE_URL.startswith('sqlite'):
        update_query = text("""
            UPDATE sp_registration_requests 
            SET status = 'APPROVED', 
                reviewed_by = :admin_id,
                reviewed_at = datetime('now'),
                admin_comments = :admin_comments
            WHERE request_id = :request_id
        """)
    else:
        update_query = text("""
            UPDATE sp_registration_requests 
            SET status = 'APPROVED', 
                reviewed_by = :admin_id,
                reviewed_at = NOW(),
                admin_comments = :admin_comments
            WHERE request_id = :request_id
        """)
    
    result = db.execute(update_query, {
        "request_id": request_id,
        "admin_id": admin_id,
        "admin_comments": admin_comments
    })
    
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SP registration request not found"
        )
    
    return {"message": "SP registration request approved", "request_id": request_id}


@router.put("/sp-registration-requests/{request_id}/reject")
async def reject_sp_registration_request(
    request_id: str,
    rejection_reason: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Reject an SP registration request."""
    # Get admin ID
    admin_query = text("SELECT admin_id FROM admins WHERE username = :username")
    admin_result = db.execute(admin_query, {"username": current_user.aadhar.replace("ADMIN--", "")}).fetchone()
    
    if not admin_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found"
        )
    
    admin_id = str(admin_result[0])
    
    if not rejection_reason:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rejection reason is required"
        )
    
    # Update request status
    if settings.DATABASE_URL.startswith('sqlite'):
        update_query = text("""
            UPDATE sp_registration_requests 
            SET status = 'REJECTED', 
                reviewed_by = :admin_id,
                reviewed_at = datetime('now'),
                rejection_reason = :rejection_reason
            WHERE request_id = :request_id
        """)
    else:
        update_query = text("""
            UPDATE sp_registration_requests 
            SET status = 'REJECTED', 
                reviewed_by = :admin_id,
                reviewed_at = NOW(),
                rejection_reason = :rejection_reason
            WHERE request_id = :request_id
        """)
    
    result = db.execute(update_query, {
        "request_id": request_id,
        "admin_id": admin_id,
        "rejection_reason": rejection_reason
    })
    
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SP registration request not found"
        )
    
    return {"message": "SP registration request rejected", "request_id": request_id}
