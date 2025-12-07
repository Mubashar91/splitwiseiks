# Quick Deployment Guide
## Frontend (Hostinger) + Backend (Railway)

## 🚀 Quick Steps

### 1. Backend on Railway (5 minutes)

1. **Go to Railway**: https://railway.app → New Project → Deploy from GitHub
2. **Select your repo** and set root directory to `backend/`
3. **Add Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ADMIN_TOKEN=<generate-random-token>
   ```
4. **Deploy** - Railway auto-deploys
5. **Get URL**: Railway gives you `https://your-app.up.railway.app`

### 2. Frontend on Hostinger (10 minutes)

1. **Set API URL**:
   ```bash
   cd frontend
   echo "VITE_API_BASE=https://your-app.up.railway.app" > .env.production
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Upload to Hostinger**:
   - Upload `frontend/dist/*` to `public_html/`
   - Upload `frontend/.htaccess` to `public_html/`

### 3. Admin Panel on Hostinger (10 minutes)

1. **Set API URL**:
   ```bash
   cd admin
   echo "VITE_API_BASE=https://your-app.up.railway.app" > .env.production
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Upload to Hostinger**:
   - Upload `admin/dist/*` to `public_html/admin/`
   - Upload `admin/.htaccess` to `public_html/admin/`

### 4. Configure CORS in Railway

Update Railway environment variable:
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://yourdomain.com/admin
```

## ✅ Test

- Frontend: `https://yourdomain.com`
- Admin: `https://yourdomain.com/admin/login`
- API: `https://your-app.up.railway.app/health`

## 🔐 Generate Admin Token

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Important Notes

1. **Build AFTER setting environment variables** - The API URL is baked into the build
2. **CORS must match exactly** - Include https:// and www if you use it
3. **Railway auto-assigns PORT** - Don't worry about it
4. **MongoDB Atlas** - Use free tier, whitelist Railway IPs (or 0.0.0.0/0)

## 🆘 Troubleshooting

**CORS Error?**
- Check Railway `CORS_ORIGIN` includes your domain
- Restart Railway service

**404 on Routes?**
- Check `.htaccess` is uploaded
- Verify mod_rewrite is enabled

**API Not Working?**
- Test: `curl https://your-app.up.railway.app/health`
- Check Railway logs
- Verify environment variables

