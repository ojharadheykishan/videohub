const axios = require('axios');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

class YouTubeService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: YOUTUBE_API_BASE,
      params: { key: apiKey }
    });
  }

  /**
   * Extract video ID from YouTube URL
   */
  static extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^?&\n]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Extract playlist ID from YouTube URL
   */
  static extractPlaylistId(url) {
    const pattern = /[?&]list=([^&\n]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  }

  /**
   * Get single video details
   */
  async getVideoDetails(videoId) {
    try {
      const response = await this.client.get('/videos', {
        params: {
          id: videoId,
          part: 'snippet,contentDetails,statistics,status',
          fields: 'items(id,snippet(title,description,thumbnails,channelTitle,channelId,publishedAt),contentDetails(duration),statistics,status)'
        }
      });

      if (response.data.items.length === 0) {
        return null;
      }

      const video = response.data.items[0];
      return this.formatVideoData(video);
    } catch (error) {
      console.error('Error fetching video details:', error.message);
      throw new Error('Failed to fetch video details');
    }
  }

  /**
   * Get all videos from a playlist
   */
  async getPlaylistVideos(playlistId, pageToken = null) {
    try {
      const response = await this.client.get('/playlistItems', {
        params: {
          playlistId,
          part: 'snippet,contentDetails',
          maxResults: 50,
          pageToken,
          fields: 'items(snippet(resourceId(videoId),title,description,thumbnails,channelTitle,publishedAt),contentDetails(videoId)),nextPageToken'
        }
      });

      const videos = response.data.items.map((item, index) => ({
        videoId: item.contentDetails.videoId || item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        channelName: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt),
        positionInPlaylist: index,
        playlistId
      }));

      return {
        videos,
        nextPageToken: response.data.nextPageToken
      };
    } catch (error) {
      console.error('Error fetching playlist videos:', error.message);
      throw new Error('Failed to fetch playlist videos');
    }
  }

  /**
   * Get playlist details
   */
  async getPlaylistDetails(playlistId) {
    try {
      const response = await this.client.get('/playlists', {
        params: {
          id: playlistId,
          part: 'snippet,contentDetails',
          fields: 'items(id,snippet(title,description,thumbnails,channelTitle,channelId),contentDetails(itemCount))'
        }
      });

      if (response.data.items.length === 0) {
        return null;
      }

      const playlist = response.data.items[0];
      return {
        playlistId,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnail: playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default.url,
        channelName: playlist.snippet.channelTitle,
        channelId: playlist.snippet.channelId,
        itemCount: playlist.contentDetails.itemCount
      };
    } catch (error) {
      console.error('Error fetching playlist details:', error.message);
      throw new Error('Failed to fetch playlist details');
    }
  }

  /**
   * Get video duration in seconds
   */
  parseDuration(duration) {
    const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10) || 0;
    const minutes = parseInt(match[2] || '0', 10) || 0;
    const seconds = parseInt(match[3] || '0', 10) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Format video data
   */
  formatVideoData(video) {
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
      duration: this.parseDuration(video.contentDetails.duration),
      channelName: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      publishedAt: new Date(video.snippet.publishedAt),
      isAvailable: video.status.uploadStatus === 'processed'
    };
  }

  /**
   * Search videos
   */
  async searchVideos(query, maxResults = 10) {
    try {
      const response = await this.client.get('/search', {
        params: {
          q: query,
          part: 'snippet',
          maxResults,
          type: 'video',
          fields: 'items(id(videoId),snippet(title,description,thumbnails,channelTitle))'
        }
      });

      return response.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url,
        channelName: item.snippet.channelTitle
      }));
    } catch (error) {
      console.error('Error searching videos:', error.message);
      throw new Error('Failed to search videos');
    }
  }
}

module.exports = YouTubeService;
