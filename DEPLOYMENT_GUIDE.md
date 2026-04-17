# 🚀 AgroVision Deployment Guide

Complete guide to deploy AgroVision backend and frontend to production.

---

## 📋 Prerequisites

Before deployment, ensure you have:

- ✅ Git account (GitHub, GitLab, or Bitbucket)
- ✅ Backend code ready (`backend/` folder)
- ✅ Frontend code ready (`onion-frontend/` folder)
- ✅ Hugging Face API key (for chatbot)
- ✅ Model files (`model/onion_mobilenet_model.h5`, `model/classes.json`)

---

## 🎯 Deployment Platform

**Using Render.com:**

| Platform   | Backend | Frontend | Cost      | Ease        |
| ---------- | ------- | -------- | --------- | ----------- |
| **Render** | ✅      | ✅       | Free tier | ⭐⭐⭐ Easy |

---

## � Render.com Deployment (Official Guide)

Render is the simplest option with free tier and automatic Git integration.

### Step 1: Prepare Git Repository

Code is already pushed to GitHub. If not, run:

```bash
cd c:\Users\ajink\OneDrive\Desktop\model-building

git add .
git commit -m "AgroVision deployment"
git push origin main
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Click **"Sign up"** → Choose **"GitHub"**
3. Click **"New +"** → Select **"Web Service"**
4. Select your **GitHub repo** (`agroVision_final`)
5. Click **"Connect"**

**Configure Backend:**

- **Name:** `agrovision-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Runtime:** `Python 3`
- **Root Directory:** Leave blank
- **Build Command:**
  ```
  pip install -r backend/requirements.txt
  ```
- **Start Command:**
  ```
  cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Add Environment Variables:**

- Click **"Environment"** tab
- Add:
  - **Key:** `HF_API_KEY`
  - **Value:** _(Get from https://huggingface.co/settings/tokens)_

**Deploy:** Click **"Create Web Service"**

- Wait 3-5 minutes
- You'll get URL: `https://agrovision-backend.onrender.com`
- **Save this URL** ⚠️

✅ **Test:** Visit `https://your-backend-url.onrender.com/docs`

### Step 3: Deploy Frontend to Render

1. Dashboard → Click **"New +"** → Select **"Static Site"**
2. Select your **GitHub repo** again
3. Click **"Connect"**

**Configure Frontend:**

- **Name:** `agrovision-frontend`
- **Region:** Same as backend
- **Branch:** `main`
- **Root Directory:** `onion-frontend`
- **Build Command:**
  ```
  npm install && npm run build
  ```
- **Publish Directory:** `build`

**Add Environment Variables:**

- Click **"Environment"** tab
- Add:
  - **Key:** `REACT_APP_API_URL`
  - **Value:** `https://agrovision-backend.onrender.com` _(from Step 2)_

**Deploy:** Click **"Create Static Site"**

- Wait 5-10 minutes for build
- You'll get URL: `https://agrovision-frontend.onrender.com`

✅ **Test:** Visit `https://your-frontend-url.onrender.com`

### Step 4: Verify Everything Works

Open your frontend URL and test:

1. **Upload Image**
   - Click "अपलोड करा" (Upload)
   - Select onion leaf image
   - Should show disease in Marathi

2. **Try Chat**
   - Go to "AI चॅट" (Chat)
   - Ask: "पर्पल ब्लॉच म्हणजे काय?" (What is purple blotch?)
   - Should get Marathi response

3. **Toggle Language**
   - Click "मा/EN" in navbar
   - Page switches language

4. **Check Weather**
   - Go to Dashboard
   - Should show weather

---

## 🌐 Your Render URLs

After deployment:

| Component    | URL                                            |
| ------------ | ---------------------------------------------- |
| Backend API  | `https://agrovision-backend.onrender.com`      |
| Frontend App | `https://agrovision-frontend.onrender.com`     |
| API Docs     | `https://agrovision-backend.onrender.com/docs` |

---

## 🆘 Troubleshooting Render

### ❌ Frontend shows "Cannot connect to API"

```
1. Check REACT_APP_API_URL is correct
2. Visit backend URL directly in browser
3. If backend not working, check Render dashboard logs
   - Render.com → agrovision-backend → Logs
```

### ❌ Backend won't build

```
1. Check build logs: Render → agrovision-backend → Logs
2. Verify HF_API_KEY is set in Environment variables
3. Ensure requirements.txt exists in backend/
```

### ❌ Image upload fails

```
1. Open browser console: F12 → Console tab
2. Check error message
3. Verify: https://your-backend-url/health returns {"status": "healthy"}
```

### ❌ Build takes too long (>15 min)

```
Render's free tier builds can be slow. Wait longer or upgrade to paid tier for faster builds.
```

---

## 💡 Render Pro Tips

✅ **Auto-Redeploy**

- Every `git push` to GitHub auto-redeploys
- No manual redeploy needed

✅ **View Live Logs**

- Render Dashboard → Click service → Logs
- See real-time errors/activity

✅ **Update Environment Variables**

- Click Environment tab → Edit → Update
- Service auto-restarts

✅ **Free Tier Details**

- 750 hours/month per service
- Covers 24/7 operation
- Spins down after 15 min inactivity (restarts when accessed)

---

## 📊 Environment Variables Reference

### Backend Variables

```env
HF_API_KEY=your_hugging_face_api_key
```

### Frontend Variables

```env
REACT_APP_API_URL=https://agrovision-backend.onrender.com
```

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] Backend API is accessible
- [ ] Frontend loads without errors
- [ ] Image upload works
- [ ] Disease detection returns results
- [ ] Chatbot responds
- [ ] Language toggle works
- [ ] Weather API works
- [ ] All translations display correctly

### Test Backend

```bash
curl https://your-backend-url/docs
# Should show Swagger API docs
```

### Test Frontend

```
https://your-frontend-url
# Should load AgroVision application
```

---

## 🔐 Security Checklist

Before production:

- [ ] Remove `.env` from git (add to `.gitignore`)
- [ ] Use secure API keys (rotate them)
- [ ] Enable HTTPS only
- [ ] Set CORS properly (don't use `"*"`)
- [ ] Add rate limiting to API
- [ ] Enable authentication if needed
- [ ] Backup model files
- [ ] Monitor API usage
- [ ] Set up error logging (Sentry)

### Update CORS for Production

In `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-url",
        "http://localhost:3000"  # for dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Environment Variables Setup

### Backend (.env file)

```env
HF_API_KEY=your_hugging_face_api_key
ENVIRONMENT=production
LOG_LEVEL=info
```

### Frontend (.env file)

Create `onion-frontend/.env`:

```env
REACT_APP_API_URL=https://your-backend-url
REACT_APP_ENVIRONMENT=production
```

**Note:** Frontend env variables must start with `REACT_APP_`

---

## 🧪 Testing Before Deployment

### Backend Tests

```bash
cd backend

# Install pytest
pip install pytest

# Run tests
pytest

# Or manually test
python -m uvicorn main:app --reload
# Visit http://localhost:8000/docs
```

### Frontend Tests

```bash
cd onion-frontend

# Build for production
npm run build

# Test build locally
npx serve -s build
```

---

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check for missing dependencies
pip list

# Verify model files exist
ls backend/model/

# Check Python version (should be 3.8+)
python --version
```

### Frontend shows "Cannot connect to API"

- Check `REACT_APP_API_URL` environment variable
- Verify backend is running
- Check CORS configuration
- Open browser console (F12) for error messages

### Model loading fails

```bash
# Verify model file
ls -lh backend/model/onion_mobilenet_model.h5

# Test TensorFlow
python -c "import tensorflow as tf; print(tf.__version__)"
```

### High latency on image upload

- Model inference takes 2-3 seconds (normal)
- First request loads model into memory (slower)
- Consider GPU deployment for faster inference

---

## 📈 Scaling Considerations

As your application grows:

1. **Database**: Add PostgreSQL for history storage
2. **Caching**: Use Redis for frequently accessed data
3. **CDN**: Use Cloudflare or AWS CloudFront for frontend
4. **Model Optimization**: Convert to ONNX for faster inference
5. **Load Balancing**: Use Kubernetes for multiple replicas
6. **Monitoring**: Add Sentry, DataDog, or New Relic

---

## 📞 Support Resources

- FastAPI docs: https://fastapi.tiangolo.com
- React deployment: https://create-react-app.dev/deployment
- TensorFlow serving: https://www.tensorflow.org/tfx/guide/serving
- Render docs: https://docs.render.com

---

## 🎉 Success!

Once deployed, share the URLs:

- **Backend API**: `https://your-backend-url/docs` (Swagger UI)
- **Frontend**: `https://your-frontend-url` (AgroVision app)

Farmers can now access your AgroVision disease detection system from anywhere! 🌾
