# ⚡ DISCERN Quick Start

Get DISCERN running in 5 minutes!

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Anthropic API Key

---

## 1️⃣ Setup Database

```bash
createdb discern
cd discern/database
psql discern -f migrations/001_initial_schema.sql
psql discern -f seeds/demo_content.sql
```

---

## 2️⃣ Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
# Default values should work for local development
```

---

## 3️⃣ Install & Build

```bash
# From root directory
npm install
cd shared && npm run build && cd ..
```

---

## 4️⃣ Start Servers

```bash
# From root directory
npm run dev
```

This starts:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

---

## 5️⃣ Test It!

1. Open http://localhost:3000
2. Click "Analyze Content"
3. Enable "Demo Mode"
4. Select a demo article
5. See instant results!

---

## 🎉 You're Ready!

**What to try:**
- Analyze a real URL
- Upload a PDF
- Check admin dashboard at /admin (password: `admin123`)
- Install browser extension

**Next steps:**
- Read `SETUP.md` for detailed setup
- Check `API.md` for API docs
- See `DEPLOYMENT.md` for production deployment

---

## Need Help?

**Common issues:**

**Port in use?**
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Database error?**
```bash
psql discern
\dt  # Should show tables
```

**API key error?**
- Check `backend/.env`
- Verify key at https://console.anthropic.com

---

Happy analyzing! 🔍
