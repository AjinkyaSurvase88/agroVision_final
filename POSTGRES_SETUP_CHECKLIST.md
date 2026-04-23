# PostgreSQL Implementation Checklist ✅

Use this checklist to complete the PostgreSQL migration for AgroVision.

---

## Pre-Installation (5 minutes)

- [ ] **1. Download PostgreSQL**
  - Go to [postgresql.org/download](https://www.postgresql.org/download/)
  - Download for your operating system (Windows/Mac/Linux)
  - Note: Version 12+ recommended

- [ ] **2. Note Your Credentials**
  - Save the **postgres** password somewhere safe
  - We'll need it to create the database
  - Default port is **5432** (don't change unless needed)

---

## Installation (15-20 minutes)

### Windows

- [ ] Run PostgreSQL installer
- [ ] Accept license agreement
- [ ] Choose installation directory (default is fine)
- [ ] Set **postgres** password (remember this!)
- [ ] Port: **5432** (default)
- [ ] Locale: **Default locale**
- [ ] Click Install and wait...
- [ ] Uncheck "Launch Stack Builder" for now
- [ ] Finish

### macOS

- [ ] `brew install postgresql`
- [ ] `brew services start postgresql`
- [ ] Default user is **postgres**

### Linux (Ubuntu/Debian)

- [ ] `sudo apt update && sudo apt install postgresql postgresql-contrib`
- [ ] `sudo systemctl start postgresql`
- [ ] Default user is **postgres**

---

## Create Database (5 minutes)

### Option A: Using pgAdmin (Easy - GUI)

- [ ] Open pgAdmin (comes with PostgreSQL)
- [ ] Login with postgres user and password
- [ ] Right-click "Databases" → Create → Database
- [ ] Name: **agrovision_db**
- [ ] Click "Save"
- [ ] **SKIP TO PYTHON SETUP** - Database created!

### Option B: Using Command Line (Advanced)

- [ ] Open terminal/command prompt
- [ ] Type: `psql -U postgres`
- [ ] Enter postgres password
- [ ] Copy and paste this entire block:
  ```sql
  CREATE DATABASE agrovision_db;
  CREATE USER agrovision_user WITH PASSWORD 'agrovision_password';
  ALTER ROLE agrovision_user SET client_encoding TO 'utf8';
  ALTER ROLE agrovision_user SET default_transaction_isolation TO 'read committed';
  ALTER ROLE agrovision_user SET default_transaction_deferrable TO on;
  GRANT ALL PRIVILEGES ON DATABASE agrovision_db TO agrovision_user;
  ```
- [ ] Press Enter
- [ ] Type: `\q` (to exit)

**Save these credentials:**

- Database: `agrovision_db`
- User: `agrovision_user`
- Password: `agrovision_password`
- Host: `localhost`
- Port: `5432`

---

## Python Setup (10 minutes)

### Step 1: Install Python Packages

```bash
cd backend
pip install -r requirements.txt
```

- [ ] Check for "Successfully installed" message
- [ ] Should install: sqlalchemy, psycopg2-binary, and others

### Step 2: Create .env File

```bash
cp .env.example .env
```

Or manually create `backend/.env` with:

```env
DATABASE_URL=postgresql://agrovision_user:agrovision_password@localhost:5432/agrovision_db
GEMINI_API_KEY=your_gemini_api_key_here
```

- [ ] DATABASE_URL is exactly as shown above
- [ ] Update GEMINI_API_KEY with your actual API key
- [ ] Save the file

### Step 3: Run Setup Script

**Windows:**

```bash
cd backend
setup.bat
```

**Mac/Linux:**

```bash
cd backend
bash setup.sh
```

Or run manually:

```bash
python setup_postgres.py
```

- [ ] Should see: ✓ Database tables created successfully
- [ ] Should see: ✓ PostgreSQL Setup Complete!

---

## Verification (5 minutes)

### Test Database Connection

```bash
cd backend
python -c "from database import SessionLocal; db = SessionLocal(); print('✓ Connected to PostgreSQL')"
```

- [ ] Should print: `✓ Connected to PostgreSQL`

### Start Backend Server

```bash
cd backend
python main.py
```

OR

```bash
uvicorn main:app --reload
```

- [ ] Should see: `INFO: Uvicorn running on http://0.0.0.0:8000`
- [ ] No errors in console
- [ ] Can access http://localhost:8000/health

### Test API Endpoint

Open a new terminal/command prompt:

```bash
# Test health endpoint
curl http://localhost:8000/health
```

- [ ] Should return: `{"status":"healthy",...}`
- [ ] If not, check PostgreSQL is running

### Test Registration

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testfarm","email":"test@farm.com","password":"pass123"}'
```

- [ ] Should return status "success"
- [ ] Should have farmer ID in response

---

## Frontend Setup (Already Done ✓)

- [ ] ✅ No frontend changes needed
- [ ] Frontend still uses the same API endpoints
- [ ] Authentication still works as before
- [ ] Frontend code is unchanged

---

## Troubleshooting

### PostgreSQL won't start

- [ ] Check Windows Services (services.msc) or systemctl status postgresql
- [ ] If port 5432 in use, check for conflicting process
- [ ] See POSTGRESQL_SETUP.md for detailed troubleshooting

### "could not connect to server" error

- [ ] Verify PostgreSQL is running
- [ ] Check DATABASE_URL in .env is correct
- [ ] Verify database `agrovision_db` exists (use pgAdmin or psql)
- [ ] Verify user `agrovision_user` has privileges

### "password authentication failed"

- [ ] Check password in .env matches what you set
- [ ] Use pgAdmin to reset password if forgotten
- [ ] Update .env with new password

### Port 5432 already in use

- [ ] This usually means PostgreSQL is already running (good!)
- [ ] Or another service uses it
- [ ] See POSTGRESQL_SETUP.md section "Port already in use"

---

## Success Checklist ✅

If you can check all these, you're done!

- [ ] PostgreSQL installed and running
- [ ] Database `agrovision_db` created
- [ ] User `agrovision_user` created with password
- [ ] `backend/.env` file exists with DATABASE_URL
- [ ] `pip install -r requirements.txt` completed
- [ ] `python setup_postgres.py` ran successfully
- [ ] `python main.py` starts without errors
- [ ] Health check returns 200 OK
- [ ] Can register a new farmer account
- [ ] Frontend loads and connects to backend

---

## What To Do Next

✅ Keep the backend running:

```bash
cd backend
python main.py
```

✅ In another terminal, start the frontend:

```bash
cd onion-frontend
npm start
```

✅ Open http://localhost:3000 in your browser

✅ Test the app:

- Upload an onion image
- Check if disease detection works
- Register a new account
- Login and verify history syncs

---

## Production Deployment

When deploying to production:

- [ ] Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
- [ ] Use strong passwords
- [ ] Enable SSL/TLS for database connections
- [ ] Set up regular backups
- [ ] Use environment variables for sensitive data
- [ ] Monitor database performance

See POSTGRESQL_SETUP.md section "Production Deployment" for details.

---

## Support Resources

- 📖 Full Setup Guide: `POSTGRESQL_SETUP.md`
- 🔧 Migration Summary: `POSTGRES_MIGRATION_SUMMARY.md`
- 🤖 Automated Setup: `backend/setup_postgres.py`
- 📚 SQLAlchemy Docs: https://docs.sqlalchemy.org/
- 📚 PostgreSQL Docs: https://www.postgresql.org/docs/

---

**Congratulations! You've successfully migrated to PostgreSQL! 🎉**

Your app is now production-ready with enterprise-grade database management.
