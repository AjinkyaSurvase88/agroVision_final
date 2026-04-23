"""
Database configuration and models for PostgreSQL
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://agrovision_user:agrovision_password@localhost:5432/agrovision_db"
)

# Create database engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Set to True for SQL logging
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=10,
        max_overflow=20
    )

# Create session factory
SessionLocal = sessionmaker(bind=engine)

# Base class for models
Base = declarative_base()


# ── ORM Models ──────────────────────────────────────────────────
class Farmer(Base):
    """Farmer user account model"""
    __tablename__ = "farmers"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(64), nullable=False)
    village = Column(String(100), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationship
    scan_history = relationship("ScanHistory", back_populates="farmer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Farmer {self.username}>"


class ScanHistory(Base):
    """Disease scan history model"""
    __tablename__ = "scan_history"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False, index=True)
    disease = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    preview = Column(Text, nullable=True)  # Base64 encoded image
    filename = Column(String(255), nullable=False)
    scan_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationship
    farmer = relationship("Farmer", back_populates="scan_history")
    
    def __repr__(self):
        return f"<ScanHistory farmer_id={self.farmer_id} disease={self.disease}>"


def init_db():
    """Initialize database - create all tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


def get_db():
    """Dependency for getting DB session in FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
