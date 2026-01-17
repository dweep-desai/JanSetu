"""API Gateway router."""
from fastapi import APIRouter, Depends, Request, HTTPException, status, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import time
from ..database import get_db
from ..models.service import Service
from ..models.observability import RequestLog
from ..services.gateway_service import GatewayService
from ..services.cache_service import CacheService
from ..services.throttling import ThrottlingService
from ..models.service import ServiceStatus
from ..security import get_current_user, require_authenticated
from ..models.user import User

router = APIRouter(prefix="/gateway", tags=["gateway"])

# Services
cache_service = CacheService()
throttling_service = ThrottlingService()


@router.api_route("/{service_id}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway_route(
    service_id: str,
    path: str,
    request: Request,
    current_user: Optional[User] = Depends(require_authenticated),
    db: Session = Depends(get_db)
):
    """Gateway route that forwards requests to downstream services."""
    start_time = time.time()
    
    # Throttling check
    if current_user:
        allowed, remaining = throttling_service.check_throttle(current_user.id)
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
                headers={"X-RateLimit-Remaining": "0"}
            )
    
    # Resolve service
    gateway_service = GatewayService(db)
    service = gateway_service.resolve_service(service_id)
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{service_id}' not found"
        )
    
    # Validate service is active
    if service.status != ServiceStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Service '{service.name}' is not active"
        )
    
    # Get request data
    method = request.method
    headers = dict(request.headers)
    params = dict(request.query_params)
    
    # Get body for non-GET requests
    body = None
    if method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except Exception:
            body = None
    
    # Check cache for GET requests
    if method == "GET" and current_user:
        cache_key = cache_service.get_cache_key(service_id, path, params)
        cached_response = cache_service.get(cache_key)
        if cached_response:
            response_time = time.time() - start_time
            # Log request
            _log_request(db, service, path, method, current_user.id if current_user else None, 200, response_time)
            return JSONResponse(content=cached_response)
    
    # Forward request
    try:
        response_data, status_code, response_headers = await gateway_service.forward_request(
            service=service,
            path=path,
            method=method,
            headers=headers,
            params=params if params else None,
            body=body
        )
        
        response_time = time.time() - start_time
        
        # Cache GET requests
        if method == "GET" and status_code == 200 and current_user:
            cache_key = cache_service.get_cache_key(service_id, path, params)
            cache_service.set(cache_key, response_data)
        
        # Log request
        _log_request(db, service, path, method, current_user.id if current_user else None, status_code, response_time)
        
        # Create response
        response = JSONResponse(
            content=response_data,
            status_code=status_code,
            headers=response_headers
        )
        
        if current_user:
            remaining, _ = throttling_service.check_throttle(current_user.id)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        response_time = time.time() - start_time
        _log_request(db, service, path, method, current_user.id if current_user else None, 500, response_time, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gateway error: {str(e)}"
        )


def _log_request(
    db: Session,
    service: Service,
    path: str,
    method: str,
    user_id: Optional[int],
    status_code: int,
    response_time: float,
    error: Optional[str] = None
):
    """Log request to database."""
    try:
        log_entry = RequestLog(
            service_name=service.name,
            service_id=service.service_id,
            endpoint=path,
            method=method,
            user_id=user_id,
            response_time=response_time,
            status_code=status_code,
            error_message=error
        )
        db.add(log_entry)
        db.commit()
    except Exception:
        db.rollback()
        # Don't fail the request if logging fails
