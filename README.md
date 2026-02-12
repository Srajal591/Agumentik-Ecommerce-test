# Fashion E-Commerce Platform

A complete single-vendor fashion e-commerce platform with one shared backend and two frontend clients (Admin Web + User Mobile App).

## 🏗️ Architecture

- **Backend**: Node.js + Express.js + MongoDB
- **Admin Frontend**: React.js (Web)
- **User Frontend**: React Native (Expo)
- **Authentication**: JWT + OTP-based login
- **Authorization**: Role-Based Access Control (RBAC)
- **Payment**: Dummy Razorpay (test mode)

## 📁 Project Structure

```
clothing-store/
├── backend/              # Node.js + Express API
├── admin-frontend/       # React.js Admin Dashboard
├── user-frontend/        # React Native Mobile App
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update MongoDB URI and other settings

4. Seed admin user:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

**Default Admin Credentials:**
- Email: `admin@fashionstore.com`
- Password: `Admin@123`

### Admin Frontend Setup

1. Navigate to admin-frontend directory:
```bash
cd admin-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL (if needed):
- Open `admin-frontend/src/config/api.js`
- Change `API_BASE_URL` if your backend runs on a different port

4. Start the development server:
```bash
npm run dev
```

The admin dashboard will run on `http://localhost:5173`

### User Frontend Setup

1. Navigate to user-frontend directory:
```bash
cd user-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL:
- Open `user-frontend/src/config/api.js`
- Update `API_BASE_URL` based on your setup:
  - Android Emulator: `http://10.0.2.2:5000/api`
  - iOS Simulator: `http://localhost:5000/api`
  - Physical Device: `http://YOUR_COMPUTER_IP:5000/api`

4. Start Expo:
```bash
npm start
```

5. Run on device:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app for physical device

## 🎨 Design System

### Colors
- Primary: `#F97316`
- Background: `#F9FAFB`
- Text Dark: `#111827`
- Text Gray: `#6B7280`
- Surface: `#FFFFFF`
- Success: `#22C55E`
- Error: `#EF4444`
- Border: `#E5E7EB`

### Spacing
- XS: 8px
- SM: 16px
- MD: 24px
- LG: 32px
- XL: 48px

## 🔐 Authentication

### Admin Authentication
- Email + Password login
- JWT token-based authentication
- Role-based access control

### User Authentication
- OTP-based login using mobile number
- OTP expires in 10 minutes
- JWT token issued after verification
- In development mode, OTP is logged to console

## 📡 API Configuration

### Centralized API URL

Both frontends use a centralized API configuration. To change the backend URL:

**Admin Frontend:**
```javascript
// admin-frontend/src/config/api.js
export const API_BASE_URL = 'http://localhost:5000/api';
```

**User Frontend:**
```javascript
// user-frontend/src/config/api.js
export const API_BASE_URL = 'http://localhost:5000/api';
```

Change the URL in ONE place and it updates everywhere!

## 🛠️ Features

### Backend
- ✅ OTP-based authentication
- ✅ JWT token management
- ✅ Role-based authorization
- ✅ User management (block/unblock)
- ✅ Category management
- ✅ Product management with inventory
- ✅ Order lifecycle (CONFIRMED → SHIPPED → DELIVERED)
- ✅ Ticket/grievance system
- ✅ Return/refund management
- ✅ Soft-delete strategy
- ✅ Pagination middleware
- ✅ Rate limiting
- ✅ Error handling
- ✅ Request logging

### Admin Dashboard
- ✅ Secure admin login
- ✅ User management
- ✅ Product & category management
- ✅ Order management with status transitions
- ✅ Ticket handling
- ✅ Return/refund processing

### User Mobile App
- ✅ OTP-based login
- ✅ Product browsing
- ✅ Category filtering
- ✅ Cart & checkout
- ✅ Address management
- ✅ Order tracking
- ✅ Wishlist
- ✅ Support tickets

## 📝 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/send-otp` - Send OTP to mobile
- `POST /api/auth/user/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/profile/update` - Update profile
- `POST /api/users/addresses` - Add address
- `POST /api/users/wishlist/toggle` - Toggle wishlist

## 🧪 Testing

### Test OTP Login (Development Mode)

When you send OTP in development mode, the OTP will be logged to the backend console:

```
📱 OTP for 9876543210: 123456
```

Use this OTP to verify and login.

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- OTP hashing before storage
- Rate limiting on auth endpoints
- Role-based access control
- Soft-delete strategy (no hard deletes)
- Request validation
- Error handling middleware

## 📦 Dependencies

### Backend
- express
- mongoose
- jsonwebtoken
- bcrypt
- cors
- dotenv
- express-rate-limit
- morgan
- helmet
- compression

### Admin Frontend
- react
- axios
- react-router-dom (for routing)

### User Frontend
- react-native
- expo
- axios
- @react-native-async-storage/async-storage
- @react-navigation/native

## 🎯 Next Steps

1. **Backend**: Start the backend server and seed admin user
2. **Admin**: Login with default credentials and create categories/products
3. **User App**: Test OTP login and browse products
4. **Customize**: Update colors, add features, enhance UI

## 📄 License

This project is for educational and portfolio purposes.

## 👨‍💻 Author

Built with ❤️ for learning and demonstration purposes.
