# StockMaster - SaaS Inventory & Sales System

A complete MERN stack (MongoDB, Express, React/Next.js, Node.js) web application with state-of-the-art Glassmorphism UI and Framer Motion animations.

## Features

- **Dashboard**: Recharts-based data visualization for revenue, profit, sales volume, and low stock metrics.
- **Inventory Management**: Full CRUD operations for products with search logic.
- **Sales Tracking**: Record sales and let the system automatically deduct stock and calculate profit margins.
- **Reports**: Beautiful Area/Bar charts mapping performance over time.
- **Authentication**: JWT-based security with bcrypt hashed passwords.
- **UI/UX**: Glassmorphism Neumorphic SaaS design, fully responsive, Dark/Light mode, Smooth micro-interactions.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Recharts, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT & bcrypt.

## Quick Start Setup

### Step 1: Start the Backend (API Server)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Make sure you have MongoDB running locally, or edit `backend/scripts/seed.js` and `backend/config/db.js` with your MongoDB URI.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the seed script to create initial data (admin user and initial products/sales):
   ```bash
   node scripts/seed.js
   ```
   *Login credentials created by seed:*
   **Email**: admin@example.com
   **Password**: password123
5. Start the backend DEV server:
   ```bash
   node server.js
   ```

### Step 2: Start the Frontend (Client App)
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000`. You will be redirected to the login page.
5. Login using: `admin@example.com` / `password123`.

*Enjoy the premium Stock Management dashboard!*
