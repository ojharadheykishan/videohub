import { useState, useCallback } from 'react';
import { useVideoStore } from '@/utils/videoStore';
import toast from 'react-hot-toast';

export const useVideo = () => {
  const store = useVideoStore();
  const [isAdding, setIsAdding] = useState(false);

  const addVideo = useCallback(
    async (videoUrl: string, folderId: string) => {
      setIsAdding(true);
      try {
        await store.addSingleVideo(videoUrl, folderId);
        toast.success('Video added successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to add video');
      } finally {
        setIsAdding(false);
      }
    },
    [store]
  );

  const addPlaylistVideos = useCallback(
    async (playlistUrl: string, customName?: string) => {
      setIsAdding(true);
      try {
        await store.addPlaylist(playlistUrl, customName);
        toast.success('Playlist added! Syncing videos...');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to add playlist');
      } finally {
        setIsAdding(false);
      }
    },
    [store]
  );

  return { ...store, addVideo, addPlaylistVideos, isAdding };
};
