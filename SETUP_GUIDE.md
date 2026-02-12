# 🚀 Complete Setup Guide - Fashion E-Commerce Platform

This guide will walk you through setting up the entire platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** (for mobile app) - Will be installed with dependencies

## 🎯 Step-by-Step Setup

### Step 1: MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get your connection string
4. Whitelist your IP address

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   # Windows
   copy .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

4. **Update `.env` file:**
   
   Open `.env` and update the following:
   ```env
   # If using local MongoDB
   MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce
   
   # If using MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashion-ecommerce
   
   # Generate a secure JWT secret
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

5. **Seed admin user:**
   ```bash
   npm run seed
   ```
   
   You should see:
   ```
   ✅ MongoDB Connected
   ✅ Admin user created successfully
   Email: admin@fashionstore.com
   Password: Admin@123
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   ✅ MongoDB Connected: localhost
   🚀 Server running on port 5000
   📍 Environment: development
   🔗 API Base URL: http://localhost:5000/api
   ```

7. **Test the API:**
   
   Open your browser and visit: `http://localhost:5000/health`
   
   You should see:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

### Step 3: Admin Frontend Setup

1. **Open a new terminal** (keep backend running)

2. **Navigate to admin-frontend directory:**
   ```bash
   cd admin-frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Update API URL (if needed):**
   
   Open `admin-frontend/src/config/api.js` and verify:
   ```javascript
   export const API_BASE_URL = 'http://localhost:5000/api';
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The admin dashboard will open at: `http://localhost:5173`

6. **Login to admin dashboard:**
   - Email: `admin@fashionstore.com`
   - Password: `Admin@123`

### Step 4: User Mobile App Setup

1. **Open a new terminal** (keep backend and admin running)

2. **Navigate to user-frontend directory:**
   ```bash
   cd user-frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Update API URL:**
   
   Open `user-frontend/src/config/api.js` and update based on your setup:
   
   ```javascript
   // For Android Emulator
   export const API_BASE_URL = 'http://10.0.2.2:5000/api';
   
   // For iOS Simulator
   export const API_BASE_URL = 'http://localhost:5000/api';
   
   // For Physical Device (replace with your computer's IP)
   export const API_BASE_URL = 'http://192.168.1.100:5000/api';
   ```
   
   **To find your computer's IP:**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

5. **Start Expo:**
   ```bash
   npm start
   ```

6. **Run the app:**
   
   **Option A: Android Emulator**
   - Press `a` in the terminal
   - Or scan QR code with Expo Go app
   
   **Option B: iOS Simulator** (macOS only)
   - Press `i` in the terminal
   
   **Option C: Physical Device**
   - Install Expo Go app from App Store/Play Store
   - Scan QR code from terminal
   - Make sure your phone and computer are on the same WiFi network

7. **Test OTP Login:**
   - Enter any 10-digit mobile number (e.g., 9876543210)
   - Click "Send OTP"
   - Check backend terminal for OTP (in development mode)
   - Enter the OTP and verify

## 🧪 Testing the Complete Flow

### 1. Admin Dashboard Flow

1. **Login** with admin credentials
2. **Create Categories:**
   - Go to Categories section
   - Add categories like: Men, Women, Kids, Accessories
3. **Create Products:**
   - Go to Products section
   - Add products with images, prices, sizes, colors
4. **Manage Orders:**
   - View incoming orders
   - Update order status (Confirmed → Shipped → Delivered)

### 2. User Mobile App Flow

1. **Login** with OTP
2. **Browse Products:**
   - View categories
   - Browse products
   - View product details
3. **Add to Cart:**
   - Select size and color
   - Add to cart
4. **Checkout:**
   - Add delivery address
   - Select payment method
   - Place order
5. **Track Order:**
   - View order history
   - Track order status

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running
- Check MongoDB URI in `.env`
- For Atlas, check IP whitelist

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in `.env` file
- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### Admin Frontend Issues

**API Connection Error:**
```
Network Error
```
**Solution:**
- Ensure backend is running
- Check API_BASE_URL in `config/api.js`
- Check browser console for CORS errors

### User Mobile App Issues

**Cannot Connect to API:**
```
Network request failed
```
**Solution:**
- Check API_BASE_URL in `config/api.js`
- For Android Emulator, use `http://10.0.2.2:5000/api`
- For Physical Device, use your computer's IP
- Ensure phone and computer are on same WiFi

**Expo Go Not Loading:**
**Solution:**
- Clear Expo cache: `expo start -c`
- Restart Expo: `npm start`
- Reinstall Expo Go app

## 📱 Device-Specific API URLs

### Android Emulator
```javascript
export const API_BASE_URL = 'http://10.0.2.2:5000/api';
```

### iOS Simulator
```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
```

### Physical Device
```javascript
// Replace with your computer's IP address
export const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

**Finding Your IP:**
- Windows: `ipconfig` → Look for IPv4 Address
- macOS: `ifconfig` → Look for inet under en0
- Linux: `ip addr show` → Look for inet

## 🎨 Customization

### Change API URL Globally

**Admin Frontend:**
Edit `admin-frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://your-api-url.com/api';
```

**User Frontend:**
Edit `user-frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://your-api-url.com/api';
```

### Change Theme Colors

Edit theme files in both frontends:
- `admin-frontend/src/theme/colors.js`
- `user-frontend/src/theme/colors.js`

```javascript
export const colors = {
  primary: '#F97316',  // Change this to your brand color
  // ... other colors
};
```

## 📊 Sample Data

### Test Mobile Numbers for OTP
In development mode, you can use any 10-digit number:
- 9876543210
- 9999999999
- 1234567890

The OTP will be logged in the backend console.

### Admin Credentials
- Email: `admin@fashionstore.com`
- Password: `Admin@123`

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong JWT_SECRET
3. Configure MongoDB Atlas for production
4. Deploy to services like:
   - Heroku
   - Railway
   - Render
   - AWS EC2

### Admin Frontend
1. Build for production: `npm run build`
2. Deploy to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

### User Mobile App
1. Build for production:
   ```bash
   # Android
   expo build:android
   
   # iOS
   expo build:ios
   ```
2. Submit to App Store / Play Store

## 📞 Support

If you encounter any issues:
1. Check this guide thoroughly
2. Review error messages in terminal
3. Check browser/app console for errors
4. Ensure all services are running
5. Verify API URLs are correct

## ✅ Checklist

- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Admin user seeded
- [ ] Backend server running on port 5000
- [ ] Admin frontend dependencies installed
- [ ] Admin frontend running on port 5173
- [ ] Admin login successful
- [ ] User frontend dependencies installed
- [ ] User frontend API URL configured
- [ ] User frontend running on Expo
- [ ] OTP login working
- [ ] Products visible in mobile app

## 🎉 Success!

If you've completed all steps, you should have:
- ✅ Backend API running
- ✅ Admin dashboard accessible
- ✅ Mobile app running on device/emulator
- ✅ All three components communicating properly

Happy coding! 🚀
