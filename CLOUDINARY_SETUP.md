# Cloudinary Setup Guide

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service. It provides:
- Image upload and storage
- Automatic image optimization
- Image transformations (resize, crop, format conversion)
- CDN delivery for fast loading

## Setup Steps

### 1. Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up" (Free tier available)
3. Complete registration

### 2. Get Your Credentials

After signing up:
1. Go to Dashboard
2. You'll see your credentials:
   - **Cloud Name**: e.g., `dxxxxx`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: e.g., `abcdefghijklmnopqrstuvwxyz`

### 3. Update Backend .env File

Open `backend/.env` and update:

```env
# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 4. Restart Backend Server

After updating .env:
```bash
cd backend
npm run dev
```

## Testing Image Upload

### Using Postman or Thunder Client

**1. Login as Admin First:**
```
POST http://localhost:5000/api/auth/admin/login
Body (JSON):
{
  "email": "admin@fashionstore.com",
  "password": "Admin@123"
}
```

Copy the `token` from response.

**2. Upload Single Image:**
```
POST http://localhost:5000/api/upload/single
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (form-data):
  image: [Select an image file]
  folder: products (optional)
```

**3. Upload Multiple Images:**
```
POST http://localhost:5000/api/upload/multiple
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (form-data):
  images: [Select multiple image files]
  folder: categories (optional)
```

**4. Delete Image:**
```
DELETE http://localhost:5000/api/upload
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "url": "https://res.cloudinary.com/..."
}
```

## Image Upload Features

### Automatic Optimizations
- **Size Limit**: 1000x1000 pixels (maintains aspect ratio)
- **Quality**: Auto (Cloudinary optimizes)
- **Format**: Auto (converts to best format like WebP)
- **File Size Limit**: 5MB per image

### Folder Organization
Images are organized by folder:
- `fashion-store/products/` - Product images
- `fashion-store/categories/` - Category images
- `fashion-store/users/` - User avatars

### Security
- Only admins can upload images
- JWT authentication required
- File type validation (only images allowed)
- File size limit enforced

## Integration with Admin Panel

### Product Creation with Image
When creating a product in admin panel:
1. Upload product image using upload API
2. Get the `secure_url` from response
3. Use that URL in product creation

**Example Flow:**
```javascript
// 1. Upload image
const uploadResponse = await uploadImage(imageFile);
const imageUrl = uploadResponse.data.url;

// 2. Create product with image URL
const productData = {
  name: "Leather Jacket",
  price: 4999,
  image: imageUrl,
  // ... other fields
};
await createProduct(productData);
```

## Cloudinary Dashboard

Access your Cloudinary dashboard at:
https://cloudinary.com/console

Features:
- View all uploaded images
- Manage folders
- See usage statistics
- Configure settings
- Generate transformations

## Free Tier Limits

Cloudinary free tier includes:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

This is more than enough for development and small projects!

## Troubleshooting

### Error: "Invalid credentials"
- Check if credentials in .env are correct
- Make sure there are no extra spaces
- Restart backend server after updating .env

### Error: "File too large"
- Maximum file size is 5MB
- Compress image before uploading
- Or increase limit in `backend/src/middleware/upload.js`

### Error: "Unauthorized"
- Make sure you're logged in as admin
- Check if token is included in Authorization header
- Token format: `Bearer YOUR_TOKEN`

### Images not loading in app
- Check if URL is correct
- Verify Cloudinary account is active
- Check network connectivity

## Best Practices

1. **Use Folders**: Organize images by type (products, categories, users)
2. **Optimize Before Upload**: Compress images before uploading
3. **Delete Unused Images**: Clean up old images to save storage
4. **Use Transformations**: Let Cloudinary handle resizing and optimization
5. **CDN URLs**: Always use the `secure_url` from upload response

## Example URLs

After upload, you'll get URLs like:
```
https://res.cloudinary.com/dxxxxx/image/upload/v1234567890/fashion-store/products/abc123.jpg
```

These URLs are:
- ✅ Fast (CDN delivery)
- ✅ Secure (HTTPS)
- ✅ Optimized (auto format/quality)
- ✅ Permanent (won't expire)

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com
- Community: https://community.cloudinary.com

---

**Your Cloudinary integration is ready! 🎉**

Just add your credentials to `.env` and start uploading images!
