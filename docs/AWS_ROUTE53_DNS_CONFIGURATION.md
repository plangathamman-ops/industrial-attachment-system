# AWS Route 53 DNS Configuration Guide

**For: hamanmatage.com**

This guide shows how to configure DNS in AWS Route 53 for your OpportunityHub deployment with Vercel frontend and Railway backend.

---

## ✅ Prerequisites

- [ ] AWS account with Route 53 access
- [ ] Namecheap domain (hamanmatage.com) with nameservers pointing to Route 53
- [ ] Vercel frontend deployed (get DNS values from Vercel)
- [ ] Railway backend deployed (get URL from Railway)

---

## 📋 DNS Records Needed

### **Record 1: Frontend (Vercel)**
```
Type:       A Record
Name:       @ (or leave blank for root)
Value:      76.76.19.132
TTL:        3600 (or 300 for faster updates)
Routing:    Simple routing
```

### **Record 2: Frontend www subdomain (Vercel)**
```
Type:       CNAME Record
Name:       www
Value:      cname.vercel-dns.com
TTL:        3600
Routing:    Simple routing
```

### **Record 3: Backend API (Railway)**
```
Type:       CNAME Record
Name:       api
Value:      [YOUR_RAILWAY_URL].up.railway.app
TTL:        3600
Routing:    Simple routing
```

**Example Railway URL:** `api-prod-c8d4-5f2a.up.railway.app`

---

## 🔧 Step-by-Step Route 53 Configuration

### **Step 1: Open Route 53 Hosted Zone**

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **Route 53** → **Hosted zones**
3. Click on your domain: **hamanmatage.com**
4. You'll see the hosted zone dashboard

---

### **Step 2: Create A Record (Frontend)**

1. Click **Create record**
2. Leave **Name** blank (for root @)
3. **Record type:** A
4. **Value:** `76.76.19.132`
5. **TTL:** `3600` (or `300` for faster)
6. **Routing policy:** Simple routing
7. Click **Create records**

✅ **Result:** hamanmatage.com → 76.76.19.132 (Vercel)

---

### **Step 3: Create CNAME Record (www)**

1. Click **Create record**
2. **Name:** `www`
3. **Record type:** CNAME
4. **Value:** `cname.vercel-dns.com`
5. **TTL:** `3600`
6. **Routing policy:** Simple routing
7. Click **Create records**

✅ **Result:** www.hamanmatage.com → cname.vercel-dns.com (Vercel)

---

### **Step 4: Create CNAME Record (api)**

1. Click **Create record**
2. **Name:** `api`
3. **Record type:** CNAME
4. **Value:** `[YOUR_RAILWAY_URL].up.railway.app`
   - Example: `api-prod-c8d4-5f2a.up.railway.app`
5. **TTL:** `3600`
6. **Routing policy:** Simple routing
7. Click **Create records**

✅ **Result:** api.hamanmatage.com → [RAILWAY_URL].up.railway.app (Railway)

---

## 🔍 Verify Your Records

### **In Route 53 Dashboard**

You should see 4 records total:

```
Name                     Type      Value
─────────────────────────────────────────────────────
hamanmatage.com          NS        [AWS Nameservers]
hamanmatage.com          SOA       [AWS SOA Record]
hamanmatage.com          A         76.76.19.132
www.hamanmatage.com      CNAME     cname.vercel-dns.com
api.hamanmatage.com      CNAME     [YOUR_RAILWAY_URL].up.railway.app
```

---

## ⏱️ DNS Propagation

### **Timing**
```
Typical:     15 minutes - 1 hour
Maximum:     Up to 48 hours
TTL Impact:  Lower TTL (300) = faster updates
             Higher TTL (3600) = faster lookups
```

### **Check Propagation Status**

Visit [whatsmydns.net](https://whatsmydns.net/) and check:

1. **For A Record:**
   - Domain: `hamanmatage.com`
   - Type: `A`
   - Should resolve to: `76.76.19.132`

2. **For www CNAME:**
   - Domain: `www.hamanmatage.com`
   - Type: `CNAME`
   - Should resolve to: `cname.vercel-dns.com`

3. **For api CNAME:**
   - Domain: `api.hamanmatage.com`
   - Type: `CNAME`
   - Should resolve to: `[YOUR_RAILWAY_URL].up.railway.app`

---

## ✅ Verification Checklist

- [ ] Route 53 hosted zone created for hamanmatage.com
- [ ] A record created: hamanmatage.com → 76.76.19.132
- [ ] CNAME record created: www.hamanmatage.com → cname.vercel-dns.com
- [ ] CNAME record created: api.hamanmatage.com → [RAILWAY_URL]
- [ ] All records visible in Route 53 dashboard
- [ ] DNS propagated (check at whatsmydns.net)
- [ ] https://hamanmatage.com loads (Vercel frontend)
- [ ] https://api.hamanmatage.com returns API response (Railway)

---

## 🔗 Testing Your Domain

### **Test 1: Frontend Access**
```bash
# Should load your OpportunityHub app
https://hamanmatage.com
https://www.hamanmatage.com
```

### **Test 2: Backend Access**
```bash
# Should return API response
https://api.hamanmatage.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "environment": "production"
}
```

### **Test 3: DNS Lookup (Terminal)**
```bash
# Windows PowerShell
nslookup hamanmatage.com
nslookup api.hamanmatage.com

# macOS/Linux Terminal
dig hamanmatage.com
dig api.hamanmatage.com
```

---

## 🐛 Troubleshooting

### **DNS Not Resolving?**

1. **Check Namecheap Nameservers**
   - Log in to Namecheap
   - Go to Domain List → Manage
   - Verify nameservers point to AWS Route 53:
     - Should show AWS nameservers (e.g., ns-123.awsdns-45.com)
   - If not, update them in Namecheap

2. **Check Route 53 Nameservers**
   - In Route 53 → Hosted zones → hamanmatage.com
   - Copy the 4 NS records shown
   - These must match in Namecheap

3. **Wait for Propagation**
   - DNS changes can take up to 48 hours
   - Current TTL might cause delays
   - Check status at [whatsmydns.net](https://whatsmydns.net/)

### **Getting "DNS SERVFAIL"?**

- Verify all records are created correctly
- Check for typos in values
- Ensure Vercel and Railway URLs are correct
- Wait 15 minutes and retry

### **Getting "Connection Timeout"?**

- DNS resolved but services not responding
- Check Vercel deployment status
- Check Railway backend status
- Verify environment variables are correct

### **Getting "SSL Certificate Error"?**

- DNS is working but SSL not yet configured
- Vercel auto-generates SSL (usually takes 5-10 minutes)
- Railway might need SSL configuration
- Wait 10-15 minutes and refresh browser (CTRL+SHIFT+R)

---

## 📝 AWS Route 53 vs Namecheap DNS

| Feature | Route 53 | Namecheap |
|---------|----------|-----------|
| **Management** | AWS Console | Namecheap Panel |
| **Reliability** | 99.99% uptime | 99.97% uptime |
| **Cost** | $0.40/month per zone | Free |
| **Features** | Advanced routing | Basic routing |
| **Update Speed** | Immediate | 5-60 minutes |
| **AWS Integration** | Native | None |

**Your Setup:** Route 53 through AWS (Namecheap is just registrar)

---

## 🚀 Next Steps

1. ✅ Create all 3 DNS records in Route 53
2. ✅ Verify records appear in Route 53 dashboard
3. ✅ Wait for DNS propagation (5-60 minutes)
4. ✅ Test domains at whatsmydns.net
5. ✅ Access https://hamanmatage.com
6. ✅ Access https://api.hamanmatage.com
7. ✅ Run full application tests
8. ✅ Save this guide for reference

---

## 📞 Quick Reference

**Your Domain:** hamanmatage.com

**Frontend URL:** https://hamanmatage.com
**Backend API:** https://api.hamanmatage.com
**WWW URL:** https://www.hamanmatage.com

**DNS Records to Create:**
- A: hamanmatage.com → 76.76.19.132
- CNAME: www → cname.vercel-dns.com
- CNAME: api → [RAILWAY_URL].up.railway.app

**Resources:**
- [AWS Route 53 Docs](https://docs.aws.amazon.com/route53/)
- [Check DNS Propagation](https://whatsmydns.net/)
- [Vercel DNS Docs](https://vercel.com/docs/concepts/projects/domains)

---

**When DNS is configured, your app will be accessible at hamanmatage.com! 🚀**
