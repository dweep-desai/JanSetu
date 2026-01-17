"""Healthcare service main application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from .routers import router

app = FastAPI(title="Healthcare Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Register service with platform on startup."""
    platform_url = os.getenv("PLATFORM_URL", "http://localhost:8000")
    service_data = {
        "name": "Healthcare Appointment Booking",
        "description": "Book and manage healthcare appointments",
        "base_url": os.getenv("SERVICE_BASE_URL", "http://localhost:8001"),
        "category": "HEALTHCARE",
        "service_id": "healthcare"
    }
    
    # In a real implementation, this would use proper authentication
    # For now, we'll just log the registration attempt
    try:
        async with httpx.AsyncClient() as client:
            # This would be a POST to /services/onboard with proper auth
            print(f"Service registration data: {service_data}")
    except Exception as e:
        print(f"Failed to register service: {e}")


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "healthcare"}
