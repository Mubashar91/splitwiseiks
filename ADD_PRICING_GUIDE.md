# Step-by-Step Guide: Adding Pricing Data

## Option 1: Create Admin Account (Recommended)

### Step 1: Make sure your backend is running
```bash
cd backend
npm run dev
```
You should see: `✅ Server started successfully!`

### Step 2: Open Admin Signup Page
Go to: **http://localhost:5173/admin/signup**

Or: **http://localhost:5173/admin/login** and click "Sign up"

### Step 3: Create Your Admin Account
Fill in the form:
- **Name**: Your full name
- **Email**: admin@example.com (or any email)
- **Password**: Create a strong password (at least 8 characters with numbers and letters)

Click **"Create Account"**

### Step 4: You'll be redirected to Admin Dashboard
After signup, you'll automatically be logged in and redirected.

### Step 5: Go to Pricing Admin
Navigate to: **http://localhost:5173/admin/pricing**

Or click on "Pricing" in the admin dashboard.

### Step 6: Add Pricing Plans

1. **Select Language**: Choose "en" (English) from the dropdown

2. **Click "Add New Plan"** to expand the form

3. **Add Plan 1 - Starter:**
   - planKey: Select `starter` from dropdown
   - name: `Starter Plan`
   - hours: `10h/week`
   - price: `299`
   - setupFee: `0`
   - features: Add features (one per line):
     ```
     Email management
     Calendar scheduling
     Basic data entry
     ```
   - highlighted: (leave unchecked or check if you want it highlighted)
   - Click **"Add"** button

4. **Add Plan 2 - Professional:**
   - planKey: `professional`
   - name: `Professional Plan`
   - hours: `20h/week`
   - price: `599`
   - setupFee: `0`
   - features:
     ```
     Everything in Starter
     Social media management
     Customer support
     Report generation
     ```
   - Click **"Add"**

5. **Add Plan 3 - Enterprise:**
   - planKey: `enterprise`
   - name: `Enterprise Plan`
   - hours: `40h/week`
   - price: `1199`
   - setupFee: `0`
   - features:
     ```
     Everything in Professional
     Dedicated account manager
     Priority support
     Custom integrations
     Advanced analytics
     ```
   - Click **"Add"**

6. **Add German Plans:**
   - Change language dropdown to "de"
   - Repeat steps 3-5 with German translations

### Step 7: Verify
- Go back to your main page: **http://localhost:5173**
- Scroll to the pricing section
- You should now see all three plans!

---

## Option 2: Quick Test (If you already have admin account)

1. Go to: **http://localhost:5173/admin/login**
2. Login with your email and password
3. Go to: **http://localhost:5173/admin/pricing**
4. Add plans as described above

---

## Troubleshooting

**"Authentication required" error:**
- Make sure you're logged in
- Try logging out and logging back in
- Clear browser cache and localStorage

**"No pricing plans found" after adding:**
- Make sure you selected the correct language (en or de)
- Refresh the frontend page
- Check browser console for errors

**Can't access admin panel:**
- Make sure backend is running on port 5001
- Make sure frontend is running on port 5173
- Check that `VITE_API_BASE=http://localhost:5001` is set in frontend/.env.local

---

## Quick Test Commands

Test if API is working:
```bash
curl http://localhost:5001/api/pricing?lang=en
```

Should return:
```json
{
  "lang": "en",
  "plans": [
    { "planKey": "starter", ... },
    { "planKey": "professional", ... },
    { "planKey": "enterprise", ... }
  ]
}
```

