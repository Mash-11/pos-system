# 🍱 Ronin Chopsticks — Point of Sale System

![Ronin Chopsticks](frontend/images/logo-circle.png)

> A full-featured web-based Point of Sale (POS) system built for **Ronin Chopsticks**.  
> Submitted as a project for **Survey of Programming Languages**.

---

## 👨‍💻 Developer

| Field | Details |
|-------|---------|
| **Name** | Martin Afful |
| **Project** | Survey of Programming Languages |
| **System** | Ronin Chopsticks POS System |

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT (JSON Web Tokens) |
| Password Security | bcryptjs |

---

## 📋 Features

### ✅ Module 1 — Authentication System
- Secure login with JWT tokens
- Three user roles: **Admin**, **Manager**, **Cashier**
- Password hashing with bcryptjs
- Role-based access control

### ✅ Module 2 — Product Management
- Add, edit, delete products
- Product categories
- Barcode support
- Stock tracking per product

### ✅ Module 3 — Inventory Management
- Real-time stock level tracking
- Manual stock adjustments
- Low stock alerts
- Adjustment history log
- Automatic stock deduction after every sale

### ✅ Module 4 — Sales Processing
- Full cashier POS screen
- Product search and category filtering
- Add to cart, adjust quantities
- Discount application
- Real-time total calculation

### ✅ Module 5 — Payment Processing
- Cash payment with change calculation
- Mobile Money support
- Card payment support
- Payment record storage

### ✅ Module 6 — Customer Management
- Register and manage customers
- Purchase history tracking
- Loyalty points system
- Search and filter customers

### ✅ Module 7 — Receipt Generation
- Auto-generated receipt after every sale
- Receipt shows: store name, transaction ID,
  date/time, items, totals, payment method
- Print receipt functionality

### ✅ Module 8 — Reporting & Analytics
- Daily sales revenue chart
- Payment methods breakdown (doughnut chart)
- Top selling products report
- Recent transactions log
- Cashier performance report
- Filterable by 7 / 30 / 90 / 365 days

---

## 🗄️ Database Schema
```
Users         — staff accounts and roles
Products      — items sold in the system
Customers     — registered customer profiles
Sales         — every transaction record
Sales_Items   — individual items per transaction
Inventory     — stock adjustment history
Payments      — payment records per sale
```

---

## 📁 Project Structure
```
pos-system/
├── backend/
│   ├── config/
│   │   └── db.js               # MySQL connection
│   ├── database/
│   │   └── schema.sql          # All 7 database tables
│   ├── routes/
│   │   ├── auth.routes.js      # Login / logout
│   │   ├── products.routes.js  # Product CRUD
│   │   ├── sales.routes.js     # Sales processing
│   │   ├── inventory.routes.js # Stock management
│   │   ├── customers.routes.js # Customer CRUD
│   │   └── reports.routes.js   # Analytics queries
│   ├── .env                    # Environment variables
│   ├── server.js               # Express entry point
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css           # Global styles
│   ├── images/                 # Logo assets
│   ├── js/                     # Frontend scripts
│   ├── index.html              # Login page
│   ├── pos.html                # Cashier screen
│   ├── products.html           # Product management
│   ├── inventory.html          # Inventory management
│   ├── customers.html          # Customer management
│   ├── reports.html            # Reports dashboard
│   └── receipts.html           # Receipt page
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/pos-system.git
cd pos-system
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Set up the database
- Open MySQL Workbench
- Create a database called `pos_db`
- Run `backend/database/schema.sql`

### 4. Configure environment variables
Create a `.env` file inside the `backend` folder:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pos_db
JWT_SECRET=pos_super_secret_key_2024
PORT=3000
```

### 5. Start the server
```bash
cd backend
node server.js
```

### 6. Open the app
Go to `http://localhost:3000` in your browser.

---

## 🔐 Default Login

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |

---

## 🏗️ System Architecture
```
┌─────────────────┐     HTTP/REST     ┌──────────────────┐
│   FRONTEND      │ ◄───────────────► │    BACKEND       │
│  HTML/CSS/JS    │                   │  Node.js/Express │
│  localhost:3000 │                   │  localhost:3000  │
└─────────────────┘                   └────────┬─────────┘
                                               │
                                               ▼
                                      ┌──────────────────┐
                                      │    DATABASE      │
                                      │      MySQL       │
                                      │     pos_db       │
                                      └──────────────────┘
```

---

## 📄 License

This project was built for educational purposes as part of a
**Survey of Programming Languages** course submission.

© 2025 Martin Afful — All rights reserved.