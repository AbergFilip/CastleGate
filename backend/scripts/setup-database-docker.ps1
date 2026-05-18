# Database Setup Script - Docker Version
# Detta script konfigurerar PostgreSQL i Docker och skapar database

Write-Host "=== CastleGate Database Setup (Docker) ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# Konfiguration
# ============================================
$dbName = "castlegate"
$dbUser = "castlegate_user"
$dbPassword = "castlegate_pass"
$dockerContainerName = "castlegate-postgres"

# ============================================
# 1. Kontrollera Docker
# ============================================
Write-Host "Kontrollerar Docker..." -ForegroundColor Yellow
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue

if (-not $dockerInstalled) {
    Write-Host "❌ Docker är inte installerat eller inte i PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker hittad!" -ForegroundColor Green

# ============================================
# 2. Kontrollera om container redan finns
# ============================================
Write-Host ""
Write-Host "Kontrollerar om container redan finns..." -ForegroundColor Yellow
$existingContainer = docker ps -a --filter "name=$dockerContainerName" --format "{{.Names}}"

if ($existingContainer -eq $dockerContainerName) {
    Write-Host "Container finns redan: $dockerContainerName" -ForegroundColor Yellow
    
    # Kontrollera om den körs
    $running = docker ps --filter "name=$dockerContainerName" --format "{{.Names}}"
    if ($running -eq $dockerContainerName) {
        Write-Host "✅ Container körs redan!" -ForegroundColor Green
    } else {
        Write-Host "Startar container..." -ForegroundColor Yellow
        docker start $dockerContainerName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Container startad!" -ForegroundColor Green
            Write-Host "Väntar 3 sekunder för att PostgreSQL ska starta..." -ForegroundColor Yellow
            Start-Sleep -Seconds 3
        } else {
            Write-Host "❌ Kunde inte starta container" -ForegroundColor Red
            exit 1
        }
    }
} else {
    # ============================================
    # 3. Skapa ny container
    # ============================================
    Write-Host "Skapar PostgreSQL container..." -ForegroundColor Yellow
    Write-Host "  Container namn: $dockerContainerName" -ForegroundColor Gray
    Write-Host "  Database: $dbName" -ForegroundColor Gray
    Write-Host "  User: $dbUser" -ForegroundColor Gray
    Write-Host "  Port: 5432" -ForegroundColor Gray
    Write-Host ""
    
    docker run --name $dockerContainerName `
      -e POSTGRES_USER=$dbUser `
      -e POSTGRES_PASSWORD=$dbPassword `
      -e POSTGRES_DB=$dbName `
      -p 5432:5432 `
      -d postgres:15
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL container skapad och startad!" -ForegroundColor Green
        Write-Host "Väntar 5 sekunder för att PostgreSQL ska starta..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "❌ Kunde inte skapa container" -ForegroundColor Red
        Write-Host "Kontrollera att Docker Desktop körs" -ForegroundColor Yellow
        exit 1
    }
}

# ============================================
# 4. Testa Anslutning
# ============================================
Write-Host ""
Write-Host "=== Testar Anslutning ===" -ForegroundColor Cyan

$maxRetries = 5
$retryCount = 0
$connected = $false

while ($retryCount -lt $maxRetries -and -not $connected) {
    $testResult = docker exec $dockerContainerName psql -U $dbUser -d $dbName -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Anslutning fungerar!" -ForegroundColor Green
        $connected = $true
    } else {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "Väntar 2 sekunder och försöker igen ($retryCount/$maxRetries)..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $connected) {
    Write-Host "⚠️  Kunde inte ansluta efter $maxRetries försök" -ForegroundColor Yellow
    Write-Host "Container kan behöva mer tid att starta. Försök igen om en minut." -ForegroundColor Yellow
}

# ============================================
# 5. Skapa/uppdatera .env-fil
# ============================================
Write-Host ""
Write-Host "=== Konfigurerar .env ===" -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot "..\.env"
$connectionString = "postgresql://$dbUser`:$dbPassword@localhost:5432/$dbName"

# Läsa befintlig .env om den finns
$envContent = ""
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    Write-Host "Befintlig .env hittad" -ForegroundColor Yellow
}

# Lägg till eller uppdatera DATABASE_URL
if ($envContent -match "DATABASE_URL\s*=") {
    $envContent = $envContent -replace "DATABASE_URL\s*=.*", "DATABASE_URL=$connectionString"
    Write-Host "✅ Uppdaterade DATABASE_URL i .env" -ForegroundColor Green
} else {
    if ($envContent -and -not $envContent.EndsWith("`n") -and -not $envContent.EndsWith("`r`n")) {
        $envContent += "`n"
    }
    $envContent += "DATABASE_URL=$connectionString`n"
    Write-Host "✅ Lade till DATABASE_URL i .env" -ForegroundColor Green
}

# Spara .env
Set-Content -Path $envPath -Value $envContent -NoNewline

# ============================================
# 6. Visa Information
# ============================================
Write-Host ""
Write-Host "=== ✅ KLART! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Connection String:" -ForegroundColor Cyan
Write-Host $connectionString -ForegroundColor White
Write-Host ""
Write-Host "Database Information:" -ForegroundColor Cyan
Write-Host "  Database: $dbName" -ForegroundColor White
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Password: $dbPassword" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host "  Container: $dockerContainerName" -ForegroundColor White
Write-Host ""
Write-Host "Nästa steg:" -ForegroundColor Cyan
Write-Host "1. ✅ Database är skapad och konfigurerad" -ForegroundColor White
Write-Host "2. ✅ Connection string är i backend/.env" -ForegroundColor White
Write-Host "3. ⏭️  Starta backend: npm run start:dev" -ForegroundColor Yellow
Write-Host "4. ⏭️  Kör migrations (SQL-filer) när backend är igång" -ForegroundColor Yellow
Write-Host ""
Write-Host "Docker-kommandon:" -ForegroundColor Cyan
Write-Host "  Stoppa: docker stop $dockerContainerName" -ForegroundColor Gray
Write-Host "  Starta: docker start $dockerContainerName" -ForegroundColor Gray
Write-Host "  Status: docker ps --filter name=$dockerContainerName" -ForegroundColor Gray
Write-Host "  Logs: docker logs $dockerContainerName" -ForegroundColor Gray
Write-Host "  Ta bort: docker rm -f $dockerContainerName" -ForegroundColor Gray
