# E-Commerce Fashion Store

A complete full-stack e-commerce application for fashion products with Admin Panel and User Mobile App.

## 🚀 Project Structure

```
├── backend/              # Node.js + Express API Server
├── admin-frontend/       # React Admin Dashboard
├── user-frontend/        # React Native Mobile App
├── API_DOCUMENTATION.md  # Complete API Documentation
├── SETUP_GUIDE.md        # Setup Instructions
└── ORDER_FLOW_COMPLETE.md # Order System Documentation
```

## � Features

### User Mobile App (React Native)
- **Authentication**: Mobile OTP-based login/registration
- **Product Browsing**: Categories, search, filters
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite products
- **Order Management**: Complete checkout flow with COD payment
- **Address Management**: Multiple delivery addresses
- **Order Tracking**: Real-time order status updates
- **Profile Management**: User profile and settings

### Admin Dashboard (React)
- **Dashboard**: Sales analytics and statistics
- **Product Management**: CRUD operations with image upload
- **Category Management**: Organize products by categories
- **Order Management**: View and update order status
- **User Management**: View and manage users
- **Admin Management**: Role-based access control
- **Returns & Tickets**: Customer support management

### Backend API (Node.js + Express)
- **RESTful API**: Clean and organized endpoints
- **Authentication**: JWT-based auth with role management
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Cloudinary integration for images
- **Email Service**: Nodemailer for OTP and notifications
- **Security**: Helmet, CORS, input validation
- **Error Handling**: Centralized error management

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Nodemailer (Email Service)
- Bcrypt (Password Hashing)

### Admin Frontend
- React.js
- React Router
- Axios
- CSS3

### User Frontend
- React Native (Expo)
- Expo Router
- AsyncStorage
- Axios

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary Account
- Gmail Account (for OTP emails)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CORS_ORIGIN=*
```

Start server:
```bash
npm start
```

### 2. Admin Frontend Setup

```bash
cd admin-frontend
npm install
npm start
```

Access at: `http://localhost:3000`

### 3. User Frontend Setup

```bash
cd user-frontend
npm install
npx expo start
```

Scan QR code with Expo Go app on your phone.

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[ORDER_FLOW_COMPLETE.md](./ORDER_FLOW_COMPLETE.md)** - Order system documentation

## 🔑 Default Admin Credentials

After running the backend, a super admin is automatically created:

```
Email: superadmin@example.com
Password: SuperAdmin@123
```

## 📱 User App Features

### Authentication Flow
1. Enter mobile number
2. Receive OTP via email
3. Verify OTP
4. Complete registration (first time)
5. Login automatically

### Shopping Flow
1. Browse products by category
2. View product details
3. Add to cart or buy now
4. Select delivery address
5. Choose payment method (COD)
6. Place order
7. Track order status

### Order Status Flow
```
Pending → Confirmed → Shipped → Delivered
```

## 🎨 Theme

The app uses a chocolate brown theme:
- Primary Color: `#704F38`
- Clean and modern UI
- Smooth animations
- Responsive design

## � Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- CORS protection
- Helmet security headers
- Token expiration handling

## 📦 Database Models

- **User**: User accounts with addresses and wishlist
- **Product**: Products with images, sizes, colors, stock
- **Category**: Product categories with images
- **Order**: Orders with items, address, payment info
- **Ticket**: Customer support tickets
- **Return**: Product return requests

## 🚀 Deployment

### Backend
- Deploy to Heroku, Railway, or any Node.js hosting
- Set environment variables
- Connect to MongoDB Atlas

### Admin Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting

### User Frontend
- Build APK: `expo build:android`
- Build IPA: `expo build:ios`
- Or publish to Expo: `expo publish`

## 🤝 Contributing

This is a private project. For any issues or suggestions, please contact the development team.

## 📄 License

Private and Confidential

## 👨‍💻 Development Team

Developed with ❤️ for fashion e-commerce

---

**Note**: Make sure to update the IP address in frontend API services to match your backend server IP address.
