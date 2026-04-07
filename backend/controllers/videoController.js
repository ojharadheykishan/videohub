const Video = require('../models/Video');
const Folder = require('../models/Folder');
const WatchHistory = require('../models/WatchHistory');
const VideoService = require('../services/VideoService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Add single video
 */
const addSingleVideo = async (req, res, next) => {
  try {
    const { videoUrl, folderId } = req.body;

    if (!videoUrl || !folderId) {
      throw new AppError('Video URL and folder ID are required', 400);
    }

    // Verify folder belongs to user
    const folder = await Folder.findOne({
      _id: folderId,
      userId: req.user.id
    });

    if (!folder) {
      throw new AppError('Folder not found', 404);
    }

    const video = await VideoService.addSingleVideo(
      req.user.id,
      folderId,
      videoUrl
    );

    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add playlist
 */
const addPlaylist = async (req, res, next) => {
  try {
    const { playlistUrl, customFolderName } = req.body;

    if (!playlistUrl) {
      throw new AppError('Playlist URL is required', 400);
    }

    res.status(202).json({
      success: true,
      message: 'Playlist sync started. This may take a few minutes.',
      status: 'syncing'
    });

    // Run sync in background
    setTimeout(async () => {
      try {
        await VideoService.addPlaylist(req.user.id, playlistUrl, customFolderName);
        console.log('✓ Playlist sync completed');
      } catch (error) {
        console.error('✗ Playlist sync failed:', error);
      }
    }, 0);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all videos with filters
 */
const getVideos = async (req, res, next) => {
  try {
    const { folderId, favorite, platform, search, page = 0, limit = 20 } = req.query;

    const filters = {
      folderId: folderId || null,
      favorite: favorite === 'true',
      platform: platform || null,
      search: search || null,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const { videos, total } = await VideoService.getVideos(req.user.id, filters);

    res.json({
      success: true,
      videos,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single video
 */
const getVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({
      _id: id,
      userId: req.user.id
    }).populate('folderId', 'name');

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update watch progress
 */
const updateWatchProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completionPercentage, duration } = req.body;

    const video = await Video.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    // Update video
    video.completionPercentage = completionPercentage;
    video.lastWatchedAt = new Date();
    if (duration) {
      video.watchTime = duration;
    }
    await video.save();

    // Log in watch history
    await WatchHistory.create({
      userId: req.user.id,
      videoId: id,
      completionPercentage,
      duration,
      isCompleted: completionPercentage >= 90
    });

    res.json({
      success: true,
      message: 'Progress updated',
      video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle favorite
 */
const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    video.isFavorite = !video.isFavorite;
    await video.save();

    res.json({
      success: true,
      message: video.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete video
 */
const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await Video.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    // Update folder stats
    await Folder.findByIdAndUpdate(video.folderId, {
      $inc: { videoCount: -1, totalDuration: -video.duration }
    });

    res.json({
      success: true,
      message: 'Video deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get watch history
 */
const getWatchHistory = async (req, res, next) => {
  try {
    const { limit = 20, page = 0 } = req.query;

    const history = await WatchHistory.find({ userId: req.user.id })
      .populate('videoId', 'title thumbnail')
      .sort({ watchedAt: -1 })
      .skip(page * limit)
      .limit(parseInt(limit));

    const total = await WatchHistory.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      history,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSingleVideo,
  addPlaylist,
  getVideos,
  getVideo,
  updateWatchProgress,
  toggleFavorite,
  deleteVideo,
  getWatchHistory
};
