# VideoHub - Personal Video Learning Platform

A modern, fully-featured platform combining YouTube's video experience with Notion-style note-taking and course organization.

## 🎯 Overview

VideoHub lets you:
- 📹 Import YouTube videos and playlists
- 🔄 Auto-sync playlists for new videos
- 📁 Organize videos into courses/folders
- 📝 Take rich notes with timestamps
- 📊 Track learning progress
- ⭐ Favorite and bookmark important videos
- 🎓 Build your personal knowledge base

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, TailwindCSS, Zustand
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: YouTube Data API v3
- **Authentication**: JWT tokens

### Folder Structure

```
videohub/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Route handlers
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (YouTube, Video services)
│   ├── middleware/      # Auth, error handling
│   ├── jobs/            # Background sync jobs
│   ├── config/          # Database config
│   ├── server.js        # Express app
│   └── package.json
│
├── frontend/
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global CSS
│   ├── utils/           # Helpers, API client, stores
│   └── package.json
│
└── docs/
    ├── SETUP.md         # Installation guide
    ├── API.md           # API documentation
    └── DEPLOYMENT.md    # Deployment guide

```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- YouTube Data API key

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/videohub
JWT_SECRET=your-super-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
FRONTEND_URL=http://localhost:3000
```

3. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

4. **Run Backend**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Run Frontend**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📚 API Documentation

See [API.md](./API.md) for complete API documentation.

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos/add-single` - Add single video
- `POST /api/videos/add-playlist` - Add playlist
- `PUT /api/videos/:id/progress` - Update watch progress
- `PUT /api/videos/:id/favorite` - Toggle favorite

#### Folders
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create folder
- `GET /api/folders/:id` - Get folder with videos
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

#### Notes
- `GET /api/notes/:videoId` - Get notes for video
- `POST /api/notes/:videoId` - Save notes
- `POST /api/notes/:videoId/timestamp` - Add timestamp

## 🎨 Features

### 1. Video Import
- Paste single YouTube video link
- Paste YouTube playlist link
- Auto-fetch all playlist videos
- Store video metadata (title, thumbnail, duration, channel)

### 2. Auto-Sync System
- Background job runs every 6 hours
- Detects new videos in playlists
- Prevents duplicates using video IDs
- Marks videos as unavailable if deleted

### 3. Folder/Course Organization
- Create custom folders
- Playlists auto-create folders
- Move videos between folders
- Organize by subject/topic

### 4. Video Player
- YouTube embedded player
- Custom controls (play, pause, speed)
- Progress tracking
- Resume where you left off

### 5. Notes System
- Rich text notes
- Timestamps with text
- Highlight key moments
- Auto-save on edit

### 6. Dashboard & Stats
- Total videos and folders
- Watch time tracking
- Completion percentage
- Favorite videos

### 7. Authentication
- User signup/login
- JWT token-based auth
- Secure password hashing (bcrypt)
- Protected routes

## 🔄 Background Jobs

### Playlist Sync Job
```
Runs: Every 6 hours
Action: Syncs all user playlists
Updates: New videos, removed videos marked unavailable
```

### Cleanup Job
```
Runs: Daily at 2 AM
Action: Removes old watch history (>30 days)
```

## 🔐 Security

- JWT authentication for API
- Password hashing with bcrypt
- Protected API routes
- CORS enabled
- Input validation

## 📊 Database Schema

### User
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  theme: 'light' | 'dark',
  preferences: {
    autoplayNext: Boolean,
    playbackSpeed: Number
  },
  stats: {
    totalVideos: Number,
    totalCourses: Number,
    watchTime: Number
  }
}
```

### Video
```javascript
{
  userId: ObjectId,
  folderId: ObjectId,
  videoId: String,
  title: String,
  thumbnail: String,
  duration: Number,
  channelName: String,
  platform: 'youtube' | 'youtube-short' | 'instagram' | 'pinterest',
  isAvailable: Boolean,
  isFavorite: Boolean,
  completionPercentage: Number,
  lastWatchedAt: Date
}
```

### Folder
```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  icon: String,
  color: String,
  type: 'custom' | 'playlist',
  playlistId: String (if playlist),
  autoSync: {
    enabled: Boolean,
    lastSyncedAt: Date,
    syncStatus: 'idle' | 'syncing' | 'error'
  },
  videoCount: Number,
  totalDuration: Number
}
```

### Note
```javascript
{
  userId: ObjectId,
  videoId: ObjectId,
  title: String,
  content: String,
  timestamps: [{ time: Number, text: String }],
  blocks: [],
  highlights: []
}
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

**Quick Deploy (Heroku + MongoDB Atlas)**
```bash
# Backend
git push heroku main

# Frontend
vercel deploy
```

## 🛠️ Development

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Run Development Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Build for Production
```bash
# Backend
npm run build

# Frontend
npm run build
```

## 📖 Component Structure

### Frontend Components

- **Header** - Navigation and search
- **Sidebar** - Folder navigation
- **VideoCard** - Video thumbnail and info
- **VideoPlayer** - YouTube player with controls
- **NotesEditor** - Rich text notes editor
- **AddVideoModal** - Modal for adding videos
- **Providers** - Context/store providers

### Frontend Pages

- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Main dashboard
- `/dashboard/library/[id]` - Folder/course view
- `/dashboard/watch/[id]` - Video player page

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/videohub
JWT_SECRET=your-secret-key
YOUTUBE_API_KEY=your-api-key
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=VideoHub
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### YouTube API Errors
- Verify API key in `.env`
- Check YouTube API quota
- Ensure Playlist ID is valid

### CORS Errors
- Add frontend URL to CORS_ORIGIN in backend `.env`
- Check `Access-Control-Allow-Origin` headers

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

## 📚 Resources

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

## 📄 License

MIT

## 🙋 Support

For issues and questions, please open an GitHub issue or contact support.

---

**Happy Learning! 🎓**
