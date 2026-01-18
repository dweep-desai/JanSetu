"""Main FastAPI application for the platform."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, get_db
from .routers import auth, services, admin, gateway, metrics, citizen, mkisan, sp_registration, appointments
from .middleware.logging import RequestLoggingMiddleware
from .database_init import init_citizens_schema_on_startup, init_admin_schema_on_startup, init_appointments_schema_on_startup

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-initialize schemas on startup
def init_schemas_on_startup():
    """Initialize all database schemas on startup."""
    db_gen = get_db()
    db = next(db_gen)
    try:
        # Initialize admin schema first (independent)
        init_admin_schema_on_startup(db)
        # Then initialize citizens schema (which also initializes service providers)
        init_citizens_schema_on_startup(db)
        # Ensure appointments schema is always initialized (in case it was missed)
        init_appointments_schema_on_startup(db)
    finally:
        db.close()

# Call initialization
init_schemas_on_startup()

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
app.include_router(mkisan.router)
app.include_router(sp_registration.router)
app.include_router(appointments.router)


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
