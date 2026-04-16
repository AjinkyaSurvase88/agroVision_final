from fastapi import APIRouter
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

HF_API_KEY = os.getenv("HF_API_KEY", "")
API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"

@router.post("/chat/")
async def chat(data: ChatRequest):
    try:
        headers = {}
        if HF_API_KEY:
            headers["Authorization"] = f"Bearer {HF_API_KEY}"
        
        # System prompt for farming guidance
        system_prompt = "आप एक कृषि सलाहकार हैं। कांदा रोगों के बारे में किसान-अनुकूल भाषा में उत्तर दें। (You are an agricultural advisor. Answer about onion diseases in farmer-friendly language.)"
        
        prompt = f"{system_prompt}\n\nप्रश्न (Question): {data.message}\n\nउत्तर (Answer):"
        
        response = requests.post(
            API_URL,
            json={"inputs": prompt},
            headers=headers,
            timeout=30
        )

        result = response.json()

        print("HF RESPONSE:", result)  # debug

        # Handle error safely
        if isinstance(result, dict) and "error" in result:
            return {"reply": "AI लोड हो रहा है, कुछ सेकंड में फिर से प्रयास करें। (AI is loading, try again in few seconds)"}

        if isinstance(result, list) and len(result) > 0:
            reply = result[0].get("generated_text", "कोई प्रतिक्रिया नहीं (No response)")
        else:
            reply = "कोई प्रतिक्रिया नहीं (No response)"

        return {"reply": reply}

    except requests.exceptions.Timeout:
        return {"reply": "अनुरोध समय समाप्त हो गया। कृपया बाद में पुन: प्रयास करें। (Request timed out. Please try again later.)"}
    except requests.exceptions.RequestException as e:
        print("ERROR:", str(e))
        return {"reply": "सर्वर त्रुटि। कृपया बाद में पुन: प्रयास करें। (Server error. Please try again later.)"}
    except Exception as e:
        print("ERROR:", str(e))
        return {"reply": "अनपेक्षित त्रुटि। कृपया बाद में पुन: प्रयास करें। (Unexpected error. Please try again later.)"}