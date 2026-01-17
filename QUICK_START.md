# Quick Start Guide

## Troubleshooting Login Issues

If you're getting "Login failed", check the following:

### 1. Is the Backend Running?

Check if the backend is running on http://localhost:8000:

```bash
# In backend directory
cd backend
python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000
```

Or test if it's accessible:
```bash
curl http://localhost:8000/health
```

### 2. Is PostgreSQL Running?

The backend needs PostgreSQL. Make sure it's running:

```bash
# Using Docker Compose (recommended)
cd D:\Jansetu\JanSetu
docker-compose up -d postgres redis

# Or check if PostgreSQL is running on port 5432
```

### 3. Is Redis Running?

The OTP system needs Redis:

```bash
# Using Docker Compose
docker-compose up -d redis

# Or check if Redis is running on port 6379
```

### 4. Initialize Database

If this is the first run, you need to create the database tables:

```python
# Run this Python script once:
from backend.jansetu_platform.database import engine, Base
from backend.jansetu_platform.models import User, Role, Service, ServiceOnboardingRequest, RequestLog

# Create all tables
Base.metadata.create_all(bind=engine)

# Create initial roles
from backend.jansetu_platform.database import SessionLocal
from backend.jansetu_platform.models import RoleType

db = SessionLocal()
try:
    for role_type in [RoleType.CITIZEN, RoleType.SERVICE_PROVIDER, RoleType.ADMIN]:
        role = db.query(Role).filter(Role.name == role_type).first()
        if not role:
            role = Role(name=role_type)
            db.add(role)
    db.commit()
    print("Database initialized successfully!")
finally:
    db.close()
```

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for JavaScript errors
- Network tab to see if the request is being made and what the response is

### 6. Check Backend Logs

When you try to login, check the backend terminal for:
- Any error messages
- The OTP code (it should print: "OTP for 1234567890: XXXXXX")

### 7. Test Backend Directly

Test the login endpoint directly:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "1234567890"}'
```

This should return an OTP response.

## Common Issues

### "Cannot connect to server"
- Backend is not running
- Wrong URL in frontend (check VITE_API_BASE_URL)

### "Internal Server Error"
- Database not initialized
- PostgreSQL not running
- Redis not running

### "Invalid or expired OTP"
- OTP expired (5 minutes)
- Wrong OTP code
- Check backend console for the actual OTP
