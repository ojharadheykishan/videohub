const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  addSingleVideo,
  addPlaylist,
  getVideos,
  getVideo,
  updateWatchProgress,
  toggleFavorite,
  deleteVideo,
  getWatchHistory
} = require('../controllers/videoController');

/**
 * POST /api/videos/add-single
 * Add single video to folder
 */
router.post('/add-single', authenticate, addSingleVideo);

/**
 * POST /api/videos/add-playlist
 * Add playlist to new folder
 */
router.post('/add-playlist', authenticate, addPlaylist);

/**
 * GET /api/videos
 * Get all videos with filters
 */
router.get('/', authenticate, getVideos);

/**
 * GET /api/videos/:id
 * Get single video
 */
router.get('/:id', authenticate, getVideo);

/**
 * PUT /api/videos/:id/progress
 * Update watch progress
 */
router.put('/:id/progress', authenticate, updateWatchProgress);

/**
 * PUT /api/videos/:id/favorite
 * Toggle favorite
 */
router.put('/:id/favorite', authenticate, toggleFavorite);

/**
 * DELETE /api/videos/:id
 * Delete video
 */
router.delete('/:id', authenticate, deleteVideo);

/**
 * GET /api/videos/history/all
 * Get watch history
 */
router.get('/history/all', authenticate, getWatchHistory);

module.exports = router;
