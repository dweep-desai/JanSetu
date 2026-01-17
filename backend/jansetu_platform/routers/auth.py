"""Authentication router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
import logging
from ..database import get_db
from ..models.user import User, Role, RoleType
from ..schemas.auth import LoginRequest, OTPRequest, OTPResponse, TokenResponse
from ..schemas.user import UserResponse
from ..security import (
    generate_otp,
    store_otp,
    verify_otp,
    create_token_for_user,
    get_current_user,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=OTPResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Generate and send OTP for phone number."""
    logger.info(f"Login request received for phone: {request.phone}")
    
    # Validate phone number is exactly 10 digits
    if not request.phone.isdigit() or len(request.phone) != 10:
        logger.warning(f"Invalid phone number format: {request.phone}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number must be exactly 10 digits"
        )
    
    # Get or create user with CITIZEN role by default
    user = db.query(User).filter(User.phone == request.phone).first()
    
    if not user:
        logger.info(f"Creating new user for phone: {request.phone}")
        # Create new user with CITIZEN role
        citizen_role = db.query(Role).filter(Role.name == RoleType.CITIZEN).first()
        if not citizen_role:
            citizen_role = Role(name=RoleType.CITIZEN)
            db.add(citizen_role)
            db.commit()
            db.refresh(citizen_role)
        
        user = User(phone=request.phone, role_id=citizen_role.id)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Generate OTP
    otp_code = generate_otp()
    otp_id = str(uuid.uuid4())
    
    logger.info(f"Generated OTP for {request.phone}, OTP ID: {otp_id}")

    # LOG OTP FIRST (Priority!)
    otp_message = f"OTP for {request.phone}: {otp_code}"
    banner = "=" * 50
    logger.warning(f"\n{banner}\n{otp_message}\n{banner}\n")
    logger.info(f"OTP displayed for {request.phone}: {otp_code}")

    # Write OTP to file for debugging (as requested)
    try:
        import json
        import os
        
        # Calculate path to backend/results
        # current file is in backend/jansetu_platform/routers/auth.py
        # go up 3 levels to get to backend
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        results_dir = os.path.join(backend_dir, "results")
        os.makedirs(results_dir, exist_ok=True)
        
        otp_file_path = os.path.join(results_dir, "otp.json")
        
        with open(otp_file_path, "w") as f:
            json.dump({
                "phone": request.phone,
                "otp": otp_code,
                "otp_id": otp_id,
                "message": "Copy this OTP code to the frontend"
            }, f, indent=2)
            
        logger.info(f"OTP written to file: {otp_file_path}")
    except Exception as e:
        logger.error(f"Failed to write OTP to file: {e}")
    
    # Store OTP in Redis (Attempt storage LAST)
    try:
        store_otp(otp_id, request.phone, otp_code)
    except Exception as e:
        logger.error(f"Failed to store OTP in Redis: {e}")
        # Continue anyway so user can login if verify_otp has a fallback
    
    return OTPResponse(
        otp_id=otp_id,
        message="OTP sent successfully",
        expires_in=300
    )


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_endpoint(request: OTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and return JWT token."""
    # Verify OTP
    if not verify_otp(request.otp_id, request.phone, request.otp_code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP"
        )
    
    # Get user
    user = db.query(User).filter(User.phone == request.phone).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create token
    token = create_token_for_user(user.id, user.phone, RoleType(user.role.name))
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        role=user.role.name.value
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user
