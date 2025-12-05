@echo off
echo Starting Icecast Server...
echo.
cd /d "C:\Program Files (x86)\Icecast"
start "Icecast Server" cmd /k ".\bin\icecast.exe -c .\icecast.xml"
echo.
echo Icecast is starting...
echo Check http://localhost:8000 to verify it's running
echo.
echo This window will close in 3 seconds...
timeout /t 3 /nobreak >nul

