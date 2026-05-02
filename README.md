# 🏍️ MotoMart — Motorcycle Marketplace API

A complete backend API for a motorcycle marketplace built with **Next.js 16 App Router**, **Prisma**, **NextAuth v5**, and **PostgreSQL**.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (JWT strategy)
- **File Upload:** Cloudinary
- **Validation:** Zod
- **Password Hashing:** bcryptjs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for photo uploads)

### 1. Clone & Install

```bash
git clone <repo-url>
cd faiz-motor-nextjs
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/motomart?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

> 💡 Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

## 📧 Default Accounts

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@motomart.com | admin123 |
| User  | budi@example.com   | user123  |

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint                   | Description           | Auth     |
|--------|----------------------------|-----------------------|----------|
| POST   | `/api/auth/register`       | Register new user     | Public   |
| POST   | `/api/auth/callback/credentials` | Login (NextAuth) | Public   |
| GET    | `/api/auth/me`             | Get current user      | Required |

### 🏍️ Motors

| Method | Endpoint                   | Description           | Auth     |
|--------|----------------------------|-----------------------|----------|
| GET    | `/api/motors`              | List motors (filtered)| Public   |
| GET    | `/api/motors/:id`          | Motor detail          | Public   |
| POST   | `/api/motors`              | Create motor          | Admin    |
| PUT    | `/api/motors/:id`          | Update motor          | Admin    |
| DELETE | `/api/motors/:id`          | Delete motor          | Admin    |
| PATCH  | `/api/motors/:id/status`   | Update status         | Admin    |

**Query Params for GET /api/motors:**
`brand`, `condition`, `status`, `minPrice`, `maxPrice`, `year`, `sort` (newest/oldest/price_asc/price_desc/popular), `page`, `limit`

### 📸 Photos

| Method | Endpoint                        | Description        | Auth  |
|--------|---------------------------------|--------------------|-------|
| POST   | `/api/motors/:id/photos`        | Upload photos      | Admin |
| DELETE | `/api/photos/:photoId`          | Delete photo       | Admin |
| PATCH  | `/api/photos/:photoId/primary`  | Set as primary     | Admin |

### ⭐ Reviews

| Method | Endpoint                        | Description          | Auth     |
|--------|---------------------------------|----------------------|----------|
| GET    | `/api/motors/:id/reviews`       | Motor reviews        | Public   |
| POST   | `/api/motors/:id/reviews`       | Submit review        | Required |
| GET    | `/api/reviews`                  | All reviews          | Admin    |
| PATCH  | `/api/reviews/:id/moderate`     | Approve/reject       | Admin    |
| DELETE | `/api/reviews/:id`              | Delete review        | Admin    |

### 🛒 Saved Motors

| Method | Endpoint               | Description          | Auth     |
|--------|------------------------|----------------------|----------|
| GET    | `/api/saved`           | My saved motors      | Required |
| POST   | `/api/saved`           | Save motor           | Required |
| DELETE | `/api/saved/:motorId`  | Remove saved         | Required |

### 👥 User Management

| Method | Endpoint                | Description          | Auth  |
|--------|-------------------------|----------------------|-------|
| GET    | `/api/users`            | List users           | Admin |
| PATCH  | `/api/users/:id/status` | Block/activate user  | Admin |

### 📊 Dashboard

| Method | Endpoint                  | Description            | Auth  |
|--------|---------------------------|------------------------|-------|
| GET    | `/api/dashboard/stats`    | Statistics overview    | Admin |
| GET    | `/api/dashboard/chart`    | Monthly sales chart    | Admin |
| GET    | `/api/dashboard/popular`  | Top 5 popular motors   | Admin |

## 📋 API Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error details",
  "message": "Human-readable message"
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "message": "Success"
}
```

## 📁 Project Structure

```
src/
├── proxy.ts                    # Route protection (Next.js 16)
├── app/api/                    # All API route handlers
│   ├── auth/                   # Authentication
│   ├── motors/                 # Motor CRUD
│   ├── photos/                 # Photo management
│   ├── reviews/                # Review system
│   ├── saved/                  # Saved/wishlist
│   ├── users/                  # User management
│   └── dashboard/              # Admin dashboard
├── lib/                        # Utilities
│   ├── prisma.ts               # Prisma singleton
│   ├── auth.ts                 # NextAuth config
│   ├── cloudinary.ts           # Cloudinary helpers
│   ├── api-response.ts         # Response helpers
│   ├── rate-limit.ts           # Rate limiter
│   └── validations/            # Zod schemas
└── types/
    └── index.ts                # Global types
prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed data
```

## 🔒 Security Features

- **JWT Authentication** via NextAuth v5
- **Role-based Access Control** (ADMIN / USER)
- **Rate Limiting** on auth endpoints
- **Input Validation** with Zod on every endpoint
- **Password Hashing** with bcryptjs (12 rounds)
- **Route Protection** via Next.js 16 Proxy
- **CORS Headers** configured for API routes
