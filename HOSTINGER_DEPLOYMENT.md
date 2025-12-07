# Hostinger Frontend Deployment Guide

## Overview
Deploy your React frontend and admin panel to Hostinger shared hosting.

## Prerequisites
1. Hostinger account with hosting plan
2. Backend deployed on Railway (or another service)
3. Domain name configured

## Deployment Structure

```
public_html/
├── index.html          # Frontend entry point
├── assets/             # Frontend build files
├── admin/              # Admin panel (separate app)
│   ├── index.html
│   ├── assets/
│   └── .htaccess       # Admin protection
└── .htaccess           # Frontend routing
```

## Step 1: Build Frontend

### Build Main Frontend
```bash
cd frontend
npm install
npm run build
```

This creates a `dist/` folder with production files.

### Build Admin Panel
```bash
cd admin
npm install
npm run build
```

This creates a `dist/` folder with admin production files.

## Step 2: Prepare Environment Variables

### Frontend
Create `frontend/.env.production`:
```env
VITE_API_BASE=https://your-backend.railway.app
```

### Admin
Create `admin/.env.production`:
```env
VITE_API_BASE=https://your-backend.railway.app
```

Rebuild after setting environment variables.

## Step 3: Upload to Hostinger

### Option A: Using File Manager

1. Log into Hostinger hPanel
2. Go to File Manager
3. Navigate to `public_html/`
4. Delete existing files (backup first if needed)

**Upload Frontend:**
1. Upload all files from `frontend/dist/` to `public_html/`
2. Upload `frontend/.htaccess` (if exists) to `public_html/`

**Upload Admin:**
1. Create folder `public_html/admin/`
2. Upload all files from `admin/dist/` to `public_html/admin/`
3. Upload `admin/.htaccess` to `public_html/admin/`

### Option B: Using FTP

1. Connect via FTP (FileZilla, etc.)
2. Navigate to `public_html/`
3. Upload frontend files
4. Create `admin/` folder and upload admin files

## Step 4: Configure .htaccess

### Frontend .htaccess (public_html/.htaccess)

Create or update:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle React Router - redirect all requests to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Admin .htaccess (public_html/admin/.htaccess)

Already created in admin folder. Configure HTTP Basic Auth if needed (see admin/DEPLOYMENT.md).

## Step 5: Set File Permissions

- **Directories**: 755
- **Files**: 644
- **.htaccess**: 644

## Step 6: Configure Backend CORS

In Railway backend environment variables, set:
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://yourdomain.com/admin
```

Replace `yourdomain.com` with your actual domain.

## Step 7: Test Deployment

1. **Frontend**: Visit `https://yourdomain.com`
2. **Admin Panel**: Visit `https://yourdomain.com/admin/login`
3. **API Health**: Check `https://your-backend.railway.app/health`

## Troubleshooting

### 404 Errors on Routes
- Ensure `.htaccess` is uploaded and RewriteEngine is enabled
- Check file permissions
- Verify mod_rewrite is enabled on Hostinger

### API Connection Errors
- Verify `VITE_API_BASE` in production build
- Check CORS settings in Railway backend
- Test API directly: `curl https://your-backend.railway.app/health`

### Admin Panel Not Loading
- Check `admin/.htaccess` is present
- Verify all admin files are in `public_html/admin/`
- Check browser console for errors

### Build Issues
- Ensure environment variables are set before building
- Check Node.js version matches (use Node 18+)
- Clear `node_modules` and reinstall if needed

## SSL/HTTPS

Hostinger provides free SSL certificates:
1. Go to hPanel → SSL
2. Enable "Free SSL" or install Let's Encrypt
3. Force HTTPS in `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

## Performance Optimization

1. **Enable Caching** in `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

2. **Gzip Compression** (already in .htaccess example)

## Backup

Before deployment:
- Backup existing `public_html/` files
- Keep a copy of your built `dist/` folders locally
- Document your environment variables

## Maintenance

- Regularly update dependencies
- Monitor Railway backend logs
- Check Hostinger resource usage
- Keep backups of your database

