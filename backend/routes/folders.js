const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getFolders,
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  toggleArchiveFolder,
  moveVideo
} = require('../controllers/folderController');

/**
 * GET /api/folders
 * Get all folders
 */
router.get('/', authenticate, getFolders);

/**
 * POST /api/folders
 * Create new folder
 */
router.post('/', authenticate, createFolder);

/**
 * GET /api/folders/:id
 * Get folder with videos
 */
router.get('/:id', authenticate, getFolder);

/**
 * PUT /api/folders/:id
 * Update folder
 */
router.put('/:id', authenticate, updateFolder);

/**
 * DELETE /api/folders/:id
 * Delete folder
 */
router.delete('/:id', authenticate, deleteFolder);

/**
 * PUT /api/folders/:id/archive
 * Archive/Unarchive folder
 */
router.put('/:id/archive', authenticate, toggleArchiveFolder);

/**
 * PUT /api/folders/video/move
 * Move video to different folder
 */
router.put('/video/move', authenticate, moveVideo);

module.exports = router;
