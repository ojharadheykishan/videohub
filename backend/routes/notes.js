const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getNotesForVideo,
  saveNotes,
  addTimestamp,
  addHighlight,
  deleteNote,
  getAllNotes
} = require('../controllers/notesController');

/**
 * GET /api/notes/all
 * Get all notes
 */
router.get('/all', authenticate, getAllNotes);

/**
 * GET /api/notes/:videoId
 * Get notes for specific video
 */
router.get('/:videoId', authenticate, getNotesForVideo);

/**
 * POST /api/notes/:videoId
 * Create or update notes
 */
router.post('/:videoId', authenticate, saveNotes);

/**
 * POST /api/notes/:videoId/timestamp
 * Add timestamp
 */
router.post('/:videoId/timestamp', authenticate, addTimestamp);

/**
 * POST /api/notes/:videoId/highlight
 * Add highlight
 */
router.post('/:videoId/highlight', authenticate, addHighlight);

/**
 * DELETE /api/notes/:videoId
 * Delete note
 */
router.delete('/:videoId', authenticate, deleteNote);

module.exports = router;
