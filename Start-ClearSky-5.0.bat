@echo off
setlocal
cd /d "%~dp0"

echo.
echo ========================================
echo       ClearSky 5.0 - Local Server
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js was not found. Install Node.js, then run this file again.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Installing ClearSky dependencies...
    call npm.cmd install
    if errorlevel 1 (
        echo Dependency installation failed.
        pause
        exit /b 1
    )
)

echo.
echo Starting ClearSky 5.0...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop the server.
echo.
node server.js
pause
