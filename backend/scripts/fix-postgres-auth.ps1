# Fix PostgreSQL Authentication Script
# Detta script fixar autentiseringsproblemet med Docker PostgreSQL

Write-Host "=== Fixar PostgreSQL Authentication ===" -ForegroundColor Cyan
Write-Host ""

# Stoppa och ta bort gammal container
Write-Host "Stoppar gammal container..." -ForegroundColor Yellow
docker stop castlegate-postgres 2>&1 | Out-Null
docker rm castlegate-postgres 2>&1 | Out-Null

# Skapa ny container med trust authentication
Write-Host "Skapar ny container med trust authentication..." -ForegroundColor Yellow
docker run --name castlegate-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=castlegate `
  -e POSTGRES_HOST_AUTH_METHOD=md5 `
  -p 5432:5432 `
  -d postgres:15

Write-Host "Väntar 5 sekunder för att PostgreSQL ska starta..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Konfigurera pg_hba.conf för att tillåta externa anslutningar
Write-Host "Konfigurerar pg_hba.conf..." -ForegroundColor Yellow
docker exec castlegate-postgres bash -c @"
sed -i '/^host.*all.*all.*scram-sha-256/d' /var/lib/postgresql/data/pg_hba.conf
echo 'host all all 0.0.0.0/0 md5' >> /var/lib/postgresql/data/pg_hba.conf
echo 'host all all ::/0 md5' >> /var/lib/postgresql/data/pg_hba.conf
"@

# Ladda om konfigurationen
docker exec castlegate-postgres psql -U postgres -c "SELECT pg_reload_conf();" | Out-Null

# Starta om containern för att säkerställa att ändringarna träder i kraft
Write-Host "Startar om container..." -ForegroundColor Yellow
docker restart castlegate-postgres
Start-Sleep -Seconds 5

# Testa anslutning
Write-Host "Testar anslutning..." -ForegroundColor Yellow
$testResult = docker exec castlegate-postgres psql -U postgres -d castlegate -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container fungerar internt!" -ForegroundColor Green
} else {
    Write-Host "❌ Container fungerar inte" -ForegroundColor Red
    exit 1
}

# Testa från Node.js
Write-Host "Testar anslutning från Node.js..." -ForegroundColor Yellow
$nodeTest = node -e @"
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'castlegate',
  user: 'postgres',
  password: 'postgres'
});
pool.query('SELECT NOW()')
  .then(r => {
    console.log('✅ Anslutning fungerar!');
    pool.end();
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Fel:', e.message);
    pool.end();
    process.exit(1);
  });
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Anslutning från Node.js fungerar!" -ForegroundColor Green
    
    # Uppdatera .env
    $envPath = Join-Path $PSScriptRoot "..\.env"
    $connectionString = "postgresql://postgres:postgres@localhost:5432/castlegate"
    
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath -Raw
        $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=$connectionString"
        Set-Content -Path $envPath -Value $envContent -NoNewline
        Write-Host "✅ .env uppdaterad!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "=== ✅ KLART! ===" -ForegroundColor Green
    Write-Host "Connection string: $connectionString" -ForegroundColor Cyan
    Write-Host "Starta om backend för att testa!" -ForegroundColor Yellow
} else {
    Write-Host "⚠️ Anslutning från Node.js fungerar inte ännu" -ForegroundColor Yellow
    Write-Host "Backend kommer starta ändå (utan databas-anslutning)" -ForegroundColor Yellow
    Write-Host "Du kan fixa databasanslutningen senare" -ForegroundColor Yellow
}
