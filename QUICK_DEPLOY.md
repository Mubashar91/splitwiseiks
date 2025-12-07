# 🚀 Quick Deployment Checklist

## Backend → Railway

- [ ] Create Railway account
- [ ] New Project → Deploy from GitHub
- [ ] Set root directory: `backend/`
- [ ] Add env vars:
  - [ ] `MONGO_URI` (MongoDB Atlas connection string)
  - [ ] `CORS_ORIGIN` (your Hostinger domain)
  - [ ] `ADMIN_TOKEN` (generate random token)
- [ ] Deploy
- [ ] Copy Railway URL: `https://your-app.up.railway.app`

## Frontend → Hostinger

- [ ] Create `frontend/.env.production` with Railway URL
- [ ] Build: `npm run build` in frontend folder
- [ ] Upload `frontend/dist/*` to Hostinger `public_html/`
- [ ] Upload `frontend/.htaccess` to `public_html/`

## Admin → Hostinger

- [ ] Create `admin/.env.production` with Railway URL
- [ ] Build: `npm run build` in admin folder
- [ ] Upload `admin/dist/*` to Hostinger `public_html/admin/`
- [ ] Upload `admin/.htaccess` to `public_html/admin/`

## Final Configuration

- [ ] Update Railway `CORS_ORIGIN` with your domain
- [ ] Test frontend: `https://yourdomain.com`
- [ ] Test admin: `https://yourdomain.com/admin/login`
- [ ] Test API: `https://your-app.up.railway.app/health`

## Generate Admin Token

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Environment Variables Template

### Railway Backend
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
ADMIN_TOKEN=<generated-token>
```

### Frontend Build
```
VITE_API_BASE=https://your-app.up.railway.app
```

### Admin Build
```
VITE_API_BASE=https://your-app.up.railway.app
```

Done! 🎉

