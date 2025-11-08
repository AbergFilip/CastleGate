# Copy important design files from Downloads to project designs folder
$sourcePath = "C:\Users\Filip\Downloads\designs"
$destPath = "C:\Users\Filip\CastleGate\designs"

# Create destination folder if it doesn't exist
if (-not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath
}

# List of important design files to copy
$importantFiles = @(
    "Min profil.png",
    "Privatkonto.png",
    "Konton.png",
    "Min brevlåda.png",
    "Mina erbjudanden.png",
    "Meny.png",
    "navbar.png",
    "Primary.png",
    "Secondary.png",
    "H1.png",
    "H2.png",
    "H3.png",
    "H4.png",
    "Inputfält.png",
    "Inputfält - Large.png",
    "Kort.png",
    "Inställningar.png"
)

Write-Host "Copying design files..."
foreach ($file in $importantFiles) {
    $sourceFile = Join-Path $sourcePath $file
    $destFile = Join-Path $destPath $file
    
    if (Test-Path $sourceFile) {
        Copy-Item $sourceFile $destFile -Force
        Write-Host "Copied: $file"
    } else {
        Write-Host "Not found: $file"
    }
}

Write-Host "`nDone! Design files copied to: $destPath"

