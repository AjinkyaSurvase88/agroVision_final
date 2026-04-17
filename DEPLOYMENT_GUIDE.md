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

## 🎯 Quick Decision Tree

**Choose your deployment platform:**

| Platform | Backend | Frontend | Cost | Ease |
|----------|---------|----------|------|------|
| **Railway** | ✅ | ✅ | Free tier | ⭐⭐⭐ Easy |
| **Render** | ✅ | ✅ | Free tier | ⭐⭐⭐ Easy |
| **Vercel** | ❌ | ✅ | Free tier | ⭐⭐⭐ Easy |
| **AWS** | ✅ | ✅ | Pay-as-you-go | ⭐⭐ Medium |
| **Azure** | ✅ | ✅ | Pay-as-you-go | ⭐⭐ Medium |
| **DigitalOcean** | ✅ | ✅ | $5+/month | ⭐⭐ Medium |

---

## 🌟 OPTION 1: Railway (RECOMMENDED - Easiest)

Railway is the simplest option with free tier and automatic Git integration.

### Step 1: Prepare Git Repository

```bash
cd c:\Users\ajink\OneDrive\Desktop\model-building

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - AgroVision project"

# Add your GitHub/GitLab remote
git remote add origin https://github.com/YOUR_USERNAME/agrovision.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"Create New Project"** → **"GitHub Repo"**
4. Select your repository
5. Click **"Deploy Now"**
6. Under **Variables**, add environment variables:
   ```
   HF_API_KEY=your_hugging_face_key
   ```
7. Railway automatically detects `requirements.txt` and deploys

**Note:** Make sure `main.py` exists in `backend/` folder

### Step 3: Configure Backend for Railway

Update `backend/main.py` to accept dynamic port:

```python
if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
```

Create `backend/Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 4: Deploy Frontend to Railway

1. In Railway dashboard, click **"Create New Service"**
2. Select **"GitHub Repo"** from your monorepo (or separate frontend repo)
3. Set **Build Command**: `cd onion-frontend && npm install && npm run build`
4. Set **Start Command**: `cd onion-frontend && npm start` (or use static hosting)
5. Set **Root Directory**: `onion-frontend`
6. Under **Environments**, add:
   ```
   REACT_APP_API_URL=https://your-backend-railway-url
   ```

### Step 5: Get Your URLs

After deployment, Railway provides URLs:
- Backend: `https://your-backend-name.up.railway.app`
- Frontend: `https://your-frontend-name.up.railway.app`

Update frontend `.env`:
```env
REACT_APP_API_URL=https://your-backend-name.up.railway.app
```

---

## 🎨 OPTION 2: Render.com (Free Alternative)

Similar to Railway but separate deployments.

### Backend Deployment

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0`
6. Add environment variables (HF_API_KEY)
7. Click **"Deploy"**

### Frontend Deployment

1. **Option A**: Deploy as static site
   - Click **"New +"** → **"Static Site"**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Option B**: Deploy as web service
   - Same as backend, use `npm start`

---

## ☁️ OPTION 3: Azure App Service

### Backend Deployment

1. Go to [Azure Portal](https://portal.azure.com)
2. Create **App Service** → **Python 3.11**
3. Create **PostgreSQL Database** (or use Azure Cosmos DB)
4. Configure deployment:
   ```bash
   # In Azure Cloud Shell
   az webapp deployment source config-zip --resource-group myGroup --name myApp --src packaged.zip
   ```

5. Set Application Settings:
   ```
   HF_API_KEY = your_key
   FLASK_ENV = production
   ```

### Frontend Deployment

1. Build React app:
   ```bash
   cd onion-frontend
   npm run build
   ```

2. Deploy to Azure Static Web Apps:
   - Create **Static Web App** in Azure Portal
   - Connect GitHub repo
   - Build preset: **React**
   - App location: `onion-frontend`
   - Output location: `build`

---

## 🐳 OPTION 4: Docker + Cloud Run (Advanced)

For containerized deployment.

### Create Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Create Docker Compose (Local Testing)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - HF_API_KEY=${HF_API_KEY}
  
  frontend:
    build: ./onion-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8000
```

### Test Locally

```bash
docker-compose up
```

### Deploy to Google Cloud Run

```bash
# Build image
docker build -t agrovision-backend ./backend

# Tag for Google Cloud
docker tag agrovision-backend gcr.io/YOUR_PROJECT_ID/agrovision-backend

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/agrovision-backend

# Deploy to Cloud Run
gcloud run deploy agrovision-backend \
  --image gcr.io/YOUR_PROJECT_ID/agrovision-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars HF_API_KEY=your_key
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
- Railway docs: https://docs.railway.app
- Render docs: https://docs.render.com

---

## 🎉 Success!

Once deployed, share the URLs:

- **Backend API**: `https://your-backend-url/docs` (Swagger UI)
- **Frontend**: `https://your-frontend-url` (AgroVision app)

Farmers can now access your AgroVision disease detection system from anywhere! 🌾
