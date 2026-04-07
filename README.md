# 📹 VideoHub - Personal Video Learning Platform

A modern, fully-responsive full-stack web application for organizing, learning from, and managing YouTube videos with a clean, distraction-free study UI.

![VideoHub](https://img.shields.io/badge/VideoHub-2026-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MongoDB](https://img.shields.io/badge/MongoDB-5+-green)

## 🎯 Features

✨ **Video Management**
- Import single YouTube videos or entire playlists
- Auto-sync to detect new videos automatically
- Organize videos into courses/folders
- Prevent duplicate videos using unique IDs

📝 **Learning Tools**
- Rich text notes with timestamps
- Highlight key moments in videos
- Tag and bookmark important videos
- Auto-save notes while editing

📊 **Progress Tracking**
- Watch history tracking
- Completion percentage per video
- Dashboard with learning stats
- Resume from last watched position

🎥 **Video Player**
- Embedded YouTube player with custom controls
- Playback speed control (0.5x to 2x)
- Progress bar and duration tracking
- Full-screen mode

🎨 **Modern UI**
- YouTube + Notion hybrid design
- Clean, distraction-free interface
- Dark/Light mode support
- Responsive on all devices
- Smooth animations and transitions

🔐 **User System**
- Secure signup/login with JWT
- Password hashing with bcrypt
- User preferences and settings
- Profile customization

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI components
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Hook Form** - Form handling
- **React Player** - Video playback
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **node-cron** - Background jobs
- **Axios** - HTTP client

### APIs
- **YouTube Data API v3** - Video metadata and playlists

---

## 📂 Project Structure

```
videohub/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Route handlers
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Auth, error handling
│   ├── jobs/              # Background tasks
│   ├── config/            # Database config
│   ├── server.js          # App entry point
│   └── package.json
│
├── frontend/              # Next.js React app
│   ├── app/              # App directory
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── styles/           # CSS files
│   ├── utils/            # Helpers & stores
│   ├── public/           # Static assets
│   └── package.json
│
└── docs/
    ├── README.md         # Main documentation
    ├── SETUP.md          # Installation guide
    ├── API.md            # API reference
    └── DEPLOYMENT.md     # Deployment guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- YouTube Data API key

### 1. Backend Setup

```bash
cd backend
npm install

# Configure .env
cp .env.example .env
# Edit .env with your credentials

# Start MongoDB
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install

# Configure .env.local
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Try It Out

1. Go to http://localhost:3000
2. Sign up for an account
3. Add a YouTube video: `https://www.youtube.com/watch?v=xvFZjo5PgG0`
4. Watch the video and take notes
5. Explore the dashboard

---

## 📖 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation instructions
- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Main Docs](./docs/README.md)** - Architecture and features

---

## 🎨 Key Pages

| Page | Description |
|------|-------------|
| `/` | Landing page |
| `/signup` | Create account |
| `/login` | Login page |
| `/dashboard` | Main dashboard with folders |
| `/library/:id` | Folder/course view |
| `/watch/:id` | Video player with notes |

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Videos
- `POST /api/videos/add-single` - Add video
- `POST /api/videos/add-playlist` - Add playlist
- `GET /api/videos` - Get all videos
- `PUT /api/videos/:id/favorite` - Toggle favorite
- `PUT /api/videos/:id/progress` - Update progress

### Folders
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create folder
- `GET /api/folders/:id` - Get folder contents
- `DELETE /api/folders/:id` - Delete folder

### Notes
- `GET /api/notes/:videoId` - Get notes
- `POST /api/notes/:videoId` - Save notes
- `POST /api/notes/:videoId/timestamp` - Add timestamp

See [API.md](./docs/API.md) for complete documentation.

---

## 🔄 Background Jobs

**Playlist Sync** (Every 6 hours)
- Detects new videos in playlists
- Updates video list automatically
- Marks deleted videos as unavailable

**Cleanup Job** (Daily at 2 AM)
- Removes old watch history (>30 days)
- Optimizes database

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS enabled
- Input validation
- Error handling

---

## 💻 Development

### Start Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

---

## 🚢 Deployment

Ready for production deployment on:
- **Heroku** + **Vercel** (Recommended)
- **Docker** + **Docker Compose**
- **AWS** EC2 + RDS
- **DigitalOcean**, **Railway**, **Render**

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🆘 Support & Issues

- 📚 Check [documentation](./docs/)
- 🐛 Report bugs on GitHub Issues
- 💬 Discuss in GitHub Discussions

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

---

## 🌟 Features Roadmap

- [ ] Multi-platform support (Instagram Reels, TikTok, Pinterest)
- [ ] Advanced search and filters
- [ ] Video recommendations
- [ ] Social sharing
- [ ] Collaborative playlists
- [ ] Mobile app (React Native)
- [ ] Webhook integrations
- [ ] Advanced analytics

---

## ✨ What's Included

✅ Complete backend with all APIs
✅ Full-featured React frontend
✅ User authentication system
✅ Video management
✅ Note-taking system
✅ Progress tracking
✅ Dashboard and statistics
✅ Auto-sync playlists
✅ Production-ready code
✅ Comprehensive documentation
✅ Deployment guides

---

**Built with ❤️ for learners everywhere**

Start learning smarter with VideoHub! 🎓