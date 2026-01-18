"""Configuration management for the platform."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""
    
    # Database - Use SQLite for local dev, PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./jansetu.db"  # Local dev (SQLite)
    # DATABASE_URL: str = "postgresql://postgres:postgres@127.0.0.1:5432/jansetu"  # Production (PostgreSQL)
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    
    # OTP
    OTP_EXPIRE_MINUTES: int = 5
    OTP_LENGTH: int = 6
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Platform
    PLATFORM_BASE_URL: str = "http://localhost:8000"
    
    # Gateway
    GATEWAY_TIMEOUT_SECONDS: int = 5
    
    # Throttling
    THROTTLE_REQUESTS_PER_MINUTE: int = 100
    
    # Cache
    CACHE_TTL_SECONDS: int = 60
    
    # AI
    GROQ_API_KEY: str = "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"  # Default or from env

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
