Write-Host "Waiting for MySQL..."

while (-not (mysqladmin ping -h mysql --silent)) {
    Start-Sleep -Seconds 2
}

Write-Host "MySQL is ready!"
Write-Host "Applying Prisma migrations..."
npx prisma migrate deploy

Write-Host "Starting server..."
npm run dev
