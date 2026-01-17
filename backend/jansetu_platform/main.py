"""Main FastAPI application for the platform."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import auth, services, admin, gateway, metrics, citizen
from .middleware.logging import RequestLoggingMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JanSetu - Unified Digital Public Infrastructure Platform",
    description="A unified platform for government services",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
app.add_middleware(RequestLoggingMiddleware)

# Include routers
app.include_router(auth.router)
app.include_router(services.router)
app.include_router(admin.router)
app.include_router(gateway.router)
app.include_router(metrics.router)
app.include_router(citizen.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "JanSetu - Unified Digital Public Infrastructure Platform",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
