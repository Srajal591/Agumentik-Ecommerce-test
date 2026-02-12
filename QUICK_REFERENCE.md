# ⚡ Quick Reference Card

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
npm install
npm run seed          # Create admin user
npm run dev          # Start server (port 5000)
```

### Admin Frontend
```bash
cd admin-frontend
npm install
npm run dev          # Start dashboard (port 5173)
```

### User Frontend
```bash
cd user-frontend
npm install
npm start            # Start Expo
# Press 'a' for Android, 'i' for iOS
```

## 🔑 Default Credentials

**Admin Login:**
- Email: `admin@fashionstore.com`
- Password: `Admin@123`

**User Login:**
- Any 10-digit mobile number
- OTP shown in backend console (dev mode)

## 📡 API Base URLs

**Backend:** `http://localhost:5000/api`

**Change API URL:**
- Admin: `admin-frontend/src/config/api.js`
- User: `user-frontend/src/config/api.js`

**Mobile Device URLs:**
- Android Emulator: `http://10.0.2.2:5000/api`
- iOS Simulator: `http://localhost:5000/api`
- Physical Device: `http://YOUR_IP:5000/api`

## 🎨 Theme Colors

```javascript
primary: '#F97316'      // Orange
background: '#F9FAFB'   // Light Gray
textDark: '#111827'     // Dark Gray
surface: '#FFFFFF'      // White
success: '#22C55E'      // Green
error: '#EF4444'        // Red
```

## 📁 Key Files

### Backend
- `src/app.js` - Express app setup
- `src/server.js` - Server entry
- `src/config/database.js` - DB connection
- `src/routes/` - API routes
- `src/services/` - Business logic
- `.env` - Environment config

### Admin Frontend
- `src/config/api.js` - API configuration
- `src/api/axios.js` - HTTP client
- `src/pages/Login.jsx` - Login page
- `src/theme/colors.js` - Design system

### User Frontend
- `src/config/api.js` - API configuration
- `src/api/axios.js` - HTTP client
- `src/screens/LoginScreen.jsx` - Login screen
- `src/screens/HomeScreen.jsx` - Home screen
- `src/theme/colors.js` - Design system

## 🔧 Common Issues & Fixes

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001
```

### Cannot Connect to API (Mobile)
```javascript
// Update API_BASE_URL in user-frontend/src/config/api.js
// Android Emulator
export const API_BASE_URL = 'http://10.0.2.2:5000/api';

// Physical Device (use your computer's IP)
export const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

### Find Your Computer's IP
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

## 📊 API Endpoints Quick Reference

### Authentication
```
POST /api/auth/admin/login          # Admin login
POST /api/auth/user/send-otp        # Send OTP
POST /api/auth/user/verify-otp      # Verify OTP
GET  /api/auth/me                   # Get current user
```

### Products
```
GET    /api/products                # Get all products
GET    /api/products/:id            # Get product by ID
POST   /api/products                # Create product (Admin)
PUT    /api/products/:id            # Update product (Admin)
DELETE /api/products/:id            # Delete product (Admin)
```

### Orders
```
POST  /api/orders                   # Create order
GET   /api/orders/my-orders         # Get user orders
GET   /api/orders/:id               # Get order by ID
PATCH /api/orders/:id/status        # Update status (Admin)
```

### Categories
```
GET    /api/categories              # Get all categories
POST   /api/categories              # Create category (Admin)
PUT    /api/categories/:id          # Update category (Admin)
DELETE /api/categories/:id          # Delete category (Admin)
```

## 🗂️ Project Structure

```
clothing-store/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── models/      # Database models
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Middleware
│   │   └── utils/       # Utilities
│   └── .env             # Environment variables
│
├── admin-frontend/       # React.js Dashboard
│   └── src/
│       ├── api/         # API services
│       ├── config/      # API config
│       ├── pages/       # Pages
│       └── theme/       # Design system
│
└── user-frontend/        # React Native App
    └── src/
        ├── api/         # API services
        ├── config/      # API config
        ├── screens/     # Screens
        └── theme/       # Design system
```

## 🔒 Security Checklist

- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] OTP hashing
- [x] Rate limiting
- [x] Input validation
- [x] Error handling
- [x] CORS configuration
- [x] Helmet security headers
- [x] Soft-delete strategy

## 📦 NPM Scripts

### Backend
```bash
npm start              # Production mode
npm run dev           # Development mode
npm run seed          # Seed admin user
```

### Admin Frontend
```bash
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview build
```

### User Frontend
```bash
npm start             # Start Expo
npm run android       # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on web
```

## 🎯 Testing Flow

1. **Start Backend** → `cd backend && npm run dev`
2. **Seed Admin** → `npm run seed`
3. **Start Admin** → `cd admin-frontend && npm run dev`
4. **Login Admin** → Use default credentials
5. **Create Categories** → Add Men, Women, Kids
6. **Create Products** → Add sample products
7. **Start Mobile App** → `cd user-frontend && npm start`
8. **Login User** → Use OTP (check backend console)
9. **Browse Products** → View categories and products
10. **Place Order** → Complete checkout flow

## 📚 Documentation Files

- `README.md` - Main overview
- `SETUP_GUIDE.md` - Detailed setup
- `API_DOCUMENTATION.md` - API reference
- `PROJECT_SUMMARY.md` - Complete summary
- `QUICK_REFERENCE.md` - This file

## 🆘 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `API_DOCUMENTATION.md` for API details
3. Read `PROJECT_SUMMARY.md` for architecture
4. Check error messages in terminal/console
5. Verify all services are running
6. Confirm API URLs are correct

## 🎓 Learning Path

1. **Start with Backend** - Understand API structure
2. **Test with Postman** - Verify endpoints work
3. **Build Admin UI** - Create management interface
4. **Build Mobile App** - Create user experience
5. **Integrate Everything** - Connect all pieces
6. **Add Features** - Extend functionality

## ⚡ Pro Tips

1. **Use centralized API config** - Change URL in one place
2. **Check backend console** - OTP is logged in dev mode
3. **Use service layer** - Don't call axios directly
4. **Follow naming conventions** - Keep code consistent
5. **Test incrementally** - Don't build everything at once
6. **Read error messages** - They usually tell you what's wrong
7. **Use Git** - Commit frequently
8. **Document changes** - Help future you

## 🚀 Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Remove dev-only code (OTP logging)
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all features
- [ ] Update API URLs
- [ ] Build mobile apps

---

**Quick Start:** Run `install.sh` (Unix) or `install.bat` (Windows) to install all dependencies at once!
