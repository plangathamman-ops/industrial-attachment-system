# 🚀 Complete AWS Deployment Guide - OpportunityHub

**Production-Ready AWS Architecture | Cost-Optimized | High Performance**

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [AWS Services Breakdown](#aws-services-breakdown)
3. [Cost Analysis](#cost-analysis)
4. [Pre-Deployment Checklist](#pre-deployment-checklist)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Configuration Files](#configuration-files)
7. [Monitoring & Scaling](#monitoring--scaling)
8. [Security & Best Practices](#security--best-practices)

---

## 🏗️ Architecture Overview

### Recommended AWS Architecture (Most Cost-Efficient)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Users (Global)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐        ┌──────────────┐
        │  Route 53    │        │  Route 53    │
        │  (DNS)       │        │  (Health)    │
        └───────┬──────┘        └──────────────┘
                │
                ▼
        ┌──────────────────────┐
        │   CloudFront CDN     │
        │  (Global Edge Nodes) │
        │  - Images            │
        │  - CSS/JS            │
        │  - Static Assets     │
        └───────────┬──────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │   S3    │  │   S3    │  │   S3    │
    │ Static  │  │ Static  │  │ Static  │
    │ Website │  │ Website │  │ Website │
    │ (us)    │  │ (eu)    │  │ (ap)    │
    └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │
         └────────────┼────────────┘
                      │
                ┌─────▼──────┐
                │ Application│
                │ Load Balancer
                │ (ALB)      │
                └─────┬──────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  ECS     │ │  ECS     │ │  ECS     │
    │ Task 1   │ │ Task 2   │ │ Task 3   │
    │(Backend) │ │(Backend) │ │(Backend) │
    │(t3.micro)│ │(t3.micro)│ │(t3.micro)│
    └──────────┘ └──────────┘ └──────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
    ┌──────────┐            ┌──────────────┐
    │ RDS      │            │   DynamoDB   │
    │ MongoDB  │            │   (Sessions) │
    │ (Multi-AZ)
    │          │            │              │
    └──────────┘            └──────────────┘
        │
        ▼
    ┌──────────┐
    │    S3    │
    │ (Uploads)│
    │ (Files)  │
    └──────────┘
```

### Three Recommended Deployment Options

#### **Option 1: Full AWS - $50-120/month**
- Frontend: S3 + CloudFront + Route 53
- Backend: ECS Fargate (serverless)
- Database: RDS MongoDB or DynamoDB
- Storage: S3
- Cost: $50-120/month

#### **Option 2: Hybrid (AWS + 3rd Party) (RECOMMENDED) - $40-80/month**
- Frontend: S3 + CloudFront + Route 53
- Backend: Railway ($7-30) or Render ($12-20)
- Database: MongoDB Atlas ($0-30)
- Cost: $40-80/month

#### **Option 3: Budget (Minimal) - $15-30/month**
- Frontend: Vercel Free
- Backend: Railway ($7-30)
- Database: MongoDB Atlas Free
- Cost: $15-30/month

**We recommend Option 2 (Hybrid) for best cost-efficiency and ease of deployment.**

---

## 🔧 AWS Services Breakdown

### 1. **S3 (Simple Storage Service)** - $0-10/month

#### Purpose:
- Store frontend static files (HTML, CSS, JS)
- Store user uploads (CVs, documents)
- Backup and archive data

#### Configuration:

**Bucket 1: Frontend Static Website**
```
Name: opportunityhub-frontend-prod
Region: us-east-1 (default, cheaper)
Versioning: Enabled
Public Access: Partial (CloudFront only)
Cost: ~$0.50/month (for 500GB typical)
```

**Bucket 2: User Uploads**
```
Name: opportunityhub-uploads
Region: us-east-1
Versioning: Disabled
Lifecycle: Delete after 90 days
Cost: ~$5/month
```

**Bucket 3: Backups**
```
Name: opportunityhub-backups
Region: us-west-2 (cross-region)
Cost: ~$2/month
```

#### Cost Optimization:
- ✅ Use Standard storage for hot data
- ✅ Use Glacier for archives (after 90 days)
- ✅ Enable S3 Intelligent-Tiering
- ✅ S3 Free tier: 5GB storage free first year

---

### 2. **CloudFront** - $0-20/month

#### Purpose:
- Global Content Delivery Network (CDN)
- Cache static assets at edge locations
- Faster loading worldwide
- DDoS protection included

#### Configuration:

```yaml
Origin: S3 bucket (opportunityhub-frontend-prod)
Protocol: HTTPS only
TTL: 
  - Images: 30 days
  - CSS/JS: 7 days
  - HTML: 1 hour
Compression: Gzip + Brotli enabled
Geographic Restriction: None (or allow Kenya only)
WAF: AWS managed rules (free)
Price Class: Use All Edge Locations (best performance)
Cost: ~$15/month for 1TB bandwidth (typical)
```

#### Cost Optimization:
- ✅ Use standard pricing
- ✅ No minimum commitment
- ✅ Free tier: 50GB bandwidth/month free for 12 months
- ✅ Enable compression (30-50% size reduction)

---

### 3. **Route 53** - $0.50-2/month

#### Purpose:
- DNS management
- Domain registration
- Health checks
- Traffic routing

#### Configuration:

```yaml
Hosted Zone:
  Name: opportunityhub.com
  Type: Public
  
DNS Records:
  A Record (www): CloudFront distribution
  A Record (@): CloudFront distribution
  MX Records: Email (optional)
  
Health Check:
  ALB: Every 30 seconds
  SNS Alert: If down
  
Cost: 
  Hosted zone: $0.50/month
  Health check: $0.50/month
  Domain: $12/year
  Total: ~$1.50/month
```

#### Cost Optimization:
- ✅ Use Route 53 for DNS only (cheapest)
- ✅ Health checks: optional but recommended
- ✅ No additional cost for basic routing

---

### 4. **ECS (Elastic Container Service)** - $15-50/month

#### Purpose:
- Run containerized Node.js backend
- Auto-scaling
- Serverless with Fargate

#### Configuration:

```yaml
Cluster: opportunityhub-prod

Task Definition:
  Name: opportunityhub-backend
  CPU: 256
  Memory: 512 MB
  Container Image: XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/opportunityhub-backend:latest
  Port: 8000
  
Service:
  Name: opportunityhub-backend-service
  Launch Type: Fargate (serverless)
  Network: VPC (public subnet)
  Load Balancer: ALB
  Task Count: 3 (high availability)
  Auto Scaling: Target 70% CPU
  
Fargate Pricing:
  vCPU: 0.25 vCPU × 3 tasks × 730 hours = $3.30
  Memory: 0.5 GB × 3 tasks × 730 hours = $16.50
  ALB: ~$15/month
  Total: ~$35/month
```

#### Cost Optimization:
- ✅ Use Fargate Spot: 70% cheaper ($10/month)
- ✅ Use t3 instances if not Fargate
- ✅ Scale down during off-peak (AWS Application Autoscaling)
- ✅ Reserved capacity: 30% savings (if long-term)

---

### 5. **RDS (Relational Database Service)** - $15-80/month

#### Option A: RDS MongoDB
```yaml
Engine: MongoDB 6.0
Instance Class: db.t3.micro
Storage: 20 GB (free tier eligible)
Multi-AZ: No (for cost)
Backup: 7 days automatic
Cost: ~$15/month (free tier)

Pro: Managed, automatic backups, failover
Con: More expensive than self-managed
```

#### Option B: DynamoDB (RECOMMENDED FOR THIS APP) - $5-25/month
```yaml
Table: opportunities
  Partition Key: _id
  Sort Key: createdAt
  Billing: On-demand (auto-scaling)
  
Table: users
  Partition Key: email
  
Table: applications
  Partition Key: _id
  
Cost: ~$0.25 per million read units
       ~$1.25 per million write units
       Free tier: 25 GB storage, 25 units read/write/sec
       
Typical: $5-15/month
```

#### Option C: MongoDB Atlas (Hybrid) - $0-30/month
```yaml
Plan: M0 Sandbox (Free)
Storage: 512 MB
Or: M2 Shared ($9/month)

Best for: Development to small production
Cost: $0 initially, scales as needed
```

#### Recommendation:
**Use DynamoDB** for:
- Predictable read/write patterns
- Automatic scaling
- Lower operational overhead
- Cheap storage (first 25GB free)

---

### 6. **Application Load Balancer (ALB)** - $15/month

#### Purpose:
- Route traffic to ECS tasks
- Health checks
- HTTPS termination
- High availability

#### Configuration:

```yaml
Name: opportunityhub-alb
Scheme: Internet-facing
Subnets: Public subnets (us-east-1a, us-east-1b)

Listeners:
  HTTP (80) → Redirect to HTTPS
  HTTPS (443) → ECS targets
  
Target Group:
  Name: opportunityhub-backend-tg
  Protocol: HTTP
  Port: 8000
  Health Check: /api/health
  Healthy Threshold: 2
  Unhealthy Threshold: 3
  Timeout: 5 seconds
  
Certificate: AWS Certificate Manager (FREE)

Cost: ~$15/month (fixed)
      + $0.006 per LCU (Least Charged Unit)
      Typical: $15-20/month
```

#### Cost Optimization:
- ✅ Use ALB (cheaper than NLB)
- ✅ Certificate Manager: FREE SSL/TLS
- ✅ Single ALB for multiple services

---

### 7. **ECR (Elastic Container Registry)** - $0.07/month

#### Purpose:
- Store Docker images
- Private container registry
- Integrated with ECS

#### Configuration:

```yaml
Repository: opportunityhub-backend
Visibility: Private
Scan on Push: Enabled (free)
Encryption: KMS (optional)

Cost: 
  Storage: $0.07 per GB/month
  Typical (1GB images): ~$0.07/month
  Data transfer: $0.02 per GB
```

#### Cost Optimization:
- ✅ Delete old image versions
- ✅ Lifecycle policies (keep last 5 images)
- ✅ Use small base images (Alpine Linux)

---

### 8. **CloudWatch** - $5-15/month

#### Purpose:
- Logs from ECS, Lambda, RDS
- Metrics and alarms
- Dashboard

#### Configuration:

```yaml
Log Groups:
  /ecs/opportunityhub-backend
  /rds/opportunityhub
  
Retention: 30 days (cost-effective)

Alarms:
  High CPU (>80%)
  High Memory (>80%)
  Error Rate (>5%)
  RDS CPU (>70%)
  
Dashboards: 1 main dashboard

Cost:
  Logs: $0.50 per GB ingested
  Typical: ~$5/month
  Metrics: No additional cost
  Alarms: No additional cost
```

#### Cost Optimization:
- ✅ Set 30-day retention
- ✅ Only log errors + important events
- ✅ Use log filters

---

### 9. **VPC & Security** - FREE

#### Configuration:

```yaml
VPC: 10.0.0.0/16
Subnets:
  Public A: 10.0.1.0/24 (us-east-1a)
  Public B: 10.0.2.0/24 (us-east-1b)
  Private A: 10.0.10.0/24 (RDS)
  Private B: 10.0.11.0/24 (RDS)
  
NAT Gateway: (1 for egress) - $32/month
  Alternative: NAT Instance (t3.nano) - $5/month

Security Groups:
  ALB: Allow HTTP (80), HTTPS (443)
  ECS: Allow 8000 from ALB only
  RDS: Allow 27017 from ECS only

Cost: FREE (NAT is optional, add $32 if needed)
```

#### Cost Optimization:
- ✅ Skip NAT Gateway initially
- ✅ Use NAT Instance if needed ($5/month)
- ✅ Security groups: Free

---

## 💰 Cost Analysis

### Monthly Cost Breakdown

#### Minimal Setup (For Testing)
```
S3 (1GB):                 $0.50
CloudFront (50GB free):   $0
Route 53:                 $0.50
ECS Fargate Spot (3):     $10
DynamoDB (on-demand):     $5
CloudWatch:               $2
Total: $18/month
```

#### Small Production (1,000-5,000 users)
```
S3 (50GB):                $2
CloudFront (500GB):       $12
Route 53:                 $1
ECS Fargate (3 tasks):    $35
DynamoDB (1M requests):   $10
CloudWatch:               $5
NAT Instance (optional):  $5
Total: $70/month
```

#### Medium Production (5,000-50,000 users)
```
S3 (500GB):               $10
CloudFront (2TB):         $40
Route 53:                 $1
ECS Fargate (6 tasks):    $70
DynamoDB (5M requests):   $30
ElastiCache (Redis):      $15
CloudWatch:               $10
NAT Gateway (1):          $32
Total: $208/month
```

#### Large Production (50,000+ users)
```
S3 (5TB):                 $50
CloudFront (10TB):        $150
Route 53:                 $1
ECS Fargate (12 tasks):   $140
RDS Multi-AZ:             $100
ElastiCache (Cluster):    $100
CloudWatch:               $20
NAT Gateways (2):         $64
Total: $625/month
```

### Cost Comparison: AWS vs. Alternatives

| Service | Full AWS | Hybrid (Recommended) | Budget |
|---------|----------|-----|--------|
| Frontend | $15 | $15 | $0 |
| Backend | $35 | $20 | $30 |
| Database | $10 | $10 | $0 |
| Storage | $5 | $5 | N/A |
| Total | $65 | **$50** | $30 |

**Best for Most:** Hybrid (Option 2) = **$40-80/month** ⭐ RECOMMENDED

**Best for Control:** Full AWS = $70-120/month

**Best for Budget:** Budget (Vercel + Railway) = $15-30/month

---

## 📋 Pre-Deployment Checklist

### AWS Account Setup
- [ ] AWS Account created
- [ ] Billing alerts configured
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS credentials configured (`aws configure`)
- [ ] Region set to us-east-1 (cheapest)

### Code & Repository
- [ ] GitHub repo created and public
- [ ] Code committed and pushed
- [ ] README.md updated
- [ ] .gitignore configured
- [ ] Environment variables documented

### Domain & DNS
- [ ] Domain purchased (or use Route 53)
- [ ] Domain name: opportunityhub.com (or your choice)
- [ ] Email for SSL certificate: your-email@example.com

### AWS Services (Pre-create)
- [ ] S3 buckets created
- [ ] ECR repository created
- [ ] IAM roles created
- [ ] RDS/DynamoDB configured

---

## 🚀 Step-by-Step Deployment

### Phase 1: Prepare AWS Account (15 minutes)

#### Step 1.1: Create S3 Buckets

```bash
# 1. Frontend bucket
aws s3 mb s3://opportunityhub-frontend-prod --region us-east-1

# 2. Uploads bucket
aws s3 mb s3://opportunityhub-uploads --region us-east-1

# 3. Backups bucket
aws s3 mb s3://opportunityhub-backups --region us-west-2

# 4. Block public access for uploads/backups
aws s3api put-public-access-block \
  --bucket opportunityhub-uploads \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# 5. Enable versioning
aws s3api put-bucket-versioning \
  --bucket opportunityhub-frontend-prod \
  --versioning-configuration Status=Enabled
```

#### Step 1.2: Create S3 Bucket Policy (Frontend Only)

```bash
# Create policy file
cat > s3-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::opportunityhub-frontend-prod/*",
      "Condition": {
        "StringEquals": {
          "aws:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
EOF

# Apply policy
aws s3api put-bucket-policy \
  --bucket opportunityhub-frontend-prod \
  --policy file://s3-policy.json
```

#### Step 1.3: Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name opportunityhub-backend \
  --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### Step 1.4: Create DynamoDB Tables

```bash
# Users table
aws dynamodb create-table \
  --table-name users \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Opportunities table
aws dynamodb create-table \
  --table-name opportunities \
  --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    AttributeName=createdAt,AttributeType=N \
  --key-schema \
    AttributeName=_id,KeyType=HASH \
    AttributeName=createdAt,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Applications table
aws dynamodb create-table \
  --table-name applications \
  --attribute-definitions AttributeName=_id,AttributeType=S \
  --key-schema AttributeName=_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Payments table
aws dynamodb create-table \
  --table-name payments \
  --attribute-definitions AttributeName=_id,AttributeType=S \
  --key-schema AttributeName=_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

### Phase 2: Build & Push Docker Image (10 minutes)

#### Step 2.1: Build Docker Image

```bash
cd backend

# Build image
docker build -t opportunityhub-backend:latest .

# Tag for ECR
docker tag opportunityhub-backend:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/opportunityhub-backend:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/opportunityhub-backend:latest

# Note: Replace ACCOUNT_ID with your AWS account number
```

#### Step 2.2: Build & Deploy Frontend

```bash
cd ../frontend

# Build with Vite
npm run build

# Sync to S3
aws s3 sync dist/ s3://opportunityhub-frontend-prod --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

---

### Phase 3: Create CloudFront Distribution (10 minutes)

```bash
# Create distribution
cat > cloudfront-config.json << 'EOF'
{
  "CallerReference": "opportunityhub-$(date +%s)",
  "Comment": "OpportunityHub Frontend",
  "Enabled": true,
  "Origins": {
    "Items": [
      {
        "Id": "S3Origin",
        "DomainName": "opportunityhub-frontend-prod.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "Quantity": 1
  },
  "DefaultCacheBehavior": {
    "AllowedMethods": {
      "Items": ["GET", "HEAD", "OPTIONS"],
      "Quantity": 3,
      "CachedMethods": {
        "Items": ["GET", "HEAD"],
        "Quantity": 2
      }
    },
    "ViewerProtocolPolicy": "redirect-to-https",
    "TargetOriginId": "S3Origin",
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "MinTTL": 0,
    "DefaultTTL": 3600,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "PriceClass": "PriceClass_100",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true
  }
}
EOF

# Create distribution
aws cloudfront create-distribution-with-tags \
  --distribution-config file://cloudfront-config.json
```

---

### Phase 4: Create ECS Cluster & Service (15 minutes)

#### Step 4.1: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name opportunityhub-prod \
  --region us-east-1

# Enable Container Insights (optional, for monitoring)
aws ecs update-cluster-settings \
  --cluster opportunityhub-prod \
  --settings name=containerInsights,value=enabled \
  --region us-east-1
```

#### Step 4.2: Create Task Definition

```bash
# Create task definition file
cat > task-definition.json << 'EOF'
{
  "family": "opportunityhub-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "opportunityhub-backend",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/opportunityhub-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "8000"
        },
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:jwt-secret:0:"
        },
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:database-url:0:"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/opportunityhub-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole"
}
EOF

# Register task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region us-east-1
```

#### Step 4.3: Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name opportunityhub-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application \
  --region us-east-1

# Create target group
aws elbv2 create-target-group \
  --name opportunityhub-targets \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region us-east-1

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:loadbalancer/app/opportunityhub-alb/xxxxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/opportunityhub-targets/xxxxx \
  --region us-east-1
```

#### Step 4.4: Create ECS Service

```bash
# Create service
aws ecs create-service \
  --cluster opportunityhub-prod \
  --service-name opportunityhub-backend-service \
  --task-definition opportunityhub-backend:1 \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/opportunityhub-targets/xxxxx,containerName=opportunityhub-backend,containerPort=8000 \
  --region us-east-1

# Setup auto-scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/opportunityhub-prod/opportunityhub-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region us-east-1

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name ecs-scaling-policy \
  --service-namespace ecs \
  --resource-id service/opportunityhub-prod/opportunityhub-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json \
  --region us-east-1
```

---

### Phase 5: Setup Route 53 DNS (5 minutes)

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name opportunityhub.com \
  --caller-reference $(date +%s) \
  --region us-east-1

# Get zone ID
ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name opportunityhub.com \
  --query 'HostedZones[0].Id' \
  --output text)

# Create A record for www (CloudFront)
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.opportunityhub.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d123.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }' \
  --region us-east-1

# Create A record for api (ALB)
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.opportunityhub.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z35SXDOTRQ7X7K",
          "DNSName": "opportunityhub-alb-xxxxx.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }' \
  --region us-east-1

# Create A record for root domain
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "opportunityhub.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d123.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }' \
  --region us-east-1
```

---

## 📁 Configuration Files

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY src ./src

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start app
CMD ["node", "src/server.js"]
```

### Environment Variables (.env for ECS)

Store in **AWS Secrets Manager**:

```bash
# Create secrets
aws secretsmanager create-secret \
  --name jwt-secret \
  --secret-string "your-super-secret-jwt-key"

aws secretsmanager create-secret \
  --name database-url \
  --secret-string "mongodb+srv://user:password@cluster.mongodb.net/opportunityhub"

aws secretsmanager create-secret \
  --name mpesa-config \
  --secret-string '{"key":"xxx","secret":"yyy"}'

aws secretsmanager create-secret \
  --name aws-credentials \
  --secret-string '{"accessKeyId":"xxx","secretAccessKey":"yyy"}'
```

### Frontend Environment (.env)

```env
VITE_API_URL=https://api.opportunityhub.com
VITE_APP_NAME=OpportunityHub
VITE_APP_URL=https://opportunityhub.com
```

---

## 📊 Monitoring & Scaling

### CloudWatch Dashboard

```bash
# Create custom dashboard
aws cloudwatch put-dashboard \
  --dashboard-name OpportunityHub-Prod \
  --dashboard-body file://dashboard.json
```

**dashboard.json:**
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          ["AWS/ECS", "MemoryUtilization", {"stat": "Average"}],
          ["AWS/ApplicationELB", "TargetResponseTime", {"stat": "Average"}],
          ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", {"stat": "Sum"}]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "ECS Performance"
      }
    }
  ]
}
```

### CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name ecs-high-cpu \
  --alarm-description "Alert when ECS CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:opportunityhub-alerts

# Service unhealthy alarm
aws cloudwatch put-metric-alarm \
  --alarm-name ecs-unhealthy-targets \
  --alarm-description "Alert when targets unhealthy" \
  --metric-name UnHealthyHostCount \
  --namespace AWS/ApplicationELB \
  --statistic Maximum \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:opportunityhub-alerts
```

### Auto-Scaling Policy

```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 300,
  "ScaleInCooldown": 300
}
```

---

## 🔒 Security & Best Practices

### IAM Roles

**ECS Task Execution Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

**ECS Task Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:s3:::opportunityhub-uploads/*",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/users",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/opportunities",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/applications"
      ]
    }
  ]
}
```

### Security Groups

```bash
# ALB Security Group
aws ec2 create-security-group \
  --group-name alb-sg \
  --description "ALB Security Group"

aws ec2 authorize-security-group-ingress \
  --group-name alb-sg \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name alb-sg \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# ECS Security Group
aws ec2 authorize-security-group-ingress \
  --group-name ecs-sg \
  --protocol tcp \
  --port 8000 \
  --source-group alb-sg

# RDS Security Group
aws ec2 authorize-security-group-ingress \
  --group-name rds-sg \
  --protocol tcp \
  --port 27017 \
  --source-group ecs-sg
```

### SSL/TLS Certificate

```bash
# Request certificate (FREE with ACM)
aws acm request-certificate \
  --domain-name opportunityhub.com \
  --subject-alternative-names www.opportunityhub.com api.opportunityhub.com \
  --region us-east-1

# Add to ALB listener
aws elbv2 modify-listener \
  --listener-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/xxxxx

# Redirect HTTP to HTTPS
aws elbv2 modify-listener \
  --listener-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] AWS account created and configured
- [ ] AWS CLI installed and configured
- [ ] Docker installed
- [ ] GitHub repository ready
- [ ] Domain purchased or registered

### Infrastructure
- [ ] S3 buckets created (3)
- [ ] ECR repository created
- [ ] DynamoDB tables created
- [ ] VPC and subnets configured
- [ ] Security groups created
- [ ] IAM roles created

### Build & Push
- [ ] Backend Docker image built
- [ ] Image pushed to ECR
- [ ] Frontend built (npm run build)
- [ ] Frontend uploaded to S3

### Deployment
- [ ] CloudFront distribution created
- [ ] Route 53 hosted zone created
- [ ] DNS records created (www, api, root)
- [ ] ECS cluster created
- [ ] Task definition registered
- [ ] ALB created and configured
- [ ] ECS service created
- [ ] Auto-scaling configured

### Post-Deployment
- [ ] Test frontend URL (www.opportunityhub.com)
- [ ] Test API URL (api.opportunityhub.com)
- [ ] Verify SSL/TLS certificates
- [ ] Test all application features
- [ ] Monitor CloudWatch metrics
- [ ] Setup alarms and notifications
- [ ] Configure backups
- [ ] Document configuration

---

## 📝 Troubleshooting

### ECS Tasks Not Running
```bash
# Check service status
aws ecs describe-services \
  --cluster opportunityhub-prod \
  --services opportunityhub-backend-service

# Check task logs
aws logs tail /ecs/opportunityhub-backend --follow

# Get task details
aws ecs describe-tasks \
  --cluster opportunityhub-prod \
  --tasks <task-arn>
```

### Database Connection Issues
```bash
# Test from ECS task
aws ecs execute-command \
  --cluster opportunityhub-prod \
  --task <task-id> \
  --container opportunityhub-backend \
  --interactive \
  --command "/bin/sh"

# Inside container
nc -zv database-host.region.rds.amazonaws.com 27017
```

### CloudFront Not Serving Files
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <id> \
  --paths "/*"

# Check distribution status
aws cloudfront get-distribution \
  --id <id>
```

---

## 📈 Scaling & Growth Path

### Phase 1: MVP (0-1,000 users) - $70/month
- 1 ALB
- 3 ECS Fargate Spot tasks
- DynamoDB on-demand
- 50GB S3
- Single AZ

### Phase 2: Growth (1,000-10,000 users) - $150/month
- 1 ALB across 2 AZs
- 6 ECS Fargate tasks (mixed spot/on-demand)
- DynamoDB with GSI
- ElastiCache (Redis)
- 500GB S3
- Multi-AZ RDS backup

### Phase 3: Scale (10,000-100,000 users) - $400/month
- 2 ALBs
- 12 ECS Fargate tasks
- RDS Multi-AZ
- ElastiCache Cluster
- 2TB S3
- CloudTrail logging

### Phase 4: Enterprise (100,000+ users)
- Kubernetes (EKS)
- RDS Aurora
- Multiple regions
- Advanced monitoring

---

## 📞 AWS Support Resources

- AWS Support: https://console.aws.amazon.com/support
- AWS Documentation: https://docs.aws.amazon.com
- AWS Forums: https://forums.aws.amazon.com
- AWS CLI Reference: https://docs.aws.amazon.com/cli/latest/reference/

---

## 🎯 Key Takeaways

### Architecture Decision
- **Full AWS** is best for scalability and control
- **Hybrid** (AWS + 3rd party) offers better cost/performance balance
- **Budget** option (Vercel + Railway) is easiest to start

### Cost Optimization
- Use S3 Intelligent-Tiering
- Use Fargate Spot for non-critical workloads
- Use DynamoDB on-demand for variable traffic
- Set up lifecycle policies for old data

### Best Practices
- Use Infrastructure as Code (Terraform recommended)
- Implement monitoring from day 1
- Use CloudWatch for logs and metrics
- Enable auto-scaling for high availability
- Keep security groups restrictive

---

**Last Updated:** February 6, 2026  
**Version:** 1.0  
**Status:** Production Ready
