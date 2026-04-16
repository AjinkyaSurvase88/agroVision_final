from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from PIL import Image
import numpy as np
import io
import json
import os

from utils.preprocess import preprocess_image

router = APIRouter()

# Load Marathi disease information
DISEASE_MARATHI_PATH = "model/disease_marathi.json"
disease_marathi_data = {}

def load_disease_marathi():
    """Load Marathi disease data from JSON file"""
    global disease_marathi_data
    try:
        if os.path.exists(DISEASE_MARATHI_PATH):
            with open(DISEASE_MARATHI_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                disease_marathi_data = data.get("diseases", {})
                print(f"✅ Loaded {len(disease_marathi_data)} Marathi disease translations")
    except Exception as e:
        print(f"⚠️ Error loading disease_marathi.json: {str(e)}")

# Load data on startup
load_disease_marathi()

@router.post("/predict/")
async def predict(request: Request, file: UploadFile = File(...)):

    # ✅ Validate file type
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Only JPG/JPEG/PNG images are allowed"
        )

    try:
        # 📥 Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # 🔄 Preprocess
        processed = preprocess_image(image)

        # 🧠 Model prediction
        model = request.app.state.model
        class_names = request.app.state.class_names

        predictions = model.predict(processed)

        predicted_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        predicted_class = class_names[predicted_index]

        # Get Marathi disease information
        disease_info = disease_marathi_data.get(predicted_class, {})
        
        marathi_disease = disease_info.get("marathi_name", predicted_class)
        treatment = disease_info.get("treatment", "उपचार की जानकारी उपलब्ध नहीं है।")
        symptoms = disease_info.get("symptoms", "लक्षण की जानकारी उपलब्ध नहीं है।")
        prevention = disease_info.get("prevention", "प्रतिबंध की जानकारी उपलब्ध नहीं है।")
        severity = disease_info.get("severity", "अज्ञात")
        status = disease_info.get("status", "अनिर्धारित")

        return {
            "disease": predicted_class,
            "marathi_disease": marathi_disease,
            "confidence": round(confidence, 3),
            "status": status,
            "severity": severity,
            "symptoms": symptoms,
            "treatment": treatment,
            "prevention": prevention
        }

    except Exception as e:
        print(f"ERROR in predict: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )