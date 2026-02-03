# 🔐 ADMIN DASHBOARD - Complete Guide

## 🎯 Overview

The admin dashboard allows you to:
- ✅ Manage opportunities (create, edit, delete, approve/reject)
- ✅ Monitor platform statistics
- ✅ Sync jobs from Adzuna & Jooble APIs
- ✅ View analytics and insights
- ✅ Manage user applications

---

## 🚀 Quick Access

### Admin Login Credentials
```
Email: admin@ias.com
Password: Admin@123
```

### Admin Routes
```
/admin/dashboard          - Main dashboard
/admin/opportunities/new  - Add new opportunity
/admin/opportunities/:id/edit - Edit opportunity
/admin/sync-jobs          - Sync from job APIs
/admin/analytics          - View platform analytics
```

---

## 📊 Admin Dashboard Features

### 1. **Dashboard Stats** (4 Key Metrics)

**Total Opportunities**
- Shows all opportunities (manual + API imported)
- Icon: Briefcase (Indigo)

**Active Opportunities**
- Currently live listings
- Icon: CheckCircle (Green)

**Pending Applications**
- Applications awaiting review
- Icon: Clock (Yellow)

**Total Users**
- Registered students on platform
- Icon: Users (Purple)

### 2. **Quick Actions** (3 Cards)

**Add Opportunity** (Manual)
- Opens form to manually post opportunity
- Direct creation, auto-approved
- Gradient: Indigo → Purple

**Sync Job APIs**
- Import from Adzuna &  Jooble
- Bulk import opportunities
- Status: Pending (requires approval)
- Gradient: Purple → Pink

**View Analytics**
- Platform metrics and insights
- Charts and graphs
- Gradient: Pink → Red

### 3. **Opportunity Management Table**

**Columns:**
- Title & Location
- Company
- Source (Manual | Adzuna | Jooble | RSS)
- Status (Pending | Approved | Active | Rejected)
- Created Date
- Actions

**Filters:**
- All Opportunities
- Pending Review
- Approved
- Rejected
- Active
- Closed

**Actions:**
- ✅ Approve (if pending)
- ❌ Reject (if pending)
- 👁️ View Details
- ✏️ Edit
- 🗑️ Delete (soft delete)

---

## 📝 Add Opportunity Form

### Fields:

**Basic Information:**
- Job Title* (e.g., "Software Engineering Intern")
- Company Name* (e.g., "Safaricom PLC")
- Type* (Internship | Industrial Attachment)
- Category* (IT | Engineering | Business | Healthcare | Other)
- Location* (e.g., "Nairobi, Kenya")
- Duration (e.g., "6 months")
- Number of Positions* (default: 1)
- Stipend (e.g., "KES 20,000/month" or "Unpaid")
- Application Deadline* (date picker)

**Job Details:**
- Description* (textarea, character counter)

**Requirements:**
- Dynamic list (add/remove)
- Each requirement is a separate input
- Click "+ Add Requirement" to add more

**Additional Info:**
- Application URL (optional)
- Leave empty to use internal system
- If provided, "Apply" redirects to external link

### Submission:
- **Cancel** - Returns to dashboard
- **Create Opportunity** - Saves and redirects

**Status:** Manually created opportunities are automatically **Active** (no approval needed)

---

## 🤖 Job API Integration

### Supported APIs:

#### 1. **Adzuna API**
- **Country:** Kenya
- **Search Terms:** intern, internship, graduate, attachment
- **Results:** Up to 50 jobs per sync
- **Status:** Pending (requires admin approval)

#### 2. **Jooble API**
- **Location:** Kenya
- **Keywords:** intern, internship, graduate program, attachment
- **Results:** Multiple jobs per sync
- **Status:** Pending (requires admin approval)

### Setup API Credentials:

**Backend `.env` file:**
```bash
# Adzuna API
ADZUNA_APP_ID=your_app_id_here
ADZUNA_APP_KEY=your_app_key_here

# Jooble API
JOOBLE_API_KEY=your_api_key_here
```

### Get API Keys:

**Adzuna:**
1. Visit: https://developer.adzuna.com/
2. Sign up for free account
3. Create app to get APP_ID and APP_KEY
4. Free tier: 1000 calls/month

**Jooble:**
1. Visit: https://jooble.org/api/about
2. Request API key (free)
3. Approval within 24-48 hours
4. Add key to .env

### Sync Jobs:

**Option 1: Admin Dashboard UI**
1. Login as admin
2. Click "Sync Job APIs"
3. Click "Sync Adzuna" or "Sync Jooble"
4. Wait for import completion
5. Review imported jobs in "Pending Review" filter
6. Approve/Reject individually

**Option 2: API Endpoint**
```bash
# Sync Adzuna
curl -X POST http://localhost:5000/api/admin/sync/adzuna \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Sync Jooble
curl -X POST http://localhost:5000/api/admin/sync/jooble \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "message": "Adzuna sync completed",
  "imported": 15,
  "skipped": 5,
  "total": 20
}
```

### How API Sync Works:

1. **Fetch** jobs from API
2. **Check** if job already exists (by title + company)
3. **Skip** duplicates
4. **Map** API data to our schema:
   - title → title
   - company → company
   - description → description
   - location → location
   - salary → stipend
   - redirect_url → applyUrl
5. **Create** opportunity with:
   - source: "adzuna" or "jooble"
   - status: "pending" (requires approval)
   - applicationDeadline: 30 days from now
6. **Return** summary (imported, skipped, total)

### Approve/Reject API Jobs:

**In Dashboard:**
1. Filter: "Pending Review"
2. Review job details
3. Click ✅ Approve or ❌ Reject
4. Approved jobs become "active"
5. Rejected jobs hidden from students

**Why Require Approval?**
- Quality control
- Remove irrelevant jobs
- Fix incorrect categorizations
- Verify company legitimacy

---

## 🗄️ MongoDB Data Model

### Opportunity Schema:

```javascript
{
  _id: ObjectId,
  title: "Frontend Developer Intern",
  company: "Safaricom",
  type: "internship" | "industrial-attachment",
  location: "Nairobi",
  stipend: "KES 20,000/month",
  description: "...",
  requirements: ["React", "Git", ...],
  applyUrl: "https://...",  // Optional external link
  source: "manual" | "adzuna" | "jooble" | "rss",
  status: "pending" | "approved" | "active" | "rejected" | "closed",
  createdAt: Date,
  applicationDeadline: Date,
  positions: 5,
  category: "IT" | "Engineering" | "Business" | "Healthcare" | "Other",
  duration: "6 months"
}
```

### User Schema (with Admin):

```javascript
{
  email: "admin@ias.com",
  passwordHash: "...",
  role: "student" | "admin",
  firstName: "Admin",
  lastName: "User"
}
```

---

## 🧪 Testing Admin Features

### Test Flow 1: Manual Opportunity Creation

1. **Login as Admin**
   ```
   Email: admin@ias.com
   Password: Admin@123
   ```

2. **Go to Dashboard**
   - URL: `/admin/dashboard`
   - Should see stats and quick actions

3. **Click "Add Opportunity"**
   - Fill all required fields
   - Add 3-5 requirements
   - Set deadline (future date)
   - Click "Create Opportunity"

4. **Verify Creation**
   - Redirected to dashboard
   - New opportunity in table
   - Status: "active"
   - Source: "manual"

5. **View as Student**
   - Logout
   - Login as student@test.com
   - Browse opportunities
   - Should see your newly created opportunity

### Test Flow 2: API Sync

1. **Setup API Credentials**
   ```bash
   cd backend
   # Edit .env
   ADZUNA_APP_ID=your_id
   ADZUNA_APP_KEY=your_key
   ```

2. **Restart Backend**
   ```bash
   npm run dev
   ```

3. **Sync Jobs**
   - Login as admin
   - Click "Sync Job APIs"
   - Click "Sync Adzuna"
   - Wait for completion
   - Check response message

4. **Review Imported Jobs**
   - Filter: "Pending Review"
   - Should see jobs with source "adzuna"
   - Status: "pending"

5. **Approve Jobs**
   - Click ✅ on relevant jobs
   - Status changes to "approved"
   - Now visible to students

### Test Flow 3: Edit & Delete

1. **Edit Opportunity**
   - Click ✏️ Edit icon
   - Modify fields
   - Save changes
   - Verify updates

2. **Delete Opportunity**
   - Click 🗑️ Delete icon
   - Confirm deletion
   - Opportunity soft-deleted
   - Status: "deleted"
   - Hidden from students

### Test Flow 4: Filters & Search

1. **Test Filters**
   - Select "Pending Review" → See only pending
   - Select "Active" → See only active
   - Select "All" → See everything

2. **Verify Sorting**
   - Table sorted by createdAt (newest first)

### Test Flow 5: Analytics

1. **View Analytics**
   - Click "View Analytics"
   - Should see:
     - Opportunities by category
     - Opportunities by source
     - Applications by status
     - Recent applications

---

## 🛡️ Security Features

### Authentication:
- JWT token required
- Token in Authorization header: `Bearer TOKEN`

### Authorization:
- Role check: `role === 'admin'`
- 403 Forbidden if not admin
- All `/api/admin/*` routes protected

### Middleware Chain:
```javascript
router.use(protect);    // 1. Verify JWT
router.use(adminOnly);  // 2. Check admin role
```

### IP Allowlist (Optional Production):
```javascript
const allowedIPs = ['123.456.789.0'];
if (!allowedIPs.includes(req.ip)) {
  return res.status(403).json({ message: 'IP not allowed' });
}
```

### Rate Limiting (Production):
```javascript
const rateLimit = require('express-rate-limit');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/admin', adminLimiter);
```

---

## 🎨 UI Features

### Dashboard Design:
- **Gradient Header:** Indigo → Purple
- **Stats Cards:** Color-coded by metric
- **Quick Action Cards:** Gradient backgrounds with hover effects
- **Table:** Clean, professional with action buttons
- **Filters:** Dropdown for status filtering

### Color Coding:

**Stats:**
- Total: Indigo (#4f46e5)
- Active: Green (#10b981)
- Pending: Yellow (#f59e0b)
- Users: Purple (#a855f7)

**Status Badges:**
- Pending: Yellow background
- Approved: Green background
- Rejected: Red background
- Active: Blue background
- Closed: Gray background

**Source Badges:**
- Manual: Indigo
- Adzuna: Purple
- Jooble: Pink
- RSS: Orange

### Animations:
- Cards hover: lift + shadow
- Buttons: scale on hover
- Table rows: background change
- Loading: spinner animation

---

## 📝 Environment Variables

### Required for Admin:
```bash
# JWT
JWT_SECRET=your-secret-key-change-in-production

# MongoDB
MONGO_URI=mongodb://localhost:27017/industrial-attachment

# Adzuna (Optional - for API sync)
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key

# Jooble (Optional - for API sync)
JOOBLE_API_KEY=your_api_key
```

---

## 🔧 Troubleshooting

### Admin can't access dashboard
- **Check:** User role is "admin" in database
  ```javascript
  // MongoDB
  db.users.find({ email: "admin@ias.com" })
  // Should show: role: "admin"
  ```

### API sync returns 400
- **Check:** API credentials in .env
- **Check:** .env is loaded (restart server)
- **Test:** API endpoints directly

### Opportunities not showing
- **Check:** Status filter (try "All")
- **Check:** Database connection
- **Check:** Backend logs for errors

### Can't approve/reject
- **Check:** Opportunity status is "pending"
- **Check:** Admin token is valid
- **Check:** Network tab for API errors

---

## 🚀 Production Deployment

### Additional Security:

1. **Hide Admin Routes:**
   ```javascript
   // Don't show /admin in navbar for non-admins
   {user.role === 'admin' && (
     <Link to="/admin/dashboard">Admin</Link>
   )}
   ```

2. **Rate Limit:**
   ```javascript
   // Limit admin login attempts
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5 // 5 attempts per 15 minutes
   });
   ```

3. **Strong Passwords:**
   - Min 12 characters
   - Upper, lower, number, symbol
   - Password strength checker

4. **Two-Factor Authentication** (Advanced):
   - SMS or authenticator app
   - Required for admin actions

5. **Audit Logging:**
   ```javascript
   // Log all admin actions
   logger.info(`Admin ${req.user.email} approved opportunity ${oppId}`);
   ```

---

## 📊 Future Enhancements

### Phase 2:
- [ ] RSS feed integration
- [ ] Bulk approve/reject
- [ ] Export to CSV
- [ ] Advanced analytics (charts)
- [ ] Email notifications for new jobs

### Phase 3:
- [ ] Company portal (self-service posting)
- [ ] Automated quality scoring
- [ ] Machine learning categorization
- [ ] Duplicate detection
- [ ] Multi-admin support

---

## ✅ Admin Testing Checklist

- [ ] Can login with admin@ias.com
- [ ] Dashboard loads with correct stats
- [ ] Can create new opportunity
- [ ] Created opportunity appears in table
- [ ] Can filter opportunities by status
- [ ] Can approve pending opportunity
- [ ] Can reject pending opportunity
- [ ] Can edit opportunity
- [ ] Can delete opportunity
- [ ] API sync works (if configured)
- [ ] Imported jobs require approval
- [ ] Analytics page loads
- [ ] Non-admin users can't access admin routes
- [ ] Student accounts see approved opportunities

---

**Admin Dashboard Ready! 🎉**

Now you have complete control over all opportunities - manual posting + automated API imports!
