# 🏗️ Architecture & Best Practices Guide - OpportunityHub

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Best Practices](#best-practices)
3. [Performance Optimization](#performance-optimization)
4. [Scalability Strategy](#scalability-strategy)
5. [Security Best Practices](#security-best-practices)
6. [Code Quality](#code-quality)
7. [DevOps & CI/CD](#devops--cicd)
8. [Future Improvements](#future-improvements)

---

## 🏗️ System Architecture

### Current Tech Stack

```
Frontend:
├── React 18.2+ (UI Framework)
├── React Router v6 (Routing)
├── Zustand (State Management)
├── TailwindCSS (Styling)
└── Vite (Build Tool)

Backend:
├── Node.js 18+ (Runtime)
├── Express.js (Web Framework)
├── Mongoose (MongoDB ODM)
├── JWT (Authentication)
└── Multer (File Uploads)

Database:
├── MongoDB (Primary)
├── Redis (Caching - Optional)
└── AWS S3 (File Storage)

DevOps:
├── Docker (Containerization)
├── GitHub Actions (CI/CD)
└── Railway/Vercel (Hosting)
```

### Folder Structure

```
FINAL-COMPLETE-APP/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Opportunities.jsx
│   │   │   ├── OpportunityDetail.jsx
│   │   │   ├── Apply.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── Success.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js (Axios instance with interceptors)
│   │   ├── context/
│   │   │   ├── authStore.js (Zustand for auth)
│   │   │   └── themeStore.js (Theme management)
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTheme.js
│   │   │   └── useFetch.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── opportunityController.js
│   │   │   ├── applicationController.js
│   │   │   ├── uploadController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Opportunity.js
│   │   │   ├── Application.js
│   │   │   └── Payment.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── opportunities.js
│   │   │   ├── applications.js
│   │   │   ├── upload.js
│   │   │   ├── admin.js
│   │   │   └── payments.js
│   │   ├── middleware/
│   │   │   ├── auth.js (JWT verification)
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   ├── upload.js
│   │   │   └── rateLimiter.js
│   │   ├── utils/
│   │   │   ├── fileUpload.js
│   │   │   ├── mpesaService.js
│   │   │   ├── emailService.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── seeders/
│   │   │   ├── seed.js
│   │   │   └── seedOpportunities.js
│   │   └── server.js (Entry point)
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── docs/
│   ├── DEPLOYMENT_GUIDE.md (NEW!)
│   ├── ARCHITECTURE_GUIDE.md (NEW!)
│   └── API_DOCUMENTATION.md
│
└── README.md
```

---

## 🎯 Best Practices

### Frontend Best Practices

#### 1. **State Management with Zustand**
```javascript
// ❌ BAD - Prop drilling
<Parent>
  <Child user={user} onLogout={onLogout} theme={theme} />
</Parent>

// ✅ GOOD - Use Zustand stores
import { useAuthStore } from '../context/authStore';
import { useThemeStore } from '../context/themeStore';

function MyComponent() {
  const { user, logout } = useAuthStore();
  const { isDark } = useThemeStore();
  // Use state directly
}
```

#### 2. **Component Organization**
```javascript
// ✅ GOOD - Functional component with clear structure
function UserProfile() {
  // 1. Hooks at top
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // Load user data
  }, []);
  
  // 3. Handlers
  const handleUpdate = () => {};
  
  // 4. Render
  return <div>...</div>;
}

// ✅ GOOD - Extract complex logic to custom hooks
function useUserData(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setData).finally(() => setLoading(false));
  }, [userId]);
  
  return { data, loading };
}
```

#### 3. **API Calls with Axios Interceptors**
```javascript
// services/api.js
import axios from 'axios';
import { useAuthStore } from '../context/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 4. **Form Validation**
```javascript
// ✅ GOOD - Validate before submit
function RegisterForm() {
  const [errors, setErrors] = useState({});
  
  const validateForm = (data) => {
    const newErrors = {};
    
    if (!data.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (data.password.length < 8) {
      newErrors.password = 'Password must be 8+ characters';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => setFormData({...formData, email: e.target.value})} />
      {errors.email && <span className="error">{errors.email}</span>}
    </form>
  );
}
```

#### 5. **Error Boundaries**
```javascript
// components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error tracking service (Sentry)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

### Backend Best Practices

#### 1. **Environment Variables**
```javascript
// ❌ BAD
const apiKey = 'sk_live_123456789';

// ✅ GOOD
require('dotenv').config();
const apiKey = process.env.STRIPE_API_KEY;

// .env
STRIPE_API_KEY=sk_live_123456789
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://...
```

#### 2. **Error Handling Middleware**
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  // Known error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Generic error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

app.use(errorHandler);
```

#### 3. **Request Validation**
```javascript
// routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');

router.post('/register',
  // Validation rules
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty(),
  // Middleware to check errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  // Controller
  authController.register
);
```

#### 4. **Database Queries**
```javascript
// ❌ BAD - N+1 query problem
const users = await User.find();
for (const user of users) {
  const applications = await Application.find({ userId: user._id });
  user.applications = applications;
}

// ✅ GOOD - Use populate or aggregation
const users = await User.find().populate('applications');

// ✅ GOOD - Aggregation pipeline for complex queries
const stats = await User.aggregate([
  { $match: { role: 'student' } },
  { $lookup: {
      from: 'applications',
      localField: '_id',
      foreignField: 'userId',
      as: 'applications'
    }
  },
  { $group: {
      _id: '$_id',
      applicationCount: { $size: '$applications' }
    }
  }
]);
```

#### 5. **Input Sanitization**
```javascript
// ❌ BAD - Vulnerable to NoSQL injection
const user = await User.findOne({ email: req.body.email });

// ✅ GOOD - Validate first
const { email } = req.body;
if (!email || typeof email !== 'string') {
  return res.status(400).json({ error: 'Invalid email' });
}
const user = await User.findOne({ email: email.trim().toLowerCase() });
```

#### 6. **Rate Limiting**
```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Apply to sensitive routes
app.post('/api/auth/login', limiter, authController.login);
app.post('/api/auth/register', limiter, authController.register);
```

---

## ⚡ Performance Optimization

### Frontend Performance

#### 1. **Code Splitting**
```javascript
// ✅ GOOD - Lazy load routes
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

#### 2. **Image Optimization**
```jsx
// ❌ BAD - Large unoptimized image
<img src="large-image.jpg" alt="Profile" />

// ✅ GOOD - Use WebP with fallback, responsive sizes
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img 
    src="image.jpg" 
    alt="Profile"
    loading="lazy"
    decoding="async"
    width="200"
    height="200"
  />
</picture>
```

#### 3. **Memoization**
```javascript
// ✅ GOOD - Prevent unnecessary re-renders
import { memo } from 'react';

const OpportunityCard = memo(({ opportunity, onApply }) => {
  return (
    <div>
      <h3>{opportunity.title}</h3>
      <button onClick={() => onApply(opportunity.id)}>Apply</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.opportunity.id === nextProps.opportunity.id;
});
```

#### 4. **Build Optimization (Vite)**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['zustand', 'axios']
        }
      }
    },
    minify: 'terser',
    sourcemap: false // Disable in production
  }
});
```

### Backend Performance

#### 1. **Database Indexing**
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Always index frequently queried fields
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index compound queries
userSchema.index({ email: 1, role: 1 });
```

#### 2. **Caching Strategy**
```javascript
// Use Redis for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache user data
const getCachedUser = async (userId) => {
  // Try cache first
  const cached = await client.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const user = await User.findById(userId);
  
  // Store in cache for 1 hour
  await client.setEx(`user:${userId}`, 3600, JSON.stringify(user));
  
  return user;
};
```

#### 3. **Pagination**
```javascript
// ❌ BAD - Load all records
const applications = await Application.find();

// ✅ GOOD - Paginate large datasets
const page = req.query.page || 1;
const limit = 20;
const skip = (page - 1) * limit;

const applications = await Application.find()
  .skip(skip)
  .limit(limit)
  .lean(); // Return plain objects, not Mongoose documents
```

#### 4. **Async/Await Best Practices**
```javascript
// ❌ BAD - Sequential queries
const user = await User.findById(userId);
const applications = await Application.find({ userId });
const payments = await Payment.find({ userId });

// ✅ GOOD - Parallel queries
const [user, applications, payments] = await Promise.all([
  User.findById(userId),
  Application.find({ userId }),
  Payment.find({ userId })
]);
```

---

## 📈 Scalability Strategy

### Phase 1: MVP (0-1,000 users)
- Vercel frontend ($0)
- Railway backend ($7)
- MongoDB Atlas free tier ($0)
- Simple architecture

### Phase 2: Growth (1,000-10,000 users)
- Vercel Pro ($20)
- Railway auto-scaling ($30-50)
- MongoDB M1 ($30)
- Add caching (Redis)
- Add CDN (Cloudflare Pro $20)

### Phase 3: Scale (10,000-100,000 users)
- Multiple backend instances
- Database replicas
- Advanced caching
- Global CDN
- Load balancing

### Phase 4: Enterprise (100,000+ users)
- Kubernetes orchestration
- Multi-region deployment
- Dedicated database cluster
- Advanced monitoring
- Custom infrastructure

---

## 🔒 Security Best Practices

### Frontend Security
```javascript
// 1. Never store sensitive data in localStorage
// ❌ BAD
localStorage.setItem('password', password);

// ✅ GOOD - Store only JWT token
localStorage.setItem('token', jwtToken);

// 2. Use httpOnly cookies for tokens (if possible)
// Server sets: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// 3. Validate all user input
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 4. Sanitize HTML output
import DOMPurify from 'dompurify';
<div>{DOMPurify.sanitize(userContent)}</div>
```

### Backend Security
```javascript
// 1. Helmet.js for HTTP headers
const helmet = require('helmet');
app.use(helmet());

// 2. CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}));

// 3. JWT verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 4. Password hashing
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hashedPassword);
```

---

## 🧪 Code Quality

### Testing Strategy

```javascript
// __tests__/authController.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    test('should register new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
    });
    
    test('should not register with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
    });
  });
});
```

### Linting & Formatting

```bash
# Install ESLint
npm install --save-dev eslint @eslint/js

# Create config
npx eslint --init

# Run linter
npm run lint

# Fix automatically
npm run lint -- --fix
```

---

## 🚀 DevOps & CI/CD

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 🚀 Future Improvements

### Short Term (1-3 months)
- [ ] Add user profile customization
- [ ] Implement saved searches
- [ ] Add email notifications
- [ ] Improve search filters
- [ ] Mobile app (React Native)

### Medium Term (3-6 months)
- [ ] AI-powered job recommendations
- [ ] Video interview integration
- [ ] Application analytics dashboard
- [ ] Referral program
- [ ] Company review system

### Long Term (6-12 months)
- [ ] Machine learning for job matching
- [ ] Advanced payment options
- [ ] Multi-language support
- [ ] International expansion
- [ ] B2B SaaS for companies

### Technical Improvements
- [ ] Implement GraphQL
- [ ] Add WebSocket for real-time notifications
- [ ] Implement proper logging (Winston/Pino)
- [ ] Add API documentation (Swagger)
- [ ] Implement feature flags
- [ ] Add advanced monitoring (DataDog)
- [ ] Implement message queue (RabbitMQ/Bull)

---

## 📚 Recommended Reading

- [React Best Practices](https://react.dev)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Last Updated:** 2026
**Version:** 1.0
