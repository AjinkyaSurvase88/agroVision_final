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
- [ ] GitHub repo is public

---

## Render Deployment Steps

```
STEP 1: Prepare GitHub
  [ ] Code committed: git add . && git commit -m "Deploy to Render"
  [ ] Code pushed: git push origin main
  [ ] GitHub repo is public

STEP 2: Deploy Backend
  [ ] Go to https://render.com
  [ ] Sign up with GitHub
  [ ] Click "New +" → "Web Service"
  [ ] Select your GitHub repo
  [ ] Set Build Command: pip install -r backend/requirements.txt
  [ ] Set Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
  [ ] Set Root Directory: (leave blank)
  [ ] Set environment variable: HF_API_KEY=your_key
  [ ] Deploy
  [ ] Wait 3-5 minutes
  [ ] Note backend URL (e.g., agrovision-backend.onrender.com)

STEP 3: Deploy Frontend
  [ ] Click "New +" → "Static Site"
  [ ] Select your GitHub repo again
  [ ] Set Root Directory: onion-frontend
  [ ] Set Build Command: npm install && npm run build
  [ ] Set Publish Directory: build
  [ ] Set environment variable: REACT_APP_API_URL=https://agrovision-backend.onrender.com
  [ ] Deploy
  [ ] Wait 5-10 minutes
  [ ] Test at the provided URL
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

### On Render Dashboard

1. **Check Logs**
   - Go to service
   - Click "Logs" tab
   - See what failed

2. **Revert Code**
   - `git revert HEAD`
   - `git push origin main`
   - Render auto-redeploys

3. **Update Environment Variables**
   - Click Environment tab
   - Fix values
   - Save (service auto-restarts)

4. **Redeploy Service**
   - Click "Manual Deploy" button
   - Select commit to redeploy
   - Wait for build to complete

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

## Troubleshooting on Render

| Issue                        | Solution                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------- |
| API 404 error                | Check `REACT_APP_API_URL` in Static Site Environment, verify backend is running  |
| Image upload fails           | Check Render logs, verify HF_API_KEY is set, check backend health endpoint       |
| Marathi text shows ???       | Check file encoding is UTF-8, reload page                                        |
| Chat not responding          | Verify `HF_API_KEY` is set in Web Service Environment, check logs                |
| App very slow                | Render free tier may be slow, consider upgrading to paid tier                    |
| Build fails                  | Click Logs tab on Render, find error message, fix and push to GitHub             |
| Frontend can't reach backend | Verify REACT_APP_API_URL matches your backend URL exactly, check CORS on backend |
| Service spinning down        | Render free tier spins down after 15 min inactivity, accessing URL wakes it      |

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
