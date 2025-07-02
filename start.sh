#!/bin/bash
set -e

# Run initial data sync if database is empty or doesn't exist
echo "Checking if initial data sync is needed..."
if [ ! -f /app/dashboard.db ] || [ $(sqlite3 /app/dashboard.db "SELECT COUNT(*) FROM dashboard_data;" 2>/dev/null | head -1) -eq 0 ] 2>/dev/null; then
    echo "Running initial data sync..."
    cd /app && python3 data_sync_sqlite.py
    echo "Initial data sync completed"
else
    echo "Database already contains data, skipping initial sync"
fi

# Start cron
service cron start

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/dashboard.conf