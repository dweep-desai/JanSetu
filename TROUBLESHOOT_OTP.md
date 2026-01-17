# 🔧 Troubleshooting: OTP Not Appearing

## ✅ Quick Fix Steps

### Step 1: Restart Your Backend Server
**IMPORTANT**: After code changes, you need to restart the backend!

1. **Stop the backend**: In your backend terminal, press `Ctrl+C`
2. **Start it again**:
   ```bash
   cd D:\Jansetu\JanSetu\backend
   python run_server.py
   ```

### Step 2: Check Backend is Running
Look for these messages in your backend terminal:
```
Starting server on http://localhost:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Test Login Again
1. Go to frontend: `http://localhost:5173`
2. Enter phone: `1234567890`
3. Click "Send OTP"
4. **Immediately check your backend terminal**

You should see:
```
==================================================
OTP for 1234567890: 123456
==================================================
```

## 🔍 If OTP Still Doesn't Appear

### Check 1: Is the Request Reaching Backend?
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try logging in again
4. Look for a request to `/auth/login`
5. Check if it shows status `200` (success) or an error

### Check 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try logging in
4. Look for any error messages

### Check 3: Check Backend Terminal for Errors
Look for any error messages in red in your backend terminal. Common issues:
- Database connection errors
- Redis connection errors
- Import errors

### Check 4: Verify Backend is Receiving Requests
In your backend terminal, you should see log messages like:
```
INFO:     127.0.0.1:xxxxx - "POST /auth/login HTTP/1.1" 200 OK
```

If you don't see this, the request isn't reaching the backend.

## 🎯 Common Issues

### Issue 1: Backend Not Running
**Symptom**: Frontend shows "Cannot connect to server"
**Fix**: Start backend with `python run_server.py`

### Issue 2: CORS Error
**Symptom**: Browser console shows CORS error
**Fix**: Check `backend/jansetu_platform/config.py` has `http://localhost:5173` in `CORS_ORIGINS`

### Issue 3: Wrong Port
**Symptom**: Frontend can't connect
**Fix**: Verify backend is on port 8000 and frontend is on port 5173

### Issue 4: Print Not Showing
**Symptom**: Request succeeds but no OTP in terminal
**Fix**: 
- Restart backend server (Ctrl+C, then run again)
- Check if you're looking at the correct terminal window
- The OTP appears in the **same terminal** where you ran `python run_server.py`

## 📝 Test Directly

You can test the backend directly without the frontend:

1. Open: `http://localhost:8000/docs`
2. Find `POST /auth/login`
3. Click "Try it out"
4. Enter: `{"phone": "1234567890"}`
5. Click "Execute"
6. Check your backend terminal for the OTP

## 💡 Pro Tip

**Keep both terminals visible:**
- Terminal 1: Backend (`python run_server.py`)
- Terminal 2: Frontend (`npm run dev`)

This way you can see both outputs at the same time!
