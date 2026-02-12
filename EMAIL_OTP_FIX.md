# ✅ Email OTP Error - FIX REQUIRED

## Error
```
Failed to send email: nodemailer.createTransporter is not a function
```

## Root Cause
The backend server was started before nodemailer was properly installed or needs to be restarted to load the module correctly.

## Solution

### Step 1: Stop the Backend
In your backend terminal, press **Ctrl+C** to stop the server

### Step 2: Restart the Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: 127.0.0.1
```

### Step 3: Test Login Again
1. Open the app
2. Go to Login screen
3. Enter email: vishwakarmasrajal297@gmail.com
4. Tap "Send OTP"
5. ✅ Should work now!

## Why This Happens

When you install a new npm package (like nodemailer), Node.js needs to restart to load the new module into memory. The backend was running when nodemailer was installed, so it didn't have access to the module.

## Verification

After restarting, you should see in the backend terminal:
```
✅ Email sent: <message-id>
```

When you try to send OTP.

## If Still Not Working

### Check 1: Nodemailer is Installed
```bash
cd backend
npm list nodemailer
```

Should show:
```
└── nodemailer@8.0.1
```

### Check 2: Gmail Credentials
Check `backend/.env`:
```env
EMAIL_USER=srajalvishwakrma8@gmail.com
EMAIL_PASSWORD=nvpg arvk rfgm yvms
```

### Check 3: Test Email Manually
Run this in backend directory:
```bash
node -e "const nm=require('nodemailer');const t=nm.createTransporter({service:'gmail',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASSWORD}});console.log('✅ Nodemailer loaded successfully!');"
```

Should show:
```
✅ Nodemailer loaded successfully!
```

## Quick Fix Commands

```bash
# Stop backend (Ctrl+C in backend terminal)

# Restart backend
cd backend
npm run dev

# Test in app
# Login → Enter Email → Send OTP → Should work!
```

---

**Status**: ⚠️ REQUIRES BACKEND RESTART
**Action**: Stop and restart backend server
**Expected Result**: Email OTP will work after restart
