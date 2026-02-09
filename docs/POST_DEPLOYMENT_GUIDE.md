# 🔧 POST-DEPLOYMENT GUIDE & TROUBLESHOOTING

**Complete troubleshooting, monitoring, and maintenance guide after deployment**

---

## 📋 Table of Contents

1. [Post-Deployment Verification](#post-deployment-verification)
2. [Common Issues & Solutions](#common-issues--solutions)
3. [Monitoring & Alerts](#monitoring--alerts)
4. [Maintenance & Updates](#maintenance--updates)
5. [Performance Optimization](#performance-optimization)
6. [Security Audit](#security-audit)
7. [Cost Management](#cost-management)
8. [Scaling Up](#scaling-up)

---

## ✅ Post-Deployment Verification

### Immediate Checks (Do This First!)

**Check 1: Frontend Loads**
```bash
# Open in browser
https://opportunityhub.com

# Verify:
✅ Page loads completely (no blank screen)
✅ All text displays correctly
✅ Images/graphics load
✅ Navigation bar appears
✅ Dark mode toggle works
✅ No console errors (F12 → Console tab)
```

**Check 2: API Responds**
```bash
# Test in browser or command line
https://api.opportunityhub.com/api/opportunities

# Expected response:
✅ Valid JSON array
✅ No 404 or 500 errors
✅ Response time < 500ms
✅ HTTPS (green lock)
```

**Check 3: Authentication Works**
```bash
1. Open https://opportunityhub.com
2. Click "Get Started"
3. Register with test email
4. Should send confirmation (or auto-confirm)
5. Login with new account
6. Should see dashboard
```

**Check 4: Main Features**
```bash
✅ Register new account
✅ Login with credentials
✅ Browse opportunities
✅ Click opportunity detail
✅ Apply to opportunity
✅ Submit application
✅ See application in "My Applications"
✅ Admin login (admin@test.com / Admin@123)
✅ Admin dashboard shows stats
✅ Dark mode toggle works
✅ Mobile responsive (test on phone)
```

---

## 🆘 Common Issues & Solutions

### Issue 1: "Cannot connect to server" / 404 errors

**Symptoms:**
- Frontend loads but can't fetch opportunities
- "Failed to fetch" errors in console
- API returns 404

**Causes:**
1. `VITE_API_URL` not updated
2. Railway backend not deployed
3. CORS not configured

**Solutions:**

✅ **Solution A: Update Frontend Environment**
```bash
1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Find VITE_API_URL
4. Change to: https://api.opportunityhub.com/api
5. Click Save
6. Go to Deployments → Redeploy
7. Wait 2-3 minutes
8. Refresh https://opportunityhub.com
```

✅ **Solution B: Check Railway Deployment**
```bash
1. Go to Railway Dashboard
2. Click your project
3. Click backend service
4. Check "Status" - should be green ✅
5. If red ❌ or yellow ⚠️:
   - Click "Deploy" to redeploy
   - Check logs for errors
```

✅ **Solution C: Check Backend Environment**
```bash
1. Railway dashboard → Backend service
2. Click "Variables" tab
3. Verify CORS_ORIGIN=https://opportunityhub.com
4. If wrong, update and redeploy
5. Test: https://api.opportunityhub.com/api/opportunities
```

✅ **Solution D: Check CORS in Backend Code**
```bash
# backend/src/server.js should have:
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

### Issue 2: "Cannot connect to database" / Database errors

**Symptoms:**
- 500 error on registration
- 500 error on login
- Database connection timeout

**Causes:**
1. MongoDB URI incorrect
2. Database credentials wrong
3. IP whitelist blocking connection
4. Database not created

**Solutions:**

✅ **Solution A: Verify MongoDB URI**
```bash
1. Go to MongoDB Atlas Dashboard
2. Click Database → Connect
3. Copy new connection string
4. Check format:
   mongodb+srv://username:password@cluster.mongodb.net/dbname
5. Go to Railway → Environment Variables
6. Update MONGODB_URI with new string
7. Redeploy
```

✅ **Solution B: Check IP Whitelist**
```bash
1. MongoDB Atlas → Network Access
2. Should show 0.0.0.0/0 (allow all)
3. If not, click "Add IP Address"
4. Select "Allow access from anywhere"
5. Click "Confirm"
6. Wait 1 minute and try again
```

✅ **Solution C: Test Connection Locally**
```bash
# In terminal, test MongoDB connection:
mongo "mongodb+srv://user:password@cluster.mongodb.net/dbname"

# If connects, MongoDB is working
# If fails, check:
- Username/password correct?
- @ and : characters escaped?
- Cluster name correct?
```

---

### Issue 3: Domain not resolving / "This site can't be reached"

**Symptoms:**
- DNS timeout error
- "Temporary Failure in Name Resolution"
- Still shows Namecheap parking page

**Causes:**
1. DNS hasn't propagated yet
2. DNS records incorrect in Namecheap
3. Browser cache issue

**Solutions:**

✅ **Solution A: Wait for DNS Propagation**
```bash
# Check at https://whatsmydns.net/
1. Enter: opportunityhub.com
2. Select: A record
3. Click Search
4. If shows green checkmarks: DNS is live
5. If shows red X: Still propagating (wait up to 48 hours)
```

✅ **Solution B: Verify DNS Records in Namecheap**
```bash
1. Login to Namecheap
2. Domain List → Manage → Manage DNS
3. Verify these records:
   - A record: @ → 76.76.19.132
   - CNAME record: www → cname.vercel-dns.com
   - CNAME record: api → railway-domain.up.railway.app
4. If wrong, update and save
5. Wait 15 minutes to 24 hours
```

✅ **Solution C: Clear Local DNS Cache**
```bash
# Windows (PowerShell or Command Prompt as Admin):
ipconfig /flushdns

# Mac:
sudo dscacheutil -flushcache

# Linux:
sudo systemctl restart systemd-resolved
```

✅ **Solution D: Try Incognito/Private Browsing**
```bash
1. Open Incognito window (Ctrl+Shift+N)
2. Try accessing https://opportunityhub.com
3. If works, your browser cache was the issue
4. Clear regular browser cache: Ctrl+Shift+Del
```

---

### Issue 4: SSL certificate showing as unsafe / "Not Secure"

**Symptoms:**
- ⚠️ Warning instead of 🔒 lock
- "Your connection is not private"
- Warnings about certificate

**Causes:**
1. Vercel hasn't generated certificate yet
2. Domain not verified in Vercel
3. Certificate validation pending

**Solutions:**

✅ **Solution A: Wait 24 Hours**
```bash
# Vercel generates certificates automatically
# But needs time (up to 24 hours)
1. First deployment: wait 24 hours
2. Subsequent: usually 1 hour
3. Check status: https://crt.sh/?q=opportunityhub.com
4. If certificate exists, wait for browser to cache
```

✅ **Solution B: Refresh Domain in Vercel**
```bash
1. Vercel Dashboard → Settings → Domains
2. Find your domain
3. Click three dots (...)
4. Select "Refresh"
5. Wait 5 minutes
6. Try accessing site
```

✅ **Solution C: Verify Domain Ownership**
```bash
1. Vercel may send email to verify domain
2. Check your email (spam folder too)
3. Click verification link
4. Wait 24 hours for certificate
```

---

### Issue 5: Payments not working / M-PESA integration issues

**Symptoms:**
- "Payment failed" message
- STK push not showing
- Payment doesn't complete

**Causes:**
1. M-PESA credentials wrong
2. Using production keys instead of sandbox
3. Phone number format incorrect

**Solutions:**

✅ **Solution A: Verify M-PESA Credentials**
```bash
1. Go to Railway → Environment Variables
2. Check: MPESA_CONSUMER_KEY
3. Check: MPESA_CONSUMER_SECRET
4. For testing: Use SANDBOX credentials
5. For production: Use LIVE credentials
6. Must match exactly (case-sensitive)
7. If wrong, update and redeploy
```

✅ **Solution B: Use Correct Phone Format**
```bash
# M-PESA phone format: 254XXXXXXXXX

Examples:
✅ 254712345678 (correct)
❌ 712345678 (missing country code)
❌ +254712345678 (has + sign)
❌ 0712345678 (has 0 instead of 254)
```

✅ **Solution C: Check Sandbox vs Production**
```bash
# For TESTING (development):
- Get credentials from: https://developer.safaricom.co.ke/
- Use SANDBOX keys
- Test with sandbox phone numbers

# For LIVE (production):
- Request LIVE credentials from Safaricom
- Use LIVE keys
- Requires verification

# To switch:
1. Update M-PESA keys in Railway
2. Redeploy
3. Test again
```

---

### Issue 6: Emails not sending

**Symptoms:**
- Registration email doesn't arrive
- Confirmation emails missing
- No application notifications

**Causes:**
1. Email credentials not set
2. Gmail blocking automated sends
3. Email configuration wrong
4. Email service not configured

**Solutions:**

✅ **Solution A: Configure Email in Railway**
```bash
1. Railway → Backend Service → Variables
2. Add these:
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
3. Redeploy
```

✅ **Solution B: Generate Gmail App Password**
```bash
# For Gmail users:
1. Go to https://myaccount.google.com/
2. Security → App Passwords
3. Generate password for "Mail"
4. Copy password
5. Use in EMAIL_PASSWORD (not your regular password)
```

✅ **Solution C: Check Email Logs**
```bash
1. Railway → Logs tab
2. Search for "email" or "mail"
3. Check for error messages
4. If error, fix and redeploy
```

---

### Issue 7: File uploads not working / S3 integration

**Symptoms:**
- "Upload failed" error
- Files don't save
- 403 Forbidden on upload

**Causes:**
1. AWS credentials missing
2. S3 bucket doesn't exist
3. S3 bucket permissions wrong
4. Credentials don't have S3 access

**Solutions:**

✅ **Solution A: Check AWS Credentials**
```bash
1. Railway → Backend Service → Variables
2. Verify:
   AWS_ACCESS_KEY_ID=(set)
   AWS_SECRET_ACCESS_KEY=(set)
3. If missing, add from AWS IAM
4. Must have S3 permissions
5. Redeploy
```

✅ **Solution B: Verify S3 Bucket**
```bash
1. AWS Console → S3
2. Find bucket: opportunityhub-uploads
3. If not exists, create it
4. Make bucket public (not recommended for security)
5. Or configure CORS for CloudFront
6. Update bucket name in backend config
```

✅ **Solution C: Create S3 Bucket**
```bash
# If bucket doesn't exist:
1. AWS Console → S3 → Create Bucket
2. Bucket name: opportunityhub-uploads-[random]
3. Region: Same as your region
4. Unblock public access (for testing)
5. Update backend config
6. Redeploy
```

---

### Issue 8: Application crashes / Server errors (500)

**Symptoms:**
- Red error page
- "Internal Server Error"
- 500 status code

**Causes:**
1. Missing environment variables
2. Code error/bug
3. Database issue
4. Out of memory

**Solutions:**

✅ **Solution A: Check Railway Logs**
```bash
1. Railway Dashboard → Project
2. Click backend service
3. Click "Logs" tab
4. Scroll to find error messages
5. Error will show line number
6. Fix code and redeploy
```

✅ **Solution B: Verify All Environment Variables**
```bash
1. Railway → Variables tab
2. Check ALL required variables are set
3. No typos or missing values
4. No special characters needing escaping
5. Redeploy
```

✅ **Solution C: Check Memory Usage**
```bash
1. Railway → Metrics tab
2. Check Memory usage
3. If consistently high (>200MB):
   - Upgrade Railway plan
   - Optimize code
   - Check for memory leaks
```

✅ **Solution D: Restart Service**
```bash
1. Railway → Settings
2. Click "Restart" button
3. Service will restart
4. Check if error persists
```

---

## 📊 Monitoring & Alerts

### Setup Vercel Monitoring

**Enable Analytics:**
```bash
1. Vercel Dashboard → Project
2. Click "Analytics" tab
3. See page views, deployments
4. Monitor error rate
5. Track performance
```

**Setup Error Notifications:**
```bash
1. Settings → Integrations
2. Add Slack (optional)
3. Get notifications for deployment failures
4. Get notifications for errors
```

### Setup Railway Monitoring

**Enable Logs:**
```bash
1. Railway Dashboard → Project
2. Backend service → Logs
3. Check logs regularly
4. Search for errors: "error" or "ERROR"
```

**Monitor Metrics:**
```bash
1. Click Metrics tab
2. Watch for:
   - CPU > 80% (upgrade needed)
   - Memory > 200MB (optimize or upgrade)
   - Restart count > 0 (check for crashes)
```

**Setup Alerts:**
```bash
1. Railway → Settings
2. Add notification email
3. Get alerts for:
   - Deployment failures
   - High CPU/Memory
   - Service crashes
```

### Setup MongoDB Atlas Monitoring

**Enable Monitoring:**
```bash
1. MongoDB Atlas → Monitoring
2. Check cluster health
3. Monitor operations
4. Check replication lag
```

**Setup Backups:**
```bash
1. MongoDB Atlas → Backups
2. Enable automatic backups (default: on)
3. Backups run daily
4. Keep for 35 days
5. Can restore from backup
```

---

## 🔄 Maintenance & Updates

### Daily (Automated)

✅ Already done automatically:
- Vercel: Auto-deploys on GitHub push
- Railway: Auto-deploys on push
- MongoDB: Auto-backs up daily
- Vercel: SSL certificate auto-renews
- Vercel: Automatic caching

### Weekly Tasks

```bash
✅ Monday:
  [ ] Check Vercel analytics
  [ ] Check Railway metrics
  [ ] Check MongoDB status
  [ ] Review error logs

✅ Wednesday:
  [ ] Check user registrations
  [ ] Check applications submitted
  [ ] Check payment success rate
  [ ] Review performance metrics

✅ Friday:
  [ ] Check total cost
  [ ] Review security logs
  [ ] Check backup status
  [ ] Plan weekend updates
```

### Monthly Tasks

```bash
✅ First week:
  [ ] Update dependencies (npm update)
  [ ] Security audit
  [ ] Review cost breakdown
  [ ] Plan scaling if needed

✅ Second week:
  [ ] Test all features manually
  [ ] Check SSL certificate expiration
  [ ] Review logs for patterns
  [ ] Optimize slow endpoints

✅ Third week:
  [ ] Performance optimization
  [ ] Database cleanup
  [ ] Archive old logs
  [ ] Update documentation

✅ Fourth week:
  [ ] Plan next month
  [ ] Review roadmap
  [ ] Prepare major updates
  [ ] Backup all data
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update major versions (be careful)
npm install package@latest

# After updating, test locally:
npm run dev

# Then push to GitHub and test live
```

---

## ⚡ Performance Optimization

### Frontend Optimization

**Check Lighthouse Score:**
```bash
1. Open https://opportunityhub.com
2. F12 → Lighthouse tab
3. Click "Analyze page load"
4. Score should be 90+
5. Fix any red flags
```

**Optimize Images:**
```bash
1. Use WebP format
2. Compress JPG/PNG
3. Use responsive images
4. Lazy load below-fold
```

**Optimize Bundle:**
```bash
npm run build
# Check bundle size
# Should be <200KB gzipped
```

### Backend Optimization

**Database Indexing:**
```bash
# MongoDB Atlas → Collections
# Add indexes on frequently searched fields:
- User.email (unique)
- Application.applicant
- Application.opportunity
- Opportunity.type
```

**API Response Caching:**
```bash
# Add caching headers:
app.get('/api/opportunities', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  // ...
});
```

**Reduce Database Queries:**
```bash
# Use Mongoose select() to limit fields
# Use populate() only when needed
# Use pagination for large collections
```

---

## 🔐 Security Audit

### Weekly Security Checks

- [ ] Check for suspicious login attempts
- [ ] Review admin access logs
- [ ] Verify HTTPS on all pages
- [ ] Check for security warnings
- [ ] Review GitHub commits

### Monthly Security Audit

```bash
✅ Check all secrets are hidden
✅ Verify no sensitive data in logs
✅ Review user permissions
✅ Check rate limiting is active
✅ Verify CORS configuration
✅ Test SQL injection prevention
✅ Test XSS prevention
✅ Review firewall rules
```

### Quarterly Penetration Testing

```bash
✅ Security scan of frontend
✅ Security scan of API
✅ Check for vulnerabilities
✅ Test authentication flows
✅ Test authorization
✅ Review security headers
```

---

## 💰 Cost Management

### Monitor Costs

**Vercel:**
```bash
1. Go to https://vercel.com/billing
2. Check usage
3. Compare to plan
4. Scale plan if needed
```

**Railway:**
```bash
1. Railway Dashboard → Billing
2. Current month usage
3. Compare to plan
4. Upgrade if needed
```

**MongoDB Atlas:**
```bash
1. MongoDB Atlas → Billing
2. Current usage
3. Cluster tier
4. Upgrade if needed
```

**Total Monthly Cost:**
```bash
Vercel:     $0-20
Railway:    $7-50
MongoDB:    $0-50
Domain:     ~$1
────────────────
TOTAL:      $8-121/month
```

### Cost Optimization

**Vercel:**
- [ ] Use free tier if < 100GB bandwidth
- [ ] Upgrade to Pro ($20) if needed
- [ ] Use Edge Functions for simple tasks

**Railway:**
- [ ] Monitor usage daily
- [ ] Scale services down if not needed
- [ ] Use smaller instances for dev/staging
- [ ] Set spending alert

**MongoDB:**
- [ ] Keep on M0 (free) as long as possible
- [ ] Upgrade to M2 ($50/month) if > 512MB
- [ ] Don't upgrade to M5 unless >50GB

---

## 🚀 Scaling Up

### When to Scale

**Scale Frontend when:**
- Lighthouse score < 90
- Build time > 3 minutes
- Edge location slow

**Scale Backend when:**
- CPU usage > 80%
- Response time > 500ms
- Memory usage > 200MB

**Scale Database when:**
- Storage > 400MB (approaching limit)
- Response time > 100ms
- Too many concurrent connections

### How to Scale

**Frontend Scaling:**
```bash
Vercel:
1. Upgrade to Vercel Pro ($20/month)
2. More build concurrent
3. Edge Functions available
4. Better Analytics
```

**Backend Scaling:**
```bash
Railway:
1. Check current plan
2. Upgrade to higher tier
3. Auto-scaling available
4. More resources allocated
```

**Database Scaling:**
```bash
MongoDB Atlas:
1. Change tier from M0 → M2 ($50/month)
2. Automatic backups
3. Sharding available
4. More resources
```

---

## 📞 Support & Help

### If You're Stuck

1. **Check Logs First**
   - Railway logs
   - Vercel deployment logs
   - MongoDB Atlas logs
   - Browser console (F12)

2. **Search Documentation**
   - Vercel docs: https://vercel.com/docs
   - Railway docs: https://docs.railway.app
   - MongoDB docs: https://docs.mongodb.com

3. **Google the Error**
   - Search exact error message
   - Usually find solution on Stack Overflow

4. **Ask Community**
   - Vercel community: https://github.com/vercel/vercel/discussions
   - Railway community: https://discord.gg/railway
   - MongoDB community: https://www.mongodb.com/community

5. **Contact Support**
   - Vercel: https://vercel.com/support
   - Railway: https://railway.app/support
   - MongoDB: https://www.mongodb.com/support

---

## 🎉 You're All Set!

Your deployment is complete and you now know how to:

✅ Monitor your application  
✅ Handle common issues  
✅ Optimize performance  
✅ Manage costs  
✅ Scale when needed  
✅ Maintain security  
✅ Update dependencies  
✅ Backup data  

**Happy deploying!** 🚀
