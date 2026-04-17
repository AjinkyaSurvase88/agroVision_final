# 🚀 Quick Start: Deployment Summary

## What You Have

✅ **Complete AgroVision Application:**

- Backend API (FastAPI + TensorFlow)
- React Frontend (Marathi-enabled)
- Disease Detection Model
- AI Chatbot with fallbacks
- Weather integration
- Full Marathi localization

---

## 🎯 Deploy with Render (5 minutes)

**Why Render?** Free tier, auto-deployment from GitHub, production-ready.

### Step 1: Sign Up

```
1. Visit: https://render.com
2. Click: Sign up with GitHub
3. Authorize Render to access GitHub
4. Complete signup
```

### Step 2: Deploy Backend

```
1. Dashboard → Click "New +" → Select "Web Service"
2. Select your GitHub repo (agroVision_final)
3. Click "Connect"

Configure:
   - Name: agrovision-backend
   - Build: pip install -r backend/requirements.txt
   - Start: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   - Root: (leave blank)

Environment Variables:
   - HF_API_KEY = your_key (get from huggingface.co/settings/tokens)

4. Click "Create Web Service"
5. Wait 3-5 minutes for deploy
6. Save your backend URL: https://agrovision-backend.onrender.com
```

### Step 3: Deploy Frontend

```
1. Dashboard → Click "New +" → Select "Static Site"
2. Select your GitHub repo again
3. Click "Connect"

Configure:
   - Name: agrovision-frontend
   - Root Directory: onion-frontend
   - Build: npm install && npm run build
   - Publish: build

Environment Variables:
   - REACT_APP_API_URL = https://agrovision-backend.onrender.com (from Step 2)

4. Click "Create Static Site"
5. Wait 5-10 minutes for deploy
6. Visit your frontend URL: https://agrovision-frontend.onrender.com
```

### Step 4: Test Your App

✅ Visit frontend URL and test:

- Upload image → See disease detection
- Chat → Ask questions in Marathi
- Toggle language → Click मा/EN
- Weather → Check agro tips

**Your URLs:**

- Frontend: `https://agrovision-frontend.onrender.com`
- Backend: `https://agrovision-backend.onrender.com`
- API Docs: `https://agrovision-backend.onrender.com/docs`

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] **HF_API_KEY ready** → Get from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- [ ] **GitHub account** → Code already pushed
- [ ] **Model files present** → `/backend/model/onion_mobilenet_model.h5` exists
- [ ] **Backend runs locally** → `python -m uvicorn main:app` works

---

## 🔧 Local Testing (Before Cloud Deployment)

### Test Backend

```bash
cd backend
python -m uvicorn main:app --reload

# Visit: http://localhost:8000/docs
# Should see Swagger UI with API endpoints
```

### Test Frontend

```bash
cd onion-frontend
npm install
npm start

# Visit: http://localhost:3000
# Should see AgroVision app
```

### Test Together

```bash
# Terminal 1
cd backend && python -m uvicorn main:app --reload

# Terminal 2
cd onion-frontend && npm start

# Both should work together
```

---

## 📦 File Structure for Deployment

Your project should look like:

```
agrovision/
├── backend/
│   ├── main.py                 ← FastAPI app
│   ├── requirements.txt        ← Dependencies
│   ├── Procfile               ← Railway/Heroku config
│   ├── Dockerfile             ← Docker config
│   ├── .env.example           ← Env template
│   ├── model/
│   │   ├── onion_mobilenet_model.h5
│   │   └── classes.json
│   └── routes/
│       ├── predict.py
│       └── chat.py
│
├── onion-frontend/
│   ├── package.json           ← Node dependencies
│   ├── Dockerfile             ← Docker config
│   ├── .env.example           ← Env template
│   ├── public/
│   └── src/
│
├── docker-compose.yml         ← Local Docker setup
├── DEPLOYMENT_GUIDE.md        ← Full deployment guide
├── README.md
└── .git/                      ← Git repository
```

---

## ⚡ Environment Variables

### Backend (.env)

```env
HF_API_KEY=your_huggingface_api_key
ENVIRONMENT=production
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://your-backend-url.com
```

**Important:** Frontend env vars must start with `REACT_APP_`

---

## 🧪 Verify Render Deployment

After deployment:

1. **Check Backend Health**

   ```bash
   curl https://agrovision-backend.onrender.com/health
   # Should return: {"status": "healthy"}
   ```

2. **Open Frontend**
   - Visit: `https://agrovision-frontend.onrender.com`
   - Should see AgroVision app with 🧅 logo

---

## 🐛 Common Issues on Render

### "Cannot connect to API"

- Check `REACT_APP_API_URL` is correct in Static Site Environment
- Visit backend URL directly: `https://agrovision-backend.onrender.com/docs`
- Check Render logs: Dashboard → agrovision-backend → Logs

### "Backend won't build"

- Check build logs in Render dashboard
- Verify `HF_API_KEY` is set in Environment variables
- Ensure `requirements.txt` exists in backend/

### "Image upload fails"

- Open browser console: F12 → Console tab
- Check for errors
- Verify backend health: `https://agrovision-backend.onrender.com/health`

### "Build taking too long"

- Render's free tier builds can take 10-15 minutes
- This is normal, wait longer
- Consider upgrading to Render paid tier

---

## ⚡ Environment Variables on Render

**Backend Environment Variables:**

```
HF_API_KEY = your_hugging_face_api_key
```

**Frontend Environment Variables:**

```
REACT_APP_API_URL = https://agrovision-backend.onrender.com
```

✅ Frontend env vars must start with `REACT_APP_`

---

## 💡 Render Pro Tips

✅ **Auto-Redeploy**

- Every `git push` to GitHub auto-redeploys
- No manual action needed

✅ **View Live Logs**

- Render → Click service → Logs tab
- See real-time errors/activity

✅ **Update Environment Variables**

- Click Environment tab → Edit → Save
- Service auto-restarts

✅ **Free Tier Details**

- 750 hours/month per service
- Covers 24/7 operation
- Spins down after 15 min inactivity

---

## 📊 What Gets Deployed

### Backend

- ✅ FastAPI server
- ✅ TensorFlow model
- ✅ Disease detection API
- ✅ AI chat with Marathi responses
- ✅ Auto health checks

### Frontend

- ✅ React app
- ✅ Marathi translations
- ✅ Image upload
- ✅ Results display
- ✅ Chatbot interface
- ✅ Weather integration

---

## 🎉 You're Ready!

Your AgroVision application is deployed on Render!

**Your URLs:**

- Frontend: `https://agrovision-frontend.onrender.com`
- Backend: `https://agrovision-backend.onrender.com`
- API Docs: `https://agrovision-backend.onrender.com/docs`

---

**Questions?** Read `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

**Success!** 🌾 Farmers can now detect crop diseases with AI! 🚀
