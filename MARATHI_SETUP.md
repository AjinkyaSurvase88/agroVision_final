# 🌾 AgroVision - Marathi Translation Setup Guide

## ✅ What's Been Translated

Your entire AgroVision application is now available in **Marathi (मराठी)**:

### 🎨 Frontend

- ✅ All navigation menus
- ✅ Upload interface
- ✅ Disease detection results
- ✅ Chatbot conversations
- ✅ Dashboard statistics
- ✅ Error messages

### 🔧 Backend

- ✅ API error messages
- ✅ Chat responses support Marathi
- ✅ Improved error handling

### 🌐 Language Toggle

- Easy switching between Marathi and English
- Button: **मा/EN** in navbar

---

## 🚀 Quick Start

### Step 1: Backend Setup

``` bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Add your Hugging Face API key to .env:
# HF_API_KEY=your_key_here
# Get it from: https://huggingface.co/settings/tokens

# Start the backend
uvicorn main:app --reload --port 8000
```

### Step 2: Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd onion-frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

### Step 3: Access Application

Open: `http://localhost:3000`

Click **मा/EN** button to toggle Marathi ↔ English

---

## 📁 Key Files Modified

### Frontend Translations

- `src/translations/marathi.json` - All Marathi text
- `src/context/LanguageContext.jsx` - Translation logic
- `src/App.js` - Added LanguageProvider
- `src/components/Navbar.jsx` - Language toggle button
- `src/components/Upload.jsx` - Upload UI in Marathi
- `src/components/Result.jsx` - Results display in Marathi
- `src/components/Chatbot.jsx` - Chat interface in Marathi

### Backend Updates

- `routes/chat.py` - Marathi support in responses
- `routes/predict.py` - Marathi error messages, PNG support
- `requirements.txt` - Added python-dotenv and requests
- `.env.example` - Configuration template

---

## 🎯 Common Marathi Terms Used

| Function   | Marathi      | English    |
| ---------- | ------------ | ---------- |
| Upload     | अपलोड        | Upload     |
| Analyze    | विश्लेषण करा | Analyze    |
| Disease    | रोग          | Disease    |
| Healthy    | निरोगी       | Healthy    |
| Confidence | आत्मविश्वास  | Confidence |
| Treatment  | उपचार        | Treatment  |
| Prevention | प्रतिबंध     | Prevention |
| Dashboard  | डॅशबोर्ड     | Dashboard  |
| Chat       | चॅट          | Chat       |
| Weather    | हवामान       | Weather    |

---

## ⚙️ Environment Variables

Create `backend/.env`:

```
# Hugging Face API Key (for chatbot)
HF_API_KEY=your_huggingface_api_key_here

# Server Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=false
```

Get your free HF API key:

1. Visit https://huggingface.co/settings/tokens
2. Create new token
3. Copy and paste in .env file

---

## 🐛 Troubleshooting

### Issue: Marathi text not showing

**Solution:**

- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (F5)
- Check console for errors (F12)

### Issue: Chatbot not responding

**Solution:**

- Verify HF_API_KEY is set in backend/.env
- Check backend console for error messages
- Test with simpler questions first

### Issue: Images won't upload

**Solution:**

- Supported: JPG, JPEG, PNG
- Max size: 10 MB
- Ensure backend running on port 8000

### Issue: Backend won't start

**Solution:**

```bash
# Install missing dependencies
pip install python-dotenv requests

# Clear Python cache
python -m py_compile .

# Restart backend
uvicorn main:app --reload
```

---

## 📱 Features in Marathi

### 1. **रोग शोधण्याचे परिणाम** (Disease Detection)

- Upload plant image
- AI identifies disease
- Shows confidence level
- Provides treatment options

### 2. **AI चॅट** (AI Chat)

- Ask farming questions
- Get advice in Marathi
- Real-time responses

### 3. **डॅशबोर्ड** (Dashboard)

- View scan history
- Statistics display
- Health metrics

### 4. **हवामान** (Weather)

- Real-time weather data
- Disease risk assessment
- Farming guidance

---

## 📚 File Structure

```
model-building/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/
│   │   ├── predict.py (Marathi errors)
│   │   └── chat.py (Marathi responses)
│   └── model/
│       ├── onion_mobilenet_model.h5
│       └── classes.json
│
├── onion-frontend/
│   ├── src/
│   │   ├── App.js (LanguageProvider added)
│   │   ├── translations/
│   │   │   └── marathi.json ✨ NEW
│   │   ├── context/
│   │   │   ├── LanguageContext.jsx ✨ NEW
│   │   │   └── HistoryContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx (Updated)
│   │   │   ├── Upload.jsx (Updated)
│   │   │   ├── Result.jsx (Updated)
│   │   │   └── Chatbot.jsx (Updated)
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Dashboard.jsx
│   │       └── ChatPage.jsx
│   └── package.json
│
└── MARATHI_TRANSLATION_GUIDE.md
```

---

## ✨ What's New

- 🌍 **Complete Marathi Translation** - All UI in Marathi
- 🔄 **Language Toggle** - Easy switching in navbar
- 🐛 **Better Error Handling** - Informative messages in Marathi
- 📸 **PNG Support** - Now accepts PNG images too
- 🔐 **API Key Management** - .env configuration for security
- 📚 **Translation System** - Scalable for future languages

---

## 🚀 Next Steps

1. ✅ Set up backend with HF API key
2. ✅ Install frontend dependencies
3. ✅ Run both services
4. ✅ Click मा/EN to test Marathi
5. ✅ Upload plant image to test
6. ✅ Use chatbot for farming advice

---

## 💡 Tips

- Keep HF_API_KEY private, never commit to git
- Use quality plant images for better predictions
- Check internet connection for chatbot responses
- Clear cache if experiencing display issues

---

**Happy Farming! शेतीच्या शुभेच्छा! 🌾**

For detailed troubleshooting, see `MARATHI_TRANSLATION_GUIDE.md`
