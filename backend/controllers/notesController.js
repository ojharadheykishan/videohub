const Note = require('../models/Note');
const Video = require('../models/Video');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get notes for a video
 */
const getNotesForVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const note = await Note.findOne({
      userId: req.user.id,
      videoId
    });

    res.json({
      success: true,
      note: note || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update notes for a video
 */
const saveNotes = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { title, content, tags, blocks, timestamps, highlights } = req.body;

    // Verify video exists
    const video = await Video.findOne({
      _id: videoId,
      userId: req.user.id
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    let note = await Note.findOne({
      userId: req.user.id,
      videoId
    });

    if (!note) {
      note = new Note({
        userId: req.user.id,
        videoId,
        folderId: video.folderId,
        title: title || null,
        content: content || '',
        tags: tags || [],
        blocks: blocks || [],
        timestamps: timestamps || [],
        highlights: highlights || []
      });
    } else {
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      if (tags !== undefined) note.tags = tags;
      if (blocks !== undefined) note.blocks = blocks;
      if (timestamps !== undefined) note.timestamps = timestamps;
      if (highlights !== undefined) note.highlights = highlights;
    }

    await note.save();

    res.json({
      success: true,
      message: 'Notes saved',
      note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add timestamp to notes
 */
const addTimestamp = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { time, text, color } = req.body;

    let note = await Note.findOne({
      userId: req.user.id,
      videoId
    });

    if (!note) {
      const video = await Video.findOne({
        _id: videoId,
        userId: req.user.id
      });

      if (!video) {
        throw new AppError('Video not found', 404);
      }

      note = new Note({
        userId: req.user.id,
        videoId,
        folderId: video.folderId
      });
    }

    note.timestamps.push({
      time,
      text,
      color: color || '#fbbf24'
    });

    await note.save();

    res.json({
      success: true,
      message: 'Timestamp added',
      note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add highlight to notes
 */
const addHighlight = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { startTime, endTime, text, color } = req.body;

    let note = await Note.findOne({
      userId: req.user.id,
      videoId
    });

    if (!note) {
      const video = await Video.findOne({
        _id: videoId,
        userId: req.user.id
      });

      if (!video) {
        throw new AppError('Video not found', 404);
      }

      note = new Note({
        userId: req.user.id,
        videoId,
        folderId: video.folderId
      });
    }

    note.highlights.push({
      startTime,
      endTime,
      text,
      color: color || '#fbbf24'
    });

    await note.save();

    res.json({
      success: true,
      message: 'Highlight added',
      note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete note
 */
const deleteNote = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const note = await Note.findOneAndDelete({
      userId: req.user.id,
      videoId
    });

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    res.json({
      success: true,
      message: 'Note deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all notes
 */
const getAllNotes = async (req, res, next) => {
  try {
    const { folderId } = req.query;

    const query = { userId: req.user.id };
    if (folderId) query.folderId = folderId;

    const notes = await Note.find(query)
      .populate('videoId', 'title thumbnail')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      notes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotesForVideo,
  saveNotes,
  addTimestamp,
  addHighlight,
  deleteNote,
  getAllNotes
};
