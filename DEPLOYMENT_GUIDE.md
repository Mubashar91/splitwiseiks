# Complete Deployment Guide
## Frontend on Hostinger + Backend on Railway

This guide covers deploying your application with:
- **Frontend**: Hostinger (shared hosting)
- **Admin Panel**: Hostinger (protected directory)
- **Backend API**: Railway (cloud platform)

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Hostinger     │         │     Railway      │
│                 │         │                  │
│  Frontend       │────────▶│   Backend API    │
│  (React SPA)    │  HTTPS  │   (Node.js)      │
│                 │         │                  │
│  Admin Panel    │────────▶│   MongoDB       │
│  (Protected)    │  HTTPS  │   (Atlas)        │
└─────────────────┘         └──────────────────┘
```

## Quick Start Checklist

### Backend (Railway)
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Get Railway URL
- [ ] Test health endpoint

### Frontend (Hostinger)
- [ ] Build frontend with Railway API URL
- [ ] Upload to Hostinger
- [ ] Configure .htaccess
- [ ] Test frontend

### Admin Panel (Hostinger)
- [ ] Build admin with Railway API URL
- [ ] Upload to Hostinger `/admin/`
- [ ] Configure protection
- [ ] Test admin login

## Detailed Steps

### Part 1: Deploy Backend to Railway

See `backend/RAILWAY_DEPLOYMENT.md` for complete instructions.

**Quick Steps:**
1. Push backend code to GitHub
2. Create Railway project
3. Connect repository
4. Set environment variables:
   - `MONGO_URI`
   - `CORS_ORIGIN` (your Hostinger domain)
   - `ADMIN_TOKEN`
5. Deploy
6. Get Railway URL (e.g., `https://your-app.up.railway.app`)

### Part 2: Deploy Frontend to Hostinger

See `HOSTINGER_DEPLOYMENT.md` for complete instructions.

**Quick Steps:**
1. Create `frontend/.env.production`:
   ```env
   VITE_API_BASE=https://your-app.up.railway.app
   ```
2. Build: `cd frontend && npm run build`
3. Upload `dist/` contents to Hostinger `public_html/`
4. Upload `.htaccess` for routing

### Part 3: Deploy Admin Panel to Hostinger

1. Create `admin/.env.production`:
   ```env
   VITE_API_BASE=https://your-app.up.railway.app
   ```
2. Build: `cd admin && npm run build`
3. Upload `dist/` contents to Hostinger `public_html/admin/`
4. Upload `admin/.htaccess` for protection

### Part 4: Configure CORS

In Railway backend, update `CORS_ORIGIN`:
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://yourdomain.com/admin
```

## Environment Variables Summary

### Railway Backend
```env
MONGO_URI=mongodb+srv://...
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
ADMIN_TOKEN=your-secure-token
PORT=5001
```

### Frontend Build
```env
VITE_API_BASE=https://your-app.up.railway.app
```

### Admin Build
```env
VITE_API_BASE=https://your-app.up.railway.app
```

## Testing After Deployment

1. **Frontend**: `https://yourdomain.com`
2. **Admin Login**: `https://yourdomain.com/admin/login`
3. **API Health**: `https://your-app.up.railway.app/health`
4. **API from Frontend**: Check browser console for API calls

## Common Issues & Solutions

### CORS Errors
- **Problem**: Frontend can't connect to backend
- **Solution**: 
  - Verify `CORS_ORIGIN` in Railway includes your domain
  - Check domain matches exactly (https vs http)
  - Restart Railway service after changing CORS

### 404 on Routes
- **Problem**: React Router routes return 404
- **Solution**: Ensure `.htaccess` RewriteRule is configured

### Admin Panel Not Accessible
- **Problem**: Can't access admin panel
- **Solution**: 
  - Check files are in `public_html/admin/`
  - Verify `.htaccess` is present
  - Check file permissions

### API Connection Failed
- **Problem**: Frontend can't reach backend
- **Solution**:
  - Verify `VITE_API_BASE` in production build
  - Check Railway service is running
  - Test API directly with curl

## Security Checklist

- [ ] HTTPS enabled on Hostinger
- [ ] Admin panel protected with `.htaccess`
- [ ] Strong `ADMIN_TOKEN` set in Railway
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS only allows your domains
- [ ] Environment variables not in git

## Cost Estimate

**Hostinger**: ~$2-5/month (shared hosting)
**Railway**: Free tier ($5 credit/month) or $5/month
**MongoDB Atlas**: Free tier (512MB) or $9/month

**Total**: ~$2-19/month depending on plan

## Support Resources

- Railway Docs: https://docs.railway.app
- Hostinger Help: https://www.hostinger.com/tutorials
- MongoDB Atlas: https://docs.atlas.mongodb.com

