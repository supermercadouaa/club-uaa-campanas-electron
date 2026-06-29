@echo off
cd /d "%~dp0"

set NODE_EXE=C:\Users\jivillar\node\node-v24.16.0-win-x64\node.exe

echo.
echo ========================================
echo Club UAA Campanas - Electron Dev
echo ========================================
echo.

echo [1/2] Compiling TypeScript...
"%NODE_EXE%" node_modules\typescript\bin\tsc --outDir dist --module commonjs
if errorlevel 1 (
  echo ERROR: TypeScript compilation failed!
  exit /b 1
)

echo [2/2] Starting Electron...
if not exist dist\renderer mkdir dist\renderer
copy src\renderer\index.html dist\renderer\index.html >nul
copy "..\Logo - Blanco.png" dist\renderer\favicon.png >nul 2>&1
copy "..\Logo Club UAA.png" dist\renderer\logo.png >nul 2>&1

node_modules\electron\dist\electron.exe .

echo.
pause
