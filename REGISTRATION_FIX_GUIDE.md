# Registration Issue - Fix Guide

## ✅ Changes Made

### 1. Updated API Configuration
**File**: `user-frontend/src/config/api.js`

Changed the default API URL to work with Android Emulator:
```javascript
export const API_BASE_URL = 'http://10.0.2.2:5000/api';
```

### 2. Enhanced Error Handling
**File**: `user-frontend/app/(auth)/register.tsx`

Added:
- Console logging for debugging
- Better error message extraction
- More detailed error alerts

### 3. Improved Axios Error Interceptor
**File**: `user-frontend/src/api/axios.js`

Added:
- Better error message extraction
- Network error handling
- Console logging for debugging

## 🔧 How to Fix Based on Your Platform

### Option 1: Android Emulator (Default)
The API URL is already set to: `http://10.0.2.2:5000/api`

**No changes needed!**

### Option 2: iOS Simulator
Update `user-frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
```

### Option 3: Physical Device (Android/iOS)
1. Find your computer's IP address:
   - **Windows**: Open CMD and run `ipconfig`, look for "IPv4 Address"
   - **Mac/Linux**: Open Terminal and run `ifconfig`, look for "inet"
   
2. Update `user-frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000/api';
// Example: export const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

3. Make sure your phone and computer are on the same WiFi network

## 🧪 Testing Steps

### Step 1: Check Backend is Running
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: 127.0.0.1
```

### Step 2: Test Registration API Directly
Open a new terminal and run:

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/user/register" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","mobile":"9876543210"}'
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","mobile":"9876543210"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "Test User",
      "email": "test@example.com",
      "mobile": "9876543210",
      "role": "user"
    }
  }
}
```

### Step 3: Restart Frontend
```bash
cd user-frontend
# Stop the current process (Ctrl+C)
npm start
```

### Step 4: Test Registration in App
1. Open the app in emulator/device
2. Tap "Get Started"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Mobile: 9876543210
4. Tap "Create Account"
5. Check the console logs for any errors

## 🐛 Debugging

### Check Console Logs
When you try to register, you should see logs like:
```
Attempting registration with: { name: 'Test User', email: 'test@example.com', mobile: '9876543210' }
Registration response: { success: true, data: {...} }
```

If you see errors, they will show:
```
Axios error: [error details]
Registration error: [error details]
```

### Common Errors and Solutions

#### Error: "Network request failed"
**Cause**: Frontend can't reach backend
**Solution**: 
- Check if backend is running
- Update API_BASE_URL based on your platform (see above)
- Make sure firewall isn't blocking port 5000

#### Error: "Email already registered"
**Cause**: User with that email already exists
**Solution**: 
- Use a different email
- Or delete the user from MongoDB Compass

#### Error: "Mobile number already registered"
**Cause**: User with that mobile already exists
**Solution**: 
- Use a different mobile number
- Or delete the user from MongoDB Compass

#### Error: "Connection refused"
**Cause**: Backend not running or wrong port
**Solution**: 
- Start backend: `cd backend && npm run dev`
- Check backend is on port 5000

#### Error: "timeout of 0ms exceeded"
**Cause**: Network timeout
**Solution**: 
- Check internet connection
- Restart backend and frontend

## 📱 Platform-Specific Notes

### Android Emulator
- Use `http://10.0.2.2:5000/api` (already set as default)
- `10.0.2.2` is a special alias to your host machine's localhost

### iOS Simulator
- Use `http://localhost:5000/api`
- iOS simulator can access localhost directly

### Physical Device
- Must use your computer's actual IP address
- Both devices must be on same WiFi network
- Firewall must allow connections on port 5000

## 🔍 Additional Debugging

### Enable More Logging
Add this to `user-frontend/src/api/axios.js` after the imports:
```javascript
// Add request logging
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Request data:', config.data);
    // ... rest of the code
  }
);
```

### Check Network Tab
If using Expo:
1. Shake device/emulator
2. Tap "Debug Remote JS"
3. Open Chrome DevTools
4. Go to Network tab
5. Try registration again
6. Check the network request details

## ✅ Verification

After making changes, you should be able to:
1. ✅ Fill registration form
2. ✅ See console logs when submitting
3. ✅ Get success message
4. ✅ Receive welcome email
5. ✅ Auto-login to home screen

## 🆘 Still Not Working?

If registration still fails after trying all the above:

1. **Check Backend Logs**
   - Look at the terminal where backend is running
   - Check for any error messages

2. **Check MongoDB**
   - Open MongoDB Compass
   - Connect to `mongodb://127.0.0.1:27017`
   - Check if `fashion-ecommerce` database exists
   - Check if `users` collection exists

3. **Test with Postman**
   - Install Postman
   - Create POST request to `http://localhost:5000/api/auth/user/register`
   - Body (JSON):
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "mobile": "9876543210"
     }
     ```
   - If this works, the issue is in the frontend

4. **Share Error Details**
   - Copy the exact error message from console
   - Copy the backend terminal output
   - Share the platform you're using (Android/iOS/Physical device)

---

**Last Updated**: February 9, 2026
**Status**: ✅ Fixed - Ready to test
