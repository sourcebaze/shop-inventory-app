# StockWise

**Smart Inventory. Simple Management.**

StockWise is a full-stack shop inventory and retail management system built as a 3MTT Software Development capstone project. The application is intentionally focused on the core inventory workflow: **Items, Stock and Alerts**, with practical business features such as authentication, sales, reports and role-based access.

## Core 3MTT Requirements

| Requirement | StockWise implementation                                                             |
| ----------- | ------------------------------------------------------------------------------------ |
| Items       | Product CRUD, search, category/supplier filters, pagination, soft delete and restore |
| Stock       | Stock in, stock out, adjustments and stock audit history                             |
| Alerts      | Low-stock and out-of-stock badges, counts and notifications                          |

> This version is intentionally a **local-development project**. Publishing/deployment configuration and deployment instructions have been excluded.

## Features

- User registration and JWT login
- Owner, Manager and Staff role-based access
- Product management
- Product categories
- Suppliers
- Customers and Walk-in Customer
- Stock In, Stock Out and Stock Adjustment
- Stock audit history
- Low-stock and out-of-stock alerts
- POS-style sales workflow
- Automatic stock reduction after sales
- Sales history
- Print-friendly invoices
- Dashboard metrics and charts
- Inventory and sales reports
- Search, filtering, sorting and pagination
- Soft delete and product restoration
- User management
- Profile and shop settings
- Light and dark themes
- Responsive mobile, tablet and desktop UI
- Subtle UI transitions and interaction animations
- Installable PWA shell
- MongoDB transaction for sales where supported, with a development fallback

## Tech Stack

### Frontend

- React + Vite
- JavaScript
- React Router
- Tailwind CSS
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Joi
- CORS
- dotenv

## Project Structure

```text
StockWise/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validators/
├── docs/
└── README.md
```

## Requirements

- Node.js 20+ recommended
- MongoDB Atlas or a local MongoDB instance
- npm

## Installation

### 1. Backend

Open a terminal:

```bash
cd backend
npm install
```

Create `.env` from `.env.example`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Configure:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockwise?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Health endpoint:

```text
GET http://localhost:5000/api/health
```

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

## MongoDB Setup

1. Create a MongoDB database.
2. Create a database user.
3. Copy the MongoDB connection string.
4. Put it in `backend/.env` as `MONGODB_URI`.
5. Ensure the MongoDB server is reachable from your development machine.
6. Never commit `.env`.

## Demo Data

After configuring `backend/.env`, run the seed command only against a development database. It clears existing application data before creating the demo users and records:

```bash
cd backend
npm run seed
```

Optional seed variables:

```env
SEED_PASSWORD=StockWise123!
SEED_OWNER_EMAIL=owner@stockwise.local
SEED_MANAGER_EMAIL=manager@stockwise.local
SEED_STAFF_EMAIL=staff@stockwise.local
```

The seed creates realistic products such as Rice, Sugar, Milk, Milo, Soap, Bread, Vegetable Oil and Detergent.

The demo email addresses and password above are created only when `npm run seed` completes successfully. If the database already contains users, use an existing account or change the optional seed variables before reseeding; the application does not reset an existing owner password during registration.

## User Roles

### Owner

Full access, including user management, settings, product restoration and reports.

### Manager

Can manage inventory, catalog records, customers, stock, sales and reports. Manager permissions cannot change owner privileges.

### Staff

Can view products and stock, create sales, view relevant sales information and view alerts. Restricted administrative operations are enforced by the backend.

### First-user rule

Public registration cannot select a role. If there are zero users, the first registered user becomes `owner`. Later public registrations become `staff`.

## API Overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Users

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/status`
- `DELETE /api/users/:id`

### Products

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `PATCH /api/products/:id/restore`

### Catalog

- `/api/categories`
- `/api/suppliers`
- `/api/customers`

### Stock

- `POST /api/stock/in`
- `POST /api/stock/out`
- `POST /api/stock/adjust`
- `GET /api/stock/history`

### Sales

- `POST /api/sales`
- `GET /api/sales`
- `GET /api/sales/:id`

### Alerts

- `GET /api/alerts`
- `PATCH /api/alerts/read`

### Reports

- `GET /api/reports/dashboard`
- `GET /api/reports/sales`
- `GET /api/reports/inventory`

## UI and Interaction Design

The frontend uses a modern business-dashboard visual system:

- Soft neutral page background
- Elevated white/dark surfaces
- Deep blue primary actions
- Rounded controls and cards
- Responsive navigation
- Subtle hover and press states
- Page entrance transitions
- Staggered dashboard card animation
- Reduced-motion support for accessibility
- Responsive tables and forms
- Dark mode
- Mobile drawer navigation

Animations are deliberately restrained so they improve perceived responsiveness without distracting from inventory operations.

## Testing Checklist

- Register first user
- Login and logout
- Test invalid credentials
- Test duplicate email
- Test role restrictions
- Add/edit/delete/restore product
- Search and filter products
- Perform stock in/out/adjustment
- Verify stock history
- Verify low-stock alerts
- Verify out-of-stock alerts
- Create a multi-item sale
- Verify automatic stock reduction
- Print an invoice
- Review sales history
- Review reports
- Test mobile layout
- Test dark mode
- Run a production frontend build

## Useful Commands

From `backend`:

```bash
npm run dev
npm start
npm run seed
```

From `frontend`:

```bash
npm run dev
npm run build
npm run preview
```

From the project root:

```bash
npm run backend
npm run frontend
npm run build
```

## Security Notes

- Passwords are hashed with bcryptjs.
- JWT secrets are stored in environment variables.
- Backend role authorization is enforced independently of frontend visibility.
- Password fields are excluded from user API responses.
- Validation is handled with Joi.
- `.env` files are ignored by Git.

## Known Local-Development Limitation

MongoDB transactions require an environment that supports MongoDB sessions/transactions. StockWise uses a transaction when available and a controlled fallback for development environments where transactions are unavailable.

## Author

**Awoh Cosmas Obinna**

3MTT Software Development Capstone — StockWise
