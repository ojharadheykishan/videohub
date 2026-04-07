// Format duration in seconds to readable format
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

// Format date to readable format
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Extract video ID from various URL formats
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^?&\n]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract playlist ID from URL
export const extractPlaylistId = (url: string): string | null => {
  const pattern = /[?&]list=([^&\n]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

// Check if URL is valid YouTube URL
export const isValidYouTubeUrl = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?youtube\.com|youtu\.be/.test(url);
};

// Calculate watch percentage
export const calculateWatchPercentage = (watched: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(100, Math.round((watched / total) * 100));
};

// Format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
