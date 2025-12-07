# Railway Backend Deployment Guide

## Overview
Deploy your Node.js backend API to Railway. Railway automatically detects Node.js projects and handles deployment.

## Prerequisites
1. Railway account (sign up at https://railway.app)
2. MongoDB database (MongoDB Atlas recommended)
3. Your Hostinger frontend domain

## Step-by-Step Deployment

### 1. Prepare Your Backend

Ensure your `package.json` has a start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 2. Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo" (recommended) or "Empty Project"

### 3. Connect Repository

If using GitHub:
1. Authorize Railway to access your GitHub
2. Select your repository
3. Railway will auto-detect the backend folder

If using Empty Project:
1. Click "New" → "GitHub Repo"
2. Select your repository
3. Set root directory to `backend/`

### 4. Add Environment Variables

In Railway dashboard, go to your service → Variables tab, add:

**Required Variables:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
ADMIN_TOKEN=your-secure-random-token-here
PORT=5001
```

**Optional Variables:**
```
NODE_ENV=production
```

**Important Notes:**
- `CORS_ORIGIN`: Add your Hostinger domain(s) here (comma-separated)
  - Example: `https://yourdomain.com,https://www.yourdomain.com`
  - Include both with and without www if you use both
- `ADMIN_TOKEN`: Generate a secure random token (use a password generator)
- `MONGO_URI`: Your MongoDB Atlas connection string

### 5. Generate Admin Token

Use one of these methods:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Or use an online generator
```

### 6. Deploy

1. Railway will automatically deploy when you push to your main branch
2. Or click "Deploy" in Railway dashboard
3. Wait for deployment to complete

### 7. Get Your Railway URL

1. Go to your service → Settings → Domains
2. Railway provides a default domain like: `your-app.up.railway.app`
3. Or add a custom domain if you have one

### 8. Update Frontend Environment Variables

Update your frontend `.env` files:
- `frontend/.env.production`: `VITE_API_BASE=https://your-app.up.railway.app`
- `admin/.env.production`: `VITE_API_BASE=https://your-app.up.railway.app`

## MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist Railway IPs (or use 0.0.0.0/0 for all IPs - less secure)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

## CORS Configuration

The backend is configured to accept requests from domains listed in `CORS_ORIGIN`.

**For Hostinger deployment, add:**
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://yourdomain.com/admin
```

## Health Check

Test your deployment:
```bash
curl https://your-app.up.railway.app/health
```

Should return: `{"ok":true}`

## Monitoring

- Railway dashboard shows logs in real-time
- Check "Metrics" tab for CPU, memory usage
- Set up alerts in Railway dashboard

## Troubleshooting

### Deployment Fails
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct start script

### CORS Errors
- Verify `CORS_ORIGIN` includes your frontend domain
- Check that domain matches exactly (including https/http)
- Restart service after changing CORS_ORIGIN

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database user has correct permissions

### API Not Responding
- Check Railway service status
- Verify PORT environment variable
- Check Railway logs for errors

## Custom Domain (Optional)

1. In Railway → Settings → Domains
2. Click "Generate Domain" or "Add Custom Domain"
3. Follow DNS configuration instructions
4. Update `CORS_ORIGIN` with custom domain

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `CORS_ORIGIN` | Yes | Allowed frontend domains | `https://yourdomain.com` |
| `ADMIN_TOKEN` | Yes | Secret token for admin auth | Random hex string |
| `PORT` | No | Server port (Railway sets this) | `5001` |
| `NODE_ENV` | No | Environment | `production` |

## Cost

Railway offers:
- **Free tier**: $5 credit/month
- **Hobby plan**: $5/month for more resources
- Pay-as-you-go pricing

For a small to medium app, the free tier is usually sufficient.

