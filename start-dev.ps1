# Starta backend och frontend i samma terminal
Write-Host "=== Startar CastleGate ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nTryck Ctrl+C för att stoppa båda" -ForegroundColor Yellow
Write-Host "---`n" -ForegroundColor Gray

# Stoppa alla Node-processer först
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Starta backend i ett minimerat fönster
Write-Host "Startar backend i separat fönster..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start" -WindowStyle Minimized

# Vänta lite så backend hinner starta
Start-Sleep -Seconds 3

# Starta frontend i förgrunden
Write-Host "Startar frontend...`n" -ForegroundColor Yellow
Set-Location $PSScriptRoot
npm run dev

