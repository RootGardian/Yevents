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

# Set permissions for storage and bootstrap/cache (just in case)
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Execute the main command (usually frankenphp)
exec "$@"
