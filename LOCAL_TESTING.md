# Local Testing Guide

## Quick Fix for Pricing Not Showing on Localhost

### Step 1: Start the Backend

1. Open a terminal in the `backend/` folder
2. Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   ADMIN_TOKEN=your-admin-token-here
   PORT=5001
   NODE_ENV=development
   ```
3. Install dependencies (if not done):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. You should see:
   ```
   ✅ Server started successfully!
   🌐 Server listening on port 5001
   ```

### Step 2: Test the API Directly

Open your browser and go to:
```
http://localhost:5001/api/pricing?lang=en
```

You should see JSON like:
```json
{
  "lang": "en",
  "plans": [...]
}
```

**If you see an empty array `[]`, you need to add pricing data first!**

### Step 3: Add Pricing Data

1. Go to your admin panel: `http://localhost:5173/admin/pricing?token=YOUR_ADMIN_TOKEN`
2. Add pricing plans for both `en` and `de` languages
3. Make sure you add at least:
   - Starter plan
   - Professional plan  
   - Enterprise plan

### Step 4: Start the Frontend

1. Open a NEW terminal in the `frontend/` folder
2. Create a `.env.local` file with:
   ```env
   VITE_API_BASE=http://localhost:5001
   ```
3. Install dependencies (if not done):
   ```bash
   npm install
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser

### Step 5: Check Browser Console

1. Press F12 to open Developer Tools
2. Go to the Console tab
3. Look for:
   - `Fetching pricing from: http://localhost:5001/api/pricing?lang=en`
   - `Pricing data received: {lang: "en", plans: [...]}`
   - `Loaded plans: 3`

### Common Issues

**Issue: "Failed to fetch"**
- ✅ Backend is not running - Start it with `npm run dev` in backend folder
- ✅ Wrong port - Check backend is on port 5001
- ✅ CORS error - Backend now allows all localhost ports automatically

**Issue: Empty plans array `[]`**
- ✅ No pricing data in database - Add plans via admin panel
- ✅ Wrong language - Make sure you added plans for the language you're viewing

**Issue: "MONGO_URI is required"**
- ✅ Create `.env` file in backend folder with your MongoDB connection string

**Issue: Frontend shows "localhost:5001" but backend is on different port**
- ✅ Check your `frontend/.env.local` has correct `VITE_API_BASE`
- ✅ Restart frontend after changing `.env.local`

### Quick Test Commands

```bash
# Test backend health
curl http://localhost:5001/health

# Test pricing API
curl http://localhost:5001/api/pricing?lang=en

# Test with specific language
curl http://localhost:5001/api/pricing?lang=de
```

### Still Not Working?

1. Check backend terminal for errors
2. Check frontend browser console (F12) for errors
3. Verify MongoDB connection is working
4. Make sure you added pricing data via admin panel

