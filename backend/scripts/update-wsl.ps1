# WSL Update Script
# Detta script uppdaterar WSL till senaste versionen

Write-Host "=== WSL Update ===" -ForegroundColor Cyan
Write-Host ""

# Kontrollera om WSL är installerat
$wslInstalled = Get-Command wsl -ErrorAction SilentlyContinue

if (-not $wslInstalled) {
    Write-Host "❌ WSL är inte installerat" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installerar WSL..." -ForegroundColor Yellow
    wsl --install
    Write-Host ""
    Write-Host "⚠️  Du behöver starta om datorn efter installationen" -ForegroundColor Yellow
    Write-Host "Efter omstart, kör detta script igen" -ForegroundColor Yellow
    exit 0
}

# Kontrollera WSL version
Write-Host "Kontrollerar WSL version..." -ForegroundColor Yellow
$wslVersion = wsl --version 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ WSL 2 är installerat" -ForegroundColor Green
    Write-Host $wslVersion -ForegroundColor White
} else {
    Write-Host "⚠️  WSL 1 eller äldre version hittad" -ForegroundColor Yellow
}

# Uppdatera WSL
Write-Host ""
Write-Host "Uppdaterar WSL..." -ForegroundColor Yellow
wsl --update

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ WSL uppdaterad!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starta om Docker Desktop och försök igen" -ForegroundColor Cyan
} else {
    Write-Host "❌ Kunde inte uppdatera WSL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Försök manuellt:" -ForegroundColor Yellow
    Write-Host "1. Öppna PowerShell som Administrator" -ForegroundColor White
    Write-Host "2. Kör: wsl --update" -ForegroundColor White
    Write-Host "3. Starta om datorn om det behövs" -ForegroundColor White
}
