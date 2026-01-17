# 🔍 How to Find Your OTP Code

## What is the "Backend Terminal"?

The **backend terminal** is the **PowerShell or Command Prompt window** where you started the backend server.

## 📍 How to Identify It

### If you started the backend with:
```bash
cd D:\Jansetu\JanSetu\backend
python run_server.py
```

**Look for a window that shows:**
```
Starting server on http://localhost:8000
API docs available at http://localhost:8000/docs
Press Ctrl+C to stop

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## 🔑 Where the OTP Appears

When you login from the frontend, **check that same terminal window**. You'll see:

```
OTP for 1234567890: 123456
```

**That's your OTP code!** Copy those 6 digits and paste them in the frontend.

## 🖼️ Visual Example

```
┌─────────────────────────────────────────┐
│  PowerShell (Backend Terminal)          │
├─────────────────────────────────────────┤
│  Starting server on http://localhost:8000│
│  INFO: Uvicorn running...               │
│  INFO: Application startup complete.    │
│                                         │
│  ← When you login, you'll see:          │
│  OTP for 1234567890: 123456  ← THIS!    │
│                                         │
└─────────────────────────────────────────┘
```

## ❓ What if I Can't Find It?

### Option 1: Check All Open Windows
- Look through all your open terminal/PowerShell windows
- The backend terminal will show "Uvicorn running" messages

### Option 2: Start a New Backend Terminal
If you can't find it, open a **new terminal** and run:

```bash
cd D:\Jansetu\JanSetu\backend
python run_server.py
```

Then:
1. Keep this window open and visible
2. Try logging in from the frontend
3. Watch this window for the OTP code

### Option 3: Check Backend Logs
The OTP is also printed to the console output, so you should see it in real-time.

## 🎯 Quick Test

1. **Open frontend**: `http://localhost:5173`
2. **Enter phone**: `1234567890`
3. **Click "Send OTP"**
4. **Immediately check your backend terminal** (the window running `python run_server.py`)
5. **You'll see**: `OTP for 1234567890: XXXXXX`
6. **Copy the 6-digit code** and paste it in the frontend

## 💡 Pro Tip

**Keep both windows visible side-by-side:**
- Left: Backend terminal (to see OTP)
- Right: Browser with frontend (to enter OTP)

This makes the login process much easier!
