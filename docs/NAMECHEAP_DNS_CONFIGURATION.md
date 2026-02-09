# 🌐 NAMECHEAP DOMAIN CONFIGURATION GUIDE

**Complete step-by-step guide for pointing your Namecheap domain to Vercel and Railway**

---

## 📋 Prerequisites

You'll need:
- [ ] Namecheap account login
- [ ] Your domain (opportunityhub.com or your domain)
- [ ] Vercel deployment (with DNS info)
- [ ] Railway backend URL (from Step 4 of main guide)

---

## 🔗 DNS Records Explained

Before you start, understand what you're doing:

```
Your Domain: opportunityhub.com
    │
    ├─ @ (root)           → Points to Vercel (Frontend)
    ├─ www                → Points to Vercel (Frontend)
    └─ api                → Points to Railway (Backend)
```

| Record Type | Purpose | Example |
|------------|---------|---------|
| **A Record** | Points domain to IP address | `opportunityhub.com → 76.76.19.132` |
| **CNAME Record** | Points domain to another domain | `api.opportunityhub.com → railway.app` |

---

## ✅ STEP 1: Login to Namecheap

1. Go to https://www.namecheap.com
2. Click "Sign In" (top right)
3. Enter your email and password
4. Click "Sign In"

**If you forgot your password:**
- Click "Forgot Password"
- Follow email link
- Create new password

---

## ✅ STEP 2: Find Your Domain

1. Click your account menu (top right) → "Account"
2. Click "Domain List" (left sidebar)
3. Find your domain in the list
4. Click "Manage" next to it

**OR directly:**
1. In your email, find domain confirmation email
2. Click "Manage" button
3. Or use this link: https://www.namecheap.com/myaccount/domain-list

---

## ✅ STEP 3: Access DNS Settings

1. On the domain management page
2. Scroll down to "Nameservers" section
3. Make sure it shows: **Namecheap BasicDNS**
4. Click "Manage DNS"

**You'll see a panel like this:**
```
DNS Records
Type | Host | Value | TTL | Edit | Delete
A    | @    | (empty)
...
```

---

## ✅ STEP 4: Get Vercel DNS Records

Before editing, gather Vercel DNS info:

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to "Settings" → "Domains"
4. Find your domain in the list
5. Click the domain name
6. You'll see Vercel's recommended DNS records:

**Copy these values:**

```
For @ (root domain):
Type: A
Value: 76.76.19.132

For *.opportunityhub.com (all subdomains):
Type: CNAME
Value: cname.vercel-dns.com
```

---

## ✅ STEP 5: Add Frontend DNS Records (Vercel)

### Add A Record for Root Domain

**In Namecheap DNS Records page:**

1. Find the **A record** with Host: `@`
2. If it doesn't exist, click "Add Record" → select "A"
3. Fill in:
   - **Type:** A
   - **Host:** @ (leave as is)
   - **Value:** `76.76.19.132` (from Vercel)
   - **TTL:** 30 min

```
Example:
Type | Host | Value           | TTL    | TTL ID
A    | @    | 76.76.19.132    | 30 min | (auto)
```

4. Click the checkmark (✓) to confirm
5. Click "Save All Changes"

### Add CNAME Record for www

**Still in Namecheap DNS Records:**

1. Click "Add Record"
2. Select "CNAME" type
3. Fill in:
   - **Type:** CNAME
   - **Host:** `www`
   - **Value:** `cname.vercel-dns.com` (from Vercel)
   - **TTL:** 30 min

```
Example:
Type  | Host | Value                  | TTL    | TTL ID
CNAME | www  | cname.vercel-dns.com   | 30 min | (auto)
```

4. Click the checkmark (✓)
5. Click "Save All Changes"

---

## ✅ STEP 6: Get Railway Backend URL

**From Railway Dashboard:**

1. Go to https://railway.app/dashboard
2. Click your project
3. Click your backend service
4. Go to "Settings" tab
5. Scroll to "Domain"
6. Copy your Railway-assigned domain

**It looks like:**
```
https://opportunityhub-prod-backend.up.railway.app
```

Just the domain part:
```
opportunityhub-prod-backend.up.railway.app
```

Keep this copied!

---

## ✅ STEP 7: Add API Subdomain (Railway)

**In Namecheap DNS Records:**

1. Click "Add Record"
2. Select "CNAME" type
3. Fill in:
   - **Type:** CNAME
   - **Host:** `api`
   - **Value:** `opportunityhub-prod-backend.up.railway.app` (from Railway)
   - **TTL:** 30 min

```
Example:
Type  | Host | Value                                  | TTL    | TTL ID
CNAME | api  | opportunityhub-prod-backend.up.railway.app | 30 min | (auto)
```

4. Click the checkmark (✓)
5. Click "Save All Changes"

---

## 📋 Complete DNS Records Summary

**After completing all steps, you should have:**

| Type | Host | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | 76.76.19.132 | 30 min | Frontend root domain |
| CNAME | www | cname.vercel-dns.com | 30 min | Frontend www subdomain |
| CNAME | api | opportunityhub-prod-backend.up.railway.app | 30 min | Backend API |

**Visual representation:**
```
opportunityhub.com (A record → Vercel)
www.opportunityhub.com (CNAME → Vercel)
api.opportunityhub.com (CNAME → Railway)
```

---

## ⏳ DNS Propagation

**After saving DNS records:**

⏳ **Wait 5-48 hours** (usually 15 minutes)

DNS propagates globally to all servers.

### Check DNS Status

**Method 1: Use Online Tool**
1. Go to https://www.whatsmydns.net/
2. Enter your domain: `opportunityhub.com`
3. Select "A" record type
4. Click "Search"
5. Check if your IP shows in the list

**Method 2: Use Command Line**
```bash
# Windows (PowerShell or CMD)
nslookup opportunityhub.com
nslookup api.opportunityhub.com

# Mac/Linux
dig opportunityhub.com
dig api.opportunityhub.com
```

**What you should see:**
```bash
opportunityhub.com         A    76.76.19.132
www.opportunityhub.com     CNAME cname.vercel-dns.com
api.opportunityhub.com     CNAME opportunityhub-prod-backend.up.railway.app
```

---

## ✅ Testing Your Domain

**After DNS propagates, test:**

### Test 1: Frontend Loading
```bash
# Visit in browser
https://opportunityhub.com

# Should load your React app
# Check dark mode works
# Check navigation works
```

### Test 2: API Connectivity
```bash
# Test API endpoint
https://api.opportunityhub.com/api/opportunities

# Should return JSON array of opportunities
```

### Test 3: SSL Certificates
```bash
# Both should show 🔒 green lock
https://opportunityhub.com
https://api.opportunityhub.com

# Check in browser DevTools:
# All requests should be HTTPS (not HTTP)
```

### Test 4: Full Application Flow
1. Go to https://opportunityhub.com
2. Register new account
3. Login
4. Browse opportunities
5. Apply to opportunity
6. Go through payment
7. Check success page

---

## 🔧 Advanced: Email Records (Optional)

If you want email from your domain (optional):

**Gmail/Google Workspace:**
1. Add these records to Namecheap:

```
Type  | Host | Value
MX    | @    | aspmx.l.google.com (Priority: 10)
MX    | @    | alt1.aspmx.l.google.com (Priority: 20)
...
```

2. Follow Google's setup guide
3. Not needed for the app to work

---

## 🆘 Troubleshooting DNS Issues

### Problem: Domain still shows Namecheap parking page

**Solution:**
1. Wait longer (up to 48 hours)
2. Clear browser cache (Ctrl+Shift+Del)
3. Try incognito/private browsing
4. Check DNS records are exactly correct
5. Verify Vercel DNS values haven't changed

### Problem: "This site can't be reached"

**Solution:**
1. Check DNS propagation: https://whatsmydns.net/
2. Verify A and CNAME records in Namecheap
3. Check Vercel dashboard - domain should show "Valid"
4. Try with http:// instead of https:// (temporary)
5. Contact Vercel support if DNS is correct

### Problem: API not responding (404 errors)

**Solution:**
1. Check `api` CNAME record points to Railway
2. Verify Railway backend is deployed
3. Test with Railway's assigned domain directly
4. Check `VITE_API_URL` in Vercel environment
5. Check backend logs in Railway for errors

### Problem: SSL certificate not working (unsafe)

**Solution:**
1. Vercel needs 24 hours to generate certificate
2. Check: https://crt.sh/?q=opportunityhub.com
3. Wait another 24 hours if not there
4. Click "Refresh" in Vercel domain settings
5. Clear browser cache

### Problem: "ERR_NAME_NOT_RESOLVED"

**Solution:**
1. This means DNS hasn't propagated yet
2. Wait 5-30 minutes
3. Clear browser cache
4. Restart browser
5. Try different device/network
6. Check at: https://whatsmydns.net/

### Problem: Redirects to localhost or old IP

**Solution:**
1. Clear all browser cookies and cache
2. Try incognito/private window
3. Close and reopen browser
4. Check hosts file (C:\Windows\System32\drivers\etc\hosts)
   - Remove any lines with your domain
5. Restart computer

---

## 📱 Email Verification

If Vercel asks to verify domain ownership:

1. Vercel may add a TXT record
2. Check your email from Vercel
3. Follow verification link
4. Or add TXT record to Namecheap:

```
Type  | Host | Value | TTL
TXT   | @    | (from Vercel email) | 3600
```

---

## 🔐 Security Best Practices

**Protect Your Domain:**

1. **Enable 2FA on Namecheap**
   - Go to Account settings
   - Enable 2-factor authentication
   - Use authenticator app

2. **Enable 2FA on Vercel**
   - Go to Account settings
   - Enable 2-factor authentication

3. **Enable 2FA on Railway**
   - Account settings
   - Enable 2-factor authentication

4. **Monitor DNS Changes**
   - Namecheap: Enable email notifications
   - Check logs regularly

5. **Use Strong Passwords**
   - Min 16 characters
   - Mix of uppercase, lowercase, numbers, symbols

---

## 📊 Verification Checklist

**After setting up DNS, verify:**

- [ ] A record for @ points to `76.76.19.132`
- [ ] CNAME for www points to `cname.vercel-dns.com`
- [ ] CNAME for api points to Railway domain
- [ ] DNS shows as "Valid" in Vercel dashboard
- [ ] Domain propagated (check whatsmydns.net)
- [ ] Frontend loads at https://opportunityhub.com
- [ ] API responds at https://api.opportunityhub.com/api/opportunities
- [ ] SSL certificates work (green lock 🔒)
- [ ] Admin dashboard accessible
- [ ] Application submission works
- [ ] Payment flow works
- [ ] Emails send (if configured)

---

## 💡 Useful Links

| Service | URL | Purpose |
|---------|-----|---------|
| Namecheap Dashboard | https://www.namecheap.com/myaccount/domain-list | Manage domains |
| Check DNS Propagation | https://whatsmydns.net/ | Verify DNS is live |
| Vercel Domains | https://vercel.com/dashboard | Domain settings |
| Railway Dashboard | https://railway.app/dashboard | Backend settings |
| SSL Certificate Check | https://www.ssl-shopper.com/ | Verify HTTPS |
| MX Lookup | https://www.mxtoolbox.com/ | Check email records |

---

## 📞 Quick Support

### Common Issues Quick Fixes

```bash
# Clear DNS cache (Windows)
ipconfig /flushdns

# Clear DNS cache (Mac)
sudo dscacheutil -flushcache

# Clear DNS cache (Linux)
sudo systemctl restart systemd-resolved
```

---

## 🎉 Success Indicators

You know it's working when:

✅ https://opportunityhub.com loads your React app  
✅ https://api.opportunityhub.com responds to API calls  
✅ Both have 🔒 green SSL lock  
✅ Dark mode works  
✅ You can register and login  
✅ You can submit applications  
✅ Admin dashboard is accessible  

---

**You're all set! Your domain is now pointing to your live application.** 🚀
