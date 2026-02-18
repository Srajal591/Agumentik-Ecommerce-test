# Order System Implementation - Complete Guide

## Overview
Complete order management system with address management, payment flow, order tracking, and theme-consistent UI.

## Backend Implementation ✅

### 1. Address Management API
**New Files Created:**
- `backend/src/controllers/addressController.js` - Address CRUD operations
- `backend/src/routes/addressRoutes.js` - Address routes

**Endpoints:**
```
GET    /api/addresses              - Get all user addresses
POST   /api/addresses              - Add new address
PUT    /api/addresses/:addressId   - Update address
DELETE /api/addresses/:addressId   - Delete address
PATCH  /api/addresses/:addressId/default - Set default address
```

**Address Schema** (already in User model):
```javascript
{
  label: String,           // e.g., "Home", "Office"
  fullName: String,
  mobile: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: Boolean
}
```

### 2. Order Management API (Already Exists)
**Endpoints:**
```
POST   /api/orders                 - Create order
GET    /api/orders/my-orders       - Get user orders
GET    /api/orders/:id             - Get order details
PATCH  /api/orders/:id/payment     - Update payment status
GET    /api/orders                 - Get all orders (Admin)
PATCH  /api/orders/:id/status      - Update order status (Admin)
```

**Order Schema:**
```javascript
{
  orderNumber: String (unique),
  user: ObjectId,
  items: [{
    product: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
    image: String
  }],
  shippingAddress: {
    fullName, mobile, addressLine1, addressLine2,
    city, state, pincode
  },
  subtotal: Number,
  shippingCharge: Number,
  tax: Number,
  total: Number,
  paymentMethod: 'razorpay' | 'cod',
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
  paymentId: String,
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  trackingNumber: String,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}
```

## Frontend Implementation Plan

### Order Flow Pages (To Be Created)

#### 1. Address Selection Page
**Route:** `user-frontend/app/checkout/address.tsx`
**Features:**
- List all saved addresses
- Select address for delivery
- Add new address button
- Edit/Delete existing addresses
- Set default address
- Continue to payment button

#### 2. Add/Edit Address Page
**Route:** `user-frontend/app/checkout/add-address.tsx`
**Features:**
- Form fields: Full Name, Mobile, Address Line 1, Address Line 2, City, State, Pincode
- Label selection (Home, Office, Other)
- Set as default checkbox
- Save address button
- Form validation

#### 3. Payment Method Page
**Route:** `user-frontend/app/checkout/payment.tsx`
**Features:**
- Cash on Delivery (COD) - Active
- Google Pay - Dummy (disabled)
- PhonePe - Dummy (disabled)
- Paytm - Dummy (disabled)
- Credit/Debit Card - Dummy (disabled)
- Order summary display
- Place Order button

#### 4. Order Confirmation Page
**Route:** `user-frontend/app/checkout/confirmation.tsx`
**Features:**
- Success animation
- Order number display
- Estimated delivery date
- Order summary
- Track Order button
- Continue Shopping button

#### 5. Order Tracking Page
**Route:** `user-frontend/app/order/[id].tsx`
**Features:**
- Order status timeline
  - Order Placed
  - Confirmed
  - Shipped (with tracking number)
  - Out for Delivery
  - Delivered
- Order details
- Shipping address
- Items list
- Payment info
- Cancel order button (if applicable)

#### 6. Orders List Page (Update Existing)
**Route:** `user-frontend/app/(tabs)/orders.tsx`
**Features:**
- List all user orders
- Order cards with:
  - Order number
  - Date
  - Status badge
  - Items preview
  - Total amount
- Filter by status
- Pull to refresh
- Tap to view details

### API Service Files (To Be Created)

#### 1. Address Service
**File:** `user-frontend/src/api/addressService.ts`
```typescript
- getAddresses()
- addAddress(addressData)
- updateAddress(addressId, addressData)
- deleteAddress(addressId)
- setDefaultAddress(addressId)
```

#### 2. Order Service
**File:** `user-frontend/src/api/orderService.ts`
```typescript
- createOrder(orderData)
- getUserOrders(page, limit)
- getOrderById(orderId)
- updatePaymentStatus(orderId, status, paymentId)
```

### UI Components (To Be Created)

#### 1. Address Card Component
**File:** `user-frontend/src/components/AddressCard.tsx`
- Display address details
- Default badge
- Edit/Delete buttons
- Select radio button

#### 2. Order Status Timeline Component
**File:** `user-frontend/src/components/OrderTimeline.tsx`
- Visual timeline with icons
- Status labels
- Dates/timestamps
- Active/completed states

#### 3. Order Card Component
**File:** `user-frontend/src/components/OrderCard.tsx`
- Order summary
- Status badge
- Items preview
- Tap to view details

## Order Flow Sequence

```
1. Product Details Page
   ↓ (Buy Now button)
2. Address Selection Page
   ↓ (Select/Add address)
3. Payment Method Page
   ↓ (Select COD)
4. Order Confirmation Page
   ↓ (Order placed successfully)
5. Order Tracking Page
   (View order status)
```

## Cart Flow Sequence

```
1. Cart Page
   ↓ (Proceed to Checkout button)
2. Address Selection Page
   ↓ (Select/Add address)
3. Payment Method Page
   ↓ (Select COD)
4. Order Confirmation Page
   ↓ (Order placed successfully)
5. Orders List Page
   (View all orders)
```

## Theme Colors (Chocolate Brown)

```javascript
colors = {
  primary: '#704F38',        // Chocolate Brown
  primaryLight: '#8A6A52',
  primaryDark: '#5C3F2E',
  background: '#EDEDED',
  surface: '#FFFFFF',
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FB8C00',
  textPrimary: '#1F2029',
  textSecondary: '#797979',
}
```

## Status Colors

```javascript
orderStatus = {
  pending: '#FB8C00',      // Orange
  confirmed: '#1E88E5',    // Blue
  shipped: '#7B1FA2',      // Purple
  delivered: '#4CAF50',    // Green
  cancelled: '#E53935',    // Red
}
```

## Payment Methods

### Active:
- ✅ Cash on Delivery (COD)

### Dummy (Disabled):
- ⚪ Google Pay
- ⚪ PhonePe
- ⚪ Paytm
- ⚪ Credit/Debit Card
- ⚪ UPI

## Next Steps

### Phase 1: Frontend API Services ✅ (Next)
1. Create `addressService.ts`
2. Create `orderService.ts`

### Phase 2: Address Management Pages
1. Create Address Selection page
2. Create Add/Edit Address page

### Phase 3: Payment & Confirmation
1. Create Payment Method page
2. Create Order Confirmation page

### Phase 4: Order Tracking & List
1. Update Orders List page
2. Create Order Tracking page

### Phase 5: Integration
1. Connect Buy Now button to checkout flow
2. Connect Cart checkout to address flow
3. Test complete order flow

## Reference Design
Behance URL: https://www.behance.net/gallery/178392283/Clothing-Store-AppFashion-E-Commerce-App-App-UI-Kit

## Status
- ✅ Backend Address API - Complete
- ✅ Backend Order API - Already exists
- ⏳ Frontend Implementation - In Progress

---
*Theme: Chocolate Brown (#704F38)*
*Payment: COD Only (Others Dummy)*
*Design: Clean, Professional, Theme-Consistent*
