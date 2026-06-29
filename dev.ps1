# Development script for Club UAA Campanas Electron
Set-Location $PSScriptRoot

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Club UAA Campanas - Electron Dev" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Start Vite server in background
Write-Host "[1/3] Starting Vite dev server on http://localhost:3000..." -ForegroundColor Green
$viteBin = "$PSScriptRoot\node_modules\.bin\vite.cmd"
$viteProc = Start-Process -NoNewWindow -PassThru -FilePath "cmd.exe" -ArgumentList "/c $viteBin --port 3000"

Write-Host "[2/3] Waiting for Vite to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Compile main process TypeScript once
Write-Host "[3/3] Compiling Electron main process..." -ForegroundColor Green
$tscBin = "$PSScriptRoot\node_modules\.bin\tsc.cmd"
& cmd.exe /c "$tscBin --outDir dist --module commonjs"

if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: TypeScript compilation failed!" -ForegroundColor Red
  if ($viteProc) { Stop-Process -Id $viteProc.Id -ErrorAction SilentlyContinue }
  exit 1
}

Write-Host "Starting Electron..." -ForegroundColor Green
$electronBin = "$PSScriptRoot\node_modules\electron\dist\electron.exe"
& $electronBin .

# Cleanup on exit
Write-Host "Stopping Vite server..." -ForegroundColor Yellow
if ($viteProc) { Stop-Process -Id $viteProc.Id -ErrorAction SilentlyContinue }
