# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

## 📋 Current Setup

- **Frontend** → Vercel (React app, never sleeps)
- **Backend** → Render (Express server with health endpoints)
- **Keep-Alive** → GitHub Actions (pings Render every 5 minutes to prevent sleep)

---

## ✅ Step 1: Deploy Backend to Render (Already Done)

Your backend is already configured with `render.yaml`. Just push to GitHub:

```bash
git add .
git commit -m "Add keep-alive backend"
git push
```

Render will automatically:
- Build: `npm install --legacy-peer-deps && npm run build`
- Start: `node server.js`
- Endpoints available:
  - `https://farm-connnect.onrender.com/api/health`
  - `https://farm-connnect.onrender.com/api/ping`

---

## 🎯 Step 2: Deploy Frontend to Vercel

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**During deployment, Vercel will ask**:
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No** (first time) or **Yes** (if already exists)
- What's your project's name? → `farmconnect` (or any name)
- In which directory is your code? → `.` (current directory)
- Want to modify settings? → **No**

Vercel will:
1. Read `vercel.json` configuration
2. Run `npm run build`
3. Deploy `dist/` folder
4. Give you a URL like: `https://farmconnect.vercel.app`

---

### Method 2: Using Vercel Dashboard (Alternative)

1. **Go to**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
4. **Configure**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`
5. **Deploy**

---

## ⚙️ Step 3: Enable GitHub Actions (Keep-Alive)

GitHub Actions will ping your Render backend every 5 minutes to keep it alive.

```bash
# Commit the workflow file
git add .github/workflows/keepalive.yml
git commit -m "Add GitHub Actions keep-alive"
git push
```

Then:
1. Go to your GitHub repo
2. Click **"Actions"** tab
3. Enable workflows if prompted
4. Wait 5 minutes, verify workflow runs

---

## 🔍 Step 4: Verify Everything Works

### Test Backend (Render)
```bash
# Test health endpoint
curl https://farm-connnect.onrender.com/api/health

# Test ping endpoint
curl -X POST https://farm-connnect.onrender.com/api/ping
```

### Test Frontend (Vercel)
1. Visit your Vercel URL (e.g., `https://farmconnect.vercel.app`)
2. Open browser console (F12)
3. Look for:
   ```
   [KeepAlive] Service initialized
   [KeepAlive] API URL: https://farm-connnect.onrender.com
   [KeepAlive] Ping successful (XXms)
   ```

### Test GitHub Actions
1. Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`
2. Click "Keep-Alive Ping" workflow
3. Verify it runs every 5 minutes
4. Check logs show successful pings

---

## 📝 Important Files

### Keep These:
- ✅ `server.js` - Backend Express server
- ✅ `render.yaml` - Render configuration
- ✅ `vercel.json` - Vercel configuration
- ✅ `public/keepalive.js` - Frontend keep-alive service
- ✅ `public/health.html` - Health dashboard
- ✅ `.github/workflows/keepalive.yml` - GitHub Actions

### Remove These (Not Needed):
- ❌ All other `.md` documentation files
- ❌ Test scripts

---

## 🎯 Complete Deployment Commands

```bash
# 1. Commit everything
git add .
git commit -m "Deploy frontend and backend with keep-alive"
git push

# 2. Deploy to Vercel
vercel --prod

# 3. Verify
# - Check Vercel URL works
# - Check Render backend responds
# - Check GitHub Actions runs
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't reach backend (CORS error)

**Solution**: Already fixed in `server.js` with:
```javascript
res.header('Access-Control-Allow-Origin', '*');
```

### Issue: Backend returns 404

**Solution**: Make sure Render deployment succeeded:
- Check Render dashboard → Your service → Logs
- Verify `node server.js` is running

### Issue: GitHub Actions not running

**Solution**:
1. Go to repo Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"
3. Push a commit to trigger workflow

---

## ✅ Success Checklist

After deployment:
- [ ] Vercel URL works (frontend loads)
- [ ] Can access: `https://farmconnect.vercel.app`
- [ ] Backend responds: `https://farm-connnect.onrender.com/api/health`
- [ ] Console shows keep-alive logs
- [ ] GitHub Actions runs every 5 minutes
- [ ] Render logs show ping confirmations

---

## 🎉 You're Done!

**Frontend**: Hosted on Vercel (never sleeps)  
**Backend**: Hosted on Render (kept alive by GitHub Actions)  
**Result**: Fast, reliable, always-on application!

---

## 📊 What Happens Now?

1. **User visits** `https://farmconnect.vercel.app`
2. **Frontend loads** from Vercel (instant, static files)
3. **keepalive.js** starts pinging Render backend
4. **GitHub Actions** pings Render every 5 minutes (even when no users)
5. **Render stays alive** 24/7, no cold starts
6. **Users get instant responses** from backend APIs

---

**Questions? Check Vercel docs**: https://vercel.com/docs  
**Render docs**: https://render.com/docs
