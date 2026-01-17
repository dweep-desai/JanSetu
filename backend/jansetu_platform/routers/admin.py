"""Admin router for service approval and management."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.service import Service, ServiceOnboardingRequest, OnboardingStatus, ServiceStatus
from ..schemas.service import ServiceOnboardingRequestResponse, OnboardingRequestUpdate, ServiceResponse
from ..security import require_admin, get_current_user
from ..models.user import User

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
