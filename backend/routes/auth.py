"""
Authentication routes with PostgreSQL backend
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
import hashlib
from datetime import datetime
from database import Farmer, ScanHistory, get_db, init_db

router = APIRouter()

# Initialize database on module import
init_db()

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# ── Pydantic Models ────────────────────────────────────────────
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    village: str = ""

class LoginRequest(BaseModel):
    username: str
    password: str

class ScanHistoryItem(BaseModel):
    disease: str
    confidence: float
    preview: str = ""
    filename: str
    date: str

class SyncHistoryRequest(BaseModel):
    farmer_id: int
    history: list[ScanHistoryItem]

class FarmerResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: str
    
    class Config:
        from_attributes = True

# ── Auth Endpoints ─────────────────────────────────────────────
@router.post("/auth/register")
async def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new farmer account"""
    try:
        # Check if username or email already exists
        existing_user = db.query(Farmer).filter(
            (Farmer.username == data.username) | (Farmer.email == data.email)
        ).first()
        
        if existing_user:
            if existing_user.username == data.username:
                raise HTTPException(status_code=400, detail="Username already exists")
            else:
                raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new farmer
        password_hash = hash_password(data.password)
        new_farmer = Farmer(
            username=data.username,
            email=data.email,
            password_hash=password_hash,
            village=data.village,
            created_at=datetime.utcnow()
        )
        
        db.add(new_farmer)
        db.commit()
        db.refresh(new_farmer)
        
        return {
            "status": "success",
            "message": "Registration successful!",
            "farmer": {
                "id": new_farmer.id,
                "username": new_farmer.username,
                "email": new_farmer.email
            }
        }
    
    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Registration failed - user already exists")
    except Exception as e:
        db.rollback()
        print(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration error")


@router.post("/auth/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Login farmer account"""
    try:
        password_hash = hash_password(data.password)
        
        # Find farmer with matching credentials
        farmer = db.query(Farmer).filter(
            (Farmer.username == data.username) & (Farmer.password_hash == password_hash)
        ).first()
        
        if not farmer:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Update last login timestamp
        farmer.last_login = datetime.utcnow()
        db.commit()
        
        # Fetch scan history (latest 50)
        history_records = db.query(ScanHistory).filter(
            ScanHistory.farmer_id == farmer.id
        ).order_by(ScanHistory.scan_date.desc()).limit(50).all()
        
        history = [
            {
                "id": record.id,
                "disease": record.disease,
                "confidence": record.confidence,
                "preview": record.preview,
                "filename": record.filename,
                "date": record.scan_date.isoformat() if record.scan_date else ""
            }
            for record in history_records
        ]
        
        return {
            "status": "success",
            "message": "Login successful!",
            "farmer": {
                "id": farmer.id,
                "username": farmer.username,
                "email": farmer.email,
                "created_at": farmer.created_at.isoformat() if farmer.created_at else ""
            },
            "history": history
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login error")


@router.post("/auth/verify")
async def verify(data: dict, db: Session = Depends(get_db)):
    """Verify farmer exists"""
    try:
        farmer_id = data.get("farmer_id")
        if not farmer_id:
            raise HTTPException(status_code=401, detail="Farmer ID required")
        
        farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        
        if not farmer:
            raise HTTPException(status_code=401, detail="Farmer not found")
        
        return {
            "status": "success",
            "farmer": {
                "id": farmer.id,
                "username": farmer.username,
                "email": farmer.email
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Verification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Verification error")


@router.post("/auth/sync-history")
async def sync_history(data: SyncHistoryRequest, db: Session = Depends(get_db)):
    """Sync scan history to farmer account"""
    try:
        # Verify farmer exists
        farmer = db.query(Farmer).filter(Farmer.id == data.farmer_id).first()
        if not farmer:
            raise HTTPException(status_code=401, detail="Farmer not found")
        
        # Add new scan history entries
        added_count = 0
        for entry in data.history:
            # Check if scan already exists (avoid duplicates)
            existing = db.query(ScanHistory).filter(
                (ScanHistory.farmer_id == data.farmer_id) &
                (ScanHistory.filename == entry.filename) &
                (ScanHistory.disease == entry.disease)
            ).first()
            
            if not existing:
                new_scan = ScanHistory(
                    farmer_id=data.farmer_id,
                    disease=entry.disease,
                    confidence=entry.confidence,
                    preview=entry.preview,
                    filename=entry.filename,
                    scan_date=datetime.fromisoformat(entry.date) if entry.date else datetime.utcnow()
                )
                db.add(new_scan)
                added_count += 1
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Synced {added_count} scan(s)",
            "added": added_count
        }
    
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"Sync error: {str(e)}")
        raise HTTPException(status_code=500, detail="Sync error")


@router.get("/auth/history/{farmer_id}")
async def get_history(farmer_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """Get scan history for a farmer"""
    try:
        farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
        
        history_records = db.query(ScanHistory).filter(
            ScanHistory.farmer_id == farmer_id
        ).order_by(ScanHistory.scan_date.desc()).limit(limit).all()
        
        return {
            "status": "success",
            "farmer_id": farmer_id,
            "total": len(history_records),
            "history": [
                {
                    "id": record.id,
                    "disease": record.disease,
                    "confidence": record.confidence,
                    "filename": record.filename,
                    "date": record.scan_date.isoformat() if record.scan_date else ""
                }
                for record in history_records
            ]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"History fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching history")
