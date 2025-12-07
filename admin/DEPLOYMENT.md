# Admin Panel Deployment Guide for Hostinger

## Overview
The admin panel is now a separate application located in the `/admin` folder. It can be deployed independently and protected using multiple security layers.

## Structure
```
admin/
├── src/              # Source files
├── dist/             # Build output (generated)
├── .htaccess         # Apache protection rules
├── .htpasswd         # HTTP Basic Auth credentials (create this)
├── package.json      # Dependencies
└── vite.config.ts    # Build configuration
```

## Setup Steps

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
VITE_API_BASE=https://your-api-domain.com
```

### 3. Build for Production
```bash
npm run build
```

This creates a `dist` folder with all the production files.

### 4. Deploy to Hostinger

#### Option A: Using File Manager
1. Log into Hostinger File Manager
2. Navigate to `public_html/`
3. Create `admin` folder if it doesn't exist
4. Upload all contents from `admin/dist/` to `public_html/admin/`
5. Upload `admin/.htaccess` to `public_html/admin/`

#### Option B: Using FTP
1. Connect to your Hostinger FTP
2. Navigate to `public_html/`
3. Create `admin` directory
4. Upload all files from `admin/dist/` to `public_html/admin/`
5. Upload `.htaccess` file

### 5. Set File Permissions
- Directories: 755
- Files: 644
- `.htaccess`: 644

## Protection Methods

### Method 1: HTTP Basic Authentication (Recommended)

1. **Generate .htpasswd file:**
   ```bash
   htpasswd -c .htpasswd admin
   ```
   Enter password when prompted.

2. **Upload .htpasswd to Hostinger:**
   - Upload to `public_html/admin/` or a secure location outside public_html
   - Recommended: Upload to `public_html/admin/.htpasswd` (it's in .gitignore)

3. **Update .htaccess:**
   Edit `.htaccess` and uncomment/modify:
   ```apache
   AuthType Basic
   AuthName "Admin Panel - Restricted Access"
   AuthUserFile /home/username/public_html/admin/.htpasswd
   Require valid-user
   ```
   Replace `/home/username/` with your actual Hostinger home path (check via File Manager).

### Method 2: IP Whitelist

1. **Find your IP address:**
   Visit: https://whatismyipaddress.com/

2. **Update .htaccess:**
   Uncomment and modify:
   ```apache
   <RequireAll>
     Require ip YOUR_IP_ADDRESS
     Require ip ANOTHER_IP_ADDRESS
   </RequireAll>
   ```

### Method 3: Application-Level Authentication (Already Built-in)

The application has built-in authentication:
- Users must login at `/admin/login`
- JWT tokens are required for API access
- Tokens are stored in localStorage

**This is the primary authentication method and should always be enabled.**

## Security Best Practices

1. **Use HTTPS:** Ensure SSL certificate is enabled on Hostinger
2. **Strong Passwords:** Use complex passwords for admin accounts
3. **Regular Updates:** Keep dependencies updated
4. **Backup:** Regularly backup admin data
5. **Monitor Access:** Check server logs for unauthorized access attempts

## Access URLs

After deployment:
- Admin Login: `https://yourdomain.com/admin/login`
- Admin Dashboard: `https://yourdomain.com/admin/`

## Troubleshooting

### 404 Errors
- Check that all files are uploaded correctly
- Verify `.htaccess` is in the admin directory
- Check file permissions

### Authentication Issues
- Verify `.htpasswd` path in `.htaccess` is correct
- Check file permissions on `.htpasswd` (should be 644)
- Ensure AuthType Basic is enabled in `.htaccess`

### API Connection Issues
- Verify `VITE_API_BASE` in `.env` matches your API URL
- Check CORS settings on backend
- Ensure API is accessible from the frontend domain

## Development

For local development:
```bash
cd admin
npm run dev
```

Access at: `http://localhost:5173/`

## Notes

- The admin panel is completely separate from the main frontend
- It has its own build process and dependencies
- All admin routes are protected by authentication
- The `.htaccess` file provides an additional security layer

