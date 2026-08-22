# PlacementIQ — AI Placement Readiness Platform

PlacementIQ is a placement readiness prediction and assessment platform built with Next.js, Drizzle ORM, and PostgreSQL.

## Features

- **Transactional Registration**: Atomic account creation, profile setup, and welcome notifications.
- **Idempotent Onboarding**: Readiness scoring and roadmap generation decoupled from database lock transactions to eliminate double submission issues.
- **Role-Based Server Route Protection**: Protected routes (`/dashboard`, `/onboarding`, etc.) enforced via server middleware & layout authentication checks.
- **Resilient API & Exception Boundaries**: Structured JSON API response handlers and React Error Boundaries (`error.tsx`, `global-error.tsx`).

---

## Setup & Local Installation

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **PostgreSQL**: Local PostgreSQL server running on port `5432` or a remote PostgreSQL connection (Neon/Supabase).

### 2. Environment Configuration
Copy `.env.example` to create `.env.local`:

```bash
cp .env.example .env.local
```

Ensure your `DATABASE_URL` and `JWT_SECRET` are correctly configured in `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/placementiq"
JWT_SECRET="placementiq-dev-secret-key-change-in-production-12345"
NODE_ENV="development"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Setup & Migrations

Push the Drizzle ORM schema to your PostgreSQL database:

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## End-to-End User Flow

```
Register (/register) -> Onboarding (/onboarding) -> Analyze & Compute -> Dashboard (/dashboard)
```

1. **Register**: Creates account, profile, welcome notification, and sets HttpOnly cookie.
2. **Onboarding**: Multi-step wizard collecting academic, technical, and career goals.
3. **Analyze**: Generates readiness score, skill breakdown, and tailored weekly roadmap.
4. **Dashboard**: Complete placement readiness dashboard with analytics, roadmap tasks, and action items.
