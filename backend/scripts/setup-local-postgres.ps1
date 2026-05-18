# Local PostgreSQL Setup Script för Windows
# Detta script hjälper dig att installera och konfigurera PostgreSQL lokalt

Write-Host "=== Local PostgreSQL Setup ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. Kontrollera om PostgreSQL redan är installerat
# ============================================
Write-Host "Kontrollerar om PostgreSQL redan är installerat..." -ForegroundColor Yellow

$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if ($pgInstalled) {
    Write-Host "✅ PostgreSQL verkar redan vara installerat!" -ForegroundColor Green
    $pgVersion = & psql --version
    Write-Host "   Version: $pgVersion" -ForegroundColor White
    
    Write-Host "`nVill du skapa en ny database ändå? (y/n)" -ForegroundColor Yellow
    $createDb = Read-Host
    if ($createDb -ne "y" -and $createDb -ne "Y") {
        exit 0
    }
} else {
    Write-Host "❌ PostgreSQL är inte installerat" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installationsalternativ:" -ForegroundColor Cyan
    Write-Host "1. Via winget (rekommenderat):" -ForegroundColor White
    Write-Host "   winget install PostgreSQL.PostgreSQL" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Via installer:" -ForegroundColor White
    Write-Host "   Ladda ner från: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host "   Eller: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Via Docker (enklast):" -ForegroundColor White
    Write-Host "   docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15" -ForegroundColor Gray
    Write-Host ""
    
    $installMethod = Read-Host "Välj installationsmetod (1=winget, 2=installer, 3=docker, eller 'skip' för att hoppa över)"
    
    if ($installMethod -eq "1") {
        Write-Host "Installerar via winget..." -ForegroundColor Yellow
        winget install PostgreSQL.PostgreSQL
        Write-Host "⚠️ Du kan behöva starta om PowerShell efter installationen" -ForegroundColor Yellow
        Write-Host "Kör detta script igen efter omstart" -ForegroundColor Yellow
        exit 0
    } elseif ($installMethod -eq "3") {
        Write-Host "Kontrollerar om Docker är installerat..." -ForegroundColor Yellow
        $dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
        if (-not $dockerInstalled) {
            Write-Host "❌ Docker är inte installerat" -ForegroundColor Red
            Write-Host "Ladda ner Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Startar PostgreSQL i Docker..." -ForegroundColor Yellow
        docker run --name castlegate-postgres `
          -e POSTGRES_PASSWORD=postgres `
          -e POSTGRES_DB=castlegate `
          -p 5432:5432 `
          -d postgres:15
        
        Write-Host "✅ PostgreSQL körs i Docker!" -ForegroundColor Green
        Write-Host "Connection string: postgresql://postgres:postgres@localhost:5432/castlegate" -ForegroundColor Cyan
        exit 0
    } elseif ($installMethod -ne "skip") {
        Write-Host "Följ installationsguiden ovan och kör detta script igen" -ForegroundColor Yellow
        exit 0
    }
}

# ============================================
# 2. Hämta PostgreSQL-installationssökväg
# ============================================
Write-Host "`n=== Steg 2: Hittar PostgreSQL-installation ===" -ForegroundColor Cyan

# Försök hitta psql
$psqlPath = (Get-Command psql).Source
$pgBinPath = Split-Path $psqlPath
$pgPath = Split-Path $pgBinPath

Write-Host "PostgreSQL hittad i: $pgPath" -ForegroundColor Green

# ============================================
# 3. Skapa Database
# ============================================
Write-Host "`n=== Steg 3: Skapar Database ===" -ForegroundColor Cyan

$dbName = "castlegate"
$dbUser = "castlegate_user"
$dbPassword = "castlegate_pass"

Write-Host "Database namn: $dbName" -ForegroundColor White
Write-Host "Användare: $dbUser" -ForegroundColor White
Write-Host "Lösenord: $dbPassword" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Du kommer att behöva ange PostgreSQL admin-lösenord" -ForegroundColor Yellow
Write-Host "   (Standard är ofta 'postgres' om du inte ändrat det)" -ForegroundColor Yellow
Write-Host ""

# Skapa användare (om den inte finns)
Write-Host "Skapar användare..." -ForegroundColor Yellow
$createUserSQL = "CREATE USER $dbUser WITH PASSWORD '$dbPassword';"
& psql -U postgres -c $createUserSQL 2>&1 | Out-Null

# Skapa database
Write-Host "Skapar database..." -ForegroundColor Yellow
$createDbSQL = "CREATE DATABASE $dbName OWNER $dbUser;"
& psql -U postgres -c $createDbSQL 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database skapad!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database kanske redan finns, fortsätter..." -ForegroundColor Yellow
}

# ============================================
# 4. Ge behörigheter
# ============================================
Write-Host "`n=== Steg 4: Ger behörigheter ===" -ForegroundColor Cyan

$grantSQL = "GRANT ALL PRIVILEGES ON DATABASE $dbName TO $dbUser;"
& psql -U postgres -c $grantSQL 2>&1 | Out-Null

Write-Host "✅ Behörigheter konfigurerade" -ForegroundColor Green

# ============================================
# 5. Skapa Connection String
# ============================================
Write-Host "`n=== Steg 5: Connection Information ===" -ForegroundColor Cyan

$connectionString = "postgresql://$dbUser`:$dbPassword@localhost:5432/$dbName"

Write-Host "`n=== CONNECTION STRING ===" -ForegroundColor Yellow
Write-Host $connectionString -ForegroundColor White

Write-Host "`n=== Lägg till i .env ===" -ForegroundColor Yellow
Write-Host "DATABASE_URL=$connectionString" -ForegroundColor White

# ============================================
# 6. Testa anslutning
# ============================================
Write-Host "`n=== Steg 6: Testar anslutning ===" -ForegroundColor Cyan

$testResult = & psql -U $dbUser -d $dbName -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Anslutning fungerar!" -ForegroundColor Green
} else {
    Write-Host "❌ Anslutning misslyckades" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
}

# ============================================
# SLUT
# ============================================
Write-Host "`n=== ✅ KLART! ===" -ForegroundColor Green
Write-Host "`nNästa steg:" -ForegroundColor Cyan
Write-Host "1. Lägg till connection string i backend/.env" -ForegroundColor White
Write-Host "2. Kör migrations: psql -U $dbUser -d $dbName -f sql/create_*.sql" -ForegroundColor White
Write-Host "3. Starta backend och testa!" -ForegroundColor White
