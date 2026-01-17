# JanSetu - Unified Digital Public Infrastructure Platform

A comprehensive unified digital public infrastructure platform inspired by India's UMANG portal, designed to demonstrate how multiple government services can be onboarded, managed, accessed, and monitored through a single core platform.

## 🚀 Quick Start for New Developers

**If you just cloned this repository, start here:** See [SETUP.md](SETUP.md) for complete setup instructions including:
- Virtual environment setup
- Database initialization
- Environment variable configuration
- Troubleshooting common issues

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Demo Flow](#demo-flow)
- [Deployment](#deployment)

## Architecture Overview

The platform follows a **core + pluggable services** architecture:

- **Core Platform**: Handles identity, authentication, authorization, service registry, API gateway routing, observability, and governance workflows
- **Mock Services**: Independent FastAPI applications (healthcare, agriculture, grievance) that register with the platform
- **Frontend**: Single React application with role-based interfaces

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vercel)                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Citizens │  │Service Prov. │  │  Gov. Administrators │   │
│  └──────────┘  └──────────────┘  └──────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Core Platform (FastAPI + Docker)               │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Auth     │  │Service Reg.  │  │  API Gateway     │    │
│  │  (JWT)     │  │  + Workflow  │  │  (Routing)       │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │Observability│  │  Caching    │  │   Throttling     │    │
│  │  (Metrics) │  │   (Redis)    │  │                  │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Healthcare  │ │ Agriculture  │ │  Grievance   │
│   Service    │ │   Service    │ │   Service    │
│  (FastAPI)   │ │  (FastAPI)   │ │  (FastAPI)   │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Features

### Core Platform Features

1. **Identity & Authentication**
   - JWT-based authentication
   - Aadhar card-based OTP login (Aadhar number + OTP)
   - Role-based access control (Citizen, Service Provider, Admin)

2. **Service Registry & Onboarding**
   - Service providers can submit onboarding requests
   - Government administrators approve/reject/request changes
   - Service lifecycle management (PENDING → APPROVED → ACTIVE)

3. **API Gateway**
   - Dynamic request routing to registered services
   - Request caching (Redis)
   - Rate limiting/throttling
   - Request logging and observability

4. **Observability**
   - Request logging with metrics
   - Service-level analytics
   - Platform health monitoring

### Mock Services

1. **Healthcare Service** (Port 8001)
   - Appointment booking
   - View available appointments
   - Manage bookings

2. **Agriculture Service** (Port 8002)
   - Agricultural advisories
   - Weather data integration (inter-service communication example)
   - Subscription management

3. **Grievance Service** (Port 8003)
   - Complaint submission
   - Complaint tracking
   - Admin resolution workflow

## Technology Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.14
- **ORM**: SQLAlchemy 2.0+
- **Validation**: Pydantic 2.0+
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: PyJWT
- **HTTP Client**: httpx

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Charts**: Recharts

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (frontend)

## Project Structure

```
JanSetu/
├── backend/
│   ├── jansetu_platform/      # Core platform code
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── security/          # Auth & authorization
│   │   ├── routers/           # API routes
│   │   ├── services/          # Business logic
│   │   └── middleware/        # Request middleware
│   ├── services/              # Mock services
│   │   ├── healthcare/
│   │   ├── agriculture/
│   │   └── grievance/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # Shared components
│   │   ├── pages/              # Role-based pages
│   │   ├── services/          # API client
│   │   └── context/            # Auth context
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm/yarn (for frontend development)
- Python 3.14+ (for local backend development)

### Backend Setup

**⚠️ IMPORTANT: For new developers, see [SETUP.md](SETUP.md) for detailed setup instructions including virtual environment setup.**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment (REQUIRED):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend` directory (copy from `.env.example` if it exists):
   ```bash
   # Windows
   copy .env.example .env
   # macOS/Linux
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL=sqlite:///./jansetu.db
   REDIS_URL=redis://localhost:6379/0
   JWT_SECRET_KEY=your-secret-key-change-in-production
   CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
   ```

5. **Initialize database:**
   ```bash
   python init_db.py
   ```

6. **Start backend server:**
   ```bash
   # Make sure virtual environment is activated
   python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Alternative: Run with Docker Compose (Optional):**
   ```bash
   cd ..
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database
   - Redis cache
   - Platform API (port 8000)
   - Healthcare service (port 8001)
   - Agriculture service (port 8002)
   - Grievance service (port 8003)

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory:
   ```bash
   # Windows
   copy .env.example .env
   # macOS/Linux
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
   
   **⚠️ IMPORTANT:** Make sure the backend is running before starting the frontend!

4. **Run development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints

- `POST /auth/login` - Generate OTP for Aadhar card number
- `POST /auth/verify-otp` - Verify OTP and get JWT token
- `GET /auth/me` - Get current user information

### Service Provider Endpoints

- `POST /services/onboard` - Submit service onboarding request
- `GET /services/my-services` - List provider's services
- `GET /services/onboarding-requests` - List provider's onboarding requests
- `GET /services/onboarding-requests/{id}` - Get specific request
- `DELETE /services/onboarding-requests/{id}` - Delete pending/changes-requested request

### Admin Endpoints

- `GET /admin/onboarding-requests` - List all onboarding requests
- `PUT /admin/onboarding-requests/{id}/approve` - Approve service
- `PUT /admin/onboarding-requests/{id}/reject` - Reject service
- `PUT /admin/onboarding-requests/{id}/request-changes` - Request changes
- `PUT /admin/services/{id}/activate` - Activate service
- `PUT /admin/services/{id}/deactivate` - Deactivate service

### Gateway Endpoints

- `GET|POST|PUT|DELETE /gateway/{service_id}/{path}` - Route requests to services

### Metrics Endpoints

- `GET /metrics/services` - Service-level metrics
- `GET /metrics/requests` - Request logs
- `GET /metrics/health` - Platform health status

### Interactive API Documentation

FastAPI provides automatic interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Demo Flow

### 1. Service Provider Onboarding

1. **Login as Service Provider:**
   - Use Aadhar card number to login (e.g., ABC123456789)
   - Verify OTP
   - Role should be SERVICE_PROVIDER (you may need to update user role in database)

2. **Submit Service Onboarding Request:**
   - Navigate to Provider Dashboard
   - Click "Submit New Service"
   - Fill in service details:
     - Name: "Healthcare Appointment Booking"
     - Service ID: "healthcare"
     - Base URL: "http://localhost:8001"
     - Category: "HEALTHCARE"
   - Submit request

3. **Admin Approval:**
   - Login as Admin (update user role in database)
   - Navigate to Admin Dashboard
   - Review pending requests
   - Approve the service

### 2. Citizen Access

1. **Login as Citizen:**
   - Use Aadhar card number to login (e.g., ABC123456789)
   - Verify OTP

2. **Browse Services:**
   - View available services in the catalog
   - Click on a service to see details

3. **Access Service via Gateway:**
   - Services are accessed through: `/gateway/{service_id}/{endpoint}`
   - Example: `GET /gateway/healthcare/appointments`

### 3. Inter-Service Communication

The Agriculture service demonstrates inter-service communication by calling the platform gateway to fetch weather data:
- Agriculture service calls: `GET /gateway/weather-service/forecast?region=...`
- Platform routes the request (or returns mock data if service doesn't exist)

### 4. Observability

1. **View Metrics:**
   - Admin can access `/metrics/services` to see service-level metrics
   - Request logs available at `/metrics/requests`

2. **Platform Health:**
   - Check `/metrics/health` for platform status

## Deployment

### Backend

The backend is containerized using Docker. To deploy:

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. For production, update environment variables in `docker-compose.yml`:
   - Use strong JWT secret key
   - Configure production database URLs
   - Set appropriate CORS origins

### Frontend

Deploy to Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `VITE_API_BASE_URL`: Your backend API URL

## Key Implementation Details

### Service Onboarding Workflow

```
Service Provider submits → PENDING
  ↓
Admin reviews → APPROVED / REJECTED / CHANGES_REQUESTED
  ↓
If APPROVED → Service.status = ACTIVE → Available in gateway
```

### Gateway Routing Logic

1. Extract `service_id` from URL path
2. Query Service registry (cache lookup first)
3. Verify service is APPROVED and ACTIVE
4. Check user authorization (role-based)
5. Forward request to `base_url + remaining_path`
6. Log request/response
7. Return response to client

### Database Schema

- **Users**: Aadhar-based authentication with roles
- **Services**: Service registry with status tracking
- **ServiceOnboardingRequest**: Onboarding workflow management
- **RequestLog**: Observability and metrics

## Development Notes

- OTP codes are printed to console in development mode
- Services use SQLite for simplicity (can be upgraded to PostgreSQL)
- Mock services attempt self-registration on startup
- All inter-service communication goes through the platform gateway
- **Login uses Aadhar card numbers** (format: ABC123456789) instead of phone numbers

## License

This project is created for demonstration purposes as part of Ingenious Hackathon 7.0.

## Support

For issues or questions, please refer to the API documentation at `/docs` or check the codebase structure.
