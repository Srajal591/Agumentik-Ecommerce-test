# Gmail Login Issue - Action Required

## Problem
Login fails with: **"535-5.7.8 Username and Password not accepted"**

## What I Fixed
1. ✅ Removed spaces from Gmail App Password in `.env`
2. ✅ Restarted backend server
3. ✅ Verified nodemailer is working correctly

## What YOU Need to Do

Your Gmail credentials are **invalid**. You need to:

### Quick Fix (5 minutes):

1. **Enable 2FA on Gmail**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Create new app password
   - Copy the 16-character code (remove spaces)

3. **Update backend/.env**
   ```
   EMAIL_PASSWORD=your16charpassword
   ```

4. **Restart Backend**
   - Stop backend (Ctrl+C)
   - Run: `npm start` in backend folder

5. **Test Login**
   - Try logging in from the app

## Current Credentials
```
EMAIL_USER=srajalvishwakrma8@gmail.com
EMAIL_PASSWORD=nvpgarvkrfgmyvms (currently invalid)
```

## Why This Happened
Gmail requires:
- 2-Factor Authentication enabled
- App-specific password (not your regular Gmail password)
- The current password in `.env` is either wrong or expired

## Backend Status
✅ Backend is running on port 5000
✅ MongoDB is connected
✅ Nodemailer is loaded correctly
✅ Email service code is correct
❌ Gmail credentials are invalid

Once you update the credentials, everything will work!
