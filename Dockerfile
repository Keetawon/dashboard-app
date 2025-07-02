# Multi-stage build for optimized image
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build frontend
RUN npm run build

# Verify build output exists
RUN ls -la dist/

# Production stage
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    cron \
    curl \
    sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd --create-home --shell /bin/bash app

# Set working directory
WORKDIR /app

# Copy Python files
COPY simple_api.py data_sync_sqlite.py ./

# Copy frontend build from builder stage
COPY --from=frontend-builder /app/dist ./frontend

# Copy configuration files
COPY nginx.conf /etc/nginx/sites-available/dashboard
COPY supervisord.conf /etc/supervisor/conf.d/dashboard.conf
COPY dashboard-cron /etc/cron.d/dashboard-sync
COPY start.sh /start.sh

# Configure nginx
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/dashboard

# Set permissions
RUN chmod 644 /etc/cron.d/dashboard-sync && \
    chmod +x /start.sh && \
    chmod +x /app/*.py && \
    chown -R app:app /app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Labels for metadata
LABEL maintainer="Dashboard Team"
LABEL description="Installation Dashboard Application"
LABEL version="1.0"

# Start application
CMD ["/start.sh"]