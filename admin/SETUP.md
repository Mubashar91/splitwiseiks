# Admin Panel Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   cd admin
   npm install
   ```

2. **Create `.env` file:**
   ```env
   VITE_API_BASE=http://localhost:5001
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
admin/
├── src/
│   ├── auth/              # Authentication components
│   │   ├── AdminLogin.tsx
│   │   └── RequireAdmin.tsx
│   ├── components/         # Shared components (if needed)
│   ├── AdminDashboard.tsx # Main dashboard
│   ├── AdminPricing.tsx   # Pricing management
│   ├── AdminFinalCTA.tsx  # Final CTA management
│   ├── AdminFormComponents.tsx # Reusable form components
│   └── ...                # Other admin components
├── public/                # Static assets
├── dist/                  # Build output (generated)
├── .htaccess              # Apache protection
├── .htpasswd.example      # Example password file
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Features

- ✅ Separate from main frontend
- ✅ Protected routes with authentication
- ✅ HTTP Basic Auth support (via .htaccess)
- ✅ IP whitelist support
- ✅ Application-level JWT authentication
- ✅ Modern UI with Tailwind CSS
- ✅ Modal-based editing (no inline editing)

## Routes

- `/login` - Admin login page
- `/signup` - Admin signup page
- `/` - Dashboard (redirects to `/pricing`)
- `/pricing` - Pricing management
- `/how-it-works` - How It Works management
- `/faq` - FAQ management
- `/services` - Services management
- `/testimonials` - Testimonials management
- `/blogs` - Blog management
- `/case-studies` - Case studies management
- `/hero` - Hero section management
- `/why-choose-us` - Why Choose Us management
- `/footer` - Footer management
- `/final-cta` - Final CTA management

## Environment Variables

- `VITE_API_BASE` - Backend API URL (required)
- `VITE_ADMIN_TOKEN` - Development token (optional)

## Protection

The admin panel has three layers of protection:

1. **HTTP Basic Authentication** (via .htaccess) - Server-level
2. **IP Whitelist** (via .htaccess) - Server-level  
3. **Application Authentication** (JWT) - Application-level

All three can be used together for maximum security.

