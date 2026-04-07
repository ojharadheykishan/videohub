# VideoHub API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses are JSON:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGc...",
  "user": {...}
}
```

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "user": {...}
}
```

---

## Video Endpoints

### Add Single Video
**POST** `/videos/add-single`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "folderId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

Response:
```json
{
  "success": true,
  "message": "Video added successfully",
  "video": {
    "_id": "...",
    "videoId": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "thumbnail": "https://i.ytimg.com/...",
    "duration": 212,
    "channelName": "Rick Astley"
  }
}
```

### Add Playlist
**POST** `/videos/add-playlist`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "playlistUrl": "https://www.youtube.com/playlist?list=PLxxxxx",
  "customFolderName": "My Course"
}
```

Response:
```json
{
  "success": true,
  "message": "Playlist sync started. This may take a few minutes."
}
```

### Get Videos
**GET** `/videos?folderId=...&favorite=false&platform=youtube&search=...&page=0&limit=20`

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `folderId` (optional) - Filter by folder
- `favorite` (optional) - true/false
- `platform` (optional) - youtube, instagram, etc
- `search` (optional) - Search in title/description
- `page` (optional) - Page number (default: 0)
- `limit` (optional) - Items per page (default: 20)

Response:
```json
{
  "success": true,
  "videos": [...],
  "pagination": {
    "total": 50,
    "page": 0,
    "limit": 20,
    "totalPages": 3
  }
}
```

### Get Single Video
**GET** `/videos/:id`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "video": {...}
}
```

### Update Watch Progress
**PUT** `/videos/:id/progress`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "completionPercentage": 45,
  "duration": 600
}
```

### Toggle Favorite
**PUT** `/videos/:id/favorite`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "message": "Added to favorites",
  "video": {...}
}
```

### Delete Video
**DELETE** `/videos/:id`

Headers: `Authorization: Bearer <token>`

---

## Folder Endpoints

### Get All Folders
**GET** `/folders?archived=false`

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `archived` (optional) - true/false

Response:
```json
{
  "success": true,
  "folders": [
    {
      "_id": "...",
      "name": "Web Development",
      "icon": "💻",
      "color": "#3b82f6",
      "videoCount": 15,
      "type": "custom",
      "isArchived": false
    }
  ]
}
```

### Create Folder
**POST** `/folders`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "name": "Python Basics",
  "description": "Learn Python fundamentals",
  "icon": "🐍",
  "color": "#8b5cf6"
}
```

### Get Folder with Videos
**GET** `/folders/:id`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "folder": {...},
  "videos": [...],
  "videoCount": 10
}
```

### Update Folder
**PUT** `/folders/:id`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "name": "Updated Name",
  "description": "New description",
  "icon": "📚",
  "autoSync": true
}
```

### Delete Folder
**DELETE** `/folders/:id?deleteVideos=false`

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `deleteVideos` (optional) - true/false

### Archive Folder
**PUT** `/folders/:id/archive`

Headers: `Authorization: Bearer <token>`

### Move Video to Folder
**PUT** `/folders/video/move`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "videoId": "...",
  "targetFolderId": "..."
}
```

---

## Notes Endpoints

### Get Notes for Video
**GET** `/notes/:videoId`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "note": {
    "_id": "...",
    "title": "My Notes",
    "content": "...",
    "timestamps": [...],
    "highlights": [...]
  }
}
```

### Save Notes
**POST** `/notes/:videoId`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "title": "My Learning Notes",
  "content": "Key concepts learned...",
  "tags": ["important", "javascript"],
  "timestamps": [
    {
      "time": 120,
      "text": "Important concept explained"
    }
  ]
}
```

### Add Timestamp
**POST** `/notes/:videoId/timestamp`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "time": 120,
  "text": "Remember this part",
  "color": "#fbbf24"
}
```

### Add Highlight
**POST** `/notes/:videoId/highlight`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "startTime": 100,
  "endTime": 150,
  "text": "Key moment",
  "color": "#fbbf24"
}
```

### Get All Notes
**GET** `/notes/all?folderId=...`

Headers: `Authorization: Bearer <token>`

### Delete Note
**DELETE** `/notes/:videoId`

Headers: `Authorization: Bearer <token>`

---

## User Endpoints

### Get Profile
**GET** `/users/profile`

Headers: `Authorization: Bearer <token>`

### Update Profile
**PUT** `/users/profile`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "username": "newusername",
  "avatar": "https://...",
  "theme": "dark"
}
```

### Get Dashboard Stats
**GET** `/users/dashboard`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "stats": {
    "totalFolders": 5,
    "totalVideos": 45,
    "favoriteVideos": 8,
    "totalDuration": 36000,
    "watchedDuration": 18000,
    "watchedVideos": 15,
    "avgWatchTime": 1200
  }
}
```

### Update Preferences
**PUT** `/users/preferences`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "autoplayNext": true,
  "playbackSpeed": 1.5,
  "defaultPlaylist": "folderId"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "status": 400,
  "message": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "status": 404,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "status": 500,
  "message": "Internal server error"
}
```

---

## Rate Limiting

API calls are limited to prevent abuse:
- 1000 requests per hour per user
- YouTube API subject to its own quotas

---

## Example Requests

### Get Watch History
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/videos/history/all
```

### Search Videos
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/videos?search=javascript&favorite=true"
```

### Create Custom Folder
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript","icon":"📜","color":"#f7df1e"}' \
  http://localhost:5000/api/folders
```

---

## Webhooks (Future)

Planned webhook events:
- `video.added` - When new video is added
- `playlist.synced` - When playlist is synced
- `note.created` - When note is created
