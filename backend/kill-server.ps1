# PowerShell script för att stoppa backend-servern på port 3001
$port = 3001

Write-Host "🔍 Söker efter processer som använder port $port..." -ForegroundColor Yellow

# Hitta process som använder port 3001
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "✅ Hittade process med PID: $process" -ForegroundColor Green
    Write-Host "🛑 Stoppar process..." -ForegroundColor Yellow
    
    Stop-Process -Id $process -Force
    Write-Host "✅ Process stoppad!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Ingen process hittades på port $port" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Nu kan du starta backend-servern igen med: node server.js" -ForegroundColor Cyan

