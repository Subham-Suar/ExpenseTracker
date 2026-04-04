# 🚀 Deployment Guide - Expense Tracker

Complete guide for deploying your Expense Tracker application to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Frontend built: `npm run build`
- [ ] All code committed to git
- [ ] Environment variables configured in deployment
- [ ] MongoDB URI set and accessible
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CORS origins updated for production
- [ ] Email credentials set (if using SMTP)
- [ ] Node.js version compatible (16.x+)

## 🔧 Build & Test Locally

```bash
# Build frontend
npm run build

# Set production environment
export NODE_ENV=production

# Start server (should serve both API and frontend)
npm start
```

Visit http://localhost:4000 - should load your app

## 📱 Deploy to Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set JWT_SECRET="your_strong_secret_key"
   heroku config:set FRONTEND_URL="https://your-app-name.herokuapp.com"
   heroku config:set PORT=5000
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View logs**
   ```bash
   heroku logs --tail
   ```

## ☁️ Deploy to AWS Elastic Beanstalk

### Prerequisites
- AWS account
- AWS CLI installed
- EB CLI installed

### Steps

1. **Initialize EB**
   ```bash
   eb init
   ```

2. **Create environment**
   ```bash
   eb create expense-tracker-env
   ```

3. **Set environment variables**
   ```bash
   eb setenv \
     NODE_ENV=production \
     MONGODB_URI=your_connection_string \
     JWT_SECRET=strong_secret_key
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

## 🎯 Deploy to Vercel (Full Stack)

### Option 1: Monorepo Deploy

1. **Connect GitHub repo to Vercel**
2. **Configure project settings:**
   - Root directory: `.`
   - Build command: `cd frontend && npm run build`
   - Output directory: `frontend/dist`
   - Environment: Add your vars

3. **For Backend (separate deployment):**
   - Deploy backend to Railway, Render, or Heroku
   - Update frontend VITE_API_URL to backend URL

### Option 2: Separate Deployments

**Frontend on Vercel:**
```bash
# Vercel automatically detects vite.config.js
# Just connect frontend directory
```

**Backend on Railway/Render:**
```bash
# Connect backend directory to service
# Set environment variables in platform
```

## 🚂 Deploy to Railway

Simple and developer-friendly:

1. **Connect GitHub repo**
2. **Configure:**
   - Service: Node
   - Environment: Production
   - Start command: `npm start`

3. **Set variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_string
   JWT_SECRET=your_secret
   FRONTEND_URL=https://your-domain
   ```

4. **Deploy** - Automatic from git push

## 📦 Deploy to Render

1. **Create new service**
   - Type: Web Service
   - Language: Node

2. **Configure:**
   - Build command: `cd backend && npm install && cd .. && npm run build`
   - Start command: `npm start`

3. **Add environment variables**

4. **Deploy**

## 🐳 Deploy with Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Build frontend
COPY frontend ./frontend
WORKDIR ./frontend
RUN npm install && npm run build

# Setup backend
WORKDIR /app
COPY backend ./backend
WORKDIR ./backend
RUN npm install

EXPOSE 4000

ENV NODE_ENV=production
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t expense-tracker .
docker run -p 4000:4000 -e MONGODB_URI=your_uri expense-tracker
```

## 🔐 Security for Production

### Environment Variables
```env
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@...
JWT_SECRET=generate_strong_key_min_32_chars

# Recommended
FRONTEND_URL=https://yourdomain.com

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=app_password
```

### Generate Strong JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### HTTPS/SSL
- All deployment platforms provide free SSL
- Heroku: Automatic
- Vercel: Automatic
- AWS: Use AWS Certificate Manager
- Railway: Automatic

## 📊 Monitoring

### Heroku
```bash
heroku logs --tail
heroku ps:scale web=2
```

### Application Monitoring
- Monitor error logs
- Watch database connection
- Check API response times

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm run install:all
      - run: npm run build
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

## 🐛 Troubleshooting Deployment

### Port Issues
- Ensure PORT env var is set
- Most platforms assign dynamic port
- Use `process.env.PORT`

### Database Connection
- Check MONGODB_URI is correct
- Verify IP whitelist in MongoDB Atlas
- Test connection locally first

### Frontend Not Loading
- Verify `npm run build` creates dist folder
- Check server.js serves frontend/dist
- Ensure NODE_ENV=production

### CORS Errors
- Update FRONTEND_URL in backend
- Check allowed origins in server.js
- Test with curl: `curl -H "Origin: https://yourdomain" ...`

### Build Failures
- Check build logs on platform
- Ensure all dependencies installed
- Verify environment variables set
- Test build locally before deploy

## 📞 Deployment Support

For platform-specific help:
- **Heroku**: https://devcenter.heroku.com/
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app/
- **Render**: https://render.com/docs
- **AWS**: https://docs.aws.amazon.com/

## ✅ Post-Deployment

1. Test all endpoints
2. Verify database connection
3. Test authentication flow
4. Check error logging
5. Monitor performance
6. Set up alerts

---

**Ready to deploy? 🚀**
