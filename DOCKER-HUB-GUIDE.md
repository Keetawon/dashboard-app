# Docker Hub Deployment Guide

## 📋 Prerequisites

1. **Docker Hub Account**: Create account at https://hub.docker.com
2. **Docker Installed**: Install Docker Desktop on your machine
3. **Docker Login**: `docker login`

## 🚀 Step-by-Step Deployment

### Step 1: Update Configuration

Edit `docker-hub-deploy.sh` and change:
```bash
DOCKER_USERNAME="your-actual-dockerhub-username"  # Replace with your username
```

### Step 2: Build and Deploy

```bash
# Make script executable
chmod +x docker-hub-deploy.sh

# Run deployment script
./docker-hub-deploy.sh
```

The script will:
- ✅ Build optimized Docker image
- ✅ Test image locally
- ✅ Tag for Docker Hub
- ✅ Push to Docker Hub
- ✅ Provide deployment instructions

### Step 3: Verify Upload

Visit your Docker Hub repository:
`https://hub.docker.com/r/your-username/dashboard-app`

## 🌐 Deploy Anywhere

Once pushed to Docker Hub, anyone can deploy your dashboard:

### Quick Deploy
```bash
docker run -d -p 8080:80 your-username/dashboard-app:latest
```

### Production Deploy
```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  dashboard:
    image: your-username/dashboard-app:latest
    ports:
      - "8080:80"
    environment:
      - TZ=Asia/Bangkok
    volumes:
      - dashboard_data:/app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  dashboard_data:
EOF

# Deploy
docker-compose up -d
```

## 🔧 Image Features

### Optimizations
- ✅ Multi-stage build (smaller image)
- ✅ Alpine Linux base (security + size)
- ✅ Non-root user execution
- ✅ Health checks included
- ✅ Production nginx configuration
- ✅ Automatic data sync (daily)

### Security
- ✅ Security headers configured
- ✅ No sensitive data in image
- ✅ Minimal attack surface
- ✅ Regular security updates

### Performance
- ✅ Static asset caching
- ✅ Gzip compression
- ✅ Optimized build process
- ✅ Fast startup time

## 📊 Usage Statistics

After deployment, you can monitor usage on Docker Hub:
- Pull statistics
- Download metrics
- Version tracking

## 🔄 Updating

### New Version Deployment
```bash
# Update version in docker-hub-deploy.sh
VERSION="1.1"

# Run deployment script
./docker-hub-deploy.sh
```

### Rolling Updates
```bash
# Pull latest
docker pull your-username/dashboard-app:latest

# Update running container
docker-compose pull
docker-compose up -d
```

## 🌍 Global Deployment Examples

### AWS ECS
```json
{
  "family": "dashboard-app",
  "containerDefinitions": [
    {
      "name": "dashboard",
      "image": "your-username/dashboard-app:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 8080
        }
      ]
    }
  ]
}
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dashboard-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dashboard
  template:
    metadata:
      labels:
        app: dashboard
    spec:
      containers:
      - name: dashboard
        image: your-username/dashboard-app:latest
        ports:
        - containerPort: 80
```

### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name dashboard-app \
  --image your-username/dashboard-app:latest \
  --dns-name-label dashboard-app \
  --ports 80
```

## 🎯 Benefits of Docker Hub Deployment

1. **Global Distribution** - CDN-backed image delivery
2. **Version Control** - Tagged releases and rollbacks
3. **Easy Deployment** - One command deployment anywhere
4. **Collaboration** - Team access and permissions
5. **Integration** - CI/CD pipeline compatibility
6. **Monitoring** - Usage analytics and insights

## 🔍 Troubleshooting

### Build Issues
```bash
# Check Docker installation
docker --version

# Clear build cache
docker builder prune

# Build with verbose output
docker build -t dashboard-app . --progress=plain
```

### Push Issues
```bash
# Check login status
docker info | grep Username

# Re-login if needed
docker login

# Check image size (should be < 1GB)
docker images dashboard-app
```

### Deployment Issues
```bash
# Test locally first
docker run -d -p 8080:80 dashboard-app
curl http://localhost:8080/health

# Check container logs
docker logs container-name
```

---

**🚀 Ready to deploy your dashboard globally!**