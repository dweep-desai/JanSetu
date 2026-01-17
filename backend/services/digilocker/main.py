"""DigiLocker service main application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .routers import router

app = FastAPI(title="DigiLocker Service", version="1.0.0")

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

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "digilocker"}
