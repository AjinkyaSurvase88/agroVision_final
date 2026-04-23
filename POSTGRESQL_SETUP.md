# PostgreSQL Setup Guide for AgroVision

This guide will help you migrate from SQLite to PostgreSQL for the AgroVision backend.

## Prerequisites

- **PostgreSQL 12+** installed on your system
- **psycopg2-binary** and **SQLAlchemy** packages (already in `requirements.txt`)

---

## Step 1: Install PostgreSQL

### Windows

1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the **postgres** user password (you'll need it)
4. Port: **5432** (default)
5. Keep **Stack Builder** for extensions

### macOS

```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create Database and User

Open **pgAdmin** or use the command line:

### Using pgAdmin (GUI):

1. Open pgAdmin (comes with PostgreSQL)
2. Right-click "Databases" → "Create" → "Database"
3. **Database name:** `agrovision_db`
4. Click "Save"

### Using Command Line:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE agrovision_db;

# Create user
CREATE USER agrovision_user WITH PASSWORD 'agrovision_password';

# Grant privileges
ALTER ROLE agrovision_user SET client_encoding TO 'utf8';
ALTER ROLE agrovision_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE agrovision_user SET default_transaction_deferrable TO on;
ALTER ROLE agrovision_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE agrovision_db TO agrovision_user;

# Exit psql
\q
```

**Database Credentials:**

- **Host:** `localhost` (or `127.0.0.1`)
- **Port:** `5432`
- **Database:** `agrovision_db`
- **User:** `agrovision_user`
- **Password:** `agrovision_password`

---

## Step 3: Update Environment Variables

Create or update `.env` file in the `backend/` directory:

```env
# PostgreSQL Connection String
DATABASE_URL=postgresql://agrovision_user:agrovision_password@localhost:5432/agrovision_db

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Keep the format exactly as shown:

```
postgresql://username:password@host:port/database_name
```

---

## Step 4: Install Dependencies

Navigate to the backend folder and install packages:

```bash
cd backend
pip install -r requirements.txt
```

This will install:

- `sqlalchemy>=2.0.0` - ORM for database operations
- `psycopg2-binary>=2.9.0` - PostgreSQL driver

---

## Step 5: Run the Application

The database tables will be created **automatically** on first run:

```bash
cd backend
python main.py
```

OR with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The application will:

1. Connect to PostgreSQL
2. Create `farmers` table
3. Create `scan_history` table
4. Start the FastAPI server

**Expected Output:**

```
✓ Database tables created successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Step 6: Test the Connection

Test the API endpoints:

```bash
# Health check
curl http://localhost:8000/health

# Register new farmer
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "farmer1",
    "email": "farmer@example.com",
    "password": "password123",
    "village": "Solapur"
  }'

# Login farmer
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "farmer1",
    "password": "password123"
  }'
```

---

## Database Schema

### farmers table

| Column        | Type         | Details                     |
| ------------- | ------------ | --------------------------- |
| id            | INTEGER      | Primary Key, Auto-increment |
| username      | VARCHAR(50)  | Unique, Required            |
| email         | VARCHAR(120) | Unique, Required            |
| password_hash | VARCHAR(64)  | Required                    |
| village       | VARCHAR(100) | Optional                    |
| created_at    | TIMESTAMP    | Auto-set                    |
| last_login    | TIMESTAMP    | Updated on login            |

### scan_history table

| Column     | Type         | Details                     |
| ---------- | ------------ | --------------------------- |
| id         | INTEGER      | Primary Key, Auto-increment |
| farmer_id  | INTEGER      | Foreign Key → farmers.id    |
| disease    | VARCHAR(100) | Disease name                |
| confidence | FLOAT        | Confidence score (0-1)      |
| preview    | TEXT         | Base64 encoded image        |
| filename   | VARCHAR(255) | Original filename           |
| scan_date  | TIMESTAMP    | Auto-set                    |

---

## Troubleshooting

### Connection Error: "could not connect to server"

```
Error: psycopg2.OperationalError: could not connect to server
```

**Solutions:**

1. Check PostgreSQL is running:

   ```bash
   # Windows
   Get-Service postgresql-x64-15  # or your version

   # Linux
   sudo systemctl status postgresql
   ```

2. Verify credentials in `.env` file
3. Ensure `DATABASE_URL` format is correct
4. Check firewall allows port 5432

### Authentication failed: "password authentication failed"

```
FATAL: password authentication failed for user "agrovision_user"
```

**Solutions:**

1. Verify password is correct in `.env`
2. Reset user password:
   ```bash
   psql -U postgres
   ALTER USER agrovision_user WITH PASSWORD 'new_password';
   \q
   ```
3. Update `.env` with new password

### Database doesn't exist

```
FATAL: database "agrovision_db" does not exist
```

**Solution:** Create the database (see Step 2)

### Port already in use

```
ERROR: database system is already running in backend directory
```

**Solution:**

```bash
# Find and stop conflicting process
# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5432
kill -9 <PID>
```

---

## Migration from SQLite

If you had data in SQLite `farmers.db`, you can migrate it:

```python
# Manual migration script (run once)
import sqlite3
from sqlalchemy.orm import Session
from database import SessionLocal, Farmer, ScanHistory, engine

conn = sqlite3.connect("farmers.db")
cursor = conn.cursor()

# Get farmers
cursor.execute("SELECT * FROM farmers")
farmers = cursor.fetchall()

db = SessionLocal()
for farmer in farmers:
    new_farmer = Farmer(
        id=farmer[0],
        username=farmer[1],
        email=farmer[2],
        password_hash=farmer[3],
        created_at=farmer[4],
        last_login=farmer[5]
    )
    db.add(new_farmer)

db.commit()
db.close()
```

---

## Backup & Restore

### Backup Database

```bash
pg_dump -U agrovision_user -h localhost agrovision_db > backup.sql
```

### Restore Database

```bash
psql -U agrovision_user -h localhost agrovision_db < backup.sql
```

---

## Performance Tips

1. **Enable Indexes** (already done by SQLAlchemy):
   - `farmers.username`
   - `farmers.email`
   - `scan_history.farmer_id`

2. **Regular Maintenance:**

   ```bash
   psql -U agrovision_user -d agrovision_db
   VACUUM ANALYZE;
   ```

3. **Connection Pooling:**
   - Configured in `database.py` with `pool_size=10`
   - Adjust for your workload

---

## Production Deployment

For production, use:

```env
DATABASE_URL=postgresql://user:password@db-server.com:5432/agrovision_db
```

Consider:

- Use managed PostgreSQL (AWS RDS, Azure Database, Google Cloud SQL)
- Enable SSL/TLS for connections
- Regular automated backups
- Monitoring and logging

---

## Support

For issues or questions, check:

- PostgreSQL Logs: `/var/log/postgresql/` (Linux) or Event Viewer (Windows)
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- psycopg2 Documentation: https://www.psycopg.org/
