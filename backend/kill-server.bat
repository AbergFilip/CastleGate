@echo off
echo 🔍 Söker efter processer som använder port 3001...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo 🛑 Stoppar process med PID: %%a
    taskkill /F /PID %%a
    echo ✅ Process stoppad!
)

echo.
echo Nu kan du starta backend-servern igen med: node server.js
pause

