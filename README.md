# Installation Dashboard Application

A modern, responsive dashboard application that migrates from Google Sheets to a database-driven system for improved performance and user experience.

## 🚀 Quick Start

### Using Docker Hub (Recommended)

```bash
# Pull and run from Docker Hub
docker run -d \
  --name dashboard-app \
  -p 8080:80 \
  -e TZ=Asia/Bangkok \
  your-dockerhub-username/dashboard-app:latest

# Access at: http://localhost:8080
```

### Using Docker Compose

```bash
# Create docker-compose.yml
version: '3.8'
services:
  dashboard:
    image: your-dockerhub-username/dashboard-app:latest
    ports:
      - "8080:80"
    environment:
      - TZ=Asia/Bangkok
    restart: unless-stopped

# Run
docker-compose up -d
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (for containerization)

### Local Development

```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev

# In another terminal, start API server
python3 simple_api.py

# Access at: http://localhost:5173
```

## 📦 Building for Production

### Build Docker Image

```bash
# Build locally
docker build -t dashboard-app .

# Run locally
docker run -d -p 8080:80 dashboard-app
```

### Deploy to Docker Hub

```bash
# 1. Update username in docker-hub-deploy.sh
# 2. Run deployment script
./docker-hub-deploy.sh
```

## 🏗️ Architecture

- **Frontend**: React.js with Vite and Tailwind CSS
- **Backend**: Python FastAPI with SQLite
- **Web Server**: Nginx (reverse proxy)
- **Data Sync**: Automated daily sync from Google Sheets
- **Deployment**: Docker containerization

## 📁 Project Structure

```
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   └── constants/         # Configuration
├── public/                # Static assets
├── simple_api.py          # Python API server
├── data_sync_sqlite.py    # Data synchronization
├── dashboard.db           # SQLite database
├── Dockerfile             # Container definition
├── docker-compose.yml     # Container orchestration
└── package.json           # Node.js dependencies
```

## 🔧 Configuration

### Environment Variables

- `TZ` - Timezone (default: Asia/Bangkok)

### Ports

- `80` - Application port (inside container)
- `3001` - API port (internal)

### Volumes

- Database persistence recommended for production

## 📊 Features

- ✅ Modern responsive UI
- ✅ Real-time data from Google Sheets
- ✅ Advanced search and filtering
- ✅ Automated daily data sync
- ✅ Performance optimized
- ✅ Mobile-friendly design
- ✅ Docker containerized
- ✅ Health monitoring
- ✅ Production ready

## 🔍 API Endpoints

- `GET /api/stats` - Database statistics
- `GET /api/data` - Filtered data
- `GET /api/projects` - Project list
- `GET /api/status` - Status summary
- `GET /health` - Health check

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port mapping
   docker run -p 8081:80 dashboard-app
   ```

2. **Health check failing**
   ```bash
   # Check logs
   docker logs dashboard-app
   ```

3. **Data sync issues**
   ```bash
   # Manual sync
   docker exec dashboard-app python3 data_sync_sqlite.py
   ```

## 📝 Development

### Adding Features

1. Frontend changes: Edit files in `src/`
2. Backend changes: Edit `simple_api.py`
3. Data sync: Edit `data_sync_sqlite.py`
4. Rebuild container: `docker build -t dashboard-app .`

### Testing

```bash
# Frontend tests
npm test

# API health check
curl http://localhost:8080/health

# Container health
docker inspect dashboard-app | grep Health -A 10
```

## 🔒 Security

- CORS enabled for cross-origin requests
- Security headers implemented
- Non-root user execution
- No sensitive data in container
- Health checks for monitoring

## 📈 Performance

- Multi-stage Docker build for smaller images
- Static asset caching
- Database query optimization
- Gzip compression
- Production-ready configuration

## 🔄 Updates

### Updating the Application

```bash
# Pull latest image
docker pull your-dockerhub-username/dashboard-app:latest

# Stop and remove current container
docker stop dashboard-app
docker rm dashboard-app

# Run new container
docker run -d --name dashboard-app -p 8080:80 your-dockerhub-username/dashboard-app:latest
```

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Python, and Docker**