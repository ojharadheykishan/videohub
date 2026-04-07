const Folder = require('../models/Folder');
const Video = require('../models/Video');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all folders
 */
const getFolders = async (req, res, next) => {
  try {
    const { archived = false } = req.query;

    const folders = await Folder.find({
      userId: req.user.id,
      isArchived: archived === 'true'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      folders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create folder
 */
const createFolder = async (req, res, next) => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name) {
      throw new AppError('Folder name is required', 400);
    }

    const folder = new Folder({
      userId: req.user.id,
      name,
      description: description || '',
      icon: icon || '📁',
      color: color || '#3b82f6',
      type: 'custom'
    });

    await folder.save();

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      folder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single folder with videos
 */
const getFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!folder) {
      throw new AppError('Folder not found', 404);
    }

    // Get videos in folder
    const videos = await Video.find({
      folderId: id,
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      folder,
      videos,
      videoCount: videos.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update folder
 */
const updateFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, color, autoSync } = req.body;

    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $set: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(icon && { icon }),
          ...(color && { color }),
          ...(autoSync !== undefined && { 'autoSync.enabled': autoSync })
        }
      },
      { new: true }
    );

    if (!folder) {
      throw new AppError('Folder not found', 404);
    }

    res.json({
      success: true,
      message: 'Folder updated',
      folder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete folder
 */
const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deleteVideos = false } = req.query;

    const folder = await Folder.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!folder) {
      throw new AppError('Folder not found', 404);
    }

    if (deleteVideos === 'true') {
      // Delete all videos in folder
      await Video.deleteMany({
        folderId: id,
        userId: req.user.id
      });
    }

    // Delete folder
    await Folder.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Folder deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Archive/Unarchive folder
 */
const toggleArchiveFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!folder) {
      throw new AppError('Folder not found', 404);
    }

    folder.isArchived = !folder.isArchived;
    await folder.save();

    res.json({
      success: true,
      message: folder.isArchived ? 'Folder archived' : 'Folder unarchived',
      folder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Move video to different folder
 */
const moveVideo = async (req, res, next) => {
  try {
    const { videoId, targetFolderId } = req.body;

    const video = await Video.findOne({
      _id: videoId,
      userId: req.user.id
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    // Verify target folder exists
    const targetFolder = await Folder.findOne({
      _id: targetFolderId,
      userId: req.user.id
    });

    if (!targetFolder) {
      throw new AppError('Target folder not found', 404);
    }

    // Update video folder
    const oldFolderId = video.folderId;
    video.folderId = targetFolderId;
    await video.save();

    // Update folder stats
    await Folder.findByIdAndUpdate(oldFolderId, {
      $inc: { videoCount: -1, totalDuration: -video.duration }
    });

    await Folder.findByIdAndUpdate(targetFolderId, {
      $inc: { videoCount: 1, totalDuration: video.duration }
    });

    res.json({
      success: true,
      message: 'Video moved successfully',
      video
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFolders,
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  toggleArchiveFolder,
  moveVideo
};
