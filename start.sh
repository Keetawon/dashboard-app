#!/bin/bash
set -e

# Start cron
service cron start

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/dashboard.conf