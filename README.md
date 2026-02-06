# 🎯 OpportunityHub - Industrial Attachment Management System

A complete production-ready platform for managing industrial attachments, internships, applications, and payments with admin dashboard, dark mode, and role-based access control.

**🌐 Live Preview:** http://localhost:3001  
**📚 Documentation:** See [docs/](./docs/) folder  
**🐳 Deployment:** AWS, Docker, Vercel, Railway

---

## 📑 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Deployment](#deployment)
- [Test Accounts](#test-accounts)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Python 3.8+ (for local preview)

### Installation & Run

```bash
# Clone repository
git clone <repo-url>
cd FINAL-COMPLETE-APP

# Install backend dependencies
cd backend
npm install
npm run dev    # Starts on http://localhost:5000

# In another terminal, install frontend
cd frontend
npm install
npm run build
npm run dev    # Starts on http://localhost:3000
```

### View the App

**Option 1: Live Vite Dev Server**
```bash
cd frontend && npm run dev
# Open http://localhost:3000
```

**Option 2: Production Build**
```bash
cd frontend && npm run build
python -m http.server 3001 --bind 127.0.0.1 --directory dist
# Open http://127.0.0.1:3001
```

---

## 📂 Project Structure

```
FINAL-COMPLETE-APP/
├── backend/                        # Node.js/Express API
│   ├── src/
│   │   ├── models/                # MongoDB schemas
│   │   ├── routes/                # API endpoints
│   │   ├── controllers/           # Business logic
│   │   ├── middleware/            # Auth, upload, error handling
│   │   ├── config/                # Configuration
│   │   ├── utils/                 # Helpers (M-PESA, file upload)
│   │   ├── seeders/               # Database seeding
│   │   └── server.js              # Express app entry
│   ├── Dockerfile                 # Container image
│   └── package.json
│
├── frontend/                       # React SPA with Vite
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   ├── components/            # Shared UI components
│   │   ├── services/              # API client
│   │   ├── context/               # Zustand stores
│   │   ├── assets/                # Images, fonts, icons
│   │   ├── App.jsx                # Main app
│   │   ├── main.jsx               # React entry
│   │   └── index.css              # Tailwind + theme CSS
│   ├── vite.config.js             # Vite config
│   ├── tailwind.config.js         # Tailwind config
│   ├── Dockerfile                 # Container image
│   ├── nginx.conf                 # Production server config
│   └── package.json
│
├── docs/                          # 📖 ALL DOCUMENTATION
│   ├── 00_READ_ME_FIRST.md       # Start here!
│   ├── START_HERE.md              # Navigation guide
│   ├── QUICK_START.md             # Installation steps
│   ├── AWS_DEPLOYMENT_GUIDE.md    # AWS setup (recommended)
│   ├── ARCHITECTURE_AND_IMPROVEMENTS.md # Best practices
│   ├── IMPLEMENTATION_STATUS.md   # Feature checklist
│   ├── DELIVERY_SUMMARY.md        # What's included
│   ├── LOCAL_TESTING_GUIDE.md     # Testing locally
│   ├── CHANGELOG.md               # Version history
│   ├── ADMIN_DASHBOARD_GUIDE.md   # Admin features
│   └── PREVIEW.html               # Landing page preview
│
├── deploy/                        # 🚀 DEPLOYMENT & INFRASTRUCTURE
│   ├── docker/                    # Docker Compose & Dockerfiles
│   ├── scripts/                   # Deployment automation
│   └── infra/ (future)           # Terraform/CloudFormation
│
├── .github/                       # GitHub Actions workflows
│   └── workflows/
│       ├── backend-deploy.yml
│       └── frontend-deploy.yml
│
├── .gitignore                     # Ignored files (see below)
├── package.json                   # Root dependencies
├── README.md                      # Main documentation
└── verify-changes.sh              # Change verification script
```

---

## ✨ Key Features

### Student Features
✅ User registration & login  
✅ Browse all opportunities  
✅ Search & filter  
✅ View detailed info  
✅ Apply with CV  
✅ Track status  
✅ Online payment (M-PESA)  
✅ Dark mode & responsive  

### Admin Features
✅ Dashboard with stats  
✅ Manage opportunities  
✅ Approve/reject applications  
✅ View all applications  
✅ User management  

### Technical Features
✅ JWT authentication  
✅ bcryptjs hashing  
✅ CORS enabled  
✅ Rate limiting  
✅ Input validation  
✅ Error handling  
✅ File uploads  

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [00_READ_ME_FIRST.md](./docs/00_READ_ME_FIRST.md) | Overview |
| [START_HERE.md](./docs/START_HERE.md) | Navigation |
| [QUICK_START.md](./docs/QUICK_START.md) | Installation |
| [AWS_DEPLOYMENT_GUIDE.md](./docs/AWS_DEPLOYMENT_GUIDE.md) | Deploy to AWS |
| [ARCHITECTURE_AND_IMPROVEMENTS.md](./docs/ARCHITECTURE_AND_IMPROVEMENTS.md) | Design & best practices |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+, Vite, TailwindCSS, Zustand |
| Backend | Node.js, Express, MongoDB/DynamoDB |
| Auth | JWT, bcryptjs |
| Hosting | AWS, Vercel, Railway, Docker |
| CI/CD | GitHub Actions |

---

## 💻 Development

### Backend
```bash
cd backend
npm install
npm run dev    # http://localhost:5000
npm run seed   # Seed database
npm run test   # Run tests
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
npm run build  # Production build
```

---

## 🚀 Deployment Options

1. **AWS** (Recommended) - $50-120/month  
   See [AWS_DEPLOYMENT_GUIDE.md](./docs/AWS_DEPLOYMENT_GUIDE.md)

2. **Vercel + Railway** - $15-60/month

3. **Docker Compose** - VPS/Local

---

## 🧪 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| student@test.com | password123 | Student |
| admin@test.com | admin123 | Admin |

---

## 🔒 Security & .gitignore

✅ `.gitignore` configured to exclude:
- `node_modules/` - Dependencies
- `.env` files - Secrets
- `dist/` - Build output
- `logs/` - Log files
- `package-lock.json` - Lock file
- `.DS_Store`, `Thumbs.db` - OS files

**⚠️ NEVER commit `.env` files!**

See `.gitignore` for complete list.

---

## 📦 What's Included

✅ React frontend (10 pages)  
✅ Node.js/Express backend  
✅ MongoDB models  
✅ JWT authentication  
✅ Admin dashboard  
✅ M-PESA payment integration  
✅ File uploads  
✅ Dark mode  
✅ 20 pre-seeded opportunities  
✅ 2 test accounts  
✅ Comprehensive documentation  
✅ Docker configs  
✅ GitHub Actions CI/CD  
✅ AWS deployment guide  

---

## 🐛 Troubleshooting

```bash
# Backend won't start?
mongosh "mongodb://localhost:27017/opportunityhub"

# Frontend blank?
rm -rf frontend/node_modules frontend/dist
npm install && npm run build

# API calls failing?
curl http://localhost:5000/api/health
```

See [LOCAL_TESTING_GUIDE.md](./docs/LOCAL_TESTING_GUIDE.md) for more.

---

## 📄 License

MIT License - Use freely.

**Version:** 2.0.0 | **Last Updated:** February 6, 2026
