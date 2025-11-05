# Olejra Backend

> Simple backend for the **Olejra** project — a lightweight Jira-like board.  
> Built with **Node.js + Fastify**, serves as API for the frontend.

---

## Tech Stack

- **Node.js 20**
- **Fastify**
- **PostgreSQL + Prisma**
- **JWT authentication**

---

## Project Structure

```text
olejra-backend/
├─ src/
│  └─ generated
│  └─ plugins
│  └─ routes
│  └─ server.js      # main server file
│  └─ test-db        # check db
├─ package.json
├─ .gitignore
└─ README.md
```

---

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/filiczini/olejra-api
   cd olejra-backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the server**
   ```bash
   # development mode (reload on changes)
   npm run dev
   # production mode
   npm start
   ```

---

## 🌐 API

### Flow

1. `POST /api/auth/login` → server signs JWT and sets **httpOnly** cookie
2. `GET /api/auth/me` (private) → verifies JWT from cookie via `req.jwtVerify({ onlyCookie: true })`, returns a minimal profile
3. `POST /api/auth/logout` → clears cookie

### Responses

```bash
- `200 OK` → `{ "ok": true }` + `Set-Cookie: olejra_token=...; HttpOnly; SameSite=Lax`
- `400 Bad Request` → AJV validation error (invalid email or password too short)
- `401 Unauthorized` → `{ "error": "Invalid credentials" }`
```

---

## Roadmap

```bash
[x] CORS & dotenv
[x] Cookie-based auth (`/api/auth/login`, `/me`, `/logout`)
[ ] Prisma schema & migrations for tasks
[ ] Tasks API (GET list, POST create, POST /:id/advance, mark done) — protected via preHandler
[ ] Swagger UI (optional)
```

---
