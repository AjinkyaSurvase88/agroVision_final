from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import json

from routes.predict import router as predict_router
from routes.chat import router as chat_router

app = FastAPI()

# ✅ CORS (React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📦 Load model ONCE
model = tf.keras.models.load_model("model/onion_mobilenet_model.h5")

# 📦 Load classes
with open("model/classes.json", "r") as f:
    class_names = json.load(f)

# 🔗 Attach model to app (global access)
app.state.model = model
app.state.class_names = class_names

# 📡 Include routes
app.include_router(predict_router)
app.include_router(chat_router)