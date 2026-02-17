# API Testing Guide

## Backend Server Status
✅ Server is running on http://localhost:5000

## Test APIs Using PowerShell

### 1. Test Categories API
```powershell
curl http://localhost:5000/api/categories
```
Expected: List of categories with Women category

### 2. Test Products API
```powershell
curl http://localhost:5000/api/products
```
Expected: Empty products list (no products created yet)

### 3. Test Health Check
```powershell
curl http://localhost:5000/health
```
Expected: Server health status

## Create Test Product (Using Admin Panel)

1. Open admin panel: http://localhost:3000
2. Login with admin credentials
3. Go to "Products" → "Add Product"
4. Fill the form:
   - Name: Test Product
   - Description: This is a test product
   - Price: 999
   - Category: Select any category
   - Upload at least one image
   - Add sizes (S, M, L)
   - Add colors
   - Status: Active
5. Click "Create Product"

## Verify Product in User App

1. Open user app (React Native)
2. Home page should show:
   - Categories from API
   - Products (if any created)
3. Go to Products tab
4. Should show all products with filters

## Test Order Flow

### Create Order (User App)
```javascript
POST http://localhost:5000/api/orders
Headers: Authorization: Bearer <user_token>
Body: {
  "items": [{
    "product": "<product_id>",
    "quantity": 1,
    "size": "M",
    "color": "Blue"
  }],
  "shippingAddress": {
    "fullName": "Test User",
    "mobile": "1234567890",
    "addressLine1": "Test Address",
    "city": "Test City",
    "state": "Test State",
    "pincode": "123456"
  },
  "subtotal": 999,
  "shippingCharge": 50,
  "tax": 50,
  "total": 1099,
  "paymentMethod": "cod"
}
```

### Get User Orders
```javascript
GET http://localhost:5000/api/orders/my-orders
Headers: Authorization: Bearer <user_token>
```

### Update Order Status (Admin)
```javascript
PATCH http://localhost:5000/api/orders/<order_id>/status
Headers: Authorization: Bearer <admin_token>
Body: {
  "status": "confirmed"
}
```

## Test Return Flow

### Create Return Request (User)
```javascript
POST http://localhost:5000/api/returns
Headers: Authorization: Bearer <user_token>
Body: {
  "order": "<order_id>",
  "items": [{
    "product": "<product_id>",
    "quantity": 1,
    "reason": "Size doesn't fit"
  }],
  "reason": "Wrong size delivered",
  "type": "return"
}
```

### Update Return Status (Admin)
```javascript
PATCH http://localhost:5000/api/returns/<return_id>/status
Headers: Authorization: Bearer <admin_token>
Body: {
  "status": "approved",
  "adminNotes": "Return approved",
  "refundAmount": 999
}
```

## Quick Test Checklist

### Backend
- [x] Server running
- [x] MongoDB connected
- [x] Categories API working
- [x] Products API working
- [ ] Create test product via API
- [ ] Create test order via API
- [ ] Create test return via API

### Admin Frontend
- [ ] Login working
- [ ] Categories page working
- [ ] Products page showing empty list
- [ ] Add Product page working
- [ ] Create product successfully
- [ ] Product appears in list

### User Frontend
- [ ] Home page loads
- [ ] Categories showing from API
- [ ] Products page loads
- [ ] Can filter by category
- [ ] Can search products
- [ ] Products show correctly

## Common Issues & Solutions

### Issue: Cannot connect to backend
**Solution:** Check if backend server is running on port 5000

### Issue: Categories not showing in user app
**Solution:** Update API_BASE_URL in `user-frontend/src/config/api.js` with your computer's IP

### Issue: Images not uploading
**Solution:** Check Cloudinary credentials in backend `.env` file

### Issue: Products not showing
**Solution:** Create products first using admin panel

### Issue: CORS error
**Solution:** Backend already has CORS enabled for all origins

## Environment Variables Required

### Backend (.env)
```
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_key>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>
```

### User Frontend (src/config/api.js)
```javascript
export const API_BASE_URL = 'http://YOUR_IP:5000/api';
```

## Next Steps After Testing

1. ✅ Verify all APIs working
2. ✅ Create test products
3. ✅ Test user app with real data
4. 🔄 Implement product details page
5. 🔄 Implement cart functionality
6. 🔄 Implement checkout flow
7. 🔄 Implement order tracking
8. 🔄 Implement Razorpay payment
