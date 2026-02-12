# API Documentation - Fashion E-Commerce Platform

Base URL: `http://localhost:5000/api`

## 📋 Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Categories](#categories)
- [Products](#products)
- [Orders](#orders)
- [Tickets](#tickets)
- [Returns](#returns)

---

## 🔐 Authentication

### Admin Login
```http
POST /api/auth/admin/login
```

**Request Body:**
```json
{
  "email": "admin@fashionstore.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin",
      "email": "admin@fashionstore.com",
      "role": "admin"
    }
  }
}
```

### Send OTP (User)
```http
POST /api/auth/user/send-otp
```

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresAt": "2024-01-01T00:10:00.000Z",
    "otp": "123456"  // Only in development mode
  }
}
```

### Verify OTP (User)
```http
POST /api/auth/user/verify-otp
```

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "mobile": "9876543210",
      "role": "user"
    }
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

---

## 👥 Users

### Get All Users (Admin)
```http
GET /api/users?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Get User by ID (Admin)
```http
GET /api/users/:id
Authorization: Bearer {admin_token}
```

### Update Profile
```http
PUT /api/users/profile/update
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Toggle Block User (Admin)
```http
PATCH /api/users/:id/toggle-block
Authorization: Bearer {admin_token}
```

### Add Address
```http
POST /api/users/addresses
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "label": "Home",
  "fullName": "John Doe",
  "mobile": "9876543210",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}
```

### Update Address
```http
PUT /api/users/addresses/:addressId
Authorization: Bearer {token}
```

### Delete Address
```http
DELETE /api/users/addresses/:addressId
Authorization: Bearer {token}
```

### Toggle Wishlist
```http
POST /api/users/wishlist/toggle
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011"
}
```

### Get Wishlist
```http
GET /api/users/wishlist
Authorization: Bearer {token}
```

---

## 📂 Categories

### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Men",
      "description": "Men's clothing",
      "image": "https://example.com/men.jpg",
      "isActive": true
    }
  ]
}
```

### Get Category by ID
```http
GET /api/categories/:id
```

### Create Category (Admin)
```http
POST /api/categories
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "Men",
  "description": "Men's clothing",
  "image": "https://example.com/men.jpg"
}
```

### Update Category (Admin)
```http
PUT /api/categories/:id
Authorization: Bearer {admin_token}
```

### Toggle Category Status (Admin)
```http
PATCH /api/categories/:id/toggle-status
Authorization: Bearer {admin_token}
```

### Delete Category (Admin)
```http
DELETE /api/categories/:id
Authorization: Bearer {admin_token}
```

---

## 🛍️ Products

### Get All Products
```http
GET /api/products?page=1&limit=10&category=507f1f77bcf86cd799439011&search=shirt&minPrice=500&maxPrice=2000
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category ID
- `search` - Search in name, description, brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `status` - Filter by status (active, inactive, out_of_stock)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Cotton T-Shirt",
        "description": "Comfortable cotton t-shirt",
        "price": 999,
        "discountPrice": 799,
        "category": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Men"
        },
        "images": ["https://example.com/tshirt.jpg"],
        "sizes": [
          { "size": "M", "stock": 10 },
          { "size": "L", "stock": 5 }
        ],
        "colors": ["Black", "White"],
        "brand": "Nike",
        "rating": 4.5,
        "reviewCount": 120,
        "status": "active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Get Product by ID
```http
GET /api/products/:id
```

### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "Cotton T-Shirt",
  "description": "Comfortable cotton t-shirt",
  "price": 999,
  "discountPrice": 799,
  "category": "507f1f77bcf86cd799439012",
  "images": ["https://example.com/tshirt.jpg"],
  "sizes": [
    { "size": "S", "stock": 15 },
    { "size": "M", "stock": 10 },
    { "size": "L", "stock": 5 }
  ],
  "colors": ["Black", "White", "Blue"],
  "brand": "Nike",
  "material": "Cotton",
  "tags": ["casual", "summer"]
}
```

### Update Product (Admin)
```http
PUT /api/products/:id
Authorization: Bearer {admin_token}
```

### Update Product Status (Admin)
```http
PATCH /api/products/:id/status
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "inactive"
}
```

### Update Inventory (Admin)
```http
PATCH /api/products/:id/inventory
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "sizes": [
    { "size": "M", "stock": 20 },
    { "size": "L", "stock": 15 }
  ]
}
```

### Delete Product (Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {admin_token}
```

---

## 📦 Orders

### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "name": "Cotton T-Shirt",
      "price": 799,
      "quantity": 2,
      "size": "M",
      "color": "Black",
      "image": "https://example.com/tshirt.jpg"
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "mobile": "9876543210",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "subtotal": 1598,
  "shippingCharge": 50,
  "tax": 152,
  "total": 1800,
  "paymentMethod": "razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD1704067200001234",
    "user": {...},
    "items": [...],
    "total": 1800,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

### Get All Orders (Admin)
```http
GET /api/orders?page=1&limit=10&status=confirmed&paymentStatus=completed
Authorization: Bearer {admin_token}
```

### Get My Orders
```http
GET /api/orders/my-orders?page=1&limit=10
Authorization: Bearer {token}
```

### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

### Update Order Status (Admin)
```http
PATCH /api/orders/:id/status
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Status Flow:**
- `pending` → `confirmed` → `shipped` → `delivered`
- `cancelled` (can be set from any status)

### Update Payment Status
```http
PATCH /api/orders/:id/payment
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "paymentStatus": "completed",
  "paymentId": "pay_123456789"
}
```

---

## 🎫 Tickets

### Create Ticket
```http
POST /api/tickets
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "subject": "Product not received",
  "description": "I ordered a product 5 days ago but haven't received it yet",
  "category": "order",
  "order": "507f1f77bcf86cd799439011",
  "priority": "high"
}
```

**Categories:** `order`, `product`, `payment`, `return`, `other`
**Priority:** `low`, `medium`, `high`

### Get All Tickets
```http
GET /api/tickets?page=1&limit=10&status=open&category=order
Authorization: Bearer {token}
```

### Get Ticket by ID
```http
GET /api/tickets/:id
Authorization: Bearer {token}
```

### Update Ticket Status (Admin)
```http
PATCH /api/tickets/:id/status
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Status:** `open`, `in_progress`, `resolved`, `closed`

### Add Message to Ticket
```http
POST /api/tickets/:id/messages
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "Thank you for your response. I will wait for the update."
}
```

---

## 🔄 Returns

### Create Return Request
```http
POST /api/returns
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "order": "507f1f77bcf86cd799439011",
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "quantity": 1,
      "reason": "Size doesn't fit"
    }
  ],
  "reason": "Product size is too small",
  "type": "return"
}
```

**Type:** `return`, `refund`, `replacement`

### Get All Returns
```http
GET /api/returns?page=1&limit=10&status=requested&type=return
Authorization: Bearer {token}
```

### Get Return by ID
```http
GET /api/returns/:id
Authorization: Bearer {token}
```

### Update Return Status (Admin)
```http
PATCH /api/returns/:id/status
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "approved",
  "adminNotes": "Return approved. Please ship the product back.",
  "refundAmount": 799
}
```

**Status:** `requested`, `approved`, `rejected`, `completed`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]  // Optional validation errors
}
```

---

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚦 Rate Limiting

Authentication endpoints are rate-limited:
- Window: 15 minutes
- Max Requests: 5 per window

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. Pagination is available on list endpoints
3. Soft-delete is used (items are marked as deleted, not removed)
4. Admin endpoints require `role: admin`
5. User endpoints require `role: user`
6. Some endpoints are accessible by both roles

---

## 🧪 Testing with Postman/Thunder Client

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. Login to get token
4. Add token to Authorization header for protected routes
5. Test CRUD operations

---

## 📞 Support

For issues or questions, refer to the main README.md and SETUP_GUIDE.md files.
