# JanSetu - Unified Digital Public Infrastructure Platform

A comprehensive unified digital public infrastructure platform that demonstrates how multiple government services can be onboarded, managed, accessed, and monitored through a single core platform. Inspired by India's UMANG portal, JanSetu provides a scalable, extensible architecture for digital governance.

## Project Overview

JanSetu provides a single unified platform that:
- Centralizes all government services under one interface
- Enables seamless service provider onboarding with governance workflows
- Provides real-time observability and analytics
- Offers consistent user experience across all services
- Supports role-based access control for citizens, providers, and administrators

## Features

### Unified Service Catalog
- 30+ Government Services across 6 categories:
  - Healthcare (Medical stores, Hospitals, Ambulance, Telemedicine)
  - Emergency Services (Police, Helplines, Ambulance)
  - Agriculture (MSP, Market availability, Supply exchange)
  - Education (Marksheets, ABC ID, AICTE, NTA)
  - Transport & Utility (Fuel prices, Petrol stations)
  - My City (Traffic, Weather, Complaints, Public transport)
  - DigiLocker (Document interaction and storage)

### Service Onboarding & Governance
- Provider Self-Service: Service providers can submit onboarding requests
- Admin Approval Workflow: Multi-stage approval process (PENDING -> APPROVED -> ACTIVE)
- Service Lifecycle Management: Activate/deactivate services dynamically
- Change Request Mechanism: Admin can request modifications before approval

### Identity & Access Management
- Aadhar-based Authentication: Secure OTP-based login system
- Role-Based Access Control: Citizens, Service Providers, Administrators
- JWT Token Management: Stateless authentication with secure token handling

### API Gateway & Routing
- Dynamic Request Routing: Routes requests to appropriate services based on registry
- Request Caching: Redis-based caching for improved performance
- Rate Limiting: Protection against abuse and overload
- Request Logging: Complete audit trail of all API calls

### Observability & Analytics
- Service-Level Metrics: Request counts, response times, error rates
- Platform Health Monitoring: Real-time system status
- Request Logs: Detailed logging for debugging and analysis
- Performance Analytics: Track service usage and performance

### Real-Time API Integrations
- Location Services: Integration with OpenStreetMap/Overpass API for location-based services
- Government Data Portals: Real-time MSP data, fuel prices, market information
- Third-Party APIs: Extensible architecture for external service integration

## Technology Stack

### Backend
- Framework: FastAPI (High-performance, async Python framework)
- Database: SQLite (Development) / PostgreSQL (Production-ready)
- Cache: Redis (For OTP storage and request caching)
- Authentication: JWT (JSON Web Tokens)
- ORM: SQLAlchemy (Database abstraction layer)

### Frontend
- Framework: React 18 with TypeScript
- Build Tool: Vite (Fast development and build)
- Styling: Tailwind CSS (Utility-first CSS framework)
- Routing: React Router (Client-side routing)
- Maps: Leaflet.js (Interactive maps for location services)

### Infrastructure
- Containerization: Docker & Docker Compose
- Deployment: Vercel (Frontend), Docker (Backend)

## Setup Steps

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker and Docker Compose (optional, for Redis/Postgres)

### Environment Variables

Copy the example environment file to create your local configuration:

```bash
cp backend/.env.example backend/.env
```

Example `.env` content:

```ini
# Database Configuration
DATABASE_URL=sqlite:///./jansetu.db

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# OTP Configuration
OTP_EXPIRE_MINUTES=5
OTP_LENGTH=6

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Platform Configuration
PLATFORM_BASE_URL=http://localhost:8000
```

## How to Run Locally

### Windows

Open a PowerShell terminal for the Backend:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python run_server.py
```

Open a new PowerShell terminal for the Frontend:

```powershell
cd frontend
npm install
npm run dev
```

### Linux / MacOS

Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run_server.py
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Test Login Credentials

To access the Citizen Dashboard, use the following test credentials:

- **Aadhar Number**: `123456789012` (Any 12-digit number works)
- **OTP**: `123456` (Default mock OTP for development)

## Basic Error Handling

The application implements robust error handling mechanisms:
- **Backend Logging**: The `run_server.py` script includes `safe_print` generic error handling to manage console encoding issues on Windows.
- **API Errors**: All API endpoints return standardized JSON error responses (e.g., 404 Not Found, 500 Internal Server Error) which are caught and displayed gracefully in the frontend.
- **Validation**: Pydantic models ensure all incoming data is validated before processing, returning detailed 422 Unprocessable Entity errors if validation fails.

## Confirmation of No Secrets

This repository does **NOT** contain any sensitive secrets, private API keys, or production credentials.
- All configuration is managed via environment variables.
- The `JWT_SECRET_KEY` in the example is a placeholder.
- Mock data is used for demonstration purposes.

## License

This project is created for demonstration purposes as part of Ingenious Hackathon 7.0.
