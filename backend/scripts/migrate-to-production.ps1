# Migrate Local Database to Production (Azure/Supabase)
# Detta script hjälper dig att migrera lokal databas till produktion

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Azure", "Supabase")]
    [string]$Provider,
    
    [Parameter(Mandatory=$false)]
    [string]$ConnectionString = "",
    
    [Parameter(Mandatory=$false)]
    [string]$BackupFile = "castlegate_backup.sql"
)

Write-Host "=== Database Migration Script ===" -ForegroundColor Cyan
Write-Host "Provider: $Provider" -ForegroundColor Yellow

# ============================================
# Steg 1: Backup Local Database
# ============================================
Write-Host "`n=== Steg 1: Backup Local Database ===" -ForegroundColor Cyan

$localConnectionString = "postgresql://postgres:postgres@localhost:5433/castlegate"

Write-Host "Dumpar lokal databas..." -ForegroundColor Yellow
pg_dump $localConnectionString -F p -f $BackupFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Fel vid backup av lokal databas" -ForegroundColor Red
    Write-Host "Kontrollera att PostgreSQL-containern körs: docker ps" -ForegroundColor Yellow
    exit 1
}

$backupSize = (Get-Item $BackupFile).Length / 1MB
Write-Host "✅ Backup skapad: $BackupFile ($([math]::Round($backupSize, 2)) MB)" -ForegroundColor Green

# ============================================
# Steg 2: Get Connection String
# ============================================
Write-Host "`n=== Steg 2: Connection String ===" -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($ConnectionString)) {
    if ($Provider -eq "Azure") {
        Write-Host "Ange Azure PostgreSQL connection string:" -ForegroundColor Yellow
        Write-Host "Format: postgresql://user:password@server.postgres.database.azure.com:5432/database?sslmode=require" -ForegroundColor Gray
        $ConnectionString = Read-Host
    } elseif ($Provider -eq "Supabase") {
        Write-Host "Ange Supabase connection string:" -ForegroundColor Yellow
        Write-Host "Hitta i Supabase Dashboard → Settings → Database" -ForegroundColor Gray
        $ConnectionString = Read-Host
    }
}

if ([string]::IsNullOrEmpty($ConnectionString)) {
    Write-Host "❌ Connection string saknas" -ForegroundColor Red
    exit 1
}

# ============================================
# Steg 3: Test Connection
# ============================================
Write-Host "`n=== Steg 3: Testar Anslutning ===" -ForegroundColor Cyan

Write-Host "Testar anslutning till produktion..." -ForegroundColor Yellow
$testResult = psql $ConnectionString -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Kunde inte ansluta till produktion" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
    Write-Host "`nKontrollera:" -ForegroundColor Yellow
    Write-Host "- Connection string är korrekt" -ForegroundColor White
    Write-Host "- Firewall rules (Azure) eller Network access (Supabase)" -ForegroundColor White
    Write-Host "- SSL/TLS är aktiverat (krävs för Azure)" -ForegroundColor White
    exit 1
}

Write-Host "✅ Anslutning lyckades!" -ForegroundColor Green

# ============================================
# Steg 4: Create Database (if needed)
# ============================================
Write-Host "`n=== Steg 4: Skapar Database ===" -ForegroundColor Cyan

# Extract database name from connection string
if ($ConnectionString -match "/([^/?]+)(\?|$)") {
    $dbName = $Matches[1]
    Write-Host "Database namn: $dbName" -ForegroundColor Yellow
    
    # Try to create database (ignore if exists)
    $createDbResult = psql $ConnectionString -c "SELECT 1 FROM pg_database WHERE datname = '$dbName';" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database finns redan eller skapad" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️ Kunde inte extrahera database namn från connection string" -ForegroundColor Yellow
}

# ============================================
# Steg 5: Restore Data
# ============================================
Write-Host "`n=== Steg 5: Restore Data ===" -ForegroundColor Cyan

Write-Host "Detta kan ta några minuter beroende på databas-storlek..." -ForegroundColor Yellow
Write-Host "Restore: $BackupFile → Production" -ForegroundColor Yellow

$restoreResult = Get-Content $BackupFile | psql $ConnectionString 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Fel vid restore" -ForegroundColor Red
    Write-Host $restoreResult -ForegroundColor Red
    exit 1
}

Write-Host "✅ Data migrerad!" -ForegroundColor Green

# ============================================
# Steg 6: Verify Migration
# ============================================
Write-Host "`n=== Steg 6: Verifierar Migration ===" -ForegroundColor Cyan

Write-Host "Kontrollerar tabeller..." -ForegroundColor Yellow
$tableCount = psql $ConnectionString -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tabeller: $($tableCount.Trim())" -ForegroundColor Green
} else {
    Write-Host "⚠️ Kunde inte kontrollera tabeller" -ForegroundColor Yellow
}

Write-Host "Kontrollerar migrations..." -ForegroundColor Yellow
$migrationCount = psql $ConnectionString -t -c "SELECT COUNT(*) FROM schema_migrations;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations: $($migrationCount.Trim())" -ForegroundColor Green
} else {
    Write-Host "⚠️ Kunde inte kontrollera migrations" -ForegroundColor Yellow
}

# ============================================
# SLUT
# ============================================
Write-Host "`n=== ✅ MIGRATION KLAR! ===" -ForegroundColor Green
Write-Host "`nNästa steg:" -ForegroundColor Cyan
Write-Host "1. Uppdatera DATABASE_URL i backend (.env eller Key Vault)" -ForegroundColor White
Write-Host "2. Testa backend-anslutning" -ForegroundColor White
Write-Host "3. Verifiera API endpoints" -ForegroundColor White
Write-Host "`nConnection String (spara denna!):" -ForegroundColor Yellow
Write-Host $ConnectionString -ForegroundColor White
