const Video = require('../models/Video');
const Folder = require('../models/Folder');
const YouTubeService = require('./YouTubeService');
const { AppError } = require('../middleware/errorHandler');

class VideoService {
  /**
   * Add single video to a folder
   */
  static async addSingleVideo(userId, folderId, videoUrl) {
    try {
      const videoId = YouTubeService.extractVideoId(videoUrl);
      if (!videoId) {
        throw new AppError('Invalid YouTube video URL', 400);
      }

      // Check if video already exists
      const existingVideo = await Video.findOne({
        userId,
        folderId,
        videoId
      });

      if (existingVideo) {
        return existingVideo;
      }

      // Fetch video details
      const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);
      const videoData = await youtubeService.getVideoDetails(videoId);

      if (!videoData) {
        throw new AppError('Video not found or unavailable', 404);
      }

      // Create video document
      const video = new Video({
        userId,
        folderId,
        videoId,
        title: videoData.title,
        description: videoData.description,
        thumbnail: videoData.thumbnail,
        duration: videoData.duration,
        channelName: videoData.channelName,
        channelId: videoData.channelId,
        publishedAt: videoData.publishedAt,
        platform: videoUrl.includes('shorts') ? 'youtube-short' : 'youtube',
        sourceUrl: videoUrl,
        isAvailable: videoData.isAvailable
      });

      await video.save();

      // Update folder stats
      await Folder.findByIdAndUpdate(folderId, {
        $inc: { videoCount: 1, totalDuration: videoData.duration }
      });

      return video;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add playlist to folder
   */
  static async addPlaylist(userId, playlistUrl, customFolderName = null) {
    try {
      const playlistId = YouTubeService.extractPlaylistId(playlistUrl);
      if (!playlistId) {
        throw new AppError('Invalid YouTube playlist URL', 400);
      }

      const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);
      
      // Get playlist details
      const playlistDetails = await youtubeService.getPlaylistDetails(playlistId);
      if (!playlistDetails) {
        throw new AppError('Playlist not found', 404);
      }

      // Create or update folder
      let folder = await Folder.findOne({
        userId,
        playlistId
      });

      if (!folder) {
        folder = new Folder({
          userId,
          name: customFolderName || playlistDetails.title,
          description: playlistDetails.description,
          playlistId,
          playlistName: playlistDetails.title,
          playlistThumbnail: playlistDetails.thumbnail,
          channelName: playlistDetails.channelName,
          channelId: playlistDetails.channelId,
          type: 'playlist',
          autoSync: { enabled: true, lastSyncedAt: new Date() }
        });
        await folder.save();
      }

      // Fetch and add all videos from playlist
      await this.syncPlaylistVideos(userId, folder._id, playlistId);

      return folder;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync playlist videos
   */
  static async syncPlaylistVideos(userId, folderId, playlistId) {
    try {
      const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);
      let pageToken = null;
      let totalVideos = 0;
      let totalDuration = 0;

      do {
        const { videos, nextPageToken } = await youtubeService.getPlaylistVideos(
          playlistId,
          pageToken
        );

        for (const videoData of videos) {
          // Check if video already exists
          const existingVideo = await Video.findOne({
            userId,
            folderId,
            videoId: videoData.videoId
          });

          if (!existingVideo) {
            // Fetch full video details for duration
            const fullDetails = await youtubeService.getVideoDetails(videoData.videoId);
            
            if (fullDetails) {
              const video = new Video({
                userId,
                folderId,
                videoId: videoData.videoId,
                title: fullDetails.title,
                description: fullDetails.description,
                thumbnail: videoData.thumbnail,
                duration: fullDetails.duration,
                channelName: fullDetails.channelName,
                channelId: fullDetails.channelId,
                publishedAt: videoData.publishedAt,
                platform: 'youtube',
                playlistId,
                positionInPlaylist: videoData.positionInPlaylist,
                sourceUrl: `https://www.youtube.com/watch?v=${videoData.videoId}`,
                isAvailable: fullDetails.isAvailable
              });

              await video.save();
              totalVideos++;
              totalDuration += fullDetails.duration;
            }
          }
        }

        pageToken = nextPageToken;
      } while (pageToken);

      // Update folder
      await Folder.findByIdAndUpdate(folderId, {
        $inc: { videoCount: totalVideos, totalDuration },
        'autoSync.lastSyncedAt': new Date(),
        'autoSync.syncStatus': 'idle'
      });

      return totalVideos;
    } catch (error) {
      // Mark sync as failed
      await Folder.findByIdAndUpdate(folderId, {
        'autoSync.syncStatus': 'error'
      });
      throw error;
    }
  }

  /**
   * Get videos for user with filters
   */
  static async getVideos(userId, filters = {}) {
    const query = { userId };

    if (filters.folderId) query.folderId = filters.folderId;
    if (filters.favorite === true) query.isFavorite = true;
    if (filters.platform) query.platform = filters.platform;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const skip = (filters.page || 0) * (filters.limit || 20);
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(filters.limit || 20)
      .lean();

    const total = await Video.countDocuments(query);

    return { videos, total, page: filters.page || 0, limit: filters.limit || 20 };
  }

  /**
   * Update video watch progress
   */
  static async updateWatchProgress(videoId, completionPercentage) {
    return await Video.findByIdAndUpdate(
      videoId,
      {
        completionPercentage,
        lastWatchedAt: new Date(),
        $cond: {
          if: { $gte: [completionPercentage, 90] },
          then: { $set: { isWatched: true } },
          else: {}
        }
      },
      { new: true }
    );
  }

  /**
   * Toggle favorite
   */
  static async toggleFavorite(videoId) {
    const video = await Video.findById(videoId);
    if (!video) throw new AppError('Video not found', 404);
    
    video.isFavorite = !video.isFavorite;
    await video.save();
    return video;
  }
}

module.exports = VideoService;
