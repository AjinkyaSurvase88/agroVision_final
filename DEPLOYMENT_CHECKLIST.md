# 📋 Deployment Checklist & Workflow

## Pre-Deployment (Do This First)

### Prerequisites
- [ ] GitHub account created
- [ ] Project pushed to GitHub
- [ ] Hugging Face API key obtained (https://huggingface.co/settings/tokens)
- [ ] Node.js installed locally (for frontend build)
- [ ] Python installed locally (for backend requirements)
- [ ] Docker installed (optional, for local testing)

### Code Checks
- [ ] No hardcoded API keys in code
- [ ] `.env.example` files created
- [ ] `.env` files added to `.gitignore`
- [ ] `requirements.txt` is up to date
- [ ] `package.json` is up to date
- [ ] Model files exist in `backend/model/`
- [ ] No TODO or FIXME comments blocking deployment

---

## Local Testing Checklist

### Backend Testing
- [ ] Backend starts: `python -m uvicorn main:app --reload`
- [ ] API docs load: `http://localhost:8000/docs`
- [ ] Health check works: `http://localhost:8000/health`
- [ ] Predict endpoint works (upload image test)
- [ ] Chat endpoint works (test query)

### Frontend Testing
- [ ] Frontend installs: `npm install`
- [ ] Frontend builds: `npm run build`
- [ ] Frontend starts: `npm start`
- [ ] App loads: `http://localhost:3000`
- [ ] Image upload works
- [ ] Chatbot responds
- [ ] Language toggle works (मा/EN)
- [ ] Results display correctly

### Integration Testing
- [ ] Both backend and frontend run together
- [ ] Frontend can upload to backend
- [ ] Responses are in Marathi
- [ ] No console errors (F12 browser console)

---

## Deployment Steps (Choose One Path)

### Path A: Railway (Recommended)

```
STEP 1: Prepare GitHub
  [ ] Code committed: git add . && git commit -m "Deploy"
  [ ] Code pushed: git push origin main
  [ ] GitHub repo is public

STEP 2: Deploy Backend
  [ ] Go to https://railway.app
  [ ] Sign up with GitHub
  [ ] Create new project → Select GitHub repo
  [ ] Set environment variable: HF_API_KEY=your_key
  [ ] Deploy
  [ ] Note backend URL (e.g., my-backend.up.railway.app)

STEP 3: Deploy Frontend
  [ ] Create new service in same project
  [ ] Set Build Command: cd onion-frontend && npm install && npm run build
  [ ] Set Start Command: npm start
  [ ] Set Root Directory: onion-frontend
  [ ] Set Environment: REACT_APP_API_URL=https://my-backend.up.railway.app
  [ ] Deploy
  [ ] Test at the provided URL
```

### Path B: Docker Compose (Local)

```
STEP 1: Test Docker Setup
  [ ] Docker installed and running
  [ ] docker-compose.yml exists
  [ ] Both Dockerfiles exist

STEP 2: Build & Run
  [ ] docker-compose up -d
  [ ] Wait 30 seconds for containers to start
  [ ] Check logs: docker-compose logs -f

STEP 3: Test Locally
  [ ] Backend: http://localhost:8000/docs
  [ ] Frontend: http://localhost:3000
  [ ] Upload image and test
  [ ] docker-compose down (when done)

STEP 4: Deploy to Cloud
  [ ] Push image to Docker Hub
  [ ] Deploy to AWS/Azure/Google Cloud
  [ ] Update environment variables
  [ ] Test on cloud
```

### Path C: Azure App Service

```
STEP 1: Create Backend Service
  [ ] Azure Portal → Create App Service
  [ ] Runtime: Python 3.11
  [ ] Create
  [ ] Configure app settings (HF_API_KEY)
  [ ] Deploy code

STEP 2: Create Frontend Service
  [ ] Azure Portal → Create Static Web App
  [ ] Select GitHub repo
  [ ] Build preset: React
  [ ] App location: onion-frontend
  [ ] Deploy

STEP 3: Connect Services
  [ ] Get backend URL from App Service
  [ ] Set REACT_APP_API_URL in frontend
  [ ] Rebuild and deploy
```

---

## Post-Deployment Verification

### Immediate Tests (After Deploy)
- [ ] Backend health check returns 200
- [ ] Frontend loads without errors (F12 → Console)
- [ ] Can upload image without errors
- [ ] Image upload completes in < 5 seconds
- [ ] Results display with Marathi disease name
- [ ] Chatbot responds (check /docs)

### Functional Tests (All Features)
- [ ] Disease detection works with sample image
- [ ] All 14 diseases are properly labeled
- [ ] Audio listen feature (🔊 आईका ऐका) works
- [ ] Marathi text displays correctly
- [ ] English toggle works (click मा/EN)
- [ ] Weather section loads
- [ ] Dashboard shows history
- [ ] Chat page loads with suggestions

### Performance Tests
- [ ] Page loads in < 3 seconds
- [ ] Image upload shows progress
- [ ] Disease detection takes 2-3 seconds
- [ ] Chat responds in < 2 seconds
- [ ] No console errors or warnings

### Security Tests
- [ ] HF_API_KEY not visible in frontend
- [ ] HTTPS is enabled (no warning)
- [ ] CORS properly configured
- [ ] No sensitive data in logs

---

## Monitoring After Deployment

### Daily Checks
- [ ] Application loads without errors
- [ ] API health check passes
- [ ] Recent predictions working
- [ ] No critical errors in logs

### Weekly Checks
- [ ] Check usage statistics
- [ ] Monitor API response times
- [ ] Review error logs
- [ ] Test all features

### Monthly Checks
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Backup model files
- [ ] Update documentation

---

## Rollback Plan (If Something Goes Wrong)

### If Backend Fails
1. Check logs for error
2. Revert last commit: `git revert HEAD`
3. Push: `git push origin main`
4. Platform auto-redeploys

### If Frontend Fails
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check REACT_APP_API_URL in .env
3. Rebuild: `npm run build`
4. Redeploy

### If Model is Missing
1. Verify file exists: `ls -la backend/model/`
2. Check file size (should be ~60-80 MB)
3. If missing, download from training output
4. Redeploy backend

---

## Success Metrics

After deployment, you should see:

✅ **Functionality**
- Users can upload images
- Disease detection works
- Marathi translations display
- Chat responds
- Audio listen feature works

✅ **Performance**
- Page loads < 3 seconds
- Image processing < 5 seconds
- Chat response < 2 seconds
- No broken features

✅ **Reliability**
- 99%+ uptime
- Auto-restart on failure
- Health checks passing
- Error logs clean

✅ **User Experience**
- Interface is responsive
- Buttons work immediately
- Results are accurate
- Help text is clear

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| API 404 error | Check `REACT_APP_API_URL` and backend is running |
| Image upload fails | Verify backend can access model file |
| Marathi text shows ??? | Check encoding is UTF-8 |
| Chat not responding | Verify `HF_API_KEY` is set |
| App very slow | Check server resources or model loading |
| CORS error | Update `allow_origins` in backend main.py |

---

## Final Deployment Readiness Checklist

- [ ] Code is clean and tested
- [ ] All environment variables are set
- [ ] Backend and frontend communicate
- [ ] Marathi translations work
- [ ] Image upload and detection work
- [ ] Chatbot responds
- [ ] Weather API works
- [ ] Model loads in < 10 seconds
- [ ] No sensitive data in code
- [ ] Documentation is updated
- [ ] Team members can access deployed app
- [ ] Monitoring is set up

---

## 🎉 Ready to Deploy?

If all checkboxes above are checked, you're ready to deploy! 

**Recommended Path:** Railway (5 minutes, free tier)

**Next:** Follow QUICK_DEPLOY.md for step-by-step instructions.

---

**Questions?** Check `DEPLOYMENT_GUIDE.md` for detailed solutions.
