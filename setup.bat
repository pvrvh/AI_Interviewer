@echo off
echo ======================================
echo AI Interview Prep - Setup Script
echo ======================================
echo.

echo [1/4] Setting up Python virtual environment...
cd backend
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)

echo [3/4] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)

echo [4/4] Creating environment file...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it to add your OpenAI API key if needed.
)

cd ..

echo.
echo ======================================
echo Backend setup complete!
echo ======================================
echo.

echo [5/6] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To start the application:
echo   1. Run 'start-backend.bat' in one terminal
echo   2. Run 'start-frontend.bat' in another terminal
echo.
echo Or simply run 'start-app.bat' to start both automatically
echo.
pause
