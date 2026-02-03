# 🎓 Industrial Attachment Management System - COMPLETE PACKAGE

**Full-Stack Application with Admin Dashboard, API Integration, and Production Deployment**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-EKS-orange.svg)](https://aws.amazon.com/eks/)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-purple.svg)](https://argoproj.github.io/cd/)

---

## ✨ What's Included

This package contains **EVERYTHING** you need to run the Industrial Attachment Management System locally and deploy to production:

### 🎨 Frontend
- ✅ Beautiful animated landing page
- ✅ Student dashboard
- ✅ Admin dashboard with opportunity management
- ✅ Browse & search 500+ opportunities
- ✅ 3-step application process
- ✅ File upload (CV, referral letters)
- ✅ M-Pesa payment integration
- ✅ Responsive design (mobile, tablet, desktop)

### 🖥️ Backend
- ✅ Node.js + Express.js API
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication & authorization
- ✅ Role-based access control (student/admin)
- ✅ M-Pesa STK Push integration
- ✅ Cloudinary file storage
- ✅ Adzuna & Jooble job API integration
- ✅ Complete admin API

### 🔐 Admin Features
- ✅ Dashboard with stats
- ✅ Add opportunities manually
- ✅ Edit/delete opportunities
- ✅ Approve/reject pending jobs
- ✅ Sync from Adzuna API
- ✅ Sync from Jooble API
- ✅ Source tracking (manual/adzuna/jooble/rss)
- ✅ Filter by status

### 🗄️ Database
- ✅ 20 pre-seeded opportunities (Safaricom, KCB, Equity, etc.)
- ✅ Admin account: admin@ias.com / Admin@123
- ✅ Student account: student@test.com / Student@123

### 📚 Documentation
- ✅ Complete local testing guide
- ✅ AWS + ArgoCD deployment guide
- ✅ Admin dashboard guide
- ✅ API documentation
- ✅ Troubleshooting guides

### 🚀 DevOps
- ✅ Docker containers (backend + frontend)
- ✅ Kubernetes manifests
- ✅ Helm charts
- ✅ GitHub Actions CI/CD
- ✅ ArgoCD GitOps setup
- ✅ AWS EKS deployment configs

---

## 📦 Package Contents

```
industrial-attachment-system/
│
├── backend/                           # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js     # ⭐ Admin CRUD & API sync
│   │   │   ├── authController.js      # Authentication
│   │   │   ├── opportunityController.js
│   │   │   ├── applicationController.js
│   │   │   └── uploadController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Opportunity.js         # ⭐ Enhanced with source/stipend
│   │   │   └── Application.js
│   │   ├── routes/
│   │   │   ├── admin.js               # ⭐ Admin routes
│   │   │   ├── auth.js
│   │   │   ├── opportunities.js
│   │   │   ├── applications.js
│   │   │   └── upload.js
│   │   ├── middleware/
│   │   │   └── auth.js                # ⭐ With adminOnly
│   │   ├── utils/
│   │   │   ├── mpesaService.js
│   │   │   └── fileUpload.js
│   │   ├── seeders/
│   │   │   └── seed.js                # ⭐ 20 opportunities + users
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx               # ✨ Animated landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx          # Student dashboard
│   │   │   ├── AdminDashboard.jsx     # ⭐ Admin dashboard
│   │   │   ├── AddOpportunity.jsx     # ⭐ Admin add form
│   │   │   ├── Opportunities.jsx
│   │   │   ├── OpportunityDetail.jsx
│   │   │   ├── Apply.jsx
│   │   │   └── MyApplications.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Glassmorphism navbar
│   │   │   └── PrivateRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── authStore.js
│   │   ├── App.jsx
│   │   └── index.css                  # Animations
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── k8s/                               # Kubernetes Manifests
│   ├── namespace.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-pvc.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── secrets.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
│
├── helm/                              # Helm Charts
│   └── industrial-attachment/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│
├── .github/workflows/                 # CI/CD
│   └── deploy.yml                     # GitHub Actions pipeline
│
├── docs/                              # Documentation
│   ├── LOCAL_TESTING_COMPLETE_GUIDE.md
│   ├── AWS_ARGOCD_DEPLOYMENT_GUIDE.md
│   ├── ADMIN_DASHBOARD_GUIDE.md
│   └── API_DOCUMENTATION.md
│
├── scripts/                           # Helper Scripts
│   ├── create-ecr-repos.sh
│   └── setup-argocd.sh
│
├── README.md                          # This file
├── PREVIEW.html                       # Visual preview
├── QUICK_START.md                     # Quick start guide
└── verify-changes.sh                  # Verification script
```

---

## 🚀 Quick Start

### Option 1: Local Testing (5 Minutes)

```bash
# 1. Extract package
tar -xzf industrial-attachment-system-FINAL.tar.gz
cd industrial-attachment-system

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Start MongoDB (choose one)
# Local:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Or MongoDB Atlas (cloud):
# Get connection string from mongodb.com/cloud/atlas

# 4. Configure backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI

# 5. Seed database (creates 20 opportunities + test users)
npm run seed

# 6. Start servers
# Terminal 1 (Backend):
npm run dev

# Terminal 2 (Frontend):
cd ../frontend
npm run dev

# 7. Open browser
# http://localhost:3000

# 8. Test accounts
# Student: student@test.com / Student@123
# Admin:   admin@ias.com / Admin@123
```

### Option 2: Production Deployment (2-3 Hours)

See `docs/AWS_ARGOCD_DEPLOYMENT_GUIDE.md` for complete instructions.

```bash
# Quick overview:
1. Setup AWS account
2. Install tools (AWS CLI, kubectl, eksctl, helm)
3. Create EKS cluster
4. Setup ECR repositories
5. Build & push Docker images
6. Install ArgoCD
7. Deploy application
8. Configure domain & SSL
9. Go live! 🚀
```

---

## 🎯 Test Accounts

### Pre-seeded Accounts:

**Admin Account:**
```
Email:    admin@ias.com
Password: Admin@123
Access:   /admin/dashboard
Can:      Add/Edit/Delete opportunities
          Approve/Reject jobs
          Sync from APIs
```

**Student Account:**
```
Email:    student@test.com
Password: Student@123
Access:   /dashboard
Can:      Browse opportunities
          Apply for positions
          Track applications
```

### Pre-seeded Opportunities (20):
1. Safaricom - Software Engineering Intern
2. Kenya Power - Electrical Engineering
3. Equity Bank - Data Analyst
4. KCB Bank - Marketing & Communications
5. EABL - Mechanical Engineering
6. Andela - Web Developer
7. China Road & Bridge - Civil Engineering
8. Twiga Foods - UI/UX Design
9. PwC Kenya - Accounting & Finance
10. Liquid Telecom - Cybersecurity
... and 10 more!

---

## 📖 Documentation

### For Local Development:
- **`docs/LOCAL_TESTING_COMPLETE_GUIDE.md`**
  - MongoDB setup (local & Atlas)
  - Seeding database
  - Running backend & frontend
  - Testing flows
  - Troubleshooting

### For Production Deployment:
- **`docs/AWS_ARGOCD_DEPLOYMENT_GUIDE.md`**
  - AWS setup
  - EKS cluster creation
  - ECR container registry
  - ArgoCD installation
  - GitOps deployment
  - Domain & SSL
  - Monitoring & logging

### For Admin Features:
- **`docs/ADMIN_DASHBOARD_GUIDE.md`**
  - Admin dashboard overview
  - Adding opportunities
  - API integration (Adzuna/Jooble)
  - Approval workflow
  - Testing admin features

---

## 🛠️ Technology Stack

### Backend:
- Node.js 18+
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- M-Pesa Daraja API
- Cloudinary
- Adzuna API
- Jooble API

### Frontend:
- React 18+
- Vite
- Tailwind CSS
- React Router v6
- Zustand
- Axios
- React Hot Toast

### DevOps:
- Docker
- Kubernetes
- Helm
- ArgoCD
- GitHub Actions
- AWS EKS
- AWS ECR

---

## 🎨 Features

### For Students:
- Browse 500+ opportunities
- Search & filter (category, location, type)
- View job details
- Apply with 3-step form
- Upload CV & referral letter
- M-Pesa payment (KES 500)
- Track application status
- Dashboard with stats

### For Admins:
- Dashboard with platform stats
- Add opportunities manually
- Edit existing opportunities
- Delete opportunities (soft delete)
- Approve/Reject pending jobs
- Filter by status (all, pending, active, rejected)
- Sync from Adzuna API
- Sync from Jooble API
- Source tracking (manual/adzuna/jooble)
- View analytics

### Technical Features:
- JWT authentication
- Role-based access control
- File uploads (Cloudinary)
- Payment integration (M-Pesa)
- Job API integration
- Responsive design
- Animations & micro-interactions
- Production-ready
- GitOps deployment
- Auto-scaling
- Monitoring & logging

---

## 🔐 Security

- ✅ JWT authentication with HTTP-only cookies
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet for HTTP headers
- ✅ CORS configuration
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Role-based access control

---

## 💰 Cost Estimates

### Local Development:
```
Cost: FREE
Requirements: Your computer + internet
```

### Production (AWS):
```
EKS Cluster:        ~$73/month
EC2 Nodes (t3.medium x2): ~$60/month
Load Balancer:      ~$20/month
ECR Storage:        ~$1/month
MongoDB Atlas:      FREE (512MB) or $9/month (2GB)
Domain:             ~$12/year
Total:              ~$155-165/month

Savings Tips:
- Use t3.small nodes: Save $30/month
- Use 1 node: Save $30/month
- Spot instances: Save 60-70%
- Estimated with savings: ~$80-100/month
```

---

## 📝 Environment Variables

### Backend (.env):
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/industrial-attachment

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# M-Pesa (Sandbox for testing)
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-mpesa-passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/applications/mpesa/callback
MPESA_API_URL=https://sandbox.safaricom.co.ke

# Cloudinary (File uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Job APIs (Optional - for admin sync)
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-app-key
JOOBLE_API_KEY=your-jooble-api-key
```

### Frontend (.env):
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Run Tests:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (if configured)
npm run test:e2e
```

### Manual Testing Checklist:
- [ ] Landing page loads
- [ ] Student registration works
- [ ] Student login works
- [ ] Browse opportunities (20 shown)
- [ ] Search & filter work
- [ ] Application form works
- [ ] File upload works
- [ ] M-Pesa payment works
- [ ] Admin login works
- [ ] Admin can add opportunity
- [ ] Admin can edit opportunity
- [ ] Admin can delete opportunity
- [ ] API sync works (if configured)

---

## 🚢 Deployment

### Local:
```bash
npm run dev  # Backend + Frontend
```

### Docker:
```bash
docker-compose up -d
```

### Kubernetes:
```bash
kubectl apply -k k8s/
```

### ArgoCD:
```bash
argocd app create industrial-attachment \
  --repo https://github.com/user/k8s-repo.git \
  --path base \
  --dest-namespace industrial-attachment
```

See `docs/AWS_ARGOCD_DEPLOYMENT_GUIDE.md` for complete instructions.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- Safaricom for M-Pesa API
- Cloudinary for file storage
- Adzuna & Jooble for job APIs
- All open-source libraries used

---

## 📞 Support

- Email: support@attachmentke.com
- GitHub Issues: [Open an issue](https://github.com/user/repo/issues)
- Documentation: See `docs/` folder

---

## 🗺️ Roadmap

### Phase 1 (Current):
- [x] Student features
- [x] Admin dashboard
- [x] Job API integration
- [x] M-Pesa payment
- [x] File uploads

### Phase 2 (Coming Soon):
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Company portal
- [ ] Interview scheduling

### Phase 3 (Future):
- [ ] Mobile app (React Native)
- [ ] Chat/messaging
- [ ] Video interviews
- [ ] AI-powered matching
- [ ] Multi-language support

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ in Kenya 🇰🇪**

**Ready to deploy! 🚀**
