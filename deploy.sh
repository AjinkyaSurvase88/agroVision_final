#!/bin/bash
# AgroVision Quick Deployment Script
# Deploys to Railway with one command

echo "🚀 AgroVision Deployment Script"
echo "================================"
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git not installed. Please install Git first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed. Please install Node.js first."
    exit 1
fi

if ! command -v pip &> /dev/null; then
    echo "❌ Python pip not installed. Please install Python first."
    exit 1
fi

echo "✅ All prerequisites found"
echo ""

# Initialize git repository
echo "📦 Setting up Git repository..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit - AgroVision project"
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📝 Next steps for Railway deployment:"
echo "=================================="
echo ""
echo "1. Go to https://railway.app and sign up with GitHub"
echo ""
echo "2. Create a new project and select your GitHub repository"
echo ""
echo "3. In Railway dashboard, add these environment variables:"
echo "   HF_API_KEY=your_hugging_face_api_key"
echo ""
echo "4. Railway will auto-detect and deploy:"
echo "   - Backend (from requirements.txt)"
echo "   - Frontend (from package.json)"
echo ""
echo "5. Update your frontend .env with the backend URL:"
echo "   REACT_APP_API_URL=https://your-backend-railway-url"
echo ""
echo "✨ Deployment complete! Your app is live!"
echo ""
echo "Need help? Read: DEPLOYMENT_GUIDE.md"
