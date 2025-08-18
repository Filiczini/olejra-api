# 📦 Olejra Backend

> Simple backend for the **Olejra** project — a lightweight Jira-like board.  
> Built with **Node.js + Fastify**, serves as API for the frontend.

---

## 🚀 Tech Stack

- **Node.js 20**  
- **Fastify**  
- (planned) **PostgreSQL + Prisma**  
- (planned) **JWT authentication**

---

## 📂 Project Structure

```text
olejra-backend/
├─ src/
│  └─ index.js      # main server file
├─ package.json
├─ .gitignore
└─ README.md
```
---

## ▶️ Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/<user>/olejra-backend.git
   cd olejra-backend
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
## 🌐 API Endpoints (current)
```bash
GET / → { "message": "Olejra API is running" }
GET /health → { "ok": true }
```
---

## 🔮 Roadmap
```bash
Add CORS & dotenv
PostgreSQL integration (Neon/Supabase)
Prisma schema & migrations
Auth (login with JWT)
Tasks API (create, move forward, done)
```
---
