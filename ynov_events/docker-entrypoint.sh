#!/bin/sh
set -e

# Run migrations if database is ready
echo "Running migrations..."
php artisan migrate --force --no-interaction

# Optimize Laravel for production
echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Execute the main command (usually frankenphp)
exec "$@"
