# 🚀 DISCERN Deployment Guide

## Quick Deploy to Railway (Recommended - 10 minutes)

Railway hosts everything in one place: backend, frontend, and PostgreSQL database.

### Step 1: Prepare Repository

1. **Initialize Git** (if not already done):
```bash
cd /Users/alex/Desktop/Claude/discern
git init
git add .
git commit -m "Initial commit - DISCERN credibility analyzer"
```

2. **Push to GitHub**:
   - Go to https://github.com/new
   - Create a new repository called `discern`
   - Don't add README, .gitignore, or license (we already have them)
   - Copy the commands shown and run them

### Step 2: Deploy on Railway

1. **Go to Railway**: https://railway.app (sign up with GitHub)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"** → Choose `discern`

#### Set Up PostgreSQL Database:
1. In your project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway will provision it automatically

#### Set Up Backend:
1. Click **"+ New"** → **"GitHub Repo"** → Select `discern`
2. Configure service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables** (Click "Variables" tab):
```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secure-random-string-here
ADMIN_PASSWORD=your-admin-password
FRONTEND_URL=will-add-after-frontend-deploy
```

4. **Generate Public Domain**:
   - Click "Settings" → "Networking" → "Generate Domain"
   - Copy the URL (e.g., `backend-production.up.railway.app`)

#### Set Up Frontend:
1. Click **"+ New"** → **"GitHub Repo"** → Select `discern` again
2. Configure service:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
NODE_ENV=production
```

4. **Generate Public Domain**:
   - Click "Settings" → "Networking" → "Generate Domain"
   - Copy the URL (e.g., `frontend-production.up.railway.app`)

5. **Update Backend FRONTEND_URL**:
   - Go back to backend service
   - Edit `FRONTEND_URL` to your frontend URL
   - Save (will auto-redeploy)

### Step 3: Run Database Migrations

1. In backend service, click **"Deploy Logs"**
2. Wait for deploy to complete
3. Open **Shell** (terminal icon)
4. Run:
```bash
npx prisma migrate deploy
```

### Step 4: Test Your Deployment!

Visit `https://your-frontend-url.up.railway.app` and try analyzing an article!

Admin dashboard: `https://your-frontend-url.up.railway.app/admin`

---

## Cost Estimate

**Railway Free Tier**: $5/month credit
- Backend service: ~$5/month (500 hours)
- PostgreSQL: Free (included)
- **Total**: ~$5/month Railway + $0.03/article for Claude API

**Example**: 100 articles/month = $5 hosting + $3 AI = **$8/month total**

---

## Troubleshooting

**Build fails?**
- Check Deploy Logs for errors
- Verify `package.json` has build scripts

**Database connection error?**
- Run `npx prisma migrate deploy` in backend shell
- Check DATABASE_URL is set to `${{Postgres.DATABASE_URL}}`

**CORS errors?**
- Verify FRONTEND_URL in backend matches your actual frontend URL
- Verify NEXT_PUBLIC_API_URL in frontend matches backend URL

**404 on API?**
- Make sure backend service is running
- Check backend logs for errors

Your app is live! 🎉
