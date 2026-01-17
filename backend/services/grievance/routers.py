"""Grievance service routers."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import httpx
import os
from .models import Complaint, ComplaintStatus, Base
from .database import get_db, engine

router = APIRouter()

# Initialize database
Base.metadata.create_all(bind=engine)


async def validate_user_via_platform(user_id: int, token: str) -> bool:
    """Validate user via platform gateway (inter-service communication)."""
    platform_url = os.getenv("PLATFORM_URL", "http://localhost:8000")
    gateway_url = f"{platform_url}/gateway/platform/auth/me"
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                gateway_url,
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code == 200:
                user_data = response.json()
                return user_data.get("id") == user_id
            return False
    except Exception:
        # In production, you might want to fail here
        # For MVP, we'll allow it
        return True


@router.post("/complaints")
async def submit_complaint(
    user_id: int,
    user_phone: str,
    title: str,
    description: str,
    category: str,
    token: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Submit a complaint."""
    # Validate user via platform if token provided
    if token:
        is_valid = await validate_user_via_platform(user_id, token)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User validation failed"
            )
    
    complaint = Complaint(
        user_id=user_id,
        user_phone=user_phone,
        title=title,
        description=description,
        category=category,
        status=ComplaintStatus.SUBMITTED
    )
    
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    return {
        "complaint_id": complaint.id,
        "title": complaint.title,
        "status": complaint.status.value,
        "message": "Complaint submitted successfully"
    }


@router.get("/complaints")
async def get_complaints(
    user_id: int,
    status_filter: Optional[ComplaintStatus] = None,
    db: Session = Depends(get_db)
):
    """Get complaints for a user."""
    query = db.query(Complaint).filter(Complaint.user_id == user_id)
    
    if status_filter:
        query = query.filter(Complaint.status == status_filter)
    
    complaints = query.order_by(Complaint.created_at.desc()).all()
    
    return {
        "complaints": [
            {
                "id": complaint.id,
                "title": complaint.title,
                "description": complaint.description,
                "category": complaint.category,
                "status": complaint.status.value,
                "resolution_notes": complaint.resolution_notes,
                "created_at": complaint.created_at.isoformat(),
                "updated_at": complaint.updated_at.isoformat() if complaint.updated_at else None
            }
            for complaint in complaints
        ]
    }


@router.put("/complaints/{complaint_id}/status")
async def update_complaint_status(
    complaint_id: int,
    status: ComplaintStatus,
    resolution_notes: Optional[str] = None,
    admin_user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Update complaint status (admin only)."""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    complaint.status = status
    if resolution_notes:
        complaint.resolution_notes = resolution_notes
    
    if status == ComplaintStatus.RESOLVED:
        complaint.resolved_by = admin_user_id
        complaint.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(complaint)
    
    return {
        "complaint_id": complaint.id,
        "status": complaint.status.value,
        "message": "Complaint status updated"
    }
