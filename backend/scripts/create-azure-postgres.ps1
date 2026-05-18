# Azure PostgreSQL Database Setup Script
# Detta script skapar en Azure PostgreSQL Flexible Server med alla nödvändiga komponenter

# ============================================
# KONFIGURATION - Uppdatera dessa värden
# ============================================
$resourceGroupName = "castlegate-rg"
$location = "swedencentral"  # Azure region (Sweden Central för GDPR)
$serverName = "castlegate-postgres"  # Måste vara globalt unikt
$adminUsername = "castlegate_admin"
$adminPassword = "ChangeMe123!@#"  # ⚠️ ÄNDRA TILL ETT STARKT LÖSENORD
$databaseName = "castlegate"
$skuName = "Standard_B1ms"  # Burstable, 1 vCore, 2GB RAM (för utveckling)
$tier = "Burstable"
$version = "15"  # PostgreSQL version
$storageSize = 32  # GB

# ============================================
# 1. Logga in på Azure
# ============================================
Write-Host "=== Steg 1: Loggar in på Azure ===" -ForegroundColor Cyan
az login

# ============================================
# 2. Skapa Resource Group
# ============================================
Write-Host "`n=== Steg 2: Skapar Resource Group ===" -ForegroundColor Cyan
az group create `
  --name $resourceGroupName `
  --location $location

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Fel vid skapande av Resource Group" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Resource Group skapad: $resourceGroupName" -ForegroundColor Green

# ============================================
# 3. Skapa PostgreSQL Flexible Server
# ============================================
Write-Host "`n=== Steg 3: Skapar PostgreSQL Server ===" -ForegroundColor Cyan
Write-Host "Detta kan ta 5-10 minuter..." -ForegroundColor Yellow

az postgres flexible-server create `
  --resource-group $resourceGroupName `
  --name $serverName `
  --location $location `
  --admin-user $adminUsername `
  --admin-password $adminPassword `
  --sku-name $skuName `
  --tier $tier `
  --version $version `
  --storage-size $storageSize `
  --public-access "0.0.0.0-255.255.255.255" `
  --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Fel vid skapande av PostgreSQL Server" -ForegroundColor Red
    exit 1
}
Write-Host "✅ PostgreSQL Server skapad: $serverName" -ForegroundColor Green

# ============================================
# 4. Skapa Database
# ============================================
Write-Host "`n=== Steg 4: Skapar Database ===" -ForegroundColor Cyan
az postgres flexible-server db create `
  --resource-group $resourceGroupName `
  --server-name $serverName `
  --database-name $databaseName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Fel vid skapande av Database" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database skapad: $databaseName" -ForegroundColor Green

# ============================================
# 5. Hämta Connection String
# ============================================
Write-Host "`n=== Steg 5: Hämtar Connection Information ===" -ForegroundColor Cyan

$serverFqdn = az postgres flexible-server show `
  --resource-group $resourceGroupName `
  --name $serverName `
  --query "fullyQualifiedDomainName" `
  --output tsv

Write-Host "`n=== CONNECTION STRING ===" -ForegroundColor Yellow
$connectionString = "postgresql://$adminUsername`:$adminPassword@$serverFqdn`:5432/$databaseName`?sslmode=require"
Write-Host $connectionString -ForegroundColor White

Write-Host "`n=== SEPARATA VÄRDEN ===" -ForegroundColor Yellow
Write-Host "Host: $serverFqdn" -ForegroundColor White
Write-Host "Port: 5432" -ForegroundColor White
Write-Host "Database: $databaseName" -ForegroundColor White
Write-Host "Username: $adminUsername" -ForegroundColor White
Write-Host "Password: $adminPassword" -ForegroundColor White

# ============================================
# 6. Konfigurera Firewall (valfritt)
# ============================================
Write-Host "`n=== Steg 6: Konfigurerar Firewall ===" -ForegroundColor Cyan
Write-Host "Vill du lägga till din nuvarande IP-adress till firewall? (y/n)" -ForegroundColor Yellow
$addFirewall = Read-Host

if ($addFirewall -eq "y" -or $addFirewall -eq "Y") {
    $myIp = (Invoke-WebRequest -Uri "https://api.ipify.org").Content
    Write-Host "Din IP: $myIp" -ForegroundColor Cyan
    
    az postgres flexible-server firewall-rule create `
      --resource-group $resourceGroupName `
      --name $serverName `
      --rule-name "AllowMyIP" `
      --start-ip-address $myIp `
      --end-ip-address $myIp
    
    Write-Host "✅ Firewall-regel tillagd för IP: $myIp" -ForegroundColor Green
}

# ============================================
# 7. Lägg till i Key Vault (om Key Vault finns)
# ============================================
Write-Host "`n=== Steg 7: Lägg till i Key Vault ===" -ForegroundColor Cyan
Write-Host "Vill du lägga till connection string i Key Vault? (y/n)" -ForegroundColor Yellow
$addToKeyVault = Read-Host

if ($addToKeyVault -eq "y" -or $addToKeyVault -eq "Y") {
    Write-Host "Ange Key Vault namn:" -ForegroundColor Yellow
    $keyVaultName = Read-Host
    
    az keyvault secret set `
      --vault-name $keyVaultName `
      --name "DATABASE_URL" `
      --value $connectionString
    
    Write-Host "✅ Connection string lagrad i Key Vault: $keyVaultName" -ForegroundColor Green
}

# ============================================
# SLUT
# ============================================
Write-Host "`n=== ✅ KLART! ===" -ForegroundColor Green
Write-Host "`nNästa steg:" -ForegroundColor Cyan
Write-Host "1. Kopiera connection string ovan" -ForegroundColor White
Write-Host "2. Lägg till i .env: DATABASE_URL=<connection-string>" -ForegroundColor White
Write-Host "3. Eller lägg till i Key Vault (om du inte gjorde det ovan)" -ForegroundColor White
Write-Host "4. Kör migrations: psql <connection-string> -f sql/create_*.sql" -ForegroundColor White
