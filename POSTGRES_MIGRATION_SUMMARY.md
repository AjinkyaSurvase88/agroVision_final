# PostgreSQL Migration Summary

## What Changed ✅

Your AgroVision app has been upgraded from **SQLite** to **PostgreSQL** for better scalability, concurrency, and production-readiness.

### Modified Files

1. **`backend/database.py`** (NEW)
   - SQLAlchemy ORM setup for PostgreSQL
   - Database models: `Farmer` and `ScanHistory` classes
   - Connection pooling configuration
   - Session management for FastAPI

2. **`backend/routes/auth.py`** (UPDATED)
   - Migrated from raw SQLite to SQLAlchemy ORM
   - Added dependency injection for database sessions
   - Improved error handling with proper rollbacks
   - New endpoint: `GET /auth/history/{farmer_id}` to fetch scan history
   - All auth endpoints now use PostgreSQL

3. **`backend/requirements.txt`** (UPDATED)
   - Added `sqlalchemy>=2.0.0` - ORM framework
   - Added `psycopg2-binary>=2.9.0` - PostgreSQL driver

4. **`backend/.env.example`** (UPDATED)
   - Added PostgreSQL connection string format
   - Documented GEMINI_API_KEY requirement

### New Files

1. **`POSTGRESQL_SETUP.md`**
   - Complete PostgreSQL installation and configuration guide
   - Step-by-step setup instructions for Windows, macOS, Linux
   - Database schema documentation
   - Troubleshooting guide

2. **`backend/setup_postgres.py`**
   - Automated setup script
   - Checks dependencies
   - Tests database connection
   - Initializes database tables

---

## Quick Start (3 Steps) 🚀

### Step 1: Install PostgreSQL

Visit [postgresql.org](https://www.postgresql.org/download/) and install for your OS.

### Step 2: Create Database

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database and user
CREATE DATABASE agrovision_db;
CREATE USER agrovision_user WITH PASSWORD 'agrovision_password';
GRANT ALL PRIVILEGES ON DATABASE agrovision_db TO agrovision_user;

# Exit
\q
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run setup script (optional but recommended)
python setup_postgres.py

# Start the backend
python main.py
```

Expected output:

```
✓ Database tables created successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Configuration

### `.env` File

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://agrovision_user:agrovision_password@localhost:5432/agrovision_db
GEMINI_API_KEY=your_api_key_here
```

---

## Database Schema

### farmers table

```sql
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(64) NOT NULL,
    village VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### scan_history table

```sql
CREATE TABLE scan_history (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    disease VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    preview TEXT,
    filename VARCHAR(255) NOT NULL,
    scan_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints (Same as Before)

### Authentication

- `POST /auth/register` - Register new farmer
- `POST /auth/login` - Login with credentials
- `POST /auth/verify` - Verify farmer exists
- `POST /auth/sync-history` - Sync scan history
- `GET /auth/history/{farmer_id}` - **NEW** - Get scan history

### Disease Prediction

- `POST /predict` - Predict disease from image (unchanged)

### Chat

- `POST /chat` - AI chatbot (unchanged)

---

## Migration Notes

✅ **Advantages of PostgreSQL:**

- **Scalability** - Handle more concurrent users
- **Performance** - Better indexing and query optimization
- **Reliability** - ACID transactions, crash recovery
- **Production-Ready** - Industry standard for production apps
- **Advanced Features** - JSON support, full-text search, etc.

⚙️ **What Stays the Same:**

- API endpoints remain unchanged
- Frontend doesn't need updates
- Authentication logic unchanged
- Password hashing unchanged

📊 **Data Compatibility:**

- SQLite `farmers.db` data can be migrated manually (see POSTGRESQL_SETUP.md)
- Or start fresh with PostgreSQL

---

## Troubleshooting

### "psycopg2" ImportError

```bash
pip install psycopg2-binary
```

### "postgresql://..." connection error

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Verify database `agrovision_db` exists
4. Check user `agrovision_user` has privileges

### Port 5432 already in use

PostgreSQL might already be running. That's fine! Or see POSTGRESQL_SETUP.md for details.

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database and user
3. ✅ Update `.env` with credentials
4. ✅ Run `python setup_postgres.py`
5. ✅ Start backend: `python main.py`
6. ✅ Test endpoints (see POSTGRESQL_SETUP.md)
7. ✅ Frontend works as-is (no changes needed)

---

## Support

- Full setup guide: `POSTGRESQL_SETUP.md`
- Setup script: `backend/setup_postgres.py`
- SQLAlchemy docs: https://docs.sqlalchemy.org/
- PostgreSQL docs: https://www.postgresql.org/docs/

---

**Status:** ✅ Ready for Production with PostgreSQL!
