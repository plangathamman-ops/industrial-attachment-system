# 🚀 LOCAL TESTING GUIDE - Industrial Attachment System

## Quick Start (5 Minutes to Running App!)

### Prerequisites Check
```bash
node --version    # Should be 16+ or 18+
npm --version     # Should be 8+ or 9+
mongod --version  # Should be 6+ or 7+ (or use MongoDB Atlas)
```

---

## METHOD 1: Using Local MongoDB (Recommended for Development)

### Step 1: Start MongoDB
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB should start automatically, or:
net start MongoDB

# Verify MongoDB is running
mongosh
# You should see: "Connecting to: mongodb://127.0.0.1:27017"
# Type: exit
```

### Step 2: Setup Backend
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/industrial-attachment
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRE=7d

# M-Pesa Credentials (Sandbox - for testing)
MPESA_CONSUMER_KEY=your-sandbox-consumer-key
MPESA_CONSUMER_SECRET=your-sandbox-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-sandbox-passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/applications/mpesa/callback
MPESA_API_URL=https://sandbox.safaricom.co.ke

# Cloudinary Credentials (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOF

# Seed the database with 20 opportunities + test users
npm run seed

# Expected output:
# ✅ Connected to MongoDB successfully!
# ✅ Created admin user: admin@ias.com
# ✅ Created test student: student@test.com
# ✅ Successfully seeded 20 opportunities!
# 🎉 DATABASE SEEDED SUCCESSFULLY!

# Start the backend server
npm run dev

# Expected output:
# Server running on port 5000
# MongoDB Connected
```

### Step 3: Setup Frontend (New Terminal)
```bash
# Open new terminal window/tab
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the frontend
npm run dev

# Expected output:
# VITE v4.x.x ready in XXX ms
# ➜ Local: http://localhost:3000/
```

### Step 4: Open Browser & Test! 🎉
```
Open: http://localhost:3000

You should see:
✨ Beautiful animated landing page
✨ Hero section with floating blobs
✨ Stats section
✨ How It Works section
✨ 6 feature cards
✨ Testimonials carousel
```

---

## METHOD 2: Using MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier available)
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)

### Step 2: Update Backend .env
```bash
cd backend

# Edit .env file and replace MONGO_URI:
MONGO_URI=mongodb+srv://username:your-password@cluster0.xxxxx.mongodb.net/industrial-attachment?retryWrites=true&w=majority
```

### Step 3: Seed Database
```bash
npm run seed
```

### Step 4: Start Servers
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd ../frontend
npm run dev
```

---

## 🧪 TESTING THE APPLICATION

### Test Accounts (Pre-seeded)

**Student Account:**
```
Email: student@test.com
Password: Student@123
```

**Admin Account:**
```
Email: admin@ias.com
Password: Admin@123
```

### Test Flow 1: Browse Opportunities (No Login Required)

1. **Visit Homepage**: http://localhost:3000
   - ✅ Should see animated hero with blobs
   - ✅ Stats section showing numbers
   - ✅ How It Works (3 steps)
   - ✅ Features section (6 cards)
   - ✅ Testimonials

2. **Click "Browse Opportunities"**
   - ✅ Should see 20 opportunities
   - ✅ Filters (IT, Engineering, Business, Other)
   - ✅ Search bar works
   - ✅ Pagination (if >10 items)

3. **Click any Opportunity Card**
   - ✅ Should see full details
   - ✅ Company name
   - ✅ Requirements list
   - ✅ Application deadline
   - ✅ "Apply Now" button (redirects to login if not logged in)

### Test Flow 2: Student Registration & Application

1. **Click "Sign Up" in Navbar**
   - ✅ Registration form appears
   - ✅ Fill in all fields:
     ```
     First Name: Jane
     Last Name: Smith
     Email: jane@example.com
     Phone: +254700000001
     Institution: JKUAT
     Course: Software Engineering
     Year: Year 3
     Password: Test@1234
     Confirm Password: Test@1234
     ```
   - ✅ Click "Create Account"
   - ✅ Should redirect to Dashboard

2. **Dashboard Check**
   - ✅ Welcome message with your name
   - ✅ Quick stats (0 applications initially)
   - ✅ "Browse Opportunities" button

3. **Apply for Opportunity**
   - ✅ Navigate to Opportunities page
   - ✅ Click "Safaricom - Software Engineering Intern"
   - ✅ Click "Apply Now"
   - ✅ Application form appears (3 steps)

4. **Step 1: Personal Info**
   - ✅ Pre-filled with your profile data
   - ✅ Click "Next"

5. **Step 2: Upload Documents**
   - ✅ Upload CV (PDF only, max 5MB)
   - ✅ Upload Referral Letter (PDF)
   - ✅ Click "Next"

6. **Step 3: Payment**
   - ✅ Review application details
   - ✅ See "Pay KES 500 via M-Pesa"
   - ✅ Enter M-Pesa phone number: +254700000001
   - ✅ Click "Pay & Submit Application"
   - ✅ Should see STK Push notification on phone (if real M-Pesa)
   - ✅ Or success message (if sandbox/mock)

7. **Check My Applications**
   - ✅ Click "My Applications" in navbar
   - ✅ Should see your application
   - ✅ Status: "Pending Payment" or "Submitted"
   - ✅ Can view application details

### Test Flow 3: Login with Test Student

1. **Logout** (if logged in)
2. **Click "Login"**
   - Email: student@test.com
   - Password: Student@123
3. **Click "Sign In"**
   - ✅ Should redirect to Dashboard
   - ✅ See "Welcome, John Doe!"

4. **Browse and Apply**
   - Follow steps from Test Flow 2

### Test Flow 4: Admin Login (Bonus)

1. **Login as Admin**
   - Email: admin@ias.com
   - Password: Admin@123

2. **Admin Dashboard**
   - ✅ See all applications (if any)
   - ✅ Can view/manage opportunities
   - ✅ Admin-specific features

---

## 🎨 VISUAL TESTING

### Homepage Animations
1. **Hero Section**
   - ✅ Blobs should float and morph
   - ✅ Text should have gradient effect
   - ✅ Buttons should scale on hover
   - ✅ Trust badges visible

2. **Stats Section**
   - ✅ Numbers should be bold
   - ✅ Grid layout (4 columns on desktop)
   - ✅ Responsive (2x2 on mobile)

3. **How It Works**
   - ✅ 3 cards with numbered badges
   - ✅ Icons should scale on hover
   - ✅ Cards lift on hover

4. **Features**
   - ✅ 6 cards with gradient backgrounds
   - ✅ Each card lifts on hover
   - ✅ Icons animate

5. **Testimonials**
   - ✅ Auto-rotates every 5 seconds
   - ✅ Dots navigation works
   - ✅ 5 stars displayed

6. **Navbar**
   - ✅ Fixed at top (stays on scroll)
   - ✅ Glassmorphism effect when scrolled
   - ✅ Active page has highlight
   - ✅ Mobile menu works (hamburger icon)

### Responsive Testing

**Desktop (1920px):**
```bash
# Open DevTools (F12)
# Set viewport: 1920 x 1080
```
- ✅ 3-4 column layouts
- ✅ Full navbar visible
- ✅ Large images

**Tablet (768px):**
```bash
# Set viewport: 768 x 1024
```
- ✅ 2 column layouts
- ✅ Hamburger menu appears
- ✅ Touch-friendly buttons

**Mobile (375px):**
```bash
# Set viewport: 375 x 667
```
- ✅ Single column
- ✅ Stacked elements
- ✅ Mobile menu
- ✅ Large tap targets

---

## 🐛 TROUBLESHOOTING

### Problem: MongoDB Connection Error
```
Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start it:
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

### Problem: Port 3000 Already in Use
```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in frontend:
# Edit vite.config.js and add:
server: { port: 3001 }
```

### Problem: Backend Port 5000 Already in Use

**Solution:**
```bash
# Kill process on port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env:
PORT=5001

# Update frontend/.env:
VITE_API_URL=http://localhost:5001/api
```

### Problem: CORS Error in Console
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS
```

**Solution:**
```bash
# Make sure backend/.env has:
NODE_ENV=development

# Backend should auto-enable CORS for localhost:3000
# If still issues, restart both servers
```

### Problem: Seed Script Fails
```
Error: Cannot find module '../models/User'
```

**Solution:**
```bash
# Make sure you're in the backend directory
cd backend

# Check that models exist:
ls -la src/models/

# If models are missing, the backend code needs to be set up first
```

### Problem: No Opportunities Showing

**Check:**
1. Backend is running (http://localhost:5000)
2. Database is seeded:
   ```bash
   cd backend
   npm run seed
   ```
3. Frontend is calling correct API:
   ```bash
   # Check frontend/.env
   VITE_API_URL=http://localhost:5000/api
   ```

### Problem: Login Not Working

**Check:**
1. Using correct credentials:
   - student@test.com / Student@123
   - admin@ias.com / Admin@123
2. Database is seeded
3. JWT_SECRET is set in backend/.env
4. Check browser console for errors (F12)

---

## 📊 DATABASE VERIFICATION

### Check MongoDB Data
```bash
# Connect to MongoDB
mongosh

# Switch to database
use industrial-attachment

# Check users
db.users.find().pretty()
# Should see admin@ias.com and student@test.com

# Check opportunities
db.opportunities.find().count()
# Should show: 20

# Check specific opportunity
db.opportunities.findOne({company: "Safaricom PLC"})

# Exit
exit
```

---

## 🎯 TESTING CHECKLIST

### Backend Tests
- [ ] MongoDB connection works
- [ ] Seed script runs successfully
- [ ] Server starts on port 5000
- [ ] API responds: `curl http://localhost:5000/api/opportunities`
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] Protected routes require authentication

### Frontend Tests
- [ ] Dev server starts on port 3000
- [ ] Homepage loads with animations
- [ ] Navbar is visible and fixed
- [ ] Opportunities page shows 20 items
- [ ] Search and filters work
- [ ] Registration form works
- [ ] Login form works
- [ ] Dashboard loads after login
- [ ] Application form accessible
- [ ] File upload works
- [ ] My Applications page shows submissions

### Visual Tests
- [ ] Animations smooth (no lag)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Colors match design (indigo/purple/pink)
- [ ] Buttons have hover effects
- [ ] Forms have validation
- [ ] Loading states display
- [ ] Error messages are friendly
- [ ] Success notifications appear

---

## 🚀 NEXT STEPS AFTER LOCAL TESTING

Once local testing works:

1. **Add Real M-Pesa Credentials** (for production)
2. **Add Real Cloudinary Credentials** (for file uploads)
3. **Deploy to Production** (Vercel, Netlify, AWS, etc.)
4. **Set up MongoDB Atlas** (for production database)
5. **Configure Domain & SSL**
6. **Set up Email Notifications**
7. **Add Analytics** (Google Analytics, etc.)

---

## 💡 PRO TIPS

### Quick Reset
```bash
# Completely reset and reseed
cd backend
npm run seed
```

### View Logs
```bash
# Backend logs (in backend directory)
npm run dev

# Watch for errors in terminal
# Common logs:
# - "Server running on port 5000" ✅
# - "MongoDB Connected" ✅
# - "POST /api/auth/register 201" ✅
```

### Test API Directly
```bash
# Test opportunities endpoint
curl http://localhost:5000/api/opportunities

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phoneNumber": "+254700000002",
    "password": "Test@1234",
    "institution": "Test University",
    "course": "Test Course",
    "yearOfStudy": "Year 1"
  }'
```

### Browser DevTools
```bash
# Open DevTools: F12 or Cmd+Option+I (Mac)

# Console tab: Check for errors
# Network tab: Check API calls
# Application tab: Check localStorage for JWT token
# Elements tab: Inspect HTML/CSS
```

---

## 📞 GETTING HELP

### Check These First:
1. All servers running? (backend + frontend)
2. MongoDB running?
3. Database seeded?
4. Correct URLs in .env files?
5. Browser console errors?

### Common Issues:
- **Nothing shows up**: Check browser console (F12)
- **API errors**: Check backend terminal for errors
- **Styling broken**: Clear cache and hard reload (Cmd+Shift+R)
- **MongoDB errors**: Check MongoDB is running (`ps aux | grep mongod`)

---

## ✅ SUCCESS INDICATORS

You'll know everything is working when:
- ✅ http://localhost:3000 shows beautiful animated homepage
- ✅ 20 opportunities visible on /opportunities page
- ✅ Can register new account
- ✅ Can login with test accounts
- ✅ Dashboard shows after login
- ✅ Can browse and view opportunity details
- ✅ Application form is accessible
- ✅ No errors in browser console or terminal

---

**Happy Testing! 🎉**

If you see the animated landing page with floating blobs, you're all set! 🚀
