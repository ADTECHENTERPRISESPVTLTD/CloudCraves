# Cloud Kitchen Ordering Platform

Monorepo workspace for AD TECH Enterprises Task-04 containing both the frontend and backend applications.

## Directory Structure

- [frontend](file:///e:/Desktop%20E-Drive/AD%20Tech/CloudCraves/frontend) - Customer and Admin portal Next.js frontend application.
- [backend](file:///e:/Desktop%20E-Drive/AD%20Tech/CloudCraves/backend) - Node.js / Express / TypeScript backend API service.

---

## How to Start the Project

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (local service running on `mongodb://localhost:27017` or a remote connection string)

### 2. Frontend Setup & Run
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
Once started, the frontend is available at [http://localhost:3000](http://localhost:3000).

### 3. Backend Setup & Run
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed the database with mock data
npm run seed

# Run the backend server in development mode
npm run dev
```
Once started, the backend API is available at [http://localhost:5000](http://localhost:5000).

---

## Known Issues & Notes

### ⚠️ Backend Database Requirement (MongoDB Connection Failure)
If there is no local MongoDB instance active at `mongodb://localhost:27017/cloudcraves`, the backend server startup command (`npm run dev`) will hang while attempting to connect and will eventually crash with a `MongooseServerSelectionError`.

**How to resolve (if desired):**
1. Ensure your local MongoDB server is running:
   ```powershell
   # Windows PowerShell (as Admin)
   Start-Service MongoDB
   ```
2. Alternatively, copy the environment file and set a custom connection string in `backend/.env`:
   ```bash
   cp .env.example .env
   # Set MONGODB_URI to your database connection string in backend/.env
   ```

### ℹ️ Next.js Monorepo Root Warning
When starting the frontend dev server, you may see:
`Warning: Next.js ignored package-lock.json ... because it is outside the current Git repository`. 
This warning can be ignored as it does not affect execution, or resolved by setting `turbopack.root` in [next.config.ts](file:///e:/Desktop%20E-Drive/AD%20Tech/CloudCraves/frontend/next.config.ts).

