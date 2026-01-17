"""Metrics and observability router."""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models.observability import RequestLog
from ..models.service import Service
from ..security import require_admin, get_current_user
from ..models.user import User

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/services")
async def get_service_metrics(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    hours: int = Query(24, ge=1, le=168, description="Hours of data to retrieve")
):
    """Get service-level metrics."""
    since = datetime.utcnow() - timedelta(hours=hours)
    
    # Aggregate metrics by service
    metrics = db.query(
        RequestLog.service_id,
        RequestLog.service_name,
        func.count(RequestLog.id).label("total_requests"),
        func.avg(RequestLog.response_time).label("avg_response_time"),
        func.min(RequestLog.response_time).label("min_response_time"),
        func.max(RequestLog.response_time).label("max_response_time"),
        func.sum(func.case((RequestLog.status_code >= 400, 1), else_=0)).label("error_count"),
        func.sum(func.case((RequestLog.status_code < 400, 1), else_=0)).label("success_count")
    ).filter(
        RequestLog.timestamp >= since
    ).group_by(
        RequestLog.service_id,
        RequestLog.service_name
    ).all()
    
    result = []
    for metric in metrics:
        result.append({
            "service_id": metric.service_id,
            "service_name": metric.service_name,
            "total_requests": metric.total_requests,
            "avg_response_time": round(float(metric.avg_response_time or 0), 3),
            "min_response_time": round(float(metric.min_response_time or 0), 3),
            "max_response_time": round(float(metric.max_response_time or 0), 3),
            "error_count": metric.error_count or 0,
            "success_count": metric.success_count or 0,
            "error_rate": round((metric.error_count or 0) / metric.total_requests * 100, 2) if metric.total_requests > 0 else 0
        })
    
    return {"metrics": result, "period_hours": hours}


@router.get("/requests")
async def get_request_logs(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    service_id: Optional[str] = Query(None, description="Filter by service ID"),
    status_code: Optional[int] = Query(None, description="Filter by status code"),
    limit: int = Query(100, ge=1, le=1000, description="Number of logs to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
):
    """Get request logs with filtering."""
    query = db.query(RequestLog)
    
    if service_id:
        query = query.filter(RequestLog.service_id == service_id)
    
    if status_code:
        query = query.filter(RequestLog.status_code == status_code)
    
    logs = query.order_by(RequestLog.timestamp.desc()).limit(limit).offset(offset).all()
    
    return {
        "logs": [
            {
                "id": log.id,
                "service_name": log.service_name,
                "service_id": log.service_id,
                "endpoint": log.endpoint,
                "method": log.method,
                "user_id": log.user_id,
                "response_time": log.response_time,
                "status_code": log.status_code,
                "timestamp": log.timestamp.isoformat(),
                "error_message": log.error_message
            }
            for log in logs
        ],
        "total": query.count(),
        "limit": limit,
        "offset": offset
    }


@router.get("/health")
async def get_platform_health(
    db: Session = Depends(get_db)
):
    """Get platform health status."""
    try:
        # Check database
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"
    
    # Check Redis (would need redis client here)
    redis_status = "healthy"  # Simplified
    
    # Get active services count
    active_services = db.query(Service).filter(Service.status == "ACTIVE").count()
    
    # Get recent error rate (last hour)
    since = datetime.utcnow() - timedelta(hours=1)
    recent_logs = db.query(RequestLog).filter(RequestLog.timestamp >= since).all()
    total_recent = len(recent_logs)
    error_recent = sum(1 for log in recent_logs if log.status_code >= 400)
    error_rate = (error_recent / total_recent * 100) if total_recent > 0 else 0
    
    return {
        "status": "healthy" if db_status == "healthy" and redis_status == "healthy" else "degraded",
        "database": db_status,
        "redis": redis_status,
        "active_services": active_services,
        "recent_error_rate": round(error_rate, 2),
        "timestamp": datetime.utcnow().isoformat()
    }
