from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import json
import os

from routes.predict import router as predict_router
from routes.chat import router as chat_router
from routes.auth import router as auth_router

app = FastAPI()

# CORS (React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get base directory (backend folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model ONCE on startup
model_path = os.path.join(BASE_DIR, "model", "onion_mobilenet_model.h5")
model = tf.keras.models.load_model(model_path)

# Load class names
classes_path = os.path.join(BASE_DIR, "model", "classes.json")
with open(classes_path, "r") as f:
    class_names = json.load(f)

# Attach to app state for global access in routes
app.state.model = model
app.state.class_names = class_names

# Include routes
app.include_router(predict_router)
app.include_router(chat_router)
app.include_router(auth_router)

# ── Health Check Endpoint ───────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and deployment verification.
    Returns 200 OK if backend is running.
    """
    return {
        "status": "healthy",
        "service": "AgroVision Backend",
        "model_loaded": app.state.model is not None,
        "classes_loaded": app.state.class_names is not None,
    }

# ── Root Endpoint ──────────────────────────────────────────────────
@app.get("/", tags=["Info"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "AgroVision API",
        "version": "2.0",
        "description": "AI-powered onion disease detection for Indian farmers",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "predict": "/predict/",
            "chat": "/chat/",
        }
    }

# ── Startup Event ──────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    print("[AgroVision] Backend started")
    print(f"[AgroVision] Model loaded: {app.state.model is not None}")
    print(f"[AgroVision] Classes loaded: {len(app.state.class_names) if app.state.class_names else 0}")

# -- Shutdown Event -------------------------------------------------
@app.on_event("shutdown")
async def shutdown_event():
    print("[AgroVision] Backend shutting down")

# ── Entry Point ────────────────────────────────────────────────────
if __name__ == "__main__":
    import os
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    )