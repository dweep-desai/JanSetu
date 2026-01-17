"""Agriculture service routers."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import httpx
import os
import json
from .models import Advisory, Subscription, Base
from .database import get_db, engine

router = APIRouter()

# Initialize database
Base.metadata.create_all(bind=engine)


async def fetch_weather_data(region: str) -> dict:
    """Fetch weather data via platform gateway (inter-service communication)."""
    platform_url = os.getenv("PLATFORM_URL", "http://localhost:8000")
    gateway_url = f"{platform_url}/gateway/weather-service/forecast"
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(gateway_url, params={"region": region})
            if response.status_code == 200:
                return response.json()
            else:
                # Return mock data if service unavailable
                return {
                    "temperature": 25,
                    "humidity": 60,
                    "rainfall": 0,
                    "region": region,
                    "source": "mock"
                }
    except Exception:
        # Return mock data on error
        return {
            "temperature": 25,
            "humidity": 60,
            "rainfall": 0,
            "region": region,
            "source": "mock"
        }


@router.get("/advisories")
async def get_advisories(
    crop_type: Optional[str] = None,
    region: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get agricultural advisories."""
    query = db.query(Advisory)
    
    if crop_type:
        query = query.filter(Advisory.crop_type.ilike(f"%{crop_type}%"))
    
    if region:
        query = query.filter(Advisory.region.ilike(f"%{region}%"))
    
    advisories = query.order_by(Advisory.created_at.desc()).limit(50).all()
    
    # Fetch weather data for each advisory's region
    result = []
    for advisory in advisories:
        weather_data = await fetch_weather_data(advisory.region)
        result.append({
            "id": advisory.id,
            "crop_type": advisory.crop_type,
            "region": advisory.region,
            "title": advisory.title,
            "content": advisory.content,
            "weather_data": json.loads(advisory.weather_data) if advisory.weather_data else weather_data,
            "created_at": advisory.created_at.isoformat()
        })
    
    return {"advisories": result}


@router.post("/advisories/subscribe")
async def subscribe_to_advisories(
    user_id: int,
    user_phone: str,
    crop_type: str,
    region: str,
    db: Session = Depends(get_db)
):
    """Subscribe to agricultural advisories."""
    subscription = Subscription(
        user_id=user_id,
        user_phone=user_phone,
        crop_type=crop_type,
        region=region
    )
    
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    return {
        "subscription_id": subscription.id,
        "message": f"Subscribed to {crop_type} advisories for {region}",
        "crop_type": crop_type,
        "region": region
    }
