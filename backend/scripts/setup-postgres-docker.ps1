# Setup PostgreSQL Docker Container med korrekt konfiguration
# Detta script skapar en ny PostgreSQL container med rätt autentisering

Write-Host "=== Skapar PostgreSQL Docker Container ===" -ForegroundColor Cyan
Write-Host ""

# Stoppa och ta bort gammal container om den finns
Write-Host "Rensar gamla containrar..." -ForegroundColor Yellow
docker stop castlegate-postgres 2>&1 | Out-Null
docker rm castlegate-postgres 2>&1 | Out-Null

# Skapa ny container med explicit lösenord
Write-Host "Skapar ny container..." -ForegroundColor Yellow
$containerId = docker run --name castlegate-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=castlegate `
  -e POSTGRES_USER=postgres `
  -p 5432:5432 `
  -d postgres:15

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Kunde inte skapa container" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Container skapad: $containerId" -ForegroundColor Green
Write-Host "Väntar 10 sekunder för att PostgreSQL ska initialisera..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Testa internt först
Write-Host "Testar internt anslutning..." -ForegroundColor Yellow
$internalTest = docker exec castlegate-postgres psql -U postgres -d castlegate -c "SELECT version();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Internt anslutning fungerar" -ForegroundColor Green
} else {
    Write-Host "❌ Internt anslutning fungerar inte" -ForegroundColor Red
    Write-Host $internalTest
    exit 1
}

# Konfigurera pg_hba.conf för externa anslutningar
Write-Host "Konfigurerar pg_hba.conf..." -ForegroundColor Yellow
docker exec castlegate-postgres bash -c @"
# Backup original
cp /var/lib/postgresql/data/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf.backup

# Ta bort alla 'host all all' rader
sed -i '/^host.*all.*all.*all/d' /var/lib/postgresql/data/pg_hba.conf
sed -i '/^host.*all.*all.*0\.0\.0\.0/d' /var/lib/postgresql/data/pg_hba.conf
sed -i '/^host.*all.*all.*::/d' /var/lib/postgresql/data/pg_hba.conf

# Lägg till md5 för externa anslutningar (efter localhost raderna)
echo '' >> /var/lib/postgresql/data/pg_hba.conf
echo '# External connections' >> /var/lib/postgresql/data/pg_hba.conf
echo 'host all all 0.0.0.0/0 md5' >> /var/lib/postgresql/data/pg_hba.conf
echo 'host all all ::/0 md5' >> /var/lib/postgresql/data/pg_hba.conf
"@

# Ladda om konfigurationen
Write-Host "Laddar om PostgreSQL konfiguration..." -ForegroundColor Yellow
docker exec castlegate-postgres psql -U postgres -c "SELECT pg_reload_conf();" | Out-Null

# Starta om containern för att säkerställa att ändringarna träder i kraft
Write-Host "Startar om container..." -ForegroundColor Yellow
docker restart castlegate-postgres
Start-Sleep -Seconds 5

# Testa anslutning från Node.js
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
pool.query('SELECT NOW() as time, version() as version')
  .then(r => {
    console.log('✅ Anslutning fungerar!');
    console.log('   Time:', r.rows[0].time);
    console.log('   Version:', r.rows[0].version.split(' ')[0] + ' ' + r.rows[0].version.split(' ')[1]);
    pool.end();
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Fel:', e.message);
    console.error('   Code:', e.code);
    pool.end();
    process.exit(1);
  });
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== ✅ KLART! ===" -ForegroundColor Green
    Write-Host "Connection string: postgresql://postgres:postgres@localhost:5432/castlegate" -ForegroundColor Cyan
    
    # Uppdatera .env
    $envPath = Join-Path $PSScriptRoot "..\.env"
    $connectionString = "postgresql://postgres:postgres@localhost:5432/castlegate"
    
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath -Raw
        if ($envContent -match "DATABASE_URL=") {
            $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=$connectionString"
        } else {
            $envContent += "`nDATABASE_URL=$connectionString"
        }
        Set-Content -Path $envPath -Value $envContent -NoNewline
        Write-Host "✅ .env uppdaterad!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Starta om backend för att testa!" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️ Anslutning från Node.js fungerar inte ännu" -ForegroundColor Yellow
    Write-Host "Låt mig prova med host.docker.internal..." -ForegroundColor Yellow
    
    # Testa med host.docker.internal (för Windows Docker Desktop)
    $nodeTest2 = node -e @"
const { Pool } = require('pg');
const pool = new Pool({
  host: 'host.docker.internal',
  port: 5432,
  database: 'castlegate',
  user: 'postgres',
  password: 'postgres'
});
pool.query('SELECT NOW()')
  .then(r => {
    console.log('✅ Anslutning fungerar med host.docker.internal!');
    pool.end();
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Inte heller det fungerade:', e.message);
    pool.end();
    process.exit(1);
  });
"@
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Anslutning fungerar med host.docker.internal!" -ForegroundColor Green
        Write-Host "Uppdatera DATABASE_URL till: postgresql://postgres:postgres@host.docker.internal:5432/castlegate" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Ingen av metoderna fungerade" -ForegroundColor Red
        Write-Host "Kontrollera Docker Desktop nätverksinställningar" -ForegroundColor Yellow
    }
}
