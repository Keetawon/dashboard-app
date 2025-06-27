#!/bin/bash

# Dashboard Docker Hub Deployment Script
set -e

echo "=== Dashboard Docker Hub Deployment ==="

# Configuration - UPDATE THESE VALUES
DOCKER_USERNAME="keetawon"  # Change this to your Docker Hub username
IMAGE_NAME="dashboard-app"
VERSION="1.0"
LATEST_TAG="latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if user is logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    print_warning "You're not logged in to Docker Hub."
    echo "Please run: docker login"
    read -p "Do you want to login now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker login
    else
        print_error "Docker login required to push to Docker Hub"
        exit 1
    fi
fi

# Build the image
print_status "Building Docker image..."
docker build -t $IMAGE_NAME:$VERSION .
docker build -t $IMAGE_NAME:$LATEST_TAG .

# Tag for Docker Hub
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME"
docker tag $IMAGE_NAME:$VERSION $FULL_IMAGE_NAME:$VERSION
docker tag $IMAGE_NAME:$LATEST_TAG $FULL_IMAGE_NAME:$LATEST_TAG

# Test the image locally
print_status "Testing image locally..."
docker run -d --name test-dashboard -p 8080:80 $IMAGE_NAME:$LATEST_TAG

# Wait for container to start
sleep 10

# Health check
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    print_status "✅ Health check passed"
else
    print_error "❌ Health check failed"
    docker logs test-dashboard
    docker stop test-dashboard
    docker rm test-dashboard
    exit 1
fi

# Stop and remove test container
docker stop test-dashboard
docker rm test-dashboard

# Push to Docker Hub
print_status "Pushing to Docker Hub..."
docker push $FULL_IMAGE_NAME:$VERSION
docker push $FULL_IMAGE_NAME:$LATEST_TAG

# Show image information
print_status "Image pushed successfully!"
echo ""
echo "📦 Docker Hub Repository: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
echo "🏷️  Available tags:"
echo "   - $FULL_IMAGE_NAME:$VERSION"
echo "   - $FULL_IMAGE_NAME:$LATEST_TAG"
echo ""
echo "🚀 To deploy on any server:"
echo "   docker run -d -p 8080:80 $FULL_IMAGE_NAME:$LATEST_TAG"
echo ""
echo "📋 Docker Compose usage:"
echo "   image: $FULL_IMAGE_NAME:$LATEST_TAG"
echo ""

# Show image size
IMAGE_SIZE=$(docker images --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}" | grep "$IMAGE_NAME:$LATEST_TAG" | awk '{print $2}')
print_status "Final image size: $IMAGE_SIZE"

print_status "✅ Deployment to Docker Hub completed successfully!"