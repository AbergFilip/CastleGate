# Fix Database Connection Script
# Detta script fixar connection string för PostgreSQL

Write-Host "=== Fixar Database Connection ===" -ForegroundColor Cyan
Write-Host ""

$dbName = "castlegate"
$dbUser = "castlegate_user"
$dbPassword = "castlegate_pass"

# Testa anslutning först
Write-Host "Testar anslutning till container..." -ForegroundColor Yellow
$testResult = docker exec castlegate-postgres psql -U $dbUser -d $dbName -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Anslutning fungerar direkt till container!" -ForegroundColor Green
} else {
    Write-Host "❌ Anslutning misslyckades" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
    exit 1
}

# Skapa korrekt connection string (URL-encoded)
$connectionString = "postgresql://$dbUser`:$dbPassword@localhost:5432/$dbName"

Write-Host ""
Write-Host "Connection String:" -ForegroundColor Cyan
Write-Host $connectionString -ForegroundColor White
Write-Host ""

# Uppdatera .env
$envPath = Join-Path $PSScriptRoot "..\.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    # Ta bort gammal DATABASE_URL om den finns
    $envContent = $envContent -replace "DATABASE_URL\s*=.*\n?", ""
    
    # Lägg till ny
    if (-not $envContent.EndsWith("`n") -and -not $envContent.EndsWith("`r`n")) {
        $envContent += "`n"
    }
    $envContent += "DATABASE_URL=$connectionString`n"
    
    Set-Content -Path $envPath -Value $envContent -NoNewline
    Write-Host "✅ .env uppdaterad!" -ForegroundColor Green
} else {
    # Skapa ny .env
    $envContent = "DATABASE_URL=$connectionString`n"
    Set-Content -Path $envPath -Value $envContent -NoNewline
    Write-Host "✅ .env skapad!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== ✅ KLART! ===" -ForegroundColor Green
Write-Host "Starta om backend för att testa anslutningen" -ForegroundColor Cyan
