# --- PHP Dependencies Stage ---
FROM composer:latest AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

# --- Frontend Assets Stage ---
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json vite.config.js ./
RUN npm install
COPY resources/ ./resources/
COPY public/ ./public/
RUN npm run build

# --- Final Production Image ---
FROM dunglas/frankenphp:1.2-php8.2-alpine

# Install system dependencies and PHP extensions
RUN install-php-extensions \
    pdo_pgsql \
    gd \
    intl \
    zip \
    opcache \
    bcmath \
    mbstring \
    exif \
    pcntl

# Set working directory
WORKDIR /app

# Copy application code
COPY . .

# Copy vendor from vendor stage
COPY --from=vendor /app/vendor /app/vendor

# Copy built assets from frontend stage
COPY --from=frontend /app/public/build /app/public/build

# Optimizing Laravel is handled in docker-entrypoint.sh

# Set permissions for Laravel during build
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Caddy configuration for FrankenPHP
ENV SERVER_NAME=":8080"
ENV APP_ENV=production
ENV APP_DEBUG=false

# Expose port (Render will use this)
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
