# VideoHub - Deployment Guide

Deploy VideoHub to production on Heroku, Vercel, or your own server.

---

## 🚀 Deployment Options

### Option 1: Heroku (Backend) + Vercel (Frontend) - **RECOMMENDED**

Easiest option for beginners.

#### Prerequisites
- Heroku account (https://heroku.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://mongodb.com/cloud/atlas) - free
- Git installed

### Backend Deployment to Heroku

#### Step 1: Create MongoDB Atlas Database

1. Go to https://mongodb.com/cloud/atlas
2. Sign up and create a new cluster
3. Choose free tier (M0)
4. Create database user with password
5. Whitelist IP addresses (or 0.0.0.0/0 for allow all)
6. Get connection string: `mongodb+srv://...`

#### Step 2: Create Heroku App

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-videohub-backend

# View created app
heroku apps
```

#### Step 3: Set Environment Variables

```bash
heroku config:set PORT=5000 --app your-videohub-backend
heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/videohub
heroku config:set JWT_SECRET=your-random-secret-key
heroku config:set YOUTUBE_API_KEY=your-youtube-api-key
heroku config:set FRONTEND_URL=https://your-videohub-frontend.vercel.app
heroku config:set CORS_ORIGIN=https://your-videohub-frontend.vercel.app
heroku config:set NODE_ENV=production

# Verify
heroku config --app your-videohub-backend
```

#### Step 4: Deploy

```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Add to git
git add Procfile
git commit -m "Add Procfile for Heroku"

# Deploy
git push heroku main

# View logs
heroku logs --tail --app your-videohub-backend
```

#### Step 5: Test

```bash
# Test health endpoint
curl https://your-videohub-backend.herokuapp.com/api/health
```

---

### Frontend Deployment to Vercel

#### Step 1: Prepare Frontend

```bash
cd frontend

# Update .env.production
NEXT_PUBLIC_API_URL=https://your-videohub-backend.herokuapp.com/api
```

#### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or use GitHub integration:
# 1. Push code to GitHub
# 2. Import project in Vercel dashboard
# 3. Configure environment variables
# 4. Deploy
```

#### Step 3: Set Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_URL`
3. Set value to your Heroku backend URL
4. Redeploy

---

## 🐳 Option 2: Docker + Docker Compose

Deploy using Docker containers.

### Create Dockerfiles

**backend/Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

**frontend/Dockerfile**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: videohub

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    environment:
      PORT: 5000
      MONGODB_URI: mongodb://mongo:27017/videohub
      FRONTEND_URL: http://localhost:3000
      CORS_ORIGIN: http://localhost:3000
      JWT_SECRET: your-secret
      YOUTUBE_API_KEY: your-api-key
    command: npm run dev

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    command: npm run dev

volumes:
  mongo-data:
```

### Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## ☁️ Option 3: AWS (EC2 + RDS)

More advanced option.

### Prerequisites
- AWS account
- AWS CLI configured

### Create EC2 Instance

1. Go to AWS Console → EC2
2. Launch Ubuntu 22.04 LTS instance (t2.micro for free tier)
3. Create security group with ports 22, 5000, 3000 open
4. Create and download key pair (.pem file)

### Connect & Setup

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Git
sudo apt install git -y

# Clone repository
git clone https://github.com/your-username/videohub.git
cd videohub
```

### Create RDS Database

1. Go to AWS Console → RDS
2. Create MongoDB Atlas instance (or switch to MongoDB Atlas)
3. Get connection string

### Deploy Backend

```bash
cd backend

# Install dependencies
npm install --production

# Create .env
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret
YOUTUBE_API_KEY=your-api-key
CORS_ORIGIN=https://your-domain.com
EOF

# Start with PM2 (for process management)
sudo npm install -g pm2
pm2 start server.js --name "videohub-backend"
pm2 startup
pm2 save

# Check status
pm2 status
```

### Deploy Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "videohub-frontend" -- start
```

### Setup Nginx Reverse Proxy

```bash
sudo apt install nginx -y

# Create config
sudo tee /etc/nginx/sites-available/videohub > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}
EOF

# Enable config
sudo ln -s /etc/nginx/sites-available/videohub /etc/nginx/sites-enabled/

# Test
sudo nginx -t

# Start
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🔒 SSL Certificate (Let's Encrypt)

Add HTTPS to your domain.

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (automatic)
sudo systemctl enable certbot.timer
```

---

## 📊 Monitoring & Logging

### Heroku Monitoring

```bash
# View logs
heroku logs --tail --app your-app

# View metrics
heroku metrics --app your-app

# Monitor performance
heroku status
```

### MongoDB Atlas Monitoring

Dashboard available at: https://cloud.mongodb.com
- Monitor query performance
- Check database metrics
- Set up alerts

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.13
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: your-videohub-backend
          heroku_email: your-email@example.com
```

---

## 🚨 Post-Deployment Checklist

- [ ] Health endpoint returns 200
- [ ] Can register user
- [ ] Can login
- [ ] Can add video/playlist
- [ ] Can watch video
- [ ] Can save notes
- [ ] Database backups enabled
- [ ] SSL certificate installed
- [ ] Environment variables set correctly
- [ ] Logs configured and monitoring
- [ ] Uptime monitoring enabled
- [ ] Error tracking enabled (Sentry)

---

## 📈 Performance Optimization

### Frontend Optimization

```bash
cd frontend

# Build analysis
npm install --save-dev @next/bundle-analyzer

# Check bundle size
npm run analyze
```

### Backend Optimization

```javascript
// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// Enable compression
const compression = require('compression');
app.use(compression());
```

---

## 🔄 Database Backup

### MongoDB Atlas Automated Backups

1. Go to MongoDB Atlas Dashboard
2. Cluster → Backup
3. Enable Automatic Backups
4. Configure retention policy

### Manual Backup

```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=./backup

# Import database
mongorestore --uri="mongodb+srv://..." ./backup
```

---

## 💰 Cost Estimates

**Free Tier:**
- Heroku: Free tier removed (use GitHub Actions + Railway)
- MongoDB Atlas: 512MB free
- Vercel: Free tier
- **Total: $0/month**

**Production:**
- Heroku Dyno: $7-50/month
- MongoDB Atlas: $10-100/month
- Vercel Pro: $20/month
- **Total: $37-170/month**

---

## 🆘 Deployment Troubleshooting

### Port Issues
- Heroku assigns PORT via environment variable
- Ensure `process.env.PORT` is used

### Database Connection
- Whitelist IP addresses in MongoDB Atlas
- Use connection string with credentials

### Build Failures
- Check logs: `heroku logs --tail`
- Ensure all dependencies installed
- Check Node version compatibility

### CORS Errors
- Update CORS_ORIGIN to match frontend URL
- Restart backend after env changes

---

## 📚 Additional Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Good luck with your deployment! 🚀**
