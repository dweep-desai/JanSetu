# 🔧 Fix: "Cannot connect to server" Error

## ✅ Quick Fix Steps

### Step 1: Check Browser Console
1. Open `http://localhost:5173` in your browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Try logging in again
5. **Look for the detailed error messages** - I've added logging that will show:
   - The API URL being used
   - The exact error code
   - The request details

### Step 2: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Try logging in
3. Look for a request to `/auth/login`
4. Check:
   - **Status**: Should be 200 (green) or show an error
   - **Request URL**: Should be `http://localhost:8000/auth/login`
   - **CORS errors**: Look for red errors mentioning CORS

### Step 3: Verify Backend is Accessible
Open these URLs directly in your browser:
- ✅ `http://localhost:8000/health` - Should show `{"status":"healthy"}`
- ✅ `http://localhost:8000/docs` - Should show API documentation

If these don't work, the backend isn't accessible.

## 🔍 Common Issues & Fixes

### Issue 1: CORS Error
**Symptom**: Browser console shows CORS error
**Fix**: 
1. Make sure backend CORS includes `http://localhost:5173`
2. Restart backend server

### Issue 2: Backend Not Running
**Symptom**: `http://localhost:8000/health` doesn't work
**Fix**: 
```bash
cd D:\Jansetu\JanSetu\backend
python run_server.py
```

### Issue 3: Frontend Not Running
**Symptom**: `http://localhost:5173` doesn't load
**Fix**: 
```bash
cd D:\Jansetu\JanSetu\frontend
npm run dev
```

### Issue 4: Browser Cache
**Symptom**: Old errors persist
**Fix**: 
- Press `Ctrl+Shift+R` (hard refresh)
- Or clear browser cache

### Issue 5: Multiple Backend Instances
**Symptom**: Conflicting ports
**Fix**: 
- Stop all Python processes
- Start only one backend instance

## 🧪 Test Directly

### Test Backend API Directly:
1. Open: `http://localhost:8000/docs`
2. Find `POST /auth/login`
3. Click "Try it out"
4. Enter: `{"phone": "1234567890"}`
5. Click "Execute"
6. If this works, backend is fine - issue is with frontend connection

## 📝 What the New Logging Shows

With the updated code, you'll now see in browser console:
- ✅ API Request: POST http://localhost:8000/auth/login
- ✅ API Response: 200 (if successful)
- ❌ Detailed error information (if failed)

This will help identify the exact issue!

## 🎯 Next Steps

1. **Open browser console** (F12)
2. **Try logging in**
3. **Check the console output** - it will show exactly what's happening
4. **Share the console error** if you need more help

The backend is confirmed working, so this is likely a frontend connection or CORS issue that the console will reveal!
