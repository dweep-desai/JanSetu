"""Service provider router for service management."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.service import Service, ServiceOnboardingRequest, OnboardingStatus
from ..schemas.service import (
    ServiceOnboardingRequestCreate,
    ServiceOnboardingRequestResponse,
    ServiceResponse,
    ServiceListResponse,
)
from ..security import require_service_provider, get_current_user
from ..models.user import User

router = APIRouter(prefix="/services", tags=["services"])


@router.post("/onboard", response_model=ServiceOnboardingRequestResponse, status_code=status.HTTP_201_CREATED)
async def submit_onboarding_request(
    request: ServiceOnboardingRequestCreate,
    current_user: User = Depends(require_service_provider),
    db: Session = Depends(get_db)
):
    """Submit a service onboarding request."""
    # Check if service_id already exists
    existing_service = db.query(Service).filter(Service.service_id == request.service_id).first()
    if existing_service:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Service with ID '{request.service_id}' already exists"
        )
    
    # Check if user already has a pending request with same service_id
    existing_request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.provider_id == current_user.id,
        ServiceOnboardingRequest.service_identifier == request.service_id,
        ServiceOnboardingRequest.status.in_([OnboardingStatus.PENDING, OnboardingStatus.CHANGES_REQUESTED])
    ).first()
    
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending or changes-requested onboarding request for this service ID"
        )
    
    # Create onboarding request
    onboarding_request = ServiceOnboardingRequest(
        provider_id=current_user.id,
        name=request.name,
        description=request.description,
        base_url=request.base_url,
        category=request.category,
        service_identifier=request.service_id,
        status=OnboardingStatus.PENDING
    )
    
    db.add(onboarding_request)
    db.commit()
    db.refresh(onboarding_request)
    
    return onboarding_request


@router.get("/my-services", response_model=ServiceListResponse)
async def get_my_services(
    current_user: User = Depends(require_service_provider),
    db: Session = Depends(get_db)
):
    """Get all services owned by the current provider."""
    services = db.query(Service).filter(Service.provider_id == current_user.id).all()
    
    return ServiceListResponse(
        services=[ServiceResponse.model_validate(s) for s in services],
        total=len(services)
    )


@router.get("/onboarding-requests", response_model=List[ServiceOnboardingRequestResponse])
async def get_my_onboarding_requests(
    current_user: User = Depends(require_service_provider),
    db: Session = Depends(get_db)
):
    """Get all onboarding requests for the current provider."""
    requests = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.provider_id == current_user.id
    ).order_by(ServiceOnboardingRequest.submitted_at.desc()).all()
    
    return requests


@router.get("/onboarding-requests/{request_id}", response_model=ServiceOnboardingRequestResponse)
async def get_onboarding_request(
    request_id: int,
    current_user: User = Depends(require_service_provider),
    db: Session = Depends(get_db)
):
    """Get a specific onboarding request."""
    request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.id == request_id,
        ServiceOnboardingRequest.provider_id == current_user.id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding request not found"
        )
    
    return request


@router.delete("/onboarding-requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_onboarding_request(
    request_id: int,
    current_user: User = Depends(require_service_provider),
    db: Session = Depends(get_db)
):
    """Delete an onboarding request (only if status is PENDING or CHANGES_REQUESTED)."""
    request = db.query(ServiceOnboardingRequest).filter(
        ServiceOnboardingRequest.id == request_id,
        ServiceOnboardingRequest.provider_id == current_user.id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding request not found"
        )
    
    # Only allow deletion if status is PENDING or CHANGES_REQUESTED
    if request.status not in [OnboardingStatus.PENDING, OnboardingStatus.CHANGES_REQUESTED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete request with status {request.status.value}. Only PENDING or CHANGES_REQUESTED requests can be deleted."
        )
    
    db.delete(request)
    db.commit()
    
    return None
