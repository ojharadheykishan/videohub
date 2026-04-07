# VideoHub - Setup & Installation Guide

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v5 or higher)
   - [Local Installation](https://docs.mongodb.com/manual/installation/)
   - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **YouTube Data API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create an API Key credential

---

## 🔧 Backend Setup

### Step 1: Clone or Extract Project
```bash
cd /path/to/videohub/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

Expected packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- axios
- node-cron
- cors

### Step 3: Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/videohub
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/videohub

# Security
JWT_SECRET=change-me-to-random-secret-key
# Generate random: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key-here

# CORS
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email (optional, for future features)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Skip this step, use connection string in MONGODB_URI

### Step 5: Run Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✓ MongoDB connected: localhost:27017
🚀 Playlist sync jobs started
```

### Step 6: Test Backend

Open http://localhost:5000/api/health

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend
```bash
cd ../frontend
# or
cd /path/to/videohub/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=VideoHub
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Run Development Server
```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 14.x
  - Local:        http://localhost:3000
```

### Step 5: Open in Browser

Go to http://localhost:3000

You should see the VideoHub landing page.

---

## ✅ Verification Checklist

### Backend Checklist
- [ ] Node modules installed: `backend/node_modules` exists
- [ ] MongoDB running: `mongosh` connects successfully
- [ ] `.env` file created with all required variables
- [ ] Server starts: `npm run dev` shows no errors
- [ ] Health endpoint works: http://localhost:5000/api/health

### Frontend Checklist
- [ ] Node modules installed: `frontend/node_modules` exists
- [ ] `.env.local` file created
- [ ] Dev server starts: `npm run dev` completes
- [ ] Homepage loads: http://localhost:3000 shows landing page

---

## 🧪 Test the Application

### 1. Create an Account

1. Go to http://localhost:3000/signup
2. Fill in details:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`
3. Click "Sign up"
4. You should be redirected to dashboard

### 2. Add a Test Video

1. Click "Add Videos" button
2. Choose "Single Video"
3. Paste YouTube URL: `https://www.youtube.com/watch?v=xvFZjo5PgG0`
4. Create new folder: `Test Folder`
5. Click "Add"
6. Video should appear in folder

### 3. Add a Playlist

1. Click "Add Videos" button
2. Choose "Playlist"
3. Paste playlist URL: `https://www.youtube.com/playlist?list=PLxxxxx`
4. Click "Add"
5. Playlist videos will sync automatically

### 4. Watch a Video

1. Click on any video
2. Click "▶ Play"
3. Controls should work:
   - Play/Pause
   - Speed control
   - Progress tracking

### 5. Add Notes

1. While watching, click "Add Notes"
2. Write some notes
3. Click "Save"
4. Notes should persist

---

## 📦 Production Build

### Backend Production Build

```bash
cd backend

# Install production dependencies
npm ci --production

# Start with Node
NODE_ENV=production node server.js
```

### Frontend Production Build

```bash
cd frontend

# Build
npm run build

# Start
npm run start
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error**: `connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# Or use MongoDB Atlas connection string
```

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Change PORT in .env
PORT=5001

# Or kill process on port 5000
# macOS/Linux: lsof -ti:5000 | xargs kill -9
# Windows: netstat -ano | findstr :5000
```

### YouTube API Error
**Error**: `API_KEY_INVALID` or `QUOTA_EXCEEDED`

**Solution**:
1. Verify API key in `.env`
2. Check Google Cloud Console
3. Ensure YouTube Data API v3 is enabled
4. Check quota usage

### Module Not Found
**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Next.js Build Error
**Error**: `Build failed`

**Solution**:
```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build
```

---

## 📊 Database Setup (MongoDB)

### Create Initial Database

```javascript
// Open mongosh
mongosh

// Switch to videohub database
use videohub

// Create collections with indexes
db.createCollection("users")
db.createCollection("videos")
db.createCollection("folders")
db.createCollection("notes")
db.createCollection("watchhistories")

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.videos.createIndex({ userId: 1 });
db.videos.createIndex({ folderId: 1 });
db.videos.createIndex({ videoId: 1 });
db.folders.createIndex({ userId: 1 });
db.notes.createIndex({ userId: 1, videoId: 1 });

// Verify
show collections
```

---

## 🚀 Common Tasks

### Update Dependencies
```bash
# Backend
cd backend && npm update

# Frontend
cd frontend && npm update
```

### Clear Database
```bash
# WARNING: This deletes all data!
mongosh
use videohub
db.dropDatabase()
```

### Run Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Format Code
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

---

## 💡 Tips & Best Practices

1. **Keep `.env` files secure** - Never commit to git
2. **Use environment files** - Different configs for dev/prod
3. **Monitor API quota** - YouTube API has usage limits
4. **Regular backups** - Backup MongoDB data
5. **Check logs** - Monitor console for errors
6. **Update packages** - Keep dependencies updated
7. **Test thoroughly** - Before deploying to production

---

## 🆘 Getting Help

If you encounter issues:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review error messages carefully
3. Check console logs in both terminal and browser DevTools
4. Verify all prerequisites are installed
5. Try reinstalling dependencies
6. Check GitHub issues or documentation

---

## ✨ Next Steps

After successful setup:

1. **Explore Features** - Try adding videos, playlists, notes
2. **Customize** - Update colors, folder names, preferences
3. **Read Documentation** - Check API.md for more details
4. **Deploy** - See DEPLOYMENT.md for production setup

---

**Happy Learning! 🎓**
