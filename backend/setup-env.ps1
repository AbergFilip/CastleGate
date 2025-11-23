# Setup script för BankID Backend
# Detta script hjälper dig att skapa .env-filen

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BankID Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kontrollera om .env redan finns
if (Test-Path ".env") {
    Write-Host "⚠️  .env-filen finns redan!" -ForegroundColor Yellow
    $overwrite = Read-Host "Vill du skriva över den? (j/n)"
    if ($overwrite -ne "j" -and $overwrite -ne "J") {
        Write-Host "Avbrutet." -ForegroundColor Red
        exit
    }
}

Write-Host "Följ dessa steg för att hämta dina Supabase-credentials:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Gå till https://app.supabase.com" -ForegroundColor White
Write-Host "2. Välj ditt projekt (eller skapa ett nytt)" -ForegroundColor White
Write-Host "3. Gå till Settings -> API" -ForegroundColor White
Write-Host "4. Kopiera 'Project URL' och 'service_role' key" -ForegroundColor White
Write-Host ""

$supabaseUrl = Read-Host "Ange din SUPABASE_URL (eller tryck Enter för att hoppa över)"
$supabaseKey = Read-Host "Ange din SUPABASE_SERVICE_ROLE_KEY (eller tryck Enter för att hoppa över)"

# Skapa .env-innehåll
$envContent = @"
# Supabase Configuration
# Hämta dessa värden från Supabase Dashboard -> Settings -> API
SUPABASE_URL=$supabaseUrl

# SUPABASE_SERVICE_ROLE_KEY: Din Supabase Service Role Key (ADMIN KEY)
# ⚠️ VIKTIGT: Denna nyckel ger full åtkomst till din databas
# Använd ENDAST i backend och dela ALDRIG denna nyckel publikt
SUPABASE_SERVICE_ROLE_KEY=$supabaseKey

# Server Configuration
PORT=3001

# Frontend URL (för redirects)
FRONTEND_URL=http://localhost:5173

# BankID Configuration
# För produktion, sätt till true och konfigurera certifikat
# För testmiljö, använd false (använder test-certifikat automatiskt)
BANKID_PRODUCTION=false
"@

# Skriv till .env-fil
$envContent | Out-File -FilePath ".env" -Encoding utf8

Write-Host ""
Write-Host "✅ .env-fil skapad!" -ForegroundColor Green
Write-Host ""
Write-Host "Nästa steg:" -ForegroundColor Cyan
Write-Host "1. Kör SQL-scriptet 'supabase_setup.sql' i Supabase SQL Editor" -ForegroundColor White
Write-Host "2. Starta backend-servern med: npm run dev" -ForegroundColor White
Write-Host ""

