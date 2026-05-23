# ============================================================
# ZenSpace - Stress Relief & Mental Wellness
# One-Click Run Script (PowerShell)
# ============================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ZenSpace - Wellness App Startup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker is running
Write-Host "[1/4] Checking Docker Desktop..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop first, then run this script again." -ForegroundColor Red
    Write-Host ""
    Write-Host "How to start Docker Desktop:" -ForegroundColor Yellow
    Write-Host "  - Search 'Docker Desktop' in Start Menu and open it" -ForegroundColor White
    Write-Host "  - Wait for the whale icon in taskbar to stop animating" -ForegroundColor White
    Write-Host "  - Then run this script again" -ForegroundColor White
    exit 1
}
Write-Host "Docker Desktop is running!" -ForegroundColor Green

# Step 2: Build frontend
Write-Host ""
Write-Host "[2/4] Building React Frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install --ignore-scripts 2>&1 | Out-Null
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend built successfully!" -ForegroundColor Green
Set-Location ..

# Step 3: Stop any existing containers
Write-Host ""
Write-Host "[3/4] Stopping existing containers (if any)..." -ForegroundColor Yellow
docker compose down 2>&1 | Out-Null
Write-Host "Done." -ForegroundColor Green

# Step 4: Start all services
Write-Host ""
Write-Host "[4/4] Starting all services with Docker Compose..." -ForegroundColor Yellow
Write-Host "This will build Spring Boot images (takes 3-5 minutes first time)..." -ForegroundColor White
Write-Host ""
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Docker Compose failed!" -ForegroundColor Red
    Write-Host "Check logs with: docker compose logs" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  All services started!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Waiting 60 seconds for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Application URLs:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Website (Frontend):    http://localhost" -ForegroundColor White
Write-Host "  User Service API:      http://localhost:8081/api/users/health" -ForegroundColor White
Write-Host "  Activity Service API:  http://localhost:8082/api/activities/health" -ForegroundColor White
Write-Host "  Session Service API:   http://localhost:8083/api/sessions/health" -ForegroundColor White
Write-Host "  MongoDB:               localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "  Open your browser at: http://localhost" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  docker compose ps          - Check container status" -ForegroundColor White
Write-Host "  docker compose logs -f     - View live logs" -ForegroundColor White
Write-Host "  docker compose down        - Stop all services" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
