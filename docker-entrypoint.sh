#!/bin/sh

echo "Waiting for MySQL..."
until mysqladmin ping -h mysql --silent; do
  sleep 2
done

echo "MySQL is ready!"
echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec "$@"
