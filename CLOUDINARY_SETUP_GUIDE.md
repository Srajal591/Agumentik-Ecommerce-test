# Cloudinary Setup Guide - Complete Step-by-Step 📸

## What is Cloudinary?
Cloudinary is a cloud-based image and video management service. It provides:
- Image upload and storage
- Automatic image optimization
- Image transformations (resize, crop, etc.)
- CDN delivery for fast loading
- Free tier: 25 GB storage, 25 GB bandwidth/month

## Step 1: Create Cloudinary Account

### 1.1 Sign Up
1. Go to: https://cloudinary.com/users/register/free
2. Fill in the form:
   - Email address
   - Password
   - Choose "I'm a developer" or "I'm a business user"
3. Click "Create Account"
4. Verify your email address

### 1.2 Complete Setup
1. After email verification, login to Cloudinary
2. You'll see the Dashboard with your credentials

## Step 2: Get Your API Credentials

### 2.1 From Dashboard
1. Login to: https://cloudinary.com/console
2. You'll see your **Dashboard** with:
   ```
   Cloud name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz123
   ```

### 2.2 Copy Credentials
Click on "Copy to clipboard" buttons next to each credential:
- **Cloud Name**: Your unique Cloudinary account name
- **API Key**: Public key for API access
- **API Secret**: Private key (keep it secret!)

### 2.3 Alternative Method
1. Click on "Settings" (gear icon) in top-right
2. Go to "Account" tab
3. Scroll to "Account Details" section
4. You'll see all credentials there

## Step 3: Configure Backend

### 3.1 Update .env File
Open `backend/.env` and update these lines:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=my-fashion-store
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

### 3.2 Your Current Configuration
Based on your .env file, you have:
```
CLOUDINARY_CLOUD_NAME=Agumentic-Ecommerce
CLOUDINARY_API_KEY=258691633781717
CLOUDINARY_API_SECRET=MnaSuYPU3k2eUj8ajd-ypY4OTDw
```

## Step 4: Test Cloudinary Connection

### 4.1 Run Test Script
```bash
cd backend
node test-cloudinary.js
```

### 4.2 Expected Output (Success)
```
🔍 Testing Cloudinary Configuration...

Cloud Name: Agumentic-Ecommerce
API Key: 258691633781717
API Secret: ***OTDw

📡 Testing Cloudinary connection...
✅ Cloudinary connection successful!
Status: ok

📊 Fetching account usage...
✅ Account Details:
Plan: Free
Credits Used: 0
Credits Limit: 25000
Storage Used: 0.00 MB
Bandwidth Used: 0.00 MB

📁 Listing folders...
Folders: categories, products

🎉 All tests passed! Cloudinary is configured correctly.
```

### 4.3 Common Errors

#### Error: "Invalid cloud_name"
**Cause**: Cloud name is incorrect
**Solution**: 
1. Go to Cloudinary Dashboard
2. Copy the exact cloud name (case-sensitive)
3. Update CLOUDINARY_CLOUD_NAME in .env

#### Error: "Invalid API key"
**Cause**: API key is incorrect
**Solution**:
1. Go to Cloudinary Dashboard
2. Copy the exact API key
3. Update CLOUDINARY_API_KEY in .env

#### Error: "Invalid API secret"
**Cause**: API secret is incorrect
**Solution**:
1. Go to Cloudinary Dashboard
2. Click "Reveal" next to API Secret
3. Copy the exact secret
4. Update CLOUDINARY_API_SECRET in .env

#### Error: "Cannot find module 'dotenv'"
**Cause**: Dependencies not installed
**Solution**:
```bash
cd backend
npm install
```

## Step 5: Test Image Upload

### 5.1 Start Backend Server
```bash
cd backend
npm start
```

### 5.2 Test Upload via Postman/Thunder Client

**Endpoint**: POST http://localhost:5000/api/upload/single

**Headers**:
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body** (form-data):
```
image: [Select a file]
folder: categories
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/categories/abc123.jpg",
    "publicId": "categories/abc123",
    "width": 1000,
    "height": 1000,
    "format": "jpg"
  }
}
```

### 5.3 Test via Admin Panel
1. Start admin frontend: `cd admin-frontend && npm run dev`
2. Login as admin
3. Go to Categories page
4. Click "Add Category"
5. Upload an image
6. Check if image appears in preview
7. Submit form
8. Check if category shows image

## Step 6: Verify Upload in Cloudinary

### 6.1 Check Media Library
1. Go to: https://cloudinary.com/console/media_library
2. You should see uploaded images
3. Click on any image to see details

### 6.2 Check Folders
1. Go to: https://cloudinary.com/console/media_library/folders
2. You should see folders: `categories`, `products`
3. Click on folders to see images inside

## Step 7: Cloudinary Dashboard Features

### 7.1 Media Library
- View all uploaded images
- Search and filter images
- Delete images
- Download images
- Get image URLs

### 7.2 Transformations
- Resize images
- Crop images
- Apply filters
- Convert formats
- Optimize quality

### 7.3 Usage Statistics
- Storage used
- Bandwidth used
- Transformations used
- API calls made

### 7.4 Settings
- Account details
- Upload presets
- Security settings
- Webhooks
- Add-ons

## Step 8: Troubleshooting

### Issue 1: Images not uploading
**Check**:
1. Backend server is running
2. Cloudinary credentials are correct
3. You're logged in as admin
4. File size is under 5MB
5. File type is image (jpg, png, gif, etc.)

**Solution**:
```bash
# Test Cloudinary connection
cd backend
node test-cloudinary.js

# Check backend logs
npm start
# Look for upload errors in console
```

### Issue 2: Images upload but don't show
**Check**:
1. Image URL is saved in database
2. Cloudinary URL is accessible
3. Browser console for errors

**Solution**:
```bash
# Check MongoDB
# Open MongoDB Compass
# Connect to: mongodb://127.0.0.1:27017/fashion-ecommerce
# Check categories collection
# Verify 'image' field has Cloudinary URL
```

### Issue 3: "Unauthorized" error
**Check**:
1. You're logged in as admin
2. Token is valid
3. Token is being sent in headers

**Solution**:
```javascript
// Check localStorage in browser console
localStorage.getItem('token')
// Should return a JWT token

// If null, login again
```

## Step 9: Free Tier Limits

### Cloudinary Free Plan Includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25,000 transformations/month
- ✅ Unlimited images
- ✅ CDN delivery
- ✅ Image optimization
- ✅ Basic transformations

### When You Exceed Limits:
- Storage: Can't upload more images
- Bandwidth: Images may not load
- Transformations: Transformations may fail

### Solution:
1. Delete unused images
2. Optimize image sizes before upload
3. Upgrade to paid plan if needed

## Step 10: Best Practices

### 10.1 Image Optimization
```javascript
// Already configured in backend/src/utils/cloudinaryUpload.js
transformation: [
  { width: 1000, height: 1000, crop: 'limit' },
  { quality: 'auto' },
  { fetch_format: 'auto' },
]
```

### 10.2 Folder Organization
- `categories/` - Category images
- `products/` - Product images
- `users/` - User profile images
- `banners/` - Banner images

### 10.3 Security
- ✅ Never commit .env file to Git
- ✅ Keep API Secret private
- ✅ Use signed uploads for sensitive content
- ✅ Restrict upload access to admins only

### 10.4 Performance
- ✅ Use Cloudinary CDN URLs
- ✅ Enable auto format (webp for modern browsers)
- ✅ Enable auto quality
- ✅ Use responsive images

## Your Current Setup Status

### ✅ Configured
- Cloud Name: `Agumentic-Ecommerce`
- API Key: `258691633781717`
- API Secret: `***OTDw` (hidden for security)

### 🔍 To Verify
Run this command to test:
```bash
cd backend
node test-cloudinary.js
```

### 📝 Next Steps
1. Run test script to verify connection
2. Test image upload via admin panel
3. Check uploaded images in Cloudinary dashboard
4. Verify images display correctly in frontend

## Support & Resources

### Official Documentation
- Cloudinary Docs: https://cloudinary.com/documentation
- Node.js SDK: https://cloudinary.com/documentation/node_integration
- Upload API: https://cloudinary.com/documentation/image_upload_api_reference

### Video Tutorials
- Getting Started: https://cloudinary.com/documentation/how_to_integrate_cloudinary
- Image Upload: https://cloudinary.com/documentation/upload_images

### Community
- Stack Overflow: https://stackoverflow.com/questions/tagged/cloudinary
- Cloudinary Community: https://community.cloudinary.com/

## Summary

✅ **Step 1**: Create Cloudinary account
✅ **Step 2**: Get API credentials from dashboard
✅ **Step 3**: Update backend/.env file
✅ **Step 4**: Run test script: `node test-cloudinary.js`
✅ **Step 5**: Test upload via admin panel
✅ **Step 6**: Verify images in Cloudinary dashboard

Your Cloudinary is already configured! Just run the test script to verify it's working properly.
