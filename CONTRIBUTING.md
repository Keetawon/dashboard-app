# Contributing to Dashboard Application

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (optional, for containerization)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/keetawon/dashboard-app.git
   cd dashboard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend API
   python3 simple_api.py
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Frontend changes: Edit files in `src/`
   - Backend changes: Edit `simple_api.py`
   - Data sync: Edit `data_sync_sqlite.py`

3. **Test your changes**
   ```bash
   # Test frontend
   npm run build

   # Test API
   curl http://localhost:3001/api/stats
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Use conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/modifications
- `chore:` - Maintenance tasks

## 🏗️ Project Structure

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

## 🧪 Testing

### Frontend Testing
```bash
# Run tests
npm test

# Run linting
npm run lint
```

### Backend Testing
```bash
# Test API endpoints
curl http://localhost:3001/api/stats
curl http://localhost:3001/api/data?limit=5
```

### Docker Testing
```bash
# Build and test container
docker build -t dashboard-app .
docker run -d -p 8080:80 dashboard-app
curl http://localhost:8080/health
```

## 📋 Code Standards

### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Keep components small and focused

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints where appropriate
- Keep API endpoints simple and focused
- Handle errors gracefully

### General
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow existing code patterns

## 🐛 Bug Reports

When reporting bugs, please include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Environment details (OS, browser, etc.)
5. Screenshots if applicable

## ✨ Feature Requests

For feature requests, please:
1. Check if it already exists in issues
2. Describe the problem you're solving
3. Propose a solution
4. Consider implementation complexity

## 🔧 Docker Development

### Building Images
```bash
# Development build
docker build -t dashboard-app:dev .

# Production build
docker build -t dashboard-app:prod .
```

### Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📦 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions will automatically build and push Docker image

## 🤝 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] Documentation updated if needed
- [ ] No merge conflicts
- [ ] Clear PR description

### PR Requirements
- Descriptive title and summary
- Link to related issues
- Screenshots for UI changes
- Test instructions
- Breaking changes noted

## 🆘 Getting Help

- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check README.md and docs/

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉