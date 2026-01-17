# 🚀 Server Status & Quick Start Guide

## ✅ Current Status

### Backend Server
- **Status**: ✅ Running
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Port**: 8000

### Frontend Server
- **Status**: ✅ Running
- **URL**: http://localhost:5173
- **Port**: 5173

### Redis
- **Status**: ✅ Running (for OTP storage)
- **Port**: 6379

### Database
- **Status**: ✅ Initialized (SQLite)
- **Location**: `backend/jansetu.db`

## 🎯 How to Use

### 1. Open Frontend
Go to: **http://localhost:5173**

### 2. Login
1. Enter any **10-digit phone number** (e.g., `1234567890`)
2. Click "Send OTP"
3. **Check your backend terminal** for the OTP code
4. You'll see: `OTP for 1234567890: 123456`
5. Enter the 6-digit OTP in the frontend
6. Click "Verify OTP"

### 3. Where to Find OTP
The OTP appears in the **backend terminal** where you see:
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

When you login, you'll see:
```
==================================================
OTP for 1234567890: 123456
==================================================
```

## 🔧 Manual Start Commands

If you need to restart servers manually:

### Start Backend
```bash
cd D:\Jansetu\JanSetu\backend
python run_server.py
```

### Start Frontend
```bash
cd D:\Jansetu\JanSetu\frontend
npm run dev
```

### Start Redis (if needed)
```bash
docker-compose up -d redis
```

## ✅ Verification

### Test Backend
```bash
curl http://localhost:8000/health
```
Should return: `{"status":"healthy"}`

### Test Frontend
Open: http://localhost:5173
Should show the JanSetu login page

### Test Login Endpoint
Open: http://localhost:8000/docs
- Find `POST /auth/login`
- Click "Try it out"
- Enter: `{"phone": "1234567890"}`
- Click "Execute"
- Check backend terminal for OTP

## 🐛 Troubleshooting

### If frontend can't connect to backend:
1. Verify backend is running: http://localhost:8000/health
2. Check browser console (F12) for errors
3. Verify CORS is configured (should be automatic)
4. Try restarting both servers

### If OTP doesn't appear:
1. Make sure you're looking at the **backend terminal** (not frontend)
2. Restart backend server
3. Check for any error messages in backend terminal

## 📝 Quick Test

1. ✅ Backend: http://localhost:8000/health
2. ✅ Frontend: http://localhost:5173
3. ✅ Login with: `1234567890`
4. ✅ Check backend terminal for OTP
5. ✅ Enter OTP and verify

Everything is ready to use! 🎉
