@echo off
REM AgroVision Quick Deployment Script for Windows
REM Prepares project for deployment

echo.
echo 🚀 AgroVision Windows Deployment Setup
echo ======================================
echo.

REM Check prerequisites
echo ✓ Checking prerequisites...

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git not found. Please install Git for Windows.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found. Please install Node.js.
    pause
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python.
    pause
    exit /b 1
)

echo ✅ All prerequisites found
echo.

REM Initialize git
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - AgroVision project"
    echo ✅ Git initialized
) else (
    echo ✅ Git repository already initialized
)

echo.
echo 📝 DEPLOYMENT OPTIONS:
echo ==========================================
echo.
echo Option 1: RAILWAY (Recommended - Easiest)
echo   1. Go to https://railway.app
echo   2. Sign up with GitHub
echo   3. Create new project from your repo
echo   4. Add HF_API_KEY environment variable
echo   5. Done! Railway auto-deploys
echo.
echo Option 2: DOCKER (Local Testing First)
echo   1. Install Docker: https://www.docker.com/download
echo   2. Run: docker-compose up -d
echo   3. Visit: http://localhost:3000
echo.
echo Option 3: MANUAL DEPLOYMENT
echo   1. Read DEPLOYMENT_GUIDE.md for full options
echo   2. Choose Azure, AWS, DigitalOcean, etc.
echo.
echo 📖 For detailed guide, open: DEPLOYMENT_GUIDE.md
echo.
pause
