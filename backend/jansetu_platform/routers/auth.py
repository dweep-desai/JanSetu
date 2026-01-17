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
    """Generate and send OTP for Aadhar card number."""
    logger.info(f"Login request received for Aadhar: {request.aadhar}")
    
    # Validate Aadhar format (alphanumeric, 12-20 characters)
    if not request.aadhar or len(request.aadhar) < 12 or len(request.aadhar) > 20:
        logger.warning(f"Invalid Aadhar format: {request.aadhar}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aadhar must be 12-20 characters (e.g., ABC123456789)"
        )
    
    # Get or create user with CITIZEN role by default
    user = db.query(User).filter(User.aadhar == request.aadhar).first()
    
    if not user:
        logger.info(f"Creating new user for Aadhar: {request.aadhar}")
        # Create new user with CITIZEN role
        citizen_role = db.query(Role).filter(Role.name == RoleType.CITIZEN).first()
        if not citizen_role:
            citizen_role = Role(name=RoleType.CITIZEN)
            db.add(citizen_role)
            db.commit()
            db.refresh(citizen_role)
        
        user = User(aadhar=request.aadhar, role_id=citizen_role.id)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Generate OTP
    otp_code = generate_otp()
    otp_id = str(uuid.uuid4())
    
    logger.info(f"Generated OTP for Aadhar {request.aadhar}, OTP ID: {otp_id}")
    
    # Store OTP in Redis
    store_otp(otp_id, request.aadhar, otp_code)
    
    # In production, send OTP via SMS service
    # For now, we'll return it (remove in production!)
    import sys
    otp_message = f"\n{'='*50}\nOTP for Aadhar {request.aadhar}: {otp_code}\n{'='*50}\n"
    print(otp_message, flush=True)
    sys.stdout.flush()  # Force flush to ensure it appears immediately
    logger.info(f"OTP displayed for Aadhar {request.aadhar}: {otp_code}")
    
    return OTPResponse(
        otp_id=otp_id,
        message="OTP sent successfully",
        expires_in=300
    )


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_endpoint(request: OTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and return JWT token."""
    # Verify OTP
    if not verify_otp(request.otp_id, request.aadhar, request.otp_code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP"
        )
    
    # Get user
    user = db.query(User).filter(User.aadhar == request.aadhar).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create token
    token = create_token_for_user(user.id, user.aadhar, RoleType(user.role.name))
    
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
