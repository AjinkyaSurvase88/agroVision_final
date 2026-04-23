#!/usr/bin/env python3
"""
PostgreSQL Setup and Migration Script for AgroVision
Run this script to set up the PostgreSQL database automatically
"""

import os
import sys
from pathlib import Path

def check_postgres():
    """Check if PostgreSQL is installed and running"""
    try:
        import psycopg2
        print("✓ psycopg2 is installed")
        return True
    except ImportError:
        print("✗ psycopg2 not found. Install with: pip install psycopg2-binary")
        return False

def check_sqlalchemy():
    """Check if SQLAlchemy is installed"""
    try:
        import sqlalchemy
        print(f"✓ SQLAlchemy {sqlalchemy.__version__} is installed")
        return True
    except ImportError:
        print("✗ SQLAlchemy not found. Install with: pip install sqlalchemy")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    backend_dir = Path(__file__).parent
    env_file = backend_dir / ".env"
    
    if env_file.exists():
        print(f"✓ .env file already exists at {env_file}")
        return True
    
    env_content = """# PostgreSQL Database Configuration
DATABASE_URL=postgresql://agrovision_user:agrovision_password@localhost:5432/agrovision_db

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Environment
ENV=development
"""
    
    try:
        env_file.write_text(env_content)
        print(f"✓ Created .env file at {env_file}")
        print("  → Update DATABASE_URL with your PostgreSQL credentials")
        return True
    except Exception as e:
        print(f"✗ Failed to create .env: {e}")
        return False

def test_database_connection():
    """Test PostgreSQL connection"""
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("✗ DATABASE_URL not set in .env file")
        return False
    
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(db_url)
        
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            print(f"✓ Successfully connected to PostgreSQL")
            return True
    except Exception as e:
        print(f"✗ Failed to connect to PostgreSQL:")
        print(f"  Error: {str(e)}")
        print(f"  DB_URL: {db_url}")
        return False

def init_database():
    """Initialize database tables"""
    try:
        from database import init_db
        init_db()
        print("✓ Database tables initialized successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to initialize database: {e}")
        return False

def main():
    """Run all setup steps"""
    print("\n" + "="*60)
    print("AgroVision PostgreSQL Setup Script")
    print("="*60 + "\n")
    
    # Step 1: Check dependencies
    print("Step 1: Checking dependencies...")
    if not (check_postgres() and check_sqlalchemy()):
        print("\n✗ Missing dependencies. Install with:")
        print("  pip install -r requirements.txt")
        sys.exit(1)
    print()
    
    # Step 2: Create .env file
    print("Step 2: Setting up environment...")
    if not create_env_file():
        print("✗ Failed to create .env file")
        sys.exit(1)
    print()
    
    # Step 3: Test database connection
    print("Step 3: Testing PostgreSQL connection...")
    if not test_database_connection():
        print("\n⚠ Database connection failed. Please check:")
        print("  1. PostgreSQL is installed and running")
        print("  2. Database 'agrovision_db' exists")
        print("  3. User 'agrovision_user' exists with correct password")
        print("  4. DATABASE_URL in .env is correct")
        print("\n  See POSTGRESQL_SETUP.md for detailed instructions")
        sys.exit(1)
    print()
    
    # Step 4: Initialize database
    print("Step 4: Initializing database tables...")
    if not init_database():
        print("✗ Failed to initialize database")
        sys.exit(1)
    print()
    
    print("="*60)
    print("✓ PostgreSQL Setup Complete!")
    print("="*60)
    print("\nYou can now start the backend with:")
    print("  cd backend")
    print("  python main.py")
    print("\nOr with uvicorn:")
    print("  uvicorn main:app --reload")
    print()

if __name__ == "__main__":
    main()
