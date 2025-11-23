# Script för att konfigurera BankID för testmiljö
# Kör detta script som administratör om nödvändigt

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BankID Test Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$bankidConfigPath = "$env:APPDATA\BankID\Config"
$configFile = Join-Path $bankidConfigPath "CavaServerSelector.txt"

Write-Host "Söker efter BankID Config-mapp..." -ForegroundColor Yellow
Write-Host "Sökväg: $bankidConfigPath" -ForegroundColor Gray

# Kontrollera om mappen finns
if (-not (Test-Path $bankidConfigPath)) {
    Write-Host "⚠️  BankID Config-mapp finns inte!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Detta betyder att BankID-appen inte har startats än." -ForegroundColor White
    Write-Host ""
    Write-Host "Så här fixar du det:" -ForegroundColor Cyan
    Write-Host "1. Starta BankID-applikationen på din dator" -ForegroundColor White
    Write-Host "2. Stäng appen igen (File → Exit)" -ForegroundColor White
    Write-Host "3. Kör detta script igen" -ForegroundColor White
    Write-Host ""
    Write-Host "Vill du att jag skapar mappen ändå? (j/n)" -ForegroundColor Yellow
    $create = Read-Host
    
    if ($create -eq "j" -or $create -eq "J") {
        try {
            New-Item -ItemType Directory -Path $bankidConfigPath -Force | Out-Null
            Write-Host "✅ Mapp skapad!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Kunde inte skapa mapp: $_" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Avbrutet. Starta BankID-appen först." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✅ BankID Config-mapp finns" -ForegroundColor Green
}

# Kontrollera om filen redan finns
if (Test-Path $configFile) {
    $currentContent = Get-Content $configFile -Raw -ErrorAction SilentlyContinue
    if ($currentContent -and $currentContent.Trim() -eq "kundtest") {
        Write-Host "✅ BankID är redan konfigurerad för test!" -ForegroundColor Green
        Write-Host "   Fil: $configFile" -ForegroundColor Gray
        Write-Host "   Innehåll: $currentContent" -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 Tips: Om QR-koden fortfarande inte fungerar:" -ForegroundColor Yellow
        Write-Host "   - Stäng BankID-appen helt (File → Exit)" -ForegroundColor White
        Write-Host "   - Starta om BankID-appen" -ForegroundColor White
        Write-Host "   - Kontrollera att du använder en test BankID på din telefon" -ForegroundColor White
        exit 0
    } else {
        Write-Host "⚠️  CavaServerSelector.txt finns men innehåller fel värde" -ForegroundColor Yellow
        Write-Host "   Nuvarande innehåll: '$currentContent'" -ForegroundColor Gray
        Write-Host ""
        $overwrite = Read-Host "Vill du skriva över den? (j/n)"
        if ($overwrite -ne "j" -and $overwrite -ne "J") {
            Write-Host "Avbrutet." -ForegroundColor Yellow
            exit 0
        }
    }
}

# Skapa/uppdatera filen
try {
    "kundtest" | Out-File -FilePath $configFile -Encoding ASCII -NoNewline
    Write-Host "✅ CavaServerSelector.txt skapad/uppdaterad!" -ForegroundColor Green
    Write-Host "   Fil: $configFile" -ForegroundColor Gray
    Write-Host "   Innehåll: kundtest" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Nästa steg:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Stäng BankID-appen HELT (File → Exit)" -ForegroundColor Yellow
    Write-Host "2. Starta om BankID-appen" -ForegroundColor Yellow
    Write-Host "3. Testa QR-koden igen" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 OBS: Du måste starta om BankID-appen för att" -ForegroundColor White
    Write-Host "   konfigurationen ska gälla!" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Kunde inte skapa fil: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Försök manuellt:" -ForegroundColor Yellow
    Write-Host "1. Öppna: $bankidConfigPath" -ForegroundColor White
    Write-Host "2. Skapa fil: CavaServerSelector.txt" -ForegroundColor White
    Write-Host "3. Skriv innehåll: kundtest" -ForegroundColor White
    exit 1
}

