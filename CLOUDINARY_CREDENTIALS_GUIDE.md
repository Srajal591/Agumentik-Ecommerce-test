# How to Get Cloudinary API Credentials 🔑

## Quick Guide (5 Minutes)

### Option 1: You Already Have Cloudinary Account

#### Step 1: Login
1. Go to: **https://cloudinary.com/console**
2. Enter your email and password
3. Click "Log In"

#### Step 2: Find Credentials on Dashboard
After login, you'll see the **Dashboard** page with a box at the top showing:

```
┌─────────────────────────────────────────────┐
│  Account Details                            │
├─────────────────────────────────────────────┤
│  Cloud name:  your-cloud-name        [Copy] │
│  API Key:     123456789012345        [Copy] │
│  API Secret:  ••••••••••••••  [Reveal][Copy]│
└─────────────────────────────────────────────┘
```

#### Step 3: Copy Each Credential

**Cloud Name**:
- Click the [Copy] button next to "Cloud name"
- Example: `my-fashion-store` or `agumentic-ecommerce`

**API Key**:
- Click the [Copy] button next to "API Key"
- Example: `258691633781717`

**API Secret**:
- Click [Reveal] button first to show the secret
- Then click [Copy] button
- Example: `MnaSuYPU3k2eUj8ajd-ypY4OTDw`

#### Step 4: Update .env File
Open `backend/.env` and paste:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

---

### Option 2: Create New Cloudinary Account (Free)

#### Step 1: Sign Up
1. Go to: **https://cloudinary.com/users/register/free**
2. Fill the form:
   ```
   Email:    your-email@example.com
   Password: YourPassword123
   ```
3. Select: "I'm a developer"
4. Click "Create Account"

#### Step 2: Verify Email
1. Check your email inbox
2. Click the verification link
3. You'll be redirected to Cloudinary

#### Step 3: Complete Setup
1. After verification, you'll see a welcome screen
2. Click "Go to Dashboard" or "Get Started"
3. You'll see the Dashboard with your credentials

#### Step 4: Copy Credentials
Same as Option 1 - Step 2 above

---

## Alternative Method: Via Settings

If you can't find credentials on Dashboard:

1. Click **Settings** (gear icon) in top-right corner
2. Click **Account** tab on left sidebar
3. Scroll to **Account Details** section
4. You'll see:
   ```
   Cloud name: your-cloud-name
   API Key:    123456789012345
   API Secret: [Click to reveal]
   ```
5. Copy each credential

---

## Your Current Credentials

Based on your `.env` file, you have:

```env
CLOUDINARY_CLOUD_NAME=Agumentic-Ecommerce
CLOUDINARY_API_KEY=258691633781717
CLOUDINARY_API_SECRET=MnaSuYPU3k2eUj8ajd-ypY4OTDw
```

### To Verify These Are Correct:

1. Go to: https://cloudinary.com/console
2. Login with your account
3. Check if the credentials match

### If They Don't Match:

1. Copy the correct credentials from dashboard
2. Update `backend/.env` file
3. Restart backend server:
   ```bash
   cd backend
   npm start
   ```

---

## Visual Guide

### Dashboard Layout:
```
┌────────────────────────────────────────────────────────┐
│  Cloudinary                    [Settings] [Profile]    │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Account Details                                 │  │
│  │  Cloud name:  agumentic-ecommerce       [Copy]  │  │
│  │  API Key:     258691633781717           [Copy]  │  │
│  │  API Secret:  ••••••••••••  [Reveal]    [Copy]  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Usage Statistics                                       │
│  ├─ Storage:    0 MB / 25 GB                           │
│  ├─ Bandwidth:  0 MB / 25 GB                           │
│  └─ Credits:    0 / 25,000                             │
│                                                         │
│  Media Library                                          │
│  [View all images]                                      │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Important Notes

### ⚠️ Security
- **Never share** your API Secret publicly
- **Never commit** .env file to Git
- **Keep credentials** private

### ✅ Free Tier Limits
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month
- Unlimited images
- No credit card required

### 🔄 If You Forget Credentials
1. Login to Cloudinary dashboard
2. They're always visible on the main page
3. You can also regenerate them in Settings

---

## Test Your Credentials

After updating `.env`, test if they work:

```bash
cd backend
node test-cloudinary.js
```

**Success Output**:
```
✅ Cloudinary connection successful!
✅ Account Details: Plan: Free
🎉 All tests passed!
```

**Error Output**:
```
❌ Cloudinary test failed!
Error: Invalid cloud_name
```

If you see an error:
1. Double-check credentials in dashboard
2. Make sure you copied them correctly
3. No extra spaces or quotes
4. Update `.env` and test again

---

## Quick Reference

### Cloudinary URLs:
- **Sign Up**: https://cloudinary.com/users/register/free
- **Login**: https://cloudinary.com/console
- **Dashboard**: https://cloudinary.com/console (after login)
- **Settings**: https://cloudinary.com/console/settings
- **Media Library**: https://cloudinary.com/console/media_library

### What You Need:
1. ✅ Cloud Name (e.g., `agumentic-ecommerce`)
2. ✅ API Key (e.g., `258691633781717`)
3. ✅ API Secret (e.g., `MnaSuYPU3k2eUj8ajd-ypY4OTDw`)

### Where to Put Them:
File: `backend/.env`
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Next Steps

1. ✅ Get credentials from Cloudinary dashboard
2. ✅ Update `backend/.env` file
3. ✅ Run test: `node test-cloudinary.js`
4. ✅ Start backend: `npm start`
5. ✅ Test upload via admin panel

---

## Need Help?

### Can't Login?
- Reset password: https://cloudinary.com/users/password/new
- Create new account: https://cloudinary.com/users/register/free

### Can't Find Credentials?
- They're on the main Dashboard page after login
- Or go to Settings → Account → Account Details

### Credentials Not Working?
- Make sure you copied them correctly
- No extra spaces or quotes
- Try regenerating them in Settings
- Create new account if needed (free)

---

## Summary

**To get Cloudinary credentials**:
1. Go to https://cloudinary.com/console
2. Login (or sign up if new)
3. Copy Cloud Name, API Key, API Secret
4. Paste in `backend/.env`
5. Test with `node test-cloudinary.js`

That's it! 🎉
