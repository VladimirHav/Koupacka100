@echo off
REM Starts the Vite dev server and opens the app in your default browser.
cd /d "%~dp0"

echo Starting Moje plavani dev server...
call npm run dev -- --open
