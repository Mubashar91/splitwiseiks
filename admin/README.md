# Admin Panel

Protected admin panel for content management. This is a separate application from the main frontend.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE=http://localhost:5001
```

3. Build for production:
```bash
npm run build
```

4. Deploy the `dist` folder to your Hostinger server in the `/admin/` directory.

## Protection

### Option 1: HTTP Basic Authentication (Recommended for Hostinger)

1. Generate `.htpasswd` file:
```bash
htpasswd -c .htpasswd admin
```

2. Update `.htaccess` file:
   - Uncomment the AuthType Basic section
   - Update `AuthUserFile` path to point to your `.htpasswd` file location

### Option 2: IP Whitelist

1. Update `.htaccess` file:
   - Uncomment the IP whitelist section
   - Add your IP addresses

### Option 3: Application-Level Authentication

The application already has authentication built-in. Users must login through `/login` before accessing the admin panel.

## Deployment on Hostinger

1. Build the application: `npm run build`
2. Upload the `dist` folder contents to `public_html/admin/` on Hostinger
3. Upload `.htaccess` file to `public_html/admin/`
4. Configure `.htpasswd` if using HTTP Basic Auth
5. Set proper file permissions (755 for directories, 644 for files)

## Development

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173/admin/`

