# 🚀 Hybrid Deployment Guide - OpportunityHub

**Deploy your app for $40-80/month using AWS Frontend + Railway/Render Backend + MongoDB Atlas**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Setup MongoDB Atlas](#phase-1-setup-mongodb-atlas)
4. [Phase 2: Deploy Backend (Railway or Render)](#phase-2-deploy-backend-railway-or-render)
5. [Phase 3: Deploy Frontend (S3 + CloudFront)](#phase-3-deploy-frontend-s3--cloudfront)
6. [Phase 4: Configure Route 53 DNS](#phase-4-configure-route-53-dns)
7. [Phase 5: Testing & Verification](#phase-5-testing--verification)
8. [Phase 6: Monitoring & Maintenance](#phase-6-monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Cost Breakdown](#cost-breakdown)

---

## 🎯 Overview

This guide walks you through deploying **OpportunityHub** using:

| Component | Service | Cost |
|-----------|---------|------|
| **Frontend** | AWS S3 + CloudFront + Route 53 | ~$15/month |
| **Backend** | Railway OR Render | $7-30/month |
| **Database** | MongoDB Atlas | $0-30/month |
| **Total** | | **$40-80/month** |

### Why This Approach?
✅ Cost-efficient ($40-80/month vs $70-120 for full AWS)
✅ Easy deployment (no Kubernetes complexity)
✅ Auto-scaling included (Railway/Render handles it)
✅ Free database tier available (MongoDB Atlas M0)
✅ Global CDN for frontend (CloudFront)

**Timeline: ~2 hours from start to live**

---

## ✅ Prerequisites

Before starting, ensure you have:

### Accounts & Tools
- [ ] GitHub account (code repo)
- [ ] AWS account (for S3, CloudFront, Route 53)
- [ ] Railway OR Render account (pick one for backend)
- [ ] MongoDB Atlas account (for database)
- [ ] Domain name (e.g., opportunityhub.com)
- [ ] Node.js 18+ installed locally
- [ ] Git installed

### Code Ready
- [ ] Backend code with `.env` example
- [ ] Frontend code ready to build
- [ ] Dockerfile for backend (if using Railway/Render)
- [ ] `package.json` with build script

### AWS Credentials
- [ ] AWS Access Key ID
- [ ] AWS Secret Access Key
- [ ] (Get from AWS Console → IAM → Users → Security credentials)

---

## Phase 1: Setup MongoDB Atlas

MongoDB Atlas is a free cloud database. **Free tier includes 512MB storage — perfect for MVP.**

### Step 1.1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email or Google
4. Create organization (name: `OpportunityHub`)
5. Verify email

### Step 1.2: Create Cluster

1. Click "Create a Deployment"
2. Select **Free** tier (M0 Sandbox)
3. Choose region: **US-East (Ohio)** or closest to your users
4. Cluster name: `opportunityhub-cluster`
5. Click "Create"
6. Wait 2-5 minutes for cluster to provision

### Step 1.3: Configure Security

**Create Database User:**
1. Go to **Security** → **Database Access**
2. Click "Add New Database User"
3. Fill in:
   - Username: `appuser`
   - Password: Generate strong password (copy it!)
   - Role: `Atlas Admin`
4. Click "Add User"

**Allow Network Access:**
1. Go to **Security** → **Network Access**
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (or add your IP)
4. Confirm

### Step 1.4: Get Connection String

1. Go to **Deployments** → Click your cluster
2. Click "Connect"
3. Select "Drivers"
4. Copy connection string that looks like:
   ```
   mongodb+srv://appuser:PASSWORD@opportunityhub-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `PASSWORD` with your actual password**
6. **Save this string — you'll need it soon!**

**Connection String Format:**
```
mongodb+srv://appuser:YOUR_PASSWORD@opportunityhub-cluster.xxxxx.mongodb.net/opportunityhub?retryWrites=true&w=majority
```

✅ **MongoDB Atlas is ready!**

---

## Phase 2: Deploy Backend (Railway or Render)

Pick **ONE** of these options. Railway is faster to set up; Render is more feature-rich.

### Option A: Railway (Recommended for Speed)

#### Step 2A.1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repos

#### Step 2A.2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `FINAL-COMPLETE-APP` repo
4. Select `backend` as the root directory
5. Click "Deploy"

#### Step 2A.3: Configure Environment Variables

1. Go to your Railway project → **Variables**
2. Add these environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mongodb+srv://appuser:PASSWORD@opportunityhub-cluster.xxxxx.mongodb.net/opportunityhub?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-generate-random-string
   MPESA_CONSUMER_KEY=your-mpesa-key
   MPESA_CONSUMER_SECRET=your-mpesa-secret
   MPESA_PASSKEY=your-mpesa-passkey
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```

3. **Replace all `your-*` values with actual credentials**
4. Save changes

#### Step 2A.4: Deploy

1. Railway automatically deploys on git push
2. Go to **Deployments** tab
3. Wait for "Success" status (2-5 minutes)
4. Click on deployment → **View logs** to confirm it's running

#### Step 2A.5: Get Backend URL

1. Go to **Settings**
2. Under "Domains", copy your Railway URL (looks like: `https://opportunityhub-prod-xxxx.railway.app`)
3. **Save this URL — you'll need it for frontend config!**

---

### Option B: Render (More Control)

#### Step 2B.1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repos

#### Step 2B.2: Create Web Service

1. Click "New +" → "Web Service"
2. Select your repo
3. Fill in:
   - **Name:** `opportunityhub-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Plan:** Free
4. Click "Create Web Service"

#### Step 2B.3: Add Environment Variables

1. Go to **Environment**
2. Add variables (click "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mongodb+srv://appuser:PASSWORD@opportunityhub-cluster.xxxxx.mongodb.net/opportunityhub?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key
   MPESA_CONSUMER_KEY=your-mpesa-key
   MPESA_CONSUMER_SECRET=your-mpesa-secret
   MPESA_PASSKEY=your-mpesa-passkey
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```
3. Save

#### Step 2B.4: Deploy

1. Render auto-deploys on push
2. Check **Logs** to ensure it started
3. Wait for "Live" status

#### Step 2B.5: Get Backend URL

1. Go to **Settings**
2. Copy the public URL (looks like: `https://opportunityhub-backend.onrender.com`)
3. **Save this URL!**

---

## Phase 3: Deploy Frontend (S3 + CloudFront)

### Step 3.1: Build Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output will be in: frontend/dist/
```

### Step 3.2: Create AWS S3 Bucket

```bash
# Create bucket (replace with your domain)
aws s3 mb s3://opportunityhub-frontend-prod --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket opportunityhub-frontend-prod \
  --versioning-configuration Status=Enabled

# Block public access (CloudFront will handle access)
aws s3api put-public-access-block \
  --bucket opportunityhub-frontend-prod \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### Step 3.3: Update Frontend API URL

Before uploading, update your frontend to point to your backend:

**`frontend/src/services/api.js`:**
```javascript
// Change this:
const API_URL = 'http://localhost:5000/api';

// To this (use your Railway/Render URL):
const API_URL = 'https://opportunityhub-prod-xxxx.railway.app/api';
// OR
const API_URL = 'https://opportunityhub-backend.onrender.com/api';
```

Then rebuild:
```bash
npm run build
```

### Step 3.4: Upload Frontend to S3

```bash
# Sync frontend files to S3
aws s3 sync frontend/dist/ s3://opportunityhub-frontend-prod --delete

# Verify upload
aws s3 ls s3://opportunityhub-frontend-prod --recursive
```

### Step 3.5: Create CloudFront Distribution

**Option A: Using AWS Console (Easiest)**

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront)
2. Click "Create Distribution"
3. Choose origin: `opportunityhub-frontend-prod.s3.us-east-1.amazonaws.com`
4. Viewer Protocol Policy: `Redirect HTTP to HTTPS`
5. Default Root Object: `index.html`
6. Click "Create Distribution"
7. Wait 5-10 minutes for deployment

**Option B: Using AWS CLI**

```bash
# Create distribution using CLI (simpler approach)
aws cloudfront create-distribution \
  --origin-domain-name opportunityhub-frontend-prod.s3.us-east-1.amazonaws.com \
  --default-root-object index.html \
  --comment "OpportunityHub Frontend" \
  --enabled
```

Save the output to get your Distribution ID and domain name.

### Step 3.6: Get CloudFront URL

```bash
# List distributions
aws cloudfront list-distributions --query 'DistributionList.Items[0].[Id,DomainName]' --output text
```

Output will be: `XXXXX  d123abc.cloudfront.net`

**Save the CloudFront domain name (d123abc.cloudfront.net)**

✅ **Test it:** Open `https://d123abc.cloudfront.net` in browser

---

## Phase 4: Configure Route 53 DNS

Route 53 is AWS's DNS service. You can register a domain or point an existing one here.

### Step 4.1: Create Hosted Zone (or Skip if Using External DNS)

#### Option A: Use Route 53 for DNS

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name opportunityhub.com \
  --caller-reference $(date +%s)

# Get zone ID from output (save it!)
# Or list hosted zones:
aws route53 list-hosted-zones
```

#### Option B: Use External DNS (GoDaddy, Namecheap, etc.)

Skip to Step 4.2 and point nameservers to Route 53 instead.

### Step 4.2: Add DNS Records

If using Route 53:

```bash
# Get your Hosted Zone ID first
ZONE_ID=Z1234567890ABC

# Create CNAME record for www (points to CloudFront)
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.opportunityhub.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "d123abc.cloudfront.net"}]
      }
    }]
  }'

# Create CNAME record for api (points to Railway/Render)
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.opportunityhub.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "opportunityhub-prod-xxxx.railway.app"}]
      }
    }]
  }'

# Create A record for root domain (optional, points to CloudFront)
# Note: Root domain (example.com) cannot be CNAME. Use A record with alias instead.
```

### Step 4.3: If Using External DNS Provider

1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS settings
3. Add these records:
   ```
   Type: CNAME
   Name: www
   Value: d123abc.cloudfront.net
   
   Type: CNAME
   Name: api
   Value: opportunityhub-prod-xxxx.railway.app
   ```
4. Save and wait 5-30 minutes for propagation

### Step 4.4: Verify DNS

```bash
# Test www subdomain
nslookup www.opportunityhub.com

# Test api subdomain
nslookup api.opportunityhub.com

# Should resolve to CloudFront and Railway/Render URLs respectively
```

✅ **DNS is live!**

---

## Phase 5: Testing & Verification

### Step 5.1: Test Frontend

1. Open **https://www.opportunityhub.com** (or your domain)
2. Verify page loads
3. Check browser console (F12) for errors
4. Test navigation between pages

### Step 5.2: Test Backend API

```bash
# Test health endpoint
curl https://api.opportunityhub.com/api/health

# Should return: { "status": "ok" }
```

### Step 5.3: Test Full Flow

1. **Signup:** Create a test account
   - Go to signup page
   - Register with test email
   - Should receive confirmation (if email configured)

2. **Login:** Test login with credentials
   - Username and password should work
   - Should get JWT token

3. **Browse Opportunities:** List all opportunities
   - Go to opportunities page
   - Should see list from MongoDB

4. **Submit Application:** Create application
   - Click on opportunity
   - Fill form and submit
   - Should appear in "My Applications"

5. **Payment (M-Pesa):** Test payment flow
   - Initiate payment (use Safaricom sandbox credentials)
   - M-Pesa STK should appear on phone
   - Enter test PIN

### Step 5.4: Verify Database

```bash
# Connect to MongoDB Atlas to verify data was saved
# Go to MongoDB Atlas → Clusters → Collections
# Verify documents in:
# - users collection
# - opportunities collection
# - applications collection
# - payments collection
```

---

## Phase 6: Monitoring & Maintenance

### Step 6.1: Setup Error Alerts (Railway/Render)

**Railway:**
1. Go to Project → Settings
2. Enable notifications
3. Get alerts on deployment failures

**Render:**
1. Go to Settings → Notifications
2. Enable email alerts
3. Get notified on service down

### Step 6.2: Monitor Database

**MongoDB Atlas:**
1. Go to Clusters → Activity
2. Monitor queries and performance
3. Check storage usage
4. If exceeding free tier, upgrade plan

### Step 6.3: View Logs

**Railway:**
```bash
# View logs in Railway dashboard
# Or use CLI:
railway logs
```

**Render:**
```bash
# View logs in Render dashboard
# Or enable integration with LogRocket
```

### Step 6.4: Update Deployment

**To push updates:**

```bash
# Make changes to code
git add .
git commit -m "Update feature"
git push origin main

# Railway/Render auto-deploys (2-5 minutes)
```

### Step 6.5: Database Backups

**MongoDB Atlas:**
1. Go to Clusters → Backup
2. Enable automated backups (free tier)
3. Set retention to 7 days
4. Download backups as needed

### Step 6.6: Monitor Costs

**Check your monthly costs:**

```
MongoDB Atlas: $0-9/month (free or M2)
Railway: $7-30/month (based on usage)
AWS S3: ~$1/month (unless very high traffic)
CloudFront: ~$10/month (5-100GB bandwidth)
Route 53: ~$0.50/month (hosting zone)
Total: $18-51/month
```

Monitor in:
- MongoDB Atlas → Billing
- Railway → Metrics
- AWS Billing Dashboard

---

## Troubleshooting

### Frontend won't load

**Issue:** Page shows 404 or blank
**Solution:**
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"

# Or rebuild and re-upload to S3
npm run build
aws s3 sync frontend/dist/ s3://opportunityhub-frontend-prod --delete
```

### API returns 502 Bad Gateway

**Issue:** API is down or not responding
**Solution:**
1. Check Railway/Render logs for errors
2. Verify database connection string is correct
3. Check environment variables are set
4. Restart service (Railway/Render dashboard)

### Database connection fails

**Issue:** "Cannot connect to database"
**Solution:**
1. Verify connection string in environment variables
2. Check MongoDB Atlas Network Access allows your IP
3. Verify username and password are correct
4. Test connection with mongosh:
   ```bash
   mongosh "mongodb+srv://appuser:PASSWORD@cluster.mongodb.net/"
   ```

### DNS not resolving

**Issue:** Domain shows "cannot find" or times out
**Solution:**
```bash
# Wait 30 minutes for DNS propagation
# Then test:
nslookup www.opportunityhub.com

# If still not working, check Route 53 records:
aws route53 list-resource-record-sets --hosted-zone-id ZONE_ID
```

### M-Pesa webhook not working

**Issue:** Payment status not updating
**Solution:**
1. Verify Railway/Render backend is public and accessible
2. Check firewall/security groups allow incoming requests
3. Test webhook URL manually:
   ```bash
   curl https://api.opportunityhub.com/api/payments/webhook
   ```
4. Check logs for webhook errors

### Storage quota exceeded

**Issue:** MongoDB Atlas shows "Quota Exceeded"
**Solution:**
1. Go to MongoDB Atlas → Clusters
2. Upgrade from M0 (free) to M2 ($9/month) or higher
3. Or delete old data if not needed

---

## Cost Breakdown

### Monthly Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Sandbox | FREE |
| Railway | Starter | $7-30 |
| AWS S3 | Standard | $1 |
| CloudFront | Standard | $10-20 |
| Route 53 | Hosted Zone | $0.50 |
| Domain | .com | $12/year |
| **Total** | | **$29-64/month** |

### Cost Optimization Tips

1. **MongoDB Atlas:**
   - Use free M0 tier as long as possible
   - If growing, upgrade to M2 ($9/month) instead of jumping to M5+

2. **Railway:**
   - Monitor usage to avoid overage charges
   - Use free tier if available
   - Consider switching to Render if Railway becomes expensive

3. **AWS:**
   - CloudFront: Compress assets with gzip
   - S3: Use Intelligent-Tiering for archives
   - Enable versioning but clean old versions monthly

4. **Domain:**
   - Register with Namecheap (~$8.88) instead of Route 53 ($12/year)
   - Use existing domain if you have one

---

## Post-Launch Checklist

- [ ] Frontend accessible at www.opportunityhub.com
- [ ] Backend API responding at api.opportunityhub.com
- [ ] Users can signup and login
- [ ] Database storing data correctly
- [ ] M-Pesa payments processing (sandbox)
- [ ] Emails sending (if configured)
- [ ] File uploads working
- [ ] Mobile responsive design verified
- [ ] SSL/TLS certificates valid
- [ ] Error monitoring enabled
- [ ] Database backups scheduled
- [ ] Domain auto-renewal enabled
- [ ] Billing alerts configured

---

## Next Steps After Launch

1. **Collect User Feedback:** 
   - Gather feedback on features
   - Monitor error logs
   - Track user behavior

2. **Scale if Needed:**
   - If MongoDB Atlas quota exceeded, upgrade plan
   - If Railway costs high, optimize code or switch to Render
   - If traffic high, increase CloudFront coverage

3. **Add Features:**
   - Email notifications
   - SMS alerts
   - Analytics dashboard
   - Admin panel improvements

4. **Security Improvements:**
   - Enable 2FA for admin users
   - Add rate limiting
   - Implement API authentication
   - Regular security audits

5. **Performance Optimization:**
   - Monitor CloudFront cache hit ratio
   - Optimize images
   - Minimize JavaScript
   - Enable gzip compression

---

## Support & Resources

- **MongoDB Atlas:** [docs.mongodb.com/atlas](https://docs.mongodb.com/atlas)
- **Railway:** [railway.app/docs](https://railway.app/docs)
- **Render:** [render.com/docs](https://render.com/docs)
- **AWS S3/CloudFront:** [docs.aws.amazon.com/s3](https://docs.aws.amazon.com/s3)
- **Route 53:** [docs.aws.amazon.com/route53](https://docs.aws.amazon.com/route53)

---

## Summary

**You've successfully deployed OpportunityHub!**

🎉 Your app is now live and serving users worldwide.

**What you built:**
- ✅ Frontend served globally via CloudFront
- ✅ Backend auto-scaling on Railway/Render
- ✅ Database with automatic backups
- ✅ Custom domain with HTTPS
- ✅ Complete CI/CD with git push deployments

**Monthly cost: $40-80** (vs $200+ for alternatives)

**Now focus on:**
- Growing your user base
- Improving features based on feedback
- Monitoring performance and costs
- Scaling services as you grow

---

**Last Updated:** February 6, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
