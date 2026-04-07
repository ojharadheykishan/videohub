require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
// Temporarily disabled - need to migrate to Supabase
// const videoRoutes = require('./routes/videos');
// const folderRoutes = require('./routes/folders');
// const notesRoutes = require('./routes/notes');
// const userRoutes = require('./routes/users');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

try {
  const supabase = require('./services/supabaseClient');
  app.set('supabase', supabase);
  console.log('✓ Supabase client configured');
} catch (error) {
  console.error('Supabase initialization error:', error.message);
}

// Routes
app.use('/api/auth', authRoutes);
// Temporarily disabled - need to migrate to Supabase
// app.use('/api/videos', videoRoutes);
// app.use('/api/folders', folderRoutes);
// app.use('/api/notes', notesRoutes);
// app.use('/api/users', authenticate, userRoutes);

// Root route for backend
app.get('/', (req, res) => {
  res.send(
    'VideoHub backend is running. Access the frontend at http://localhost:3000 or check API status at /api/health.'
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
