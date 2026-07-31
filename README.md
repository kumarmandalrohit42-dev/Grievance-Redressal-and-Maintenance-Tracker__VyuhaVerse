# CampusCare AI - Smart Campus Grievance & Maintenance System

CampusCare AI is structured into a clean, 3-tier architecture with dedicated directories for **Frontend**, **Backend**, and **Database**.

---

## 📂 Repository Structure

```
├── frontend/             # React 18 + TypeScript + Vite + Tailwind CSS UI
│   ├── src/              # Application components, contexts, and pages
│   ├── index.html        # Vite entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite build config
│
├── backend/              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── controllers/  # API business logic
│   │   ├── routes/       # Endpoint definitions (/api/complaints, /api/auth, /api/admin, /api/ai)
│   │   ├── middleware/   # Authentication & error handling
│   │   └── server.ts     # Express app entry point
│   ├── package.json      # Backend dependencies
│   └── .env.example      # Environment variables template
│
└── database/             # Relational Database Schema & Data Models
    ├── schema.sql        # Native SQL schema definitions
    ├── prisma/           # Prisma ORM models
    ├── seeds/            # Initial dataset SQL scripts
    └── README.md         # Database documentation
```

---

## ⚡ Quick Start

### 1. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2. Run Backend API

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Database

Refer to `database/README.md` to load `schema.sql` and `seeds/seed_data.sql` into your database.
