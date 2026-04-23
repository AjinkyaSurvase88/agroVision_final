#!/bin/bash
# PostgreSQL Quick Setup - Copy and paste these commands

echo "🚀 PostgreSQL Setup for AgroVision"
echo "===================================="
echo ""

# Step 1: Install dependencies
echo "Step 1: Installing Python packages..."
cd backend
pip install -r requirements.txt

echo "✓ Dependencies installed"
echo ""

# Step 2: Create .env file if it doesn't exist
echo "Step 2: Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file - UPDATE with your PostgreSQL credentials"
else
    echo "✓ .env file already exists"
fi
echo ""

# Step 3: Run setup script
echo "Step 3: Running automated setup..."
python setup_postgres.py

echo ""
echo "===================================="
echo "✓ Setup Complete!"
echo "===================================="
echo ""
echo "Before starting, make sure:"
echo "1. PostgreSQL is installed and running"
echo "2. Database 'agrovision_db' is created"
echo "3. User 'agrovision_user' exists"
echo "4. .env file has correct DATABASE_URL"
echo ""
echo "Start backend with:"
echo "  python main.py"
echo ""
