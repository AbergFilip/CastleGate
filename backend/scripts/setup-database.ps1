# Database Setup Script
# Detta script konfigurerar PostgreSQL (Docker eller lokal) och skapar database

Write-Host "=== CastleGate Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# Konfiguration
# ============================================
$dbName = "castlegate"
$dbUser = "castlegate_user"
$dbPassword = "castlegate_pass"
$dockerContainerName = "castlegate-postgres"

# ============================================
# 1. Välj metod
# ============================================
Write-Host "Välj metod:" -ForegroundColor Yellow
Write-Host "1. Docker (rekommenderat - isolerat och enkelt)" -ForegroundColor White
Write-Host "2. Lokal PostgreSQL (direkt installation)" -ForegroundColor White
Write-Host ""
$method = Read-Host "Välj (1 eller 2)"

if ($method -eq "1") {
    # ============================================
    # DOCKER METOD
    # ============================================
    Write-Host ""
    Write-Host "=== Använder Docker ===" -ForegroundColor Cyan
    
    # Kontrollera om container redan finns
    $existingContainer = docker ps -a --filter "name=$dockerContainerName" --format "{{.Names}}"
    
    if ($existingContainer -eq $dockerContainerName) {
        Write-Host "Container finns redan: $dockerContainerName" -ForegroundColor Yellow
        Write-Host "Vill du starta den? (y/n)" -ForegroundColor Yellow
        $start = Read-Host
        if ($start -eq "y" -or $start -eq "Y") {
            docker start $dockerContainerName
            Write-Host "✅ Container startad!" -ForegroundColor Green
        }
    } else {
        Write-Host "Skapar PostgreSQL container..." -ForegroundColor Yellow
        docker run --name $dockerContainerName `
          -e POSTGRES_USER=$dbUser `
          -e POSTGRES_PASSWORD=$dbPassword `
          -e POSTGRES_DB=$dbName `
          -p 5432:5432 `
          -d postgres:15
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL container skapad och startad!" -ForegroundColor Green
            Write-Host "Väntar 3 sekunder för att PostgreSQL ska starta..." -ForegroundColor Yellow
            Start-Sleep -Seconds 3
        } else {
            Write-Host "❌ Kunde inte skapa container" -ForegroundColor Red
            exit 1
        }
    }
    
    $connectionString = "postgresql://$dbUser`:$dbPassword@localhost:5432/$dbName"
    
} elseif ($method -eq "2") {
    # ============================================
    # LOKAL POSTGRESQL METOD
    # ============================================
    Write-Host ""
    Write-Host "=== Använder Lokal PostgreSQL ===" -ForegroundColor Cyan
    
    # Kontrollera om psql finns
    $psqlInstalled = Get-Command psql -ErrorAction SilentlyContinue
    if (-not $psqlInstalled) {
        Write-Host "❌ PostgreSQL (psql) hittades inte i PATH" -ForegroundColor Red
        Write-Host "Kontrollera att PostgreSQL är installerat och i PATH" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ PostgreSQL hittad!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Du kommer att behöva ange PostgreSQL admin-lösenord" -ForegroundColor Yellow
    Write-Host "   (Standard är ofta 'postgres' om du inte ändrat det)" -ForegroundColor Yellow
    Write-Host ""
    
    # Skapa användare (ignorera om den redan finns)
    Write-Host "Skapar användare..." -ForegroundColor Yellow
    $createUserSQL = "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$dbUser') THEN CREATE USER $dbUser WITH PASSWORD '$dbPassword'; END IF; END \$\$;"
    & psql -U postgres -c $createUserSQL 2>&1 | Out-Null
    
    # Skapa database
    Write-Host "Skapar database..." -ForegroundColor Yellow
    $createDbSQL = "SELECT 'CREATE DATABASE $dbName OWNER $dbUser' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$dbName')\gexec"
    & psql -U postgres -c $createDbSQL 2>&1 | Out-Null
    
    # Om ovan misslyckas, försök direkt
    if ($LASTEXITCODE -ne 0) {
        & psql -U postgres -c "CREATE DATABASE $dbName OWNER $dbUser;" 2>&1 | Out-Null
    }
    
    # Ge behörigheter
    Write-Host "Ger behörigheter..." -ForegroundColor Yellow
    & psql -U postgres -d $dbName -c "GRANT ALL PRIVILEGES ON DATABASE $dbName TO $dbUser;" 2>&1 | Out-Null
    & psql -U postgres -d $dbName -c "GRANT ALL ON SCHEMA public TO $dbUser;" 2>&1 | Out-Null
    
    $connectionString = "postgresql://$dbUser`:$dbPassword@localhost:5432/$dbName"
    
} else {
    Write-Host "❌ Ogiltigt val" -ForegroundColor Red
    exit 1
}

# ============================================
# 2. Testa Anslutning
# ============================================
Write-Host ""
Write-Host "=== Testar Anslutning ===" -ForegroundColor Cyan

if ($method -eq "1") {
    # Docker - testa via docker exec
    $testResult = docker exec $dockerContainerName psql -U $dbUser -d $dbName -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Anslutning fungerar!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Anslutning misslyckades - vänta lite och försök igen" -ForegroundColor Yellow
    }
} else {
    # Lokal - testa via psql
    $testResult = & psql -U $dbUser -d $dbName -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Anslutning fungerar!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Anslutning misslyckades - kontrollera lösenord" -ForegroundColor Yellow
    }
}

# ============================================
# 3. Skapa .env-fil
# ============================================
Write-Host ""
Write-Host "=== Konfigurerar .env ===" -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot "..\.env"
$envContent = ""

# Läsa befintlig .env om den finns
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    Write-Host "Befintlig .env hittad" -ForegroundColor Yellow
}

# Lägg till eller uppdatera DATABASE_URL
if ($envContent -match "DATABASE_URL=") {
    $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=$connectionString"
    Write-Host "Uppdaterade DATABASE_URL i .env" -ForegroundColor Green
} else {
    if ($envContent -and -not $envContent.EndsWith("`n")) {
        $envContent += "`n"
    }
    $envContent += "DATABASE_URL=$connectionString`n"
    Write-Host "Lade till DATABASE_URL i .env" -ForegroundColor Green
}

# Spara .env
Set-Content -Path $envPath -Value $envContent -NoNewline

# ============================================
# 4. Visa Information
# ============================================
Write-Host ""
Write-Host "=== ✅ KLART! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Connection String:" -ForegroundColor Cyan
Write-Host $connectionString -ForegroundColor White
Write-Host ""
Write-Host "Information:" -ForegroundColor Cyan
Write-Host "  Database: $dbName" -ForegroundColor White
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Password: $dbPassword" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host ""
Write-Host "Nästa steg:" -ForegroundColor Cyan
Write-Host "1. ✅ Database är skapad och konfigurerad" -ForegroundColor White
Write-Host "2. ✅ Connection string är i backend/.env" -ForegroundColor White
Write-Host "3. ⏭️  Kör migrations (SQL-filer)" -ForegroundColor Yellow
Write-Host "4. ⏭️  Starta backend och testa!" -ForegroundColor Yellow
Write-Host ""

if ($method -eq "1") {
    Write-Host "Docker-kommandon:" -ForegroundColor Cyan
    Write-Host "  Stoppa: docker stop $dockerContainerName" -ForegroundColor Gray
    Write-Host "  Starta: docker start $dockerContainerName" -ForegroundColor Gray
    Write-Host "  Ta bort: docker rm -f $dockerContainerName" -ForegroundColor Gray
}
