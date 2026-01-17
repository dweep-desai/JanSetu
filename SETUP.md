# Complete Setup Guide for New Developers

This comprehensive guide will help you set up the JanSetu project from scratch after cloning the repository. Follow these steps carefully to get everything running on a fresh machine.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Quick Reference](#quick-reference)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Python 3.10+** (Python 3.14 recommended)
   - Download from: https://www.python.org/downloads/
   - **Windows**: Check "Add Python to PATH" during installation
   - **macOS**: `brew install python3.14`
   - **Linux**: `sudo apt-get install python3.14 python3.14-venv`

2. **Node.js 18+** and npm
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version  # Should be v18.x or higher
     npm --version   # Should be 9.x or higher
     ```

3. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify: `git --version`

### Optional (for production-like setup)

4. **Docker and Docker Compose** (optional, for PostgreSQL and Redis)
   - Download from: https://www.docker.com/get-started
   - Verify: `docker --version` and `docker-compose --version`

---

## Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd Jansetu

# Verify you're in the correct directory
# You should see: backend/, frontend/, README.md, SETUP.md
```

### Step 2: Verify Project Structure

Your project structure should look like this:

```
Jansetu/
├── backend/
│   ├── jansetu_platform/
│   ├── requirements.txt
│   ├── init_db.py
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── README.md
└── SETUP.md
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Python Virtual Environment

**⚠️ CRITICAL: Always use a virtual environment. Never install packages globally.**

**On Windows (PowerShell or Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Verify activation:**
- You should see `(venv)` at the beginning of your terminal prompt
- Example: `(venv) C:\Users\YourName\Jansetu\backend>`

**If activation fails:**
- Windows: Try `venv\Scripts\activate.bat` or `.\venv\Scripts\Activate.ps1`
- macOS/Linux: Make sure you're using `python3` not `python`

### Step 3: Upgrade pip

```bash
# Make sure virtual environment is activated (you should see (venv))
pip install --upgrade pip
```

### Step 4: Install Python Dependencies

```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

**This will install:**
- FastAPI (web framework)
- SQLAlchemy (ORM)
- Pydantic (validation)
- PyJWT (authentication)
- uvicorn (ASGI server)
- And other dependencies

**Expected output:**
```
Successfully installed fastapi-0.x.x sqlalchemy-2.x.x ...
```

### Step 5: Set Up Environment Variables

**Create `.env` file from example:**

**On Windows:**
```bash
copy .env.example .env
```

**On macOS/Linux:**
```bash
cp .env.example .env
```

**Edit `.env` file** (use any text editor):

```env
# Database Configuration
DATABASE_URL=sqlite:///./jansetu.db

# Redis Configuration (Optional - OTP will work without it)
REDIS_URL=redis://localhost:6379/0

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-this-in-production-use-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# OTP Configuration
OTP_EXPIRE_MINUTES=5
OTP_LENGTH=6

# CORS Configuration (Allow frontend to connect)
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Platform Configuration
PLATFORM_BASE_URL=http://localhost:8000
```

**Important Notes:**
- For SQLite (default): No additional setup needed
- For PostgreSQL: Change `DATABASE_URL` to `postgresql://user:password@localhost:5432/jansetu`
- `JWT_SECRET_KEY`: Use a random string (e.g., generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- Redis is optional - OTP codes will be printed to console if Redis is not available

### Step 6: Initialize Database

```bash
# Make sure virtual environment is activated
python init_db.py
```

**Expected output:**
```
Database initialized successfully!
Created roles: CITIZEN, SERVICE_PROVIDER, ADMIN
```

**This creates:**
- SQLite database file: `jansetu.db` in the `backend/` directory
- Initial roles in the database
- Database tables (users, services, etc.)

### Step 7: Start Backend Server

```bash
# Make sure virtual environment is activated
python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Will watch for changes in these directories: ['D:\\Jansetu\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using WatchFiles
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal open!** The backend must be running for the frontend to work.

**Test the backend:**
- Open browser: http://localhost:8000/health
- Should return: `{"status":"healthy"}`
- API docs: http://localhost:8000/docs

---

## Frontend Setup

### Step 1: Open a New Terminal

**⚠️ IMPORTANT:** Keep the backend terminal running. Open a **new terminal window/tab** for frontend setup.

### Step 2: Navigate to Frontend Directory

```bash
# From project root
cd frontend
```

### Step 3: Install Node.js Dependencies

```bash
npm install
```

**This will install:**
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios
- And other dependencies

**Expected output:**
```
added 345 packages, and audited 345 packages in 15s
```

**If you encounter errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Step 4: Set Up Environment Variables

**Create `.env` file from example:**

**On Windows:**
```bash
copy .env.example .env
```

**On macOS/Linux:**
```bash
cp .env.example .env
```

**Edit `.env` file:**

```env
VITE_API_BASE_URL=http://localhost:8000
```

**⚠️ CRITICAL:** 
- Make sure the backend is running on `http://localhost:8000` before starting frontend
- If you change `.env`, restart the frontend dev server

### Step 5: Start Frontend Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**The frontend is now running at:** http://localhost:5173

---

## Verification

### Step 1: Verify Backend

1. **Health Check:**
   - Open: http://localhost:8000/health
   - Should return: `{"status":"healthy"}`

2. **API Documentation:**
   - Open: http://localhost:8000/docs
   - Should show Swagger UI with all API endpoints

### Step 2: Verify Frontend

1. **Landing Page:**
   - Open: http://localhost:5173
   - Should show the JanSetu welcome/landing page

2. **Login Page:**
   - Open: http://localhost:5173/login
   - Should show the login form with Aadhar input

### Step 3: Test Login Flow

1. **Go to login page:** http://localhost:5173/login

2. **Enter Aadhar number:**
   - Format: `ABC123456789` (12-20 alphanumeric characters)
   - Example: `ABC123456789`

3. **Click "Send OTP"**

4. **Check backend terminal** for OTP code:
   ```
   ==================================================
   OTP for Aadhar ABC123456789: 123456
   ==================================================
   ```

5. **Enter the OTP** in the frontend

6. **You should be logged in** and redirected to the dashboard

---

## Troubleshooting

### ❌ "uvicorn: command not found" or "ModuleNotFoundError: No module named 'uvicorn'"

**Problem:** Virtual environment is not activated or dependencies not installed.

**Solution:**
1. Navigate to `backend/` directory
2. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
3. Verify activation (should see `(venv)` in prompt)
4. Install dependencies: `pip install -r requirements.txt`
5. Try again: `python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000`

### ❌ "Cannot connect to server" in Frontend

**Problem:** Backend is not running or misconfigured.

**Checklist:**
1. ✅ Backend is running (check terminal for uvicorn output)
2. ✅ Backend is accessible: http://localhost:8000/health
3. ✅ Frontend `.env` has: `VITE_API_BASE_URL=http://localhost:8000`
4. ✅ Restart frontend after creating/editing `.env` file
5. ✅ No firewall blocking port 8000
6. ✅ Backend is running on `0.0.0.0:8000` (not just `127.0.0.1:8000`)

**Test backend connection:**
```bash
# In browser or terminal
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### ❌ Database Errors

**Problem:** Database not initialized or corrupted.

**Solution:**
1. Make sure you're in `backend/` directory
2. Activate virtual environment
3. Run: `python init_db.py`
4. Check that `jansetu.db` file exists in `backend/` directory
5. If errors persist, delete `jansetu.db` and run `init_db.py` again

### ❌ OTP Not Working

**Problem:** Redis not running (optional) or OTP not being generated.

**Solution:**
- Redis is **optional** for development
- OTP codes are **printed to backend terminal** if Redis is not available
- Check backend terminal for OTP code after clicking "Send OTP"
- Format: `OTP for Aadhar ABC123456789: 123456`

**To use Redis (optional):**
```bash
# If you have Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or install Redis locally
# Windows: Use WSL or Docker
# macOS: brew install redis && brew services start redis
# Linux: sudo apt-get install redis-server && sudo systemctl start redis
```

### ❌ Port Already in Use

**Problem:** Port 8000 or 5173 is already in use.

**Solution:**

**Find what's using the port:**

**Windows:**
```bash
netstat -ano | findstr :8000
# Note the PID, then: taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :8000
# Note the PID, then: kill -9 <PID>
```

**Or change the port:**

**Backend:**
```bash
python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8001
# Then update frontend .env: VITE_API_BASE_URL=http://localhost:8001
```

**Frontend:**
```bash
npm run dev -- --port 3000
```

### ❌ Frontend Build Errors

**Problem:** Node modules corrupted or version mismatch.

**Solution:**
```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json
# Windows: rmdir /s node_modules && del package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### ❌ Tailwind CSS Not Working

**Problem:** PostCSS or Tailwind configuration issues.

**Solution:**
1. Make sure `tailwindcss` is installed: `npm list tailwindcss`
2. Should show: `tailwindcss@3.4.19` (not v4.x)
3. If wrong version:
   ```bash
   npm uninstall tailwindcss
   npm install -D tailwindcss@^3.4.0
   ```
4. Restart frontend dev server

### ❌ "Module not found" Errors

**Problem:** Dependencies not installed or import paths incorrect.

**Solution:**
1. **Backend:** Make sure virtual environment is activated and run `pip install -r requirements.txt`
2. **Frontend:** Run `npm install`
3. Check that all files exist in the expected locations
4. Restart the dev server

### ❌ Styling Issues (Colors/UI messed up)

**Problem:** Tailwind CSS conflicts with custom CSS.

**Solution:**
- This should be fixed in the current version
- If issues persist:
  1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
  2. Restart frontend dev server
  3. Check browser console for CSS errors

---

## Quick Reference

### Starting the Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate          # Windows
# or
source venv/bin/activate        # macOS/Linux

python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

### Common Commands

**Backend:**
```bash
# Activate virtual environment
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Run server
python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

### Environment Files

**Backend `.env`:**
```env
DATABASE_URL=sqlite:///./jansetu.db
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:5173"]
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Next Steps

After successful setup:

1. **Read the README.md** for project overview and architecture
2. **Explore the API** at http://localhost:8000/docs
3. **Test the login flow** with Aadhar: `ABC123456789`
4. **Check the dashboard** after logging in
5. **Review the code structure** in `backend/jansetu_platform/` and `frontend/src/`

## Getting Help

If you're still stuck:

1. **Check the terminal output** for error messages
2. **Check browser console** (F12) for frontend errors
3. **Verify all prerequisites** are installed correctly
4. **Verify environment variables** are set correctly
5. **Check that both backend and frontend are running**
6. **Review the troubleshooting section** above

## Notes

- **Virtual Environment:** Always activate the virtual environment before running backend commands
- **Environment Variables:** Both backend and frontend need `.env` files
- **Ports:** Backend uses 8000, Frontend uses 5173 (default)
- **Database:** SQLite is used by default (no setup needed)
- **Redis:** Optional for development (OTP works without it)
- **Aadhar Login:** Uses Aadhar card numbers (e.g., ABC123456789) instead of phone numbers

---

**Happy Coding! 🚀**
