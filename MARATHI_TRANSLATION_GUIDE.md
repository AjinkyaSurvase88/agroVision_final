# AgroVision - Marathi Translation Guide

## 🌍 Marathi Language Support

Your AgroVision application has been fully translated to **Marathi** (मराठी), with an easy language toggle feature!

### ✨ Key Features

✅ **Complete Marathi Translation**

- All UI components and pages translated to Marathi
- User-friendly error messages in Marathi
- Backend responses in Marathi

✅ **Easy Language Toggle**

- Click the **"मा/EN"** button in the navbar to switch between Marathi and English
- Language preference persists across pages

✅ **Marathi Support in Backend**

- Chat responses support Marathi farming advice
- Error messages in both Hindi and Marathi
- Improved error handling and logging

### 📋 Translated Components

#### Frontend Pages:

- **Home** (घर) - Landing page with upload feature
- **Dashboard** (डॅशबोर्ड) - Overview and statistics
- **AI Chat** (AI चॅट) - Chatbot interface

#### Components:

- **Upload** - Image drag-and-drop with Marathi labels
- **Result** - Disease detection results display
- **Chatbot** - AI assistant conversations
- **Navbar** - Navigation menu with language toggle

#### Features:

- Disease detection results (रोग शोधण्याचे परिणाम)
- Confidence levels (आत्मविश्वास स्तर)
- Treatment suggestions (उपचार सुझाव)
- Prevention tips (प्रतिबंध टिप्स)
- Weather-based guidance (हवामान-आधारित मार्गदर्शन)

### 🔧 Setup Instructions

#### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
pip install python-dotenv  # For environment variables
```

#### 2. Configure Hugging Face API (For Chatbot)

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face API key:

```
HF_API_KEY=your_huggingface_api_key_here
```

Get your free API key from: https://huggingface.co/settings/tokens

#### 3. Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

#### 4. Install Frontend Dependencies

```bash
cd onion-frontend
npm install
```

#### 5. Start the Frontend

```bash
npm start
```

The application will be available at `http://localhost:3000`

### 🗣️ Language Switching

Click the **मा/EN** button in the top-right corner of the navbar to toggle between:

- **मा** (Marathi)
- **EN** (English - coming soon)

### 📚 Translation Structure

Translations are organized in:

- `onion-frontend/src/translations/marathi.json` - All Marathi translations
- `onion-frontend/src/context/LanguageContext.jsx` - Translation management

### 🎯 Marathi Text Examples

| Feature       | Marathi      | English    |
| ------------- | ------------ | ---------- |
| Upload Button | अपलोड        | Upload     |
| Analyze       | विश्लेषण करा | Analyze    |
| Disease       | रोग          | Disease    |
| Healthy       | निरोगी       | Healthy    |
| Confidence    | आत्मविश्वास  | Confidence |
| Prevention    | प्रतिबंध     | Prevention |
| Treatment     | उपचार        | Treatment  |

### 🐛 Troubleshooting

**Chatbot not responding?**

- Ensure HF_API_KEY is set in backend/.env
- Check backend console for API errors
- Verify internet connection

**Images not uploading?**

- Supported formats: JPG, JPEG, PNG
- Maximum file size: 10 MB
- Ensure backend is running on port 8000

**Translation not showing?**

- Clear browser cache (Ctrl+Shift+Del)
- Refresh the page (F5)
- Check LanguageContext is properly wrapped in App.js

### 📞 Support

For issues or feature requests:

1. Check error messages in the console
2. Ensure all dependencies are installed
3. Verify backend/frontend are running on correct ports

### 🚀 Future Enhancements

- Add Hindi translation
- Support for English translation
- Regional language support (Tamil, Telugu, Kannada, etc.)
- Offline Marathi support

---

**Built with ❤️ for Indian Farmers | निर्मित भारतीय किसानों के लिए**
