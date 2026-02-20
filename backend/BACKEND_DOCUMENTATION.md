# Backend Documentation - Fashion E-Commerce Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation Scripts](#installation-scripts)
- [Controllers](#controllers)
- [Models](#models)
- [Routes](#routes)
- [Services](#services)
- [Middleware](#middleware)
- [Socket.IO](#socketio)
- [Utilities](#utilities)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

---

## 🎯 Overview

This is the backend server for a Fashion E-Commerce Platform built with Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, product management, order processing, chat functionality, and admin operations.

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Real-time Communication**: Socket.IO
- **Email Service**: Nodemailer
- **Validation**: Express-validator, Joi
- **Security**: Helmet, CORS, bcrypt
- **Rate Limiting**: Express-rate-limit

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # Socket.IO handlers
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env                 # Environment variables
├── .env.example         # Environment template
└── package.json         # Dependencies
```

---

## 🚀 Installation Scripts

### Root Level Scripts

**`install.bat` (Windows)**
- Automatically installs dependencies for all three projects (backend, admin-frontend, user-frontend)
- Runs `npm install` in each folder sequentially
- Shows error messages if any installation fails
- Provides next steps after successful installation

**`install.sh` (Linux/Mac)**
- Same functionality as install.bat but for Unix-based systems
- Executable with: `chmod +x install.sh && ./install.sh`

### Usage
```bash
# Windows
install.bat

# Linux/Mac
./install.sh
```

---

## 🎮 Controllers

Controllers handle incoming HTTP requests and return responses.

### 1. **authController.js**
- `register` - User registration with OTP verification
- `verifyOTP` - Verify OTP for registration
- `login` - User login with JWT token
- `logout` - User logout
- `forgotPassword` - Send password reset OTP
- `resetPassword` - Reset password with OTP

### 2. **userController.js**
- `getAllUsers` - Get all users (Admin only)
- `getUserById` - Get user by ID
- `updateUser` - Update user details
- `deleteUser` - Delete user account
- `toggleBlockUser` - Block/unblock user (Admin)

### 3. **productController.js**
- `createProduct` - Create new product (Admin)
- `getAllProducts` - Get all products with filters
- `getProductById` - Get single product details
- `updateProduct` - Update product (Admin)
- `deleteProduct` - Delete product (Admin)
- `searchProducts` - Search products by name/category

### 4. **categoryController.js**
- `createCategory` - Create new category (Admin)
- `getAllCategories` - Get all categories
- `getCategoryById` - Get category by ID
- `updateCategory` - Update category (Admin)
- `deleteCategory` - Delete category (Admin)

### 5. **orderController.js**
- `createOrder` - Create new order
- `getAllOrders` - Get all orders (Admin)
- `getUserOrders` - Get user's orders
- `getOrderById` - Get order details
- `updateOrderStatus` - Update order status (Admin)
- `cancelOrder` - Cancel order

### 6. **returnController.js**
- `createReturn` - Create return request
- `getAllReturns` - Get all returns (Admin)
- `getUserReturns` - Get user's returns
- `getReturnById` - Get return details
- `updateReturnStatus` - Update return status (Admin)

### 7. **chatController.js**
- `sendMessage` - Send chat message
- `getMessages` - Get chat messages
- `getChatRooms` - Get user's chat rooms
- `markAsRead` - Mark messages as read

### 8. **ticketController.js**
- `createTicket` - Create support ticket
- `getAllTickets` - Get all tickets (Admin)
- `getUserTickets` - Get user's tickets
- `getTicketById` - Get ticket details
- `updateTicketStatus` - Update ticket status (Admin)
- `addTicketReply` - Add reply to ticket

### 9. **addressController.js**
- `addAddress` - Add new address
- `getAddresses` - Get user's addresses
- `updateAddress` - Update address
- `deleteAddress` - Delete address
- `setDefaultAddress` - Set default address

### 10. **profileController.js**
- `getProfile` - Get user profile
- `updateProfile` - Update user profile
- `changePassword` - Change password
- `uploadProfilePicture` - Upload profile picture

### 11. **adminManagementController.js**
- `createAdmin` - Create new admin (Super Admin)
- `getAllAdmins` - Get all admins
- `updateAdminRole` - Update admin role
- `deleteAdmin` - Delete admin
- `toggleAdminStatus` - Enable/disable admin

### 12. **uploadController.js**
- `uploadSingle` - Upload single file
- `uploadMultiple` - Upload multiple files
- `deleteFile` - Delete uploaded file

---

## 📊 Models

Mongoose schemas defining data structure.

### 1. **User.js**
```javascript
{
  name: String,
  mobile: String (unique),
  email: String,
  password: String (hashed),
  role: Enum ['user', 'admin', 'super_admin'],
  isBlocked: Boolean,
  profilePicture: String,
  addresses: [AddressSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Product.js**
```javascript
{
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: ObjectId (ref: Category),
  brand: String,
  images: [String],
  sizes: [String],
  colors: [String],
  stock: Number,
  status: Enum ['active', 'inactive'],
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Category.js**
```javascript
{
  name: String (unique),
  description: String,
  image: String,
  status: Enum ['active', 'inactive'],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **Order.js**
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    size: String,
    color: String
  }],
  totalAmount: Number,
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: Enum ['pending', 'paid', 'failed'],
  orderStatus: Enum ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

### 5. **Return.js**
```javascript
{
  returnNumber: String (unique),
  order: ObjectId (ref: Order),
  user: ObjectId (ref: User),
  items: [Object],
  reason: String,
  status: Enum ['pending', 'approved', 'rejected', 'completed'],
  refundAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. **Chat.js**
```javascript
{
  room: String,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

### 7. **Ticket.js**
```javascript
{
  ticketNumber: String (unique),
  user: ObjectId (ref: User),
  subject: String,
  description: String,
  status: Enum ['open', 'in_progress', 'resolved', 'closed'],
  priority: Enum ['low', 'medium', 'high'],
  replies: [{
    user: ObjectId (ref: User),
    message: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 8. **OTP.js**
```javascript
{
  mobile: String,
  otp: String,
  type: Enum ['registration', 'password_reset'],
  expiresAt: Date,
  createdAt: Date
}
```

---

## 🛣 Routes

API route definitions.

### Base URL: `/api`

| Route | File | Description |
|-------|------|-------------|
| `/auth` | authRoutes.js | Authentication endpoints |
| `/users` | userRoutes.js | User management |
| `/products` | productRoutes.js | Product operations |
| `/categories` | categoryRoutes.js | Category management |
| `/orders` | orderRoutes.js | Order processing |
| `/returns` | returnRoutes.js | Return requests |
| `/chat` | chatRoutes.js | Chat functionality |
| `/tickets` | ticketRoutes.js | Support tickets |
| `/addresses` | addressRoutes.js | Address management |
| `/profile` | profileRoutes.js | User profile |
| `/admin-management` | adminManagementRoutes.js | Admin operations |
| `/upload` | uploadRoutes.js | File uploads |

---

## 🔧 Services

Business logic layer.

### 1. **authService.js**
- User registration logic
- OTP generation and verification
- Password hashing and validation
- JWT token generation

### 2. **userService.js**
- User CRUD operations
- User search and filtering
- Block/unblock functionality

### 3. **productService.js**
- Product CRUD operations
- Product search and filtering
- Stock management

### 4. **categoryService.js**
- Category CRUD operations
- Category validation

### 5. **orderService.js**
- Order creation and processing
- Order status updates
- Order history

### 6. **returnService.js**
- Return request processing
- Return approval/rejection
- Refund calculations

### 7. **ticketService.js**
- Ticket creation and management
- Ticket replies
- Status updates

### 8. **adminManagementService.js**
- Admin creation
- Role management
- Admin permissions

---

## 🛡 Middleware

### 1. **auth.js**
- `authenticate` - Verify JWT token
- `authorize` - Check user roles
- `isSuperAdmin` - Super admin only access
- `isAdmin` - Admin/Super admin access

### 2. **errorHandler.js**
- Global error handling
- Error formatting
- Error logging

### 3. **logger.js**
- Request logging (Morgan)
- Custom logging functions

### 4. **pagination.js**
- Pagination helper
- Query parameter parsing

### 5. **upload.js**
- Multer configuration
- File type validation
- File size limits

### 6. **validator.js**
- Request validation
- Input sanitization
- Custom validation rules

---

## 🔌 Socket.IO

### chatSocket.js
Real-time chat functionality:
- `connection` - Handle new connections
- `join_room` - Join chat room
- `send_message` - Send message
- `typing` - Typing indicator
- `disconnect` - Handle disconnection

---

## 🔨 Utilities

### 1. **cloudinaryUpload.js**
- Upload files to Cloudinary
- Delete files from Cloudinary
- Image optimization

### 2. **emailService.js**
- Send OTP emails
- Send order confirmation
- Send password reset emails

### 3. **generateOrderNumber.js**
- Generate unique order numbers
- Format: ORD-YYYYMMDD-XXXX

### 4. **generateOTP.js**
- Generate 6-digit OTP
- OTP expiry handling

### 5. **generateToken.js**
- Generate JWT tokens
- Token verification
- Refresh tokens

### 6. **seedAdmin.js**
- Create default super admin
- Database seeding

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/verify-otp        - Verify OTP
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

### Users
```
GET    /api/users                  - Get all users (Admin)
GET    /api/users/:id              - Get user by ID
PUT    /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user
POST   /api/users/:id/toggle-block - Block/unblock user (Admin)
```

### Products
```
GET    /api/products               - Get all products
GET    /api/products/:id           - Get product by ID
POST   /api/products               - Create product (Admin)
PUT    /api/products/:id           - Update product (Admin)
DELETE /api/products/:id           - Delete product (Admin)
GET    /api/products/search        - Search products
```

### Categories
```
GET    /api/categories             - Get all categories
GET    /api/categories/:id         - Get category by ID
POST   /api/categories             - Create category (Admin)
PUT    /api/categories/:id         - Update category (Admin)
DELETE /api/categories/:id         - Delete category (Admin)
```

### Orders
```
GET    /api/orders                 - Get all orders (Admin)
GET    /api/orders/user            - Get user orders
GET    /api/orders/:id             - Get order by ID
POST   /api/orders                 - Create order
PUT    /api/orders/:id/status      - Update order status (Admin)
POST   /api/orders/:id/cancel      - Cancel order
```

### Returns
```
GET    /api/returns                - Get all returns (Admin)
GET    /api/returns/user           - Get user returns
GET    /api/returns/:id            - Get return by ID
POST   /api/returns                - Create return request
PUT    /api/returns/:id/status     - Update return status (Admin)
```

### Chat
```
GET    /api/chat/rooms             - Get chat rooms
GET    /api/chat/:roomId/messages  - Get messages
POST   /api/chat/send              - Send message
PUT    /api/chat/:messageId/read   - Mark as read
```

### Tickets
```
GET    /api/tickets                - Get all tickets (Admin)
GET    /api/tickets/user           - Get user tickets
GET    /api/tickets/:id            - Get ticket by ID
POST   /api/tickets                - Create ticket
PUT    /api/tickets/:id/status     - Update ticket status (Admin)
POST   /api/tickets/:id/reply      - Add reply
```

### Profile
```
GET    /api/profile                - Get profile
PUT    /api/profile                - Update profile
PUT    /api/profile/password       - Change password
POST   /api/profile/picture        - Upload profile picture
```

### Addresses
```
GET    /api/addresses              - Get addresses
POST   /api/addresses              - Add address
PUT    /api/addresses/:id          - Update address
DELETE /api/addresses/:id          - Delete address
PUT    /api/addresses/:id/default  - Set default address
```

### Admin Management
```
GET    /api/admin-management       - Get all admins (Super Admin)
POST   /api/admin-management       - Create admin (Super Admin)
PUT    /api/admin-management/:id   - Update admin role (Super Admin)
DELETE /api/admin-management/:id   - Delete admin (Super Admin)
POST   /api/admin-management/:id/toggle - Toggle admin status (Super Admin)
```

### Upload
```
POST   /api/upload/single          - Upload single file
POST   /api/upload/multiple        - Upload multiple files
DELETE /api/upload/:publicId       - Delete file
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URLs
ADMIN_FRONTEND_URL=http://localhost:5173
USER_FRONTEND_URL=http://localhost:8081

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Running the Backend

### Development Mode
```bash
cd backend
npm run dev
```

### Production Mode
```bash
cd backend
npm start
```

### Seed Super Admin
```bash
cd backend
npm run seed
```

---

## 📝 Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- OTP expires after 10 minutes
- File uploads are stored in Cloudinary
- Socket.IO runs on the same port as Express
- Rate limiting is applied to prevent abuse
- CORS is configured for frontend URLs

---

## 🔒 Security Features

- Helmet for HTTP headers security
- CORS for cross-origin requests
- JWT for authentication
- Bcrypt for password hashing
- Express-validator for input validation
- Rate limiting for API endpoints
- File upload validation

---

## 📦 Dependencies

See `package.json` for complete list of dependencies.

**Main Dependencies:**
- express
- mongoose
- jsonwebtoken
- bcrypt
- multer
- cloudinary
- socket.io
- nodemailer
- joi
- express-validator
- helmet
- cors
- dotenv

---

## 👨‍💻 Development

For detailed API documentation, see `API_DOCUMENTATION.md` in the root folder.

---

**Last Updated:** 2025
