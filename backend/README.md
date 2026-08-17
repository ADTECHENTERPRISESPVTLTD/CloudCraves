# CloudCraves Backend REST API

**AD TECH Enterprises Pvt. Ltd. - Internship Project Assignment (Task 04 Backend Development)**

CloudCraves is a complete REST API backend engineered for small restaurants, cloud kitchens, local hotels, cafés, and food businesses operating in smaller towns and villages.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Backend](#running-the-backend)
- [API Base URL](#api-base-url)
- [Response Contracts](#response-contracts)
- [Authorization Matrix](#authorization-matrix)
- [API Documentation](#api-documentation)
  - [1. Health Check](#1-health-check)
  - [2. Customer Authentication](#2-customer-authentication)
  - [3. Admin Authentication](#3-admin-authentication)
  - [4. Customer Profile & Addresses](#4-customer-profile--addresses)
  - [5. Restaurant & Settings](#5-restaurant--settings)
  - [6. Food & Menu Browsing](#6-food--menu-browsing)
  - [7. Customer Orders](#7-customer-orders)
  - [8. Customer & Admin Reviews](#8-customer--admin-reviews)
  - [9. Admin Dashboard & Analytics](#9-admin-dashboard--analytics)
  - [10. Admin Customer Management](#10-admin-customer-management)
  - [11. Admin Category Management](#11-admin-category-management)
  - [12. Admin Food Management](#12-admin-food-management)
  - [13. Admin Order Management](#13-admin-order-management)
- [Database Seed Data](#database-seed-data)
- [API Testing Guide](#api-testing-guide)
- [Deployment Instructions](#deployment-instructions)

---

## Project Overview

The CloudCraves backend powers the frontend application developed by Akanksha Hajare. It provides a stable, secure, and production-quality API contract for food catalog management, server-side price-verified order creation, order tracking, dual customer/admin authentication, and database-driven dashboard statistics.

---

## Technology Stack

- **Runtime Environment**: Node.js (v18+) & Express.js
- **Language**: TypeScript (v5.4+)
- **Database**: MongoDB with Mongoose ODM (v8.3+)
- **Authentication**: JWT (`jsonwebtoken`) & `bcrypt` password hashing
- **Security & Utilities**: CORS, `dotenv`, Centralized Error Middleware & Input Validators
- **Deployment Platform**: Render

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database connection (database.ts) & Environment loader (env.ts)
│   ├── controllers/     # Controller handlers (Auth, AdminAuth, User, Address, Restaurant, Food, Category, Order, AdminOrder, Review, Admin)
│   ├── models/          # Mongoose models (User, Admin, Restaurant, Category, Food, Address, Order, Review)
│   ├── routes/          # Express route definitions (authRoutes, adminAuthRoutes, userRoutes, addressRoutes, restaurantRoutes, foodRoutes, orderRoutes, reviewRoutes, adminRoutes)
│   ├── middleware/      # Middlewares (authMiddleware, adminMiddleware, errorMiddleware)
│   ├── validators/      # Validation rules (authValidator, foodValidator, orderValidator, reviewValidator)
│   ├── services/        # Business logic & Aggregations (authService, restaurantService, orderService, reviewService, adminService)
│   ├── utils/           # Response helpers (response.ts), Token generator (generateToken.ts), Seed script (seed.ts)
│   ├── app.ts           # Express application configuration & Middleware mounting
│   ├── server.ts        # Server startup & Database connection entrypoint
│   └── seed.ts          # Root alias for seed execution
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Installation

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Install Required Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment File**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

---

## Environment Variables

Configure `.env` with appropriate environment variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `5000` |
| `MONGODB_URI` | MongoDB connection URI string | `mongodb://localhost:27017/cloudcraves` |
| `JWT_SECRET` | Secret key for signing customer & admin JWTs | `dev_jwt_secret_ad_tech_cloudcraves_2026_key` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |

> **Note**: Never commit `.env` containing sensitive credentials to source control. `.env` is listed in `.gitignore`.

---

## Running the Backend

Execute the scripts defined in `package.json`:

- **Development Server** (Hot reload with `ts-node-dev`):
  ```bash
  npm run dev
  ```
- **Run Seed Script** (Populates database with sample restaurant, categories, 20 food items, customers, admin, orders, reviews):
  ```bash
  npm run seed
  ```
- **Build TypeScript** (Compiles code into `dist/` folder):
  ```bash
  npm run build
  ```
- **Start Production Build**:
  ```bash
  npm start
  ```

---

## API Base URL

- **Local Development URL**: `http://localhost:5000`
- **Production Render URL (Placeholder)**: `https://<your-render-backend-url>`

---

## Response Contracts

### Success Response Format (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error Response Format (HTTP 400 / 401 / 403 / 404 / 409 / 500)
```json
{
  "success": false,
  "message": "Error explanation",
  "error": "ERROR_CODE"
}
```

---

## Authorization Matrix

- **Public Endpoints**: Restaurant info, operating settings, category list, food menu browsing, health check.
- **Customer Protected (`Authorization: Bearer <customer_jwt>`)**: User profile, delivery address CRUD, order placement, order history, order status tracking, submit review, user reviews.
- **Admin Protected (`Authorization: Bearer <admin_jwt>`)**: Admin dashboard, analytics, customer list/details, order listing, status transitions, order cancellations, category CRUD, food CRUD, review list.

---

## API Documentation

### 1. Health Check

#### `GET /api/health`
- **Authentication**: None (Public)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "CloudCraves Backend REST API is operational",
    "timestamp": "2026-08-15T12:00:00.000Z"
  }
  ```

---

### 2. Customer Authentication

#### `POST /api/auth/register`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "66bc610012a4b87e248a1005",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "addresses": []
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Email address is already registered",
    "error": "EMAIL_EXISTS"
  }
  ```

#### `POST /api/auth/login`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "66bc610012a4b87e248a1005",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "error": "INVALID_CREDENTIALS"
  }
  ```

---

### 3. Admin Authentication

#### `POST /api/admin/auth/login`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "admin@cloudcraves.com",
    "password": "admin123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Admin login successful",
    "data": {
      "admin": {
        "_id": "66bc610012a4b87e248a1001",
        "name": "Adarsh Admin",
        "email": "admin@cloudcraves.com",
        "role": "admin",
        "isActive": true
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

#### `GET /api/admin/auth/me`
- **Authentication**: Admin JWT Required (`Authorization: Bearer <admin_jwt>`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Admin profile fetched successfully",
    "data": {
      "_id": "66bc610012a4b87e248a1001",
      "name": "Adarsh Admin",
      "email": "admin@cloudcraves.com",
      "role": "admin"
    }
  }
  ```

---

### 4. Customer Profile & Addresses

#### `GET /api/users/me`
- **Authentication**: Customer JWT Required
- **Success Response (200 OK)**: Profile data without `passwordHash`.

#### `PUT /api/users/me`
- **Authentication**: Customer JWT Required
- **Request Body**: `{ "name": "John Updated", "phone": "9876543299" }`

#### `GET /api/users/addresses`
- **Authentication**: Customer JWT Required
- **Success Response (200 OK)**: List of delivery addresses owned by the authenticated customer.

#### `POST /api/users/addresses`
- **Authentication**: Customer JWT Required
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "9876543210",
    "house": "Flat 402, Green Heights",
    "street": "Station Road",
    "area": "Central Market",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001",
    "landmark": "Near SBI Bank",
    "addressType": "Home"
  }
  ```

#### `PUT /api/users/addresses/:id`
- **Authentication**: Customer JWT Required (Strict ownership check)

#### `DELETE /api/users/addresses/:id`
- **Authentication**: Customer JWT Required (Strict ownership check)

---

### 5. Restaurant & Settings

#### `GET /api/restaurant`
- **Authentication**: None (Public)
- **Success Response (200 OK)**: Returns restaurant info (name, logo, description, phone, address, city, state, pincode, openingTime, closingTime, isOpen, deliveryAvailable, minimumOrder, deliveryCharge).

#### `GET /api/restaurant/settings`
- **Authentication**: None (Public)
- **Success Response (200 OK)**: Returns opening/closing times, delivery availability, minimum order, and delivery charge.

#### `GET /api/restaurant/menu`
- **Authentication**: None (Public)
- **Success Response (200 OK)**: Structured menu array grouped by categories.

#### `GET /api/restaurant/categories`
- **Authentication**: None (Public)
- **Success Response (200 OK)**: Active categories list sorted by `sortOrder`.

#### `PUT /api/restaurant`
- **Authentication**: Admin JWT Required
- **Request Body**: Fields to update in restaurant settings.

---

### 6. Food & Menu Browsing

#### `GET /api/foods`
- **Authentication**: None (Public)
- **Query Parameters**:
  - `category` (string, category name or ObjectId) e.g., `/api/foods?category=biryani`
  - `search` (string, text search in name/description) e.g., `/api/foods?search=paneer`
  - `veg` (boolean) e.g., `/api/foods?veg=true`
  - `available` (boolean) e.g., `/api/foods?available=true`
- **Success Response (200 OK)**: Array of matching food items.

#### `GET /api/foods/:id`
- **Authentication**: None (Public)
- **Success Response (200 OK)**: Details of specific food item with populated category details.

---

### 7. Customer Orders

#### `POST /api/orders`
- **Authentication**: Customer JWT Required
- **Server Price Guard**: Food prices sent by client are IGNORED. The server fetches current prices from MongoDB, verifies availability, and calculates subtotal, delivery charge, 5% tax, and final total amount.
- **Request Body**:
  ```json
  {
    "items": [
      { "foodId": "66bc62f912a4b87e248a101a", "quantity": 2 },
      { "foodId": "66bc62f912a4b87e248a101b", "quantity": 1 }
    ],
    "addressId": "66bc63e012a4b87e248a1020",
    "orderType": "DELIVERY",
    "paymentMethod": "COD",
    "specialInstructions": "Deliver near main gate."
  }
  ```
- **Success Response (201 Created)**: Created order document containing snapshot of verified items, address, order status (`PLACED`), and payment status (`COD`).

#### `GET /api/orders`
- **Authentication**: Customer JWT Required (Returns authenticated user's order history).

#### `GET /api/orders/:id`
- **Authentication**: Customer JWT Required (Strict ownership check prevents cross-account access).

#### `GET /api/orders/:id/status`
- **Authentication**: Customer JWT Required
- **Success Response (200 OK)**: Returns `{ orderId, orderStatus, paymentStatus, paymentMethod, estimatedDeliveryTime, createdAt, updatedAt }`.

---

### 8. Customer & Admin Reviews

#### `POST /api/reviews`
- **Authentication**: Customer JWT Required
- **Eligibility Checks**: Order must belong to user, order must be `DELIVERED`, food item must be part of order, duplicate review for same user/order/food is blocked with `409 REVIEW_ALREADY_EXISTS`.
- **Request Body**:
  ```json
  {
    "orderId": "66bc649112a4b87e248a1030",
    "foodId": "66bc62f912a4b87e248a101a",
    "foodRating": 5,
    "serviceRating": 5,
    "comment": "Delicious food!"
  }
  ```

#### `GET /api/reviews`
- **Authentication**: Customer JWT Required (Returns user's reviews).

#### `GET /api/admin/reviews`
- **Authentication**: Admin JWT Required (Returns all customer reviews with populated user, order, and food details).

---

### 9. Admin Dashboard & Analytics

#### `GET /api/admin/dashboard`
- **Authentication**: Admin JWT Required
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Dashboard data fetched successfully",
    "data": {
      "totalOrders": 12,
      "pendingOrders": 3,
      "preparingOrders": 2,
      "completedOrders": 6,
      "todayRevenue": 1420.00,
      "monthlyRevenue": 8450.00,
      "popularFoodItems": [
        { "foodId": "...", "name": "Paneer Biryani", "price": 220, "totalQuantity": 15, "totalRevenue": 3300 }
      ],
      "recentOrders": []
    }
  }
  ```

#### `GET /api/admin/analytics`
- **Authentication**: Admin JWT Required
- **Success Response (200 OK)**: Returns aggregate metrics and order status breakdown.

---

### 10. Admin Customer Management

#### `GET /api/admin/customers`
- **Authentication**: Admin JWT Required
- **Success Response (200 OK)**: List of all customers with computed order counts, total spending, last order, and account status (`Active`).

#### `GET /api/admin/customers/:id`
- **Authentication**: Admin JWT Required
- **Success Response (200 OK)**: Customer profile details, order history, addresses, and total spending.

---

### 11. Admin Category Management

- `GET /api/admin/categories` (Admin JWT)
- `POST /api/admin/categories` (Admin JWT, `{ "name": "Snacks", "description": "...", "image": "...", "isActive": true, "sortOrder": 1 }`)
- `PUT /api/admin/categories/:id` (Admin JWT)
- `DELETE /api/admin/categories/:id` (Admin JWT)

---

### 12. Admin Food Management

- `GET /api/admin/foods` (Admin JWT)
- `POST /api/admin/foods` (Admin JWT, `{ "name": "Food", "categoryId": "...", "price": 100, ... }`)
- `GET /api/admin/foods/:id` (Admin JWT)
- `PUT /api/admin/foods/:id` (Admin JWT)
- `DELETE /api/admin/foods/:id` (Admin JWT)

---

### 13. Admin Order Management

#### `GET /api/admin/orders`
- **Authentication**: Admin JWT Required (Returns all platform orders, newest first).

#### `GET /api/admin/orders/:id`
- **Authentication**: Admin JWT Required

#### `PATCH /api/admin/orders/:id/status`
- **Authentication**: Admin JWT Required
- **Supported Order Statuses**: `PLACED`, `ACCEPTED`, `PREPARING`, `READY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
- **Status Transition Rules**: Enforces valid progression (`PLACED` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `OUT_FOR_DELIVERY` -> `DELIVERED`). Blocks terminal state modifications (`DELIVERED` & `CANCELLED`).
- **Request Body**: `{ "status": "ACCEPTED" }`

#### `PATCH /api/admin/orders/:id/cancel`
- **Authentication**: Admin JWT Required (Cancels order if not already DELIVERED or CANCELLED).

---

## Database Seed Data

Run the database seed script:
```bash
npm run seed
```

**Seed Artifacts Created**:
- 1 Restaurant (`CloudCraves Kitchen`)
- 8 Categories (`Breakfast`, `Meals`, `Biryani`, `Snacks`, `Fast Food`, `Beverages`, `Desserts`, `Specials`)
- 20 Food Items (Realistic local menu items)
- 3 Customer Accounts (`john@example.com`, `akanksha@example.com`, `rahul@example.com` / Password: `password123`)
- 2 Admin Accounts (`admin@cloudcraves.com` [admin], `owner@cloudcraves.com` [owner] / Password: `admin123`)
- 2 Customer Addresses
- 3 Orders (`DELIVERED`, `PREPARING`, `PLACED`)
- 2 Reviews

---

## API Testing Guide

1. **Start Backend Server**:
   ```bash
   npm run dev
   ```
2. **Run Automated Integration Test Suite**:
   Executes automated flow tests for all 20 backend test suites:
   ```bash
   npm run test
   ```
3. **Execute Customer Login**:
   Send `POST http://localhost:5000/api/auth/login` with `{ "email": "john@example.com", "password": "password123" }` to retrieve JWT token.
4. **Execute Admin Login**:
   Send `POST http://localhost:5000/api/admin/auth/login` with `{ "email": "admin@cloudcraves.com", "password": "admin123" }` to retrieve Admin JWT token.
5. **Attach Token in Headers**:
   For protected endpoints, add request header:
   ```http
   Authorization: Bearer <YOUR_JWT_TOKEN>
   ```

---

## Test Verification Report (Stage 15)

| Test Area | Endpoint / Flow | Expected Behavior | Verification Status |
| :--- | :--- | :--- | :---: |
| **System Health** | `GET /api/health` | HTTP 200 with `success: true` | **PASS** |
| **Customer Registration** | `POST /api/auth/register` | HTTP 201 with JWT token & no passwordHash | **PASS** |
| **Customer Login** | `POST /api/auth/login` | HTTP 200 with JWT token | **PASS** |
| **Admin Login** | `POST /api/admin/auth/login` | HTTP 200 with Admin JWT token | **PASS** |
| **Customer Profile** | `GET /api/users/me` | HTTP 200 user data without passwordHash | **PASS** |
| **Restaurant Info** | `GET /api/restaurant` | HTTP 200 returning restaurant info | **PASS** |
| **Food Catalog Filters** | `GET /api/foods?veg=true` | HTTP 200 returning filtered food items | **PASS** |
| **Address Creation** | `POST /api/users/addresses` | HTTP 201 returning address object | **PASS** |
| **Order Server Price Guard** | `POST /api/orders` (Price Tamper Attack) | Server ignores client price 1, calculates DB price | **PASS** |
| **Customer Order History** | `GET /api/orders` | HTTP 200 returning array of customer orders | **PASS** |
| **Customer Order Tracking** | `GET /api/orders/:id/status` | HTTP 200 returning status `PLACED` | **PASS** |
| **Admin Order Listing** | `GET /api/admin/orders` | HTTP 200 returning all platform orders | **PASS** |
| **Admin Status Transition** | `PATCH /api/admin/orders/:id/status` | HTTP 200 updating status to `ACCEPTED` | **PASS** |
| **Invalid Transition Guard** | `PATCH /api/admin/orders/:id/status` | HTTP 400 with `INVALID_STATUS_TRANSITION` | **PASS** |
| **Review Creation** | `POST /api/reviews` | HTTP 201 Created on `DELIVERED` order | **PASS** |
| **Duplicate Review Guard** | `POST /api/reviews` (Duplicate Check) | HTTP 409 Conflict with `REVIEW_ALREADY_EXISTS` | **PASS** |
| **Admin Dashboard** | `GET /api/admin/dashboard` | HTTP 200 returning aggregated database stats | **PASS** |
| **Admin Customer Management** | `GET /api/admin/customers` | HTTP 200 customer list without passwordHash | **PASS** |
| **Role Authorization Guard** | `GET /api/admin/dashboard` (Customer Token) | HTTP 403 Forbidden | **PASS** |
| **Central 404 Handler** | `GET /api/unknown-nonexistent-route` | HTTP 404 Route Not Found | **PASS** |

**Summary**: 20 / 20 Test Suites Passed (100% Success Rate).

---

## Deployment Instructions

1. **Render Deployment Configuration**:
   - Environment: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
2. **Set Render Environment Variables**:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<your_mongodb_atlas_connection_string>`
   - `JWT_SECRET`: `<production_jwt_secret>`
   - `CLIENT_URL`: `<deployed_vercel_frontend_url>`

