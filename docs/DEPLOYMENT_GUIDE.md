# 🚀 Complete Deployment Guide - OpportunityHub

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Cost Breakdown](#cost-breakdown)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🏗️ Architecture Overview

### Current Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Users (Worldwide)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │Vercel   │      │Netlify  │      │Railway  │
   │(React)  │      │(React)  │      │(React)  │
   └─────────┘      └─────────┘      └─────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                    ┌────▼─────┐
                    │  API Key  │
                    │ (Secure)  │
                    └────┬─────┘
                         │
                    ┌────▼──────────┐
                    │   Backend API  │
                    │  (Node.js)     │
                    │  (Express)     │
                    └────┬──────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
        ┌────────┐  ┌─────────┐  ┌──────────┐
        │Database│  │Payments │  │Upload    │
        │(MongoDB)  │(M-PESA) │  │(AWS S3)  │
        └────────┘  └─────────┘  └──────────┘
```

### Recommended Production Setup
```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                            │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │Vercel    │    │Vercel    │    │Vercel    │
   │Frontend  │    │Frontend  │    │Frontend  │
   └──────────┘    └──────────┘    └──────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │ (Optimized Routing)
                    ┌────▼──────────┐
                    │ AWS ALB        │
                    │ (Load Balance) │
                    └────┬──────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
      ┌─────────┐  ┌──────────┐  ┌──────────┐
      │ Railway │  │ Railway  │  │ Railway  │
      │Backend 1│  │Backend 2 │  │Backend 3 │
      └─────────┘  └──────────┘  └──────────┘
            │            │            │
            └────────────┼────────────┘
                         │
                    ┌────▼──────────┐
                    │AWS RDS MongoDB │
                    │ (Primary)      │
                    │ (3-node)       │
                    └────┬──────────┘
                         │
                    ┌────▼──────────┐
                    │AWS RDS MongoDB │
                    │ (Replica)      │
                    │ (2-node)       │
                    └────────────────┘
```

---

## 📋 Prerequisites

### Required Tools
- Node.js 18+ (`node -v`)
- npm 8+ or Yarn (`npm -v`)
- Git (`git --version`)
- Docker (optional, for local testing)
- AWS Account (S3, RDS, CloudFront)
- MongoDB Atlas Account OR AWS RDS

### Local Setup Check
```bash
# Check all requirements
node -v       # v18.0.0 or higher
npm -v        # 8.0.0 or higher
git -v        # git version 2.x
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended - FREE + PRO)

**Pros:**
- ✅ Fastest deployment (built for Next.js & React)
- ✅ Automatic HTTPS
- ✅ Free tier includes 100GB bandwidth
- ✅ Serverless functions for backend
- ✅ Built-in analytics
- ✅ Preview deployments for each PR

**Cons:**
- ❌ Limited free tier after 100GB
- ❌ Expensive overages

**Cost:** FREE → $20/month (Pro) → $150/month (Enterprise)

#### Steps:

1. **Connect GitHub Repository**
```bash
# Go to https://vercel.com
# Click "New Project"
# Import your GitHub repo
# Authorize Vercel access
```

2. **Configure Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=OpportunityHub
VITE_APP_URL=https://opportunityhub.com
```

3. **Deploy**
```bash
# Push to main branch
git push origin main

# Vercel automatically deploys on git push
# Monitor at https://vercel.com/dashboard
```

4. **Custom Domain**
- Go to Vercel → Project Settings → Domains
- Add your custom domain
- Update DNS records at your domain registrar

### Option 2: Netlify (FREE + PRO)

**Pros:**
- ✅ Good performance
- ✅ Free tier very generous (300 minutes/month builds)
- ✅ Easy GitHub integration
- ✅ Built-in forms (bonus)

**Cons:**
- ❌ Slower than Vercel for edge cases
- ❌ Cold starts on functions

**Cost:** FREE → $19/month (Pro)

#### Steps:

1. **Connect GitHub**
```bash
# Go to https://netlify.com
# Click "New site from Git"
# Select GitHub
# Choose your repository
```

2. **Configure Build Settings**
- Build command: `npm run build`
- Publish directory: `dist`

3. **Add Environment Variables**
Netlify → Site Settings → Build & Deploy → Environment:
```
VITE_API_URL=https://your-backend-api.com
```

4. **Deploy**
```bash
# Push to main
git push origin main

# Netlify auto-deploys
```

### Option 3: AWS Amplify (MODERATE)

**Pros:**
- ✅ Integrated with AWS ecosystem
- ✅ CI/CD pipeline
- ✅ Good for AWS-heavy architectures

**Cost:** FREE → $1-10/month (varies)

#### Quick Setup:
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

---

## 🔧 Backend Deployment

### Option 1: Railway.app (Recommended - CHEAP)

**Pros:**
- ✅ Cheapest paid option ($7-50/month)
- ✅ Docker support
- ✅ Postgres/MongoDB included
- ✅ Simple deployment
- ✅ Free tier available

**Cons:**
- ❌ Smaller company (less established)
- ❌ Less scaling options

**Cost:** $7-50/month (usage-based)

#### Deployment Steps:

1. **Connect GitHub**
```bash
# Go to https://railway.app
# Create new project
# Connect GitHub account
# Select your backend repo
```

2. **Add MongoDB (Optional - use separate DB service)**
```bash
# In Railway dashboard
# Click "Add Service"
# Search "MongoDB"
# Click "Create"
```

3. **Configure Environment**
Railway → Variables:
```
NODE_ENV=production
PORT=8000
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret_key
MPESA_API_KEY=your_mpesa_key
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
```

4. **Deploy**
```bash
# Push to main
git push origin main

# Railway auto-deploys from GitHub
```

5. **Get Backend URL**
- Railway → Deployments → Settings
- Copy the public URL
- Use for frontend API calls

### Option 2: Render.com (MODERATE)

**Pros:**
- ✅ Good free tier
- ✅ Automatic deploys from GitHub
- ✅ Built-in PostgreSQL

**Cost:** FREE → $12/month (Starter)

#### Quick Setup:
```bash
# Go to https://render.com
# New Web Service
# Connect GitHub
# Choose branch
# Add environment variables
# Deploy
```

### Option 3: Heroku (Was FREE - Now PAID)

**Pros:**
- ✅ Very easy to use
- ✅ Good documentation

**Cons:**
- ❌ No free tier anymore (Oct 2022)
- ❌ Expensive (min $50/month)

**Cost:** $50-300/month (not recommended)

### Option 4: AWS EC2 (ADVANCED)

**Pros:**
- ✅ Full control
- ✅ Scalable
- ✅ Can integrate with other AWS services

**Cons:**
- ❌ More complex setup
- ❌ Need to manage server
- ❌ Expensive if not optimized

**Cost:** $5-50+/month (varies by usage)

#### Setup (Advanced):
```bash
# Launch EC2 instance
# t3.micro for low traffic ($6-9/month)
# t3.small for medium traffic ($15-20/month)

# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/your-repo/backend.git
cd backend

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start src/server.js --name "opportunityhub-api"

# Save PM2 configuration
pm2 save

# Setup startup on reboot
pm2 startup

# Install Nginx as reverse proxy
sudo apt-get install nginx

# Start Nginx
sudo systemctl start nginx
```

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

**Pros:**
- ✅ Fully managed
- ✅ FREE tier: 512MB storage
- ✅ Easy scaling
- ✅ Automatic backups

**Cost:** FREE → $9-99/month (varies)

#### Setup:

1. **Create Account**
```bash
# Go to https://www.mongodb.com/cloud/atlas
# Sign up
# Create free cluster
```

2. **Create Cluster**
- Choose "Create Deployment"
- Select "M0 Sandbox" (free)
- Choose cloud provider (AWS recommended)
- Select region (us-east-1 for low latency)
- Create cluster

3. **Get Connection String**
- Atlas Dashboard → Connect
- Choose "Connect your application"
- Select Node.js
- Copy connection string
- Format: `mongodb+srv://username:password@cluster0.mongodb.net/database-name?retryWrites=true&w=majority`

4. **Update Backend .env**
```env
MONGODB_URI=mongodb+srv://user:password@cluster0.mongodb.net/opportunityhub?retryWrites=true&w=majority
```

### Option 2: AWS RDS (MongoDB Engine)

**Pros:**
- ✅ Integrated with AWS
- ✅ Automatic backups
- ✅ High availability

**Cost:** $10-100+/month

#### Setup:
```bash
# AWS Console → RDS
# Create database
# Select MongoDB
# Choose instance type (db.t3.micro for testing)
# Configure storage (20GB free tier)
# Get connection string
# Update backend .env
```

### Option 3: Self-Hosted (NOT RECOMMENDED FOR PRODUCTION)

**Pros:**
- ✅ Full control
- ✅ Free

**Cons:**
- ❌ Must manage backups
- ❌ Security responsibility
- ❌ Scaling difficult

---

## 🔑 Environment Configuration

### Backend .env Template
```env
# Server
NODE_ENV=production
PORT=8000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/opportunityhub

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# M-PESA
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_pass_key
MPESA_SHORTCODE=your_short_code
MPESA_CALLBACK_URL=https://your-backend.com/api/mpesa/callback

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=opportunityhub-uploads
AWS_REGION=us-east-1

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@opportunityhub.com

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# CORS
CORS_ORIGIN=https://opportunityhub.com,https://www.opportunityhub.com

# Stripe (Optional)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Frontend .env Template
```env
VITE_API_URL=https://api.opportunityhub.com
VITE_APP_NAME=OpportunityHub
VITE_APP_URL=https://opportunityhub.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 💰 Cost Breakdown

### Minimal Setup (Testing/Small Traffic - $30-50/month)
```
Frontend: Vercel Free → $0
Backend: Railway $7/month → $7
Database: MongoDB Atlas Free → $0
Storage: AWS S3 Free tier → ~$5
Total: ~$12-15/month
```

### Small Production (1,000-5,000 users - $80-150/month)
```
Frontend: Vercel Pro → $20
Backend: Railway Standard → $30
Database: MongoDB Atlas M1 → $30
Storage: AWS S3 + CloudFront → $20
Email: SendGrid Free → $0
Total: ~$100/month
```

### Medium Production (5,000-50,000 users - $250-400/month)
```
Frontend: Vercel Pro → $20
Backend: Railway + Auto-scaling → $80-100
Database: MongoDB Atlas M2 → $45
Storage: AWS S3 + CloudFront → $50
Email: SendGrid Standard → $20
CDN: Cloudflare Pro → $20
Monitoring: New Relic → $40
Total: ~$275-295/month
```

### Large Production (50,000+ users - $500-1,000+/month)
```
Frontend: Vercel Enterprise → $150
Backend: AWS ECS + Load Balancer → $200
Database: MongoDB Atlas M5 + replicas → $100
Storage: AWS S3 + CloudFront → $100
Email: SendGrid Pro → $50
CDN: Cloudflare Enterprise → $200
Monitoring: Datadog → $200
Total: ~$1,000+/month
```

---

## 📊 Monitoring & Maintenance

### Setup Monitoring

1. **Uptime Monitoring (FREE)**
```bash
# Use UptimeRobot (free tier)
# https://uptimerobot.com
# Monitor your backend API every 5 minutes
# Get alerts if down
```

2. **Error Tracking (FREE)**
```bash
# Use Sentry (free tier)
# npm install @sentry/react
# npm install @sentry/node

# In frontend/main.jsx
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "https://your-sentry-dsn",
  environment: "production"
});

# In backend/src/server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://your-sentry-dsn" });
```

3. **Analytics (FREE)**
```bash
# Frontend
# Use Google Analytics
# npm install react-ga4
# Track user behavior, conversion funnel

# Backend
# Use MongoDB Atlas monitoring
# Railway has built-in metrics
```

### Regular Maintenance Checklist

- [ ] **Weekly:**
  - Check error logs (Sentry)
  - Verify uptime (UptimeRobot)
  - Monitor database growth

- [ ] **Monthly:**
  - Review costs
  - Check security patches
  - Backup database

- [ ] **Quarterly:**
  - Load testing
  - Performance optimization
  - Security audit

---

## 🔒 Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set CORS properly
- [ ] Use environment variables (no hardcoded secrets)
- [ ] Enable MongoDB authentication
- [ ] Set up API rate limiting
- [ ] Use CSRF protection
- [ ] Validate all inputs
- [ ] Keep dependencies updated
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable logging and monitoring
- [ ] Regular security audits

---

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Run tests: `npm run test`
- [ ] Check linting: `npm run lint`
- [ ] Build locally: `npm run build`
- [ ] Test build: `npm run preview`

### During Deployment
- [ ] Push code to main branch
- [ ] Monitor deployment logs
- [ ] Verify environment variables are set
- [ ] Test deployed application

### After Deployment
- [ ] Smoke test key flows
- [ ] Check error logs
- [ ] Verify analytics working
- [ ] Monitor uptime
- [ ] Check performance metrics

---

## 📱 Recommended Stack Summary

| Component | Recommended | Alternative |
|-----------|-------------|-------------|
| Frontend Hosting | Vercel | Netlify, AWS Amplify |
| Backend Hosting | Railway | Render, Fly.io |
| Database | MongoDB Atlas | AWS RDS, Self-hosted |
| Storage | AWS S3 | Cloudinary, Filestack |
| CDN | Cloudflare | AWS CloudFront |
| Email | SendGrid | Mailgun, AWS SES |
| Payments | M-PESA (Kenya) | Stripe, PayPal |
| Analytics | Google Analytics | Mixpanel, Amplitude |
| Monitoring | Sentry | New Relic, DataDog |

---

## 🆘 Troubleshooting

### Frontend Deployment Issues

**Issue: Build fails on Vercel**
```bash
# Check Node version
# Update package.json engines
"engines": {
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
}

# Clear cache
# Vercel Dashboard → Settings → Advanced → Clear Cache

# Rebuild
```

**Issue: API calls fail after deployment**
```bash
# Check CORS in backend
# Ensure frontend URL is whitelisted
# Verify API URL in .env

# Debug: Check Network tab in DevTools
# Should see OPTIONS request succeeded
```

### Backend Deployment Issues

**Issue: Database connection fails**
```bash
# Verify connection string
# Check IP whitelist in MongoDB Atlas
# Test locally first

# Connection string format:
# mongodb+srv://user:password@host/database
```

**Issue: File uploads not working**
```bash
# Check AWS S3 bucket permissions
# Verify AWS credentials in environment
# Check bucket CORS settings

# AWS S3 CORS Config:
[{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedOrigins": ["https://your-frontend.com"],
  "MaxAgeSeconds": 3000
}]
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **AWS Documentation**: https://docs.aws.amazon.com
- **Express.js Guide**: https://expressjs.com
- **React Documentation**: https://react.dev

---

## 🎯 Next Steps

1. Choose frontend host (Vercel recommended)
2. Choose backend host (Railway recommended)
3. Choose database (MongoDB Atlas recommended)
4. Set up custom domain
5. Configure DNS records
6. Set environment variables
7. Deploy and test
8. Set up monitoring
9. Configure backups
10. Plan scaling strategy

---

**Last Updated:** 2026
**Version:** 1.0
