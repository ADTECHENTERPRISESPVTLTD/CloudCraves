# CloudCraves Backend REST API

**AD TECH Enterprises Pvt. Ltd. - Internship Project Assignment (Task 04 Backend Development)**

CloudCraves is a complete REST API backend designed for local cloud kitchens, small restaurants, cafés, and food businesses operating in villages and smaller towns.

---

## Technology Stack

- **Runtime**: Node.js & Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Token (JWT) & bcrypt password hashing
- **Security**: CORS, Environment Secrets, Role-Based Access Control, Centralized Validation & Error Handling
- **Deployment**: Render

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # Environment configuration & MongoDB connection
│   ├── controllers/     # Express route handlers
│   ├── models/          # Mongoose data schemas (User, Admin, Restaurant, Category, Food, Address, Order, Review)
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, Admin, Validation, and Central Error middlewares
│   ├── validators/      # Modular input validation rules
│   ├── services/        # Business logic & Database aggregations
│   ├── utils/           # JWT generator, API response helpers, Seed script
│   ├── app.ts           # Express application initialization & middleware stack
│   └── server.ts        # Server entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Installation & Setup

1. **Clone the Repository & Navigate to Backend**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set appropriate variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cloudcraves
   JWT_SECRET=dev_jwt_secret_ad_tech_cloudcraves_2026_key
   CLIENT_URL=http://localhost:3000
   ```

4. **Run Database Seed Script**:
   Populate MongoDB with sample restaurant details, 8 categories, 20 food items, test customers, test admins, addresses, sample orders, and reviews:
   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Build TypeScript Codebase**:
   ```bash
   npm run build
   ```

---

## Sample Test Credentials

| Account Type | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `john@example.com` | `password123` | Customer Order, Profile, Address & Review APIs |
| **Customer** | `akanksha@example.com` | `password123` | Customer Order, Profile, Address & Review APIs |
| **Admin** | `admin@cloudcraves.com` | `admin123` | Full Admin Dashboard, Food, Orders & Analytics APIs |
| **Owner** | `owner@cloudcraves.com` | `admin123` | Full Owner & Restaurant Settings Management APIs |

---

## Seed Data Summary

Running `npm run seed` generates:
- **1 Restaurant**: `CloudCraves Kitchen`
- **8 Categories**: Breakfast, Meals, Biryani, Snacks, Fast Food, Beverages, Desserts, Specials
- **20 Food Items**: Realistic food dishes with prices, ingredients, prep times, spice levels, ratings, and vegetarian flags
- **3 Sample Customers**: John Doe, Akanksha Hajare, Rahul Sharma
- **2 Admins**: Adarsh Admin (admin), CloudCraves Owner (owner)
- **2 Addresses**: Pre-configured customer delivery addresses
- **3 Orders**: Sample orders across `DELIVERED`, `PREPARING`, and `PLACED` statuses
- **2 Reviews**: Ratings and customer comments on completed orders
