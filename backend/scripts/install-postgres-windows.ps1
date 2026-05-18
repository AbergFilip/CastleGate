# PostgreSQL Windows Installer Script
# Detta script hjälper dig installera PostgreSQL direkt på Windows (utan Docker)

Write-Host "=== PostgreSQL Windows Installation ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. Kontrollera om PostgreSQL redan är installerat
# ============================================
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if ($pgInstalled) {
    Write-Host "✅ PostgreSQL är redan installerat!" -ForegroundColor Green
    $pgVersion = & psql --version
    Write-Host "   Version: $pgVersion" -ForegroundColor White
    Write-Host ""
    Write-Host "Vill du skapa database ändå? (y/n)" -ForegroundColor Yellow
    $createDb = Read-Host
    if ($createDb -ne "y" -and $createDb -ne "Y") {
        exit 0
    }
} else {
    Write-Host "❌ PostgreSQL är inte installerat" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installationsalternativ:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Via winget (rekommenderat - enklast):" -ForegroundColor Yellow
    Write-Host "   winget install PostgreSQL.PostgreSQL" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Via installer (manuell nedladdning):" -ForegroundColor Yellow
    Write-Host "   https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host ""
    
    $installChoice = Read-Host "Välj installationsmetod (1=winget, 2=installer, eller 'skip' för att hoppa över)"
    
    if ($installChoice -eq "1") {
        Write-Host ""
        Write-Host "Installerar PostgreSQL via winget..." -ForegroundColor Yellow
        Write-Host "Detta kan ta några minuter..." -ForegroundColor Gray
        
        winget install PostgreSQL.PostgreSQL
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ PostgreSQL installerad!" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  VIKTIGT: Du behöver starta om PowerShell efter installationen" -ForegroundColor Yellow
            Write-Host "Efter omstart, kör detta script igen för att skapa database" -ForegroundColor Yellow
            exit 0
        } else {
            Write-Host ""
            Write-Host "❌ Installation misslyckades" -ForegroundColor Red
            Write-Host "Försök med alternativ 2 (manuell installer) istället" -ForegroundColor Yellow
            exit 1
        }
    } elseif ($installChoice -eq "2") {
        Write-Host ""
        Write-Host "Öppnar PostgreSQL download-sida..." -ForegroundColor Yellow
        Start-Process "https://www.postgresql.org/download/windows/"
        Write-Host ""
        Write-Host "Efter installationen, kör detta script igen för att skapa database" -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "Hoppar över installation" -ForegroundColor Yellow
        exit 0
    }
}

# ============================================
# 2. Skapa Database och Användare
# ============================================
Write-Host ""
Write-Host "=== Skapar Database ===" -ForegroundColor Cyan

$dbName = "castlegate"
$dbUser = "castlegate_user"
$dbPassword = "castlegate_pass"

Write-Host "Database namn: $dbName" -ForegroundColor White
Write-Host "Användare: $dbUser" -ForegroundColor White
Write-Host "Lösenord: $dbPassword" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Du kommer att behöva ange PostgreSQL admin-lösenord" -ForegroundColor Yellow
Write-Host "   (Standard är ofta 'postgres' om du inte ändrat det vid installationen)" -ForegroundColor Yellow
Write-Host ""

# Skapa användare (ignorera om den redan finns)
Write-Host "Skapar användare..." -ForegroundColor Yellow
$createUserSQL = "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$dbUser') THEN CREATE USER $dbUser WITH PASSWORD '$dbPassword'; END IF; END \$\$;"
& psql -U postgres -c $createUserSQL 2>&1 | Out-Null

# Skapa database (ignorera om den redan finns)
Write-Host "Skapar database..." -ForegroundColor Yellow
$createDbSQL = "SELECT 'CREATE DATABASE $dbName OWNER $dbUser' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$dbName')\gexec"
& psql -U postgres -c $createDbSQL 2>&1 | Out-Null

# Alternativ metod om ovan misslyckas
if ($LASTEXITCODE -ne 0) {
    Write-Host "Försöker alternativ metod..." -ForegroundColor Yellow
    & psql -U postgres -c "CREATE DATABASE $dbName OWNER $dbUser;" 2>&1 | Out-Null
}

# Ge behörigheter
Write-Host "Ger behörigheter..." -ForegroundColor Yellow
& psql -U postgres -d $dbName -c "GRANT ALL PRIVILEGES ON DATABASE $dbName TO $dbUser;" 2>&1 | Out-Null
& psql -U postgres -d $dbName -c "GRANT ALL ON SCHEMA public TO $dbUser;" 2>&1 | Out-Null

Write-Host "✅ Database och användare skapade!" -ForegroundColor Green

# ============================================
# 3. Connection String
# ============================================
Write-Host ""
Write-Host "=== Connection Information ===" -ForegroundColor Cyan

$connectionString = "postgresql://$dbUser`:$dbPassword@localhost:5432/$dbName"

Write-Host ""
Write-Host "CONNECTION STRING:" -ForegroundColor Yellow
Write-Host $connectionString -ForegroundColor White

Write-Host ""
Write-Host "Lägg till i backend/.env:" -ForegroundColor Yellow
Write-Host "DATABASE_URL=$connectionString" -ForegroundColor White

# ============================================
# 4. Testa Anslutning
# ============================================
Write-Host ""
Write-Host "=== Testar Anslutning ===" -ForegroundColor Cyan

$testResult = & psql -U $dbUser -d $dbName -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Anslutning fungerar!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Anslutning misslyckades - kontrollera lösenord" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor Gray
}

# ============================================
# SLUT
# ============================================
Write-Host ""
Write-Host "=== ✅ KLART! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Nästa steg:" -ForegroundColor Cyan
Write-Host "1. Kopiera connection string ovan" -ForegroundColor White
Write-Host "2. Lägg till i backend/.env: DATABASE_URL=<connection-string>" -ForegroundColor White
Write-Host "3. Starta backend och testa!" -ForegroundColor White
