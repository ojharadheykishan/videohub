const cron = require('node-cron');
const Folder = require('../models/Folder');
const VideoService = require('./VideoService');

/**
 * Start background sync jobs for all user playlists
 */
const startPlaylistSyncJobs = () => {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('🔄 Starting playlist sync job...');
    try {
      const folders = await Folder.find({
        type: 'playlist',
        'autoSync.enabled': true
      });

      for (const folder of folders) {
        try {
          console.log(`📹 Syncing playlist: ${folder.name}`);
          await VideoService.syncPlaylistVideos(
            folder.userId,
            folder._id,
            folder.playlistId
          );
          console.log(`✓ Synced: ${folder.name}`);
        } catch (error) {
          console.error(`✗ Error syncing ${folder.name}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error in playlist sync job:', error);
    }
  });

  console.log('🚀 Playlist sync jobs started');
};

/**
 * Clean up old watch history (keep only last 30 days)
 */
const startCleanupJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('🧹 Starting cleanup job...');
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const WatchHistory = require('../models/WatchHistory');
      
      const result = await WatchHistory.deleteMany({
        watchedAt: { $lt: thirtyDaysAgo }
      });

      console.log(`✓ Cleaned up ${result.deletedCount} old watch history records`);
    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  });

  console.log('🚀 Cleanup job started');
};

module.exports = {
  startPlaylistSyncJobs,
  startCleanupJob
};
