"""Request logging middleware."""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.observability import RequestLog


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all requests."""
    
    async def dispatch(self, request: Request, call_next):
        """Process request and log it."""
        start_time = time.time()
        
        # Skip logging for metrics and health endpoints
        if request.url.path.startswith("/metrics") or request.url.path.startswith("/health"):
            response = await call_next(request)
            return response
        
        # Process request
        response = await call_next(request)
        
        # Calculate response time
        response_time = time.time() - start_time
        
        # Log to database (async, non-blocking)
        try:
            db = SessionLocal()
            try:
                # Extract service info if it's a gateway request
                service_name = "platform"
                service_id = "platform"
                
                if request.url.path.startswith("/gateway/"):
                    parts = request.url.path.split("/")
                    if len(parts) > 2:
                        service_id = parts[2]
                        service_name = service_id
                
                # Get user ID from token if available
                user_id = None
                if "authorization" in request.headers:
                    # In a real implementation, decode JWT to get user_id
                    # For now, we'll get it from the request state if available
                    pass
                
                log_entry = RequestLog(
                    service_name=service_name,
                    service_id=service_id,
                    endpoint=request.url.path,
                    method=request.method,
                    user_id=user_id,
                    response_time=response_time,
                    status_code=response.status_code
                )
                db.add(log_entry)
                db.commit()
            except Exception:
                db.rollback()
            finally:
                db.close()
        except Exception:
            # Don't fail the request if logging fails
            pass
        
        return response
