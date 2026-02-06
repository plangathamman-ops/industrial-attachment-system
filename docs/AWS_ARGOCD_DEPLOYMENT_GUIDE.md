This document has been removed from the repository during a cleanup to eliminate ArgoCD/EKS-specific instructions.
If you need the original guide, retrieve it from the project archive or contact the maintainer.

### Option 1: Using eksctl (Recommended - Easy)

```bash
# Create cluster configuration file
cat > cluster-config.yaml <<EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: attachment-cluster
  region: us-east-1
  version: "1.28"

nodeGroups:
  - name: attachment-nodes
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 1
    maxSize: 4
    volumeSize: 20
    ssh:
      allow: true
    labels:
      role: worker
    tags:
      environment: production
      project: industrial-attachment

# Enable IAM OIDC provider for service accounts
iam:
  withOIDC: true

# Add-ons
addons:
  - name: vpc-cni
  - name: coredns
  - name: kube-proxy
EOF

# Create cluster (takes 15-20 minutes)
eksctl create cluster -f cluster-config.yaml

# Verify cluster
kubectl get nodes
# Should show 2 nodes in Ready state
```

### Option 2: Using AWS Console (Manual)

```
1. Go to AWS Console → EKS
2. Click "Create cluster"
3. Cluster name: attachment-cluster
4. Kubernetes version: 1.28
5. Cluster role: Create new or select existing
6. VPC: Default or create new
7. Subnets: Select at least 2 in different AZs
8. Security groups: Default
9. Click "Create"

After cluster creation:
10. Add node group:
    - Name: attachment-nodes
    - Instance type: t3.medium
    - Desired capacity: 2
    - Min: 1, Max: 4
    - SSH key: Select or create
11. Click "Create"
```

### Step 3: Update kubeconfig

```bash
# Update kubeconfig to connect to cluster
aws eks update-kubeconfig \
  --region us-east-1 \
  --name attachment-cluster

# Verify connection
kubectl get nodes
kubectl get namespaces
```

---

## 🐳 ECR Setup

### Step 1: Create ECR Repositories

```bash
# Create repositories for backend and frontend
aws ecr create-repository \
  --repository-name industrial-attachment/backend \
  --region us-east-1

aws ecr create-repository \
  --repository-name industrial-attachment/frontend \
  --region us-east-1

# Get repository URIs (save these!)
aws ecr describe-repositories \
  --region us-east-1 \
  --query 'repositories[*].[repositoryName,repositoryUri]' \
  --output table

# Example output:
# backend:  123456789.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/backend
# frontend: 123456789.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/frontend
```

### Step 2: Authenticate Docker to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS \
  --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Should see: "Login Succeeded"
```

---

## 🏗️ Build & Push Docker Images

### Step 1: Build Images

```bash
# Navigate to project root
cd industrial-attachment-app

# Build backend image
cd backend
docker build -t industrial-attachment-backend:latest .

# Build frontend image
cd ../frontend
docker build -t industrial-attachment-frontend:latest .
```

### Step 2: Tag Images

```bash
# Replace with your actual ECR URIs
ACCOUNT_ID=123456789
REGION=us-east-1

# Tag backend
docker tag industrial-attachment-backend:latest \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/backend:latest

docker tag industrial-attachment-backend:latest \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/backend:v1.0.0

# Tag frontend
docker tag industrial-attachment-frontend:latest \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/frontend:latest

docker tag industrial-attachment-frontend:latest \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/frontend:v1.0.0
```

### Step 3: Push Images to ECR

```bash
# Push backend
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/backend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/backend:v1.0.0

# Push frontend
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/frontend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/industrial-attachment/frontend:v1.0.0

# Verify images in ECR
aws ecr list-images \
  --repository-name industrial-attachment/backend \
  --region us-east-1

aws ecr list-images \
  --repository-name industrial-attachment/frontend \
  --region us-east-1
```

---

## 🔄 ArgoCD Installation

### Step 1: Install ArgoCD

```bash
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready (2-3 minutes)
kubectl wait --for=condition=available --timeout=300s \
  deployment/argocd-server -n argocd

# Verify installation
kubectl get pods -n argocd
# All pods should be Running
```

### Step 2: Expose ArgoCD Server

**Option A: LoadBalancer (Recommended for production)**
```bash
# Change service type to LoadBalancer
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get LoadBalancer URL (wait 2-3 minutes)
kubectl get svc argocd-server -n argocd
# Note the EXTERNAL-IP
```

**Option B: Port Forward (for testing)**
```bash
# Port forward to localhost
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access at: https://localhost:8080
```

### Step 3: Get ArgoCD Admin Password

```bash
# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d; echo

# Save this password!
# Username: admin
# Password: [output from above command]
```

### Step 4: Login to ArgoCD

**Via Web UI:**
```
1. Open browser: https://[EXTERNAL-IP] or https://localhost:8080
2. Username: admin
3. Password: [from previous step]
4. Click "Sign In"
```

**Via CLI:**
```bash
# Install ArgoCD CLI
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# Login
argocd login localhost:8080 \
  --username admin \
  --password [YOUR_PASSWORD] \
  --insecure

# Change admin password (recommended)
argocd account update-password
```

---

## 🚀 Deploy Application

### Step 1: Create Kubernetes Manifests Repository

```bash
# Create new GitHub repository: industrial-attachment-k8s

# Clone and setup
git clone https://github.com/YOUR_USERNAME/industrial-attachment-k8s.git
cd industrial-attachment-k8s

# Create directory structure
mkdir -p {base,overlays/{dev,staging,production}}

# Copy k8s manifests from your app
cp -r /path/to/industrial-attachment-app/k8s/* base/
```

### Step 2: Create Kubernetes Manifests

**base/namespace.yaml:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: industrial-attachment
  labels:
    name: industrial-attachment
    environment: production
```

**base/mongodb-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: industrial-attachment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:7
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-data
          mountPath: /data/db
      volumes:
      - name: mongodb-data
        persistentVolumeClaim:
          claimName: mongodb-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  namespace: industrial-attachment
spec:
  selector:
    app: mongodb
  ports:
  - port: 27017
    targetPort: 27017
  type: ClusterIP
```

**base/mongodb-pvc.yaml:**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: industrial-attachment
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: gp2  # AWS EBS
```

**base/secrets.yaml:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
  namespace: industrial-attachment
type: Opaque
stringData:
  username: admin
  password: YOUR_SECURE_PASSWORD_HERE  # Change this!

---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: industrial-attachment
type: Opaque
stringData:
  JWT_SECRET: your-jwt-secret-change-in-production
  MPESA_CONSUMER_KEY: your-mpesa-consumer-key
  MPESA_CONSUMER_SECRET: your-mpesa-consumer-secret
  MPESA_PASSKEY: your-mpesa-passkey
  CLOUDINARY_CLOUD_NAME: your-cloudinary-name
  CLOUDINARY_API_KEY: your-cloudinary-key
  CLOUDINARY_API_SECRET: your-cloudinary-secret
  ADZUNA_APP_ID: your-adzuna-app-id
  ADZUNA_APP_KEY: your-adzuna-app-key
  JOOBLE_API_KEY: your-jooble-api-key
```

**base/backend-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: industrial-attachment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: PORT
          value: "5000"
        - name: NODE_ENV
          value: "production"
        - name: MONGO_URI
          value: "mongodb://$(MONGO_USER):$(MONGO_PASSWORD)@mongodb:27017/industrial-attachment?authSource=admin"
        - name: MONGO_USER
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: username
        - name: MONGO_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        - name: MPESA_CONSUMER_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: MPESA_CONSUMER_KEY
        - name: MPESA_CONSUMER_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: MPESA_CONSUMER_SECRET
        - name: CLOUDINARY_CLOUD_NAME
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: CLOUDINARY_CLOUD_NAME
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: industrial-attachment
spec:
  selector:
    app: backend
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP
```

**base/frontend-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: industrial-attachment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: VITE_API_URL
          value: "https://api.attachmentke.com/api"  # Update with your domain
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: industrial-attachment
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

**base/ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: industrial-attachment
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:REGION:ACCOUNT:certificate/CERT_ID  # Add your cert
spec:
  rules:
  - host: attachmentke.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 5000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
  - host: www.attachmentke.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
```

**base/kustomization.yaml:**
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: industrial-attachment

resources:
  - namespace.yaml
  - mongodb-pvc.yaml
  - mongodb-deployment.yaml
  - backend-deployment.yaml
  - frontend-deployment.yaml
  - secrets.yaml
  - ingress.yaml

commonLabels:
  app: industrial-attachment
```

### Step 3: Commit and Push

```bash
# Commit manifests
git add .
git commit -m "Add Kubernetes manifests"
git push origin main
```

### Step 4: Create ArgoCD Application

**Via CLI:**
```bash
argocd app create industrial-attachment \
  --repo https://github.com/YOUR_USERNAME/industrial-attachment-k8s.git \
  --path base \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace industrial-attachment \
  --sync-policy automated \
  --auto-prune \
  --self-heal

# Sync application
argocd app sync industrial-attachment

# Check status
argocd app get industrial-attachment
```

**Via Web UI:**
```
1. Login to ArgoCD UI
2. Click "+ NEW APP"
3. Fill details:
   - Application Name: industrial-attachment
   - Project: default
   - Sync Policy: Automatic
   - Repository URL: https://github.com/YOUR_USERNAME/industrial-attachment-k8s.git
   - Path: base
   - Cluster URL: https://kubernetes.default.svc
   - Namespace: industrial-attachment
4. Click "CREATE"
5. Click "SYNC" to deploy
```

### Step 5: Verify Deployment

```bash
# Check pods
kubectl get pods -n industrial-attachment

# Check services
kubectl get svc -n industrial-attachment

# Check ingress
kubectl get ingress -n industrial-attachment

# Get application URL
kubectl get ingress app-ingress -n industrial-attachment \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# Check logs
kubectl logs -f deployment/backend -n industrial-attachment
kubectl logs -f deployment/frontend -n industrial-attachment
```

---

## 🌐 Configure Domain & SSL

### Step 1: Request SSL Certificate in ACM

```bash
# Request certificate via AWS Console:
1. Go to AWS Certificate Manager (ACM)
2. Click "Request certificate"
3. Select "Request a public certificate"
4. Add domain names:
   - attachmentke.com
   - *.attachmentke.com
5. Validation method: DNS validation
6. Click "Request"

# Verify via DNS (add CNAME records to your domain)
7. Copy the CNAME name and value
8. Add to your domain DNS settings
9. Wait for validation (5-30 minutes)
```

### Step 2: Update Ingress with Certificate ARN

```bash
# Get certificate ARN
aws acm list-certificates --region us-east-1

# Update ingress.yaml with certificate ARN
# Edit base/ingress.yaml and add:
annotations:
  alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123456789:certificate/abc-123

# Commit and push
git add base/ingress.yaml
git commit -m "Add SSL certificate"
git push

# ArgoCD will auto-sync
```

### Step 3: Update DNS Records

```bash
# Get LoadBalancer DNS name
kubectl get ingress app-ingress -n industrial-attachment \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# Example output: k8s-industri-appingre-xyz123.us-east-1.elb.amazonaws.com

# Add DNS records in your domain registrar:
Type: CNAME
Name: @
Value: k8s-industri-appingre-xyz123.us-east-1.elb.amazonaws.com

Type: CNAME
Name: www
Value: k8s-industri-appingre-xyz123.us-east-1.elb.amazonaws.com

Type: CNAME
Name: api
Value: k8s-industri-appingre-xyz123.us-east-1.elb.amazonaws.com
```

---

## 📊 Monitoring & Logs

### Install AWS Load Balancer Controller

```bash
# Download IAM policy
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json

# Create IAM policy
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json

# Create IAM service account
eksctl create iamserviceaccount \
  --cluster=attachment-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve

# Install controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=attachment-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n industrial-attachment

# Frontend logs
kubectl logs -f deployment/frontend -n industrial-attachment

# MongoDB logs
kubectl logs -f deployment/mongodb -n industrial-attachment

# All pods
kubectl logs -f -l app=industrial-attachment -n industrial-attachment

# Previous logs (if pod crashed)
kubectl logs --previous deployment/backend -n industrial-attachment
```

### CloudWatch Integration (Optional)

```bash
# Install CloudWatch agent
curl https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/quickstart/cwagent-fluentd-quickstart.yaml | sed "s/{{cluster_name}}/attachment-cluster/;s/{{region_name}}/us-east-1/" | kubectl apply -f -

# View logs in CloudWatch Console:
# CloudWatch → Log groups → /aws/eks/attachment-cluster
```

---

## 🔧 Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n industrial-attachment

# Describe pod
kubectl describe pod POD_NAME -n industrial-attachment

# Check events
kubectl get events -n industrial-attachment --sort-by='.lastTimestamp'

# Common issues:
# - ImagePullBackOff: Check ECR permissions
# - CrashLoopBackOff: Check logs and environment variables
# - Pending: Check node resources
```

### Database Connection Issues

```bash
# Check MongoDB pod
kubectl get pod -l app=mongodb -n industrial-attachment

# Exec into backend pod
kubectl exec -it deployment/backend -n industrial-attachment -- sh

# Test MongoDB connection
nc -zv mongodb 27017
# Or
mongosh mongodb://admin:password@mongodb:27017/

# Check MongoDB logs
kubectl logs deployment/mongodb -n industrial-attachment
```

### Ingress Not Working

```bash
# Check ingress
kubectl describe ingress app-ingress -n industrial-attachment

# Check Load Balancer Controller
kubectl get pods -n kube-system | grep aws-load-balancer

# Check ALB in AWS Console
# EC2 → Load Balancers → Find your ALB

# Common issues:
# - No address: Wait 5-10 minutes for ALB provisioning
# - 502/503: Check backend service and pods
# - 404: Check ingress paths
```

### Image Pull Errors

```bash
# Create ECR secret for pulling images
kubectl create secret docker-registry ecr-secret \
  --docker-server=ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region REGION) \
  --namespace=industrial-attachment

# Add to deployment:
spec:
  template:
    spec:
      imagePullSecrets:
      - name: ecr-secret
```

### ArgoCD Sync Issues

```bash
# Force refresh
argocd app get industrial-attachment --refresh

# Hard refresh (re-pull from Git)
argocd app get industrial-attachment --hard-refresh

# Delete and recreate
argocd app delete industrial-attachment
argocd app create industrial-attachment [options]
```

---

## 🚀 CI/CD with GitHub Actions

### .github/workflows/deploy.yml:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

env:
  AWS_REGION: us-east-1
  ECR_BACKEND: ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/backend
  ECR_FRONTEND: ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/frontend

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build and push backend
      working-directory: ./backend
      run: |
        docker build -t $ECR_BACKEND:$GITHUB_SHA .
        docker push $ECR_BACKEND:$GITHUB_SHA
        docker tag $ECR_BACKEND:$GITHUB_SHA $ECR_BACKEND:latest
        docker push $ECR_BACKEND:latest

    - name: Build and push frontend
      working-directory: ./frontend
      run: |
        docker build -t $ECR_FRONTEND:$GITHUB_SHA .
        docker push $ECR_FRONTEND:$GITHUB_SHA
        docker tag $ECR_FRONTEND:$GITHUB_SHA $ECR_FRONTEND:latest
        docker push $ECR_FRONTEND:latest

    - name: Trigger ArgoCD Sync
      run: |
        # ArgoCD will auto-sync on new image tags
        echo "Deployment complete! ArgoCD will sync automatically."
```

---

## 📝 Quick Reference Commands

```bash
# Check cluster status
kubectl cluster-info
kubectl get nodes

# Check application
kubectl get all -n industrial-attachment

# Restart deployment
kubectl rollout restart deployment/backend -n industrial-attachment
kubectl rollout restart deployment/frontend -n industrial-attachment

# Scale deployment
kubectl scale deployment/backend --replicas=3 -n industrial-attachment

# Update image
kubectl set image deployment/backend \
  backend=ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/industrial-attachment/backend:v2.0.0 \
  -n industrial-attachment

# Delete everything
kubectl delete namespace industrial-attachment

# Delete cluster
eksctl delete cluster --name attachment-cluster --region us-east-1
```

---

## 💰 Cost Optimization

```bash
# Use Spot Instances (60-70% cheaper)
eksctl create nodegroup \
  --cluster attachment-cluster \
  --spot \
  --instance-types t3.medium,t3a.medium \
  --nodes 2

# Use Fargate (pay per pod)
eksctl create fargateprofile \
  --cluster attachment-cluster \
  --name attachment-profile \
  --namespace industrial-attachment

# Schedule downtime for dev/staging
kubectl scale deployment --all --replicas=0 -n industrial-attachment
# Scale back up when needed
kubectl scale deployment --all --replicas=2 -n industrial-attachment
```

---

## ✅ Deployment Checklist

- [ ] AWS CLI configured
- [ ] EKS cluster created
- [ ] ECR repositories created
- [ ] Docker images built and pushed
- [ ] Kubernetes manifests created
- [ ] Secrets configured
- [ ] ArgoCD installed
- [ ] Application deployed
- [ ] Pods running
- [ ] Services accessible
- [ ] Ingress configured
- [ ] SSL certificate added
- [ ] DNS records updated
- [ ] Monitoring setup
- [ ] CI/CD pipeline configured
- [ ] Backups configured
- [ ] Documentation updated

---

**Your application is now live on AWS with GitOps! 🚀**

Access: https://attachmentke.com
Admin: https://attachmentke.com/admin/dashboard
API: https://api.attachmentke.com
