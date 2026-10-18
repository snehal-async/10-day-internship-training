FROM php:8.3-cli-alpine

# Install build & runtime dependencies for PostgreSQL and PHP extensions
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    zip \
    unzip \
    git \
    curl

# Install and enable PostgreSQL and core Laravel PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    intl \
    zip \
    bcmath \
    opcache

# Install Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy application files
COPY . .

# Install production PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set up required directory permissions
RUN chmod +x docker-entrypoint.sh \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

ENV PORT=8000
EXPOSE 8000

ENTRYPOINT ["/var/www/docker-entrypoint.sh"]
