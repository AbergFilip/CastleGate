@echo off
echo ========================================
echo Castlegate B2C - Development Server
echo ========================================
echo.
echo Step 1: Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo.
echo Step 2: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo.
echo Step 3: Starting development server...
echo.
echo The server will start on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause

