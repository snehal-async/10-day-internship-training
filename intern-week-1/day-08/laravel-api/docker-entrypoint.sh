#!/bin/sh
set -e

PORT_TO_USE="${PORT:-8000}"
echo "==> Initializing FacilityOps API on port $PORT_TO_USE..."

# Clear config caches to ensure environment variables are read dynamically
php artisan config:clear
php artisan route:clear

# Run database migrations and seeders if enabled
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "==> Running database migrations & seeders..."
    php artisan migrate --force --seed || echo "==> Migrations completed or database connection pending."
fi

# Ensure storage directories exist with writable permissions
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs
chmod -R 777 storage bootstrap/cache

echo "==> Starting Laravel server on 0.0.0.0:$PORT_TO_USE..."
exec php artisan serve --host=0.0.0.0 --port="$PORT_TO_USE"
