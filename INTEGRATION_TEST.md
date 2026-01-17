# Integration Test Guide

## ✅ Backend & Frontend Integration Status

### Backend Status
- ✅ Backend running on: `http://localhost:8000`
- ✅ Health check: Working
- ✅ Database: Initialized (SQLite)
- ✅ Redis: Running (for OTP storage)
- ✅ Phone validation: Exactly 10 digits enforced

### Frontend Status
- ✅ Frontend running on: `http://localhost:5173`
- ✅ API integration: Configured to connect to backend
- ✅ Phone validation: 10 digits enforced in UI

## 🧪 How to Test Login Flow

### Step 1: Open Frontend
1. Open your browser and go to: `http://localhost:5173`
2. You should see the JanSetu login page

### Step 2: Enter Phone Number
1. Enter a **10-digit phone number** (e.g., `1234567890`)
2. Click "Send OTP"
3. The frontend will call: `POST http://localhost:8000/auth/login`

### Step 3: Get OTP from Backend Terminal
1. **Check the backend terminal** where you ran `python run_server.py`
2. You will see a message like:
   ```
   OTP for 1234567890: 123456
   ```
3. **Copy this 6-digit OTP code**

### Step 4: Verify OTP
1. Enter the 6-digit OTP code in the frontend
2. Click "Verify OTP"
3. The frontend will call: `POST http://localhost:8000/auth/verify-otp`
4. On success, you'll be redirected to the dashboard

## 🔍 Troubleshooting

### If login fails:
1. **Check backend is running**: Open `http://localhost:8000/health`
2. **Check frontend is running**: Open `http://localhost:5173`
3. **Check browser console**: Press F12 → Console tab
4. **Check network tab**: Press F12 → Network tab → Look for failed requests
5. **Check backend terminal**: Look for error messages

### Common Issues:

**"Cannot connect to server"**
- Backend is not running
- Solution: Start backend with `cd backend && python run_server.py`

**"Phone number must be exactly 10 digits"**
- You entered less/more than 10 digits
- Solution: Enter exactly 10 digits (e.g., `1234567890`)

**"Invalid or expired OTP"**
- OTP expired (5 minutes) or wrong code
- Solution: Request a new OTP

**CORS errors**
- Backend CORS not configured
- Solution: Check `backend/jansetu_platform/config.py` has frontend URL in `CORS_ORIGINS`

## 📝 Test Phone Numbers

You can use any 10-digit number:
- `1234567890`
- `9876543210`
- `5555555555`

The system will automatically create a user with `CITIZEN` role on first login.

## 🎯 Expected Flow

```
User enters phone → Frontend validates (10 digits) 
→ Backend validates (10 digits) 
→ Backend generates OTP 
→ Backend prints OTP to terminal 
→ User enters OTP from terminal 
→ Backend verifies OTP 
→ Backend returns JWT token 
→ Frontend stores token 
→ User redirected to dashboard
```
