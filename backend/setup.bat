@echo off
REM PostgreSQL Quick Setup for Windows - Run this in Command Prompt or PowerShell

echo.
echo PostgreSQL Setup for AgroVision
echo ================================
echo.

REM Step 1: Install dependencies
echo Step 1: Installing Python packages...
cd backend
pip install -r requirements.txt

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed
) else (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo.

REM Step 2: Create .env file if it doesn't exist
echo Step 2: Creating .env file...
if not exist .env (
    copy .env.example .env
    echo [OK] Created .env file - UPDATE with your PostgreSQL credentials
) else (
    echo [OK] .env file already exists
)
echo.

REM Step 3: Run setup script
echo Step 3: Running automated setup...
python setup_postgres.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo [OK] Setup Complete!
    echo ================================
    echo.
    echo Before starting, make sure:
    echo 1. PostgreSQL is installed and running
    echo 2. Database 'agrovision_db' is created
    echo 3. User 'agrovision_user' exists
    echo 4. .env file has correct DATABASE_URL
    echo.
    echo Start backend with:
    echo   python main.py
    echo.
) else (
    echo [ERROR] Setup failed
    pause
    exit /b 1
)

pause
