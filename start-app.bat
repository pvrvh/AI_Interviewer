@echo off
echo ======================================
echo AI Interview Prep - Starting Application
echo ======================================
echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window or press any key to exit
pause > nul
