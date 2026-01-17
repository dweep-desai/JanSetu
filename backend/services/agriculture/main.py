"""Agriculture service main application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from .routers import router

app = FastAPI(title="Agriculture Service", version="1.0.0")

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
        "name": "Agricultural Advisory Service",
        "description": "Get agricultural advisories and weather information",
        "base_url": os.getenv("SERVICE_BASE_URL", "http://localhost:8002"),
        "category": "AGRICULTURE",
        "service_id": "agriculture"
    }
    
    print(f"Service registration data: {service_data}")


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "agriculture"}
