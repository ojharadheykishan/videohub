const User = require('../models/User');
const Video = require('../models/Video');
const Folder = require('../models/Folder');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar, theme } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(username && { username }),
          ...(avatar && { avatar }),
          ...(theme && { theme })
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile updated',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user dashboard stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get counts
    const totalFolders = await Folder.countDocuments({ userId });
    const totalVideos = await Video.countDocuments({ userId });
    const favoriteVideos = await Video.countDocuments({ userId, isFavorite: true });
    
    // Get total duration
    const videos = await Video.find({ userId });
    const totalDuration = videos.reduce((sum, v) => sum + (v.duration || 0), 0);
    const watchedDuration = videos.reduce((sum, v) => sum + (v.completionPercentage >= 90 ? v.duration : 0), 0);

    // Get user stats
    const user = await User.findById(userId);

    res.json({
      success: true,
      stats: {
        totalFolders,
        totalVideos,
        favoriteVideos,
        totalDuration,
        watchedDuration,
        watchedVideos: videos.filter(v => v.completionPercentage >= 90).length,
        avgWatchTime: totalVideos > 0 ? Math.round(watchedDuration / totalVideos) : 0
      },
      userStats: user.stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update preferences
 */
const updatePreferences = async (req, res, next) => {
  try {
    const { autoplayNext, playbackSpeed, defaultPlaylist } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'preferences.autoplayNext': autoplayNext !== undefined ? autoplayNext : true,
          'preferences.playbackSpeed': playbackSpeed || 1,
          'preferences.defaultPlaylist': defaultPlaylist || null
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated',
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  updatePreferences
};
