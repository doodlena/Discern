# 🛠️ DISCERN Local Development Setup

Quick start guide for running DISCERN locally.

---

## Prerequisites

Install these first:

- **Node.js 18+** ([download](https://nodejs.org))
- **PostgreSQL 14+** ([download](https://www.postgresql.org/download/))
- **Git** ([download](https://git-scm.com/downloads))
- **Anthropic API Key** ([get one](https://console.anthropic.com))

---

## Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd discern
```

---

## Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd extension && npm install && cd ..
cd shared && npm install && cd ..
```

---

## Step 3: Database Setup

### Create Database

```bash
# Using PostgreSQL CLI
createdb discern

# Or using psql
psql postgres
CREATE DATABASE discern;
\q
```

### Run Migrations

```bash
cd database
psql discern -f migrations/001_initial_schema.sql
psql discern -f seeds/demo_content.sql
cd ..
```

### Verify Database

```bash
psql discern
\dt  # List tables - you should see Analysis, User, etc.
\q
```

---

## Step 4: Configure Environment Variables

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://localhost:5432/discern"
ANTHROPIC_API_KEY="sk-ant-your-key-here"
JWT_SECRET="your-random-secret-string"
PORT=3001
NODE_ENV=development
ADMIN_PASSWORD="admin123"  # Change this!
FRONTEND_URL="http://localhost:3000"
```

### Frontend Configuration

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5: Build Shared Package

```bash
cd ../shared
npm run build
cd ..
```

---

## Step 6: Start Development Servers

### Option 1: Run All Services (Recommended)

```bash
# From root directory
npm run dev
```

This starts:
- Backend on http://localhost:3001
- Frontend on http://localhost:3000

### Option 2: Run Services Individually

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Step 7: Test the Application

### Test Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Should return: {"status":"healthy",...}
```

### Test Frontend

Open http://localhost:3000 in your browser

You should see the DISCERN landing page!

### Test Analysis

1. Go to http://localhost:3000/analyze
2. Try demo mode or paste a URL
3. Click "Analyze Content"

---

## Step 8: Install Browser Extension (Optional)

### Chrome

1. **Build Extension**
   ```bash
   cd extension
   npm run build
   ```

2. **Load in Chrome**
   - Open Chrome
   - Go to `chrome://extensions`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select `discern/extension` folder

3. **Test Extension**
   - Navigate to any website
   - Click DISCERN extension icon
   - Click "Analyze This Page"

---

## Step 9: Access Admin Dashboard

1. Go to http://localhost:3000/admin
2. Enter password: `admin123` (or whatever you set in `.env`)
3. View analytics and stats

---

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql discern

# Verify DATABASE_URL in backend/.env
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Claude API Error

- Verify API key is valid
- Check key in `backend/.env`
- Ensure no extra spaces or quotes

### NPM Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Shared Package Not Found

```bash
# Rebuild shared package
cd shared
npm run build
cd ..

# Reinstall in other packages
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## Development Tips

### Hot Reload

- Frontend: Changes auto-reload (Next.js fast refresh)
- Backend: Changes auto-restart (tsx watch)

### Database Changes

After modifying schema:

```bash
cd database
psql discern -f migrations/new_migration.sql
```

### Debugging

**Backend Logs:**
```bash
cd backend
npm run dev  # Logs appear in console
```

**Frontend:**
- Open browser DevTools (F12)
- Check Console and Network tabs

**Database Queries:**
```bash
psql discern
SELECT * FROM "Analysis" LIMIT 5;
```

---

## Project Structure Overview

```
discern/
├── frontend/          # Next.js app
│   ├── app/          # Pages (landing, analyze, admin)
│   ├── components/   # React components
│   └── lib/          # API client
├── backend/          # Express API
│   ├── src/
│   │   ├── api/     # Route handlers
│   │   ├── services/# Business logic (Claude, PDF, DB)
│   │   └── middleware/
├── extension/        # Browser extension
│   ├── popup/       # Extension popup UI
│   ├── content/     # Page injection scripts
│   └── background/  # Service worker
├── database/         # PostgreSQL schema
│   ├── migrations/  # SQL migrations
│   └── seeds/       # Demo data
└── shared/           # Shared TypeScript types
    ├── types/
    ├── utils/
    └── constants/
```

---

## Quick Commands

```bash
# Start everything
npm run dev

# Build for production
npm run build

# Run database migrations
npm run db:migrate

# Seed demo data
npm run db:seed

# Build extension
cd extension && npm run build

# Clean everything
rm -rf */node_modules */.next */dist
```

---

## Next Steps

- ✅ Development environment ready!
- 📚 Read API documentation in `backend/API.md`
- 🎨 Customize UI in `frontend/components`
- 🧪 Add tests
- 🚀 Deploy to production (see `DEPLOYMENT.md`)

---

## Getting Help

- Check existing issues
- Review documentation
- Test with demo mode first
- Check browser/terminal console for errors

Happy coding! 🎉
