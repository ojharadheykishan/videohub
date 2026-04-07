import { create } from 'zustand';
import apiClient from './api';

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  duration: number;
  channelName: string;
  videoId: string;
  completionPercentage: number;
  isFavorite: boolean;
  isAvailable: boolean;
  lastWatchedAt?: Date;
}

interface Folder {
  _id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  videoCount: number;
  type: 'custom' | 'playlist';
  isArchived: boolean;
  playlistId?: string;
}

interface VideoStore {
  folders: Folder[];
  currentFolder: Folder | null;
  videos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
  filters: {
    search?: string;
    favorite?: boolean;
    platform?: string;
  };

  // Actions
  fetchFolders: () => Promise<void>;
  fetchFolder: (folderId: string) => Promise<void>;
  fetchVideos: (filters?: any) => Promise<void>;
  createFolder: (name: string, description?: string) => Promise<Folder>;
  updateFolder: (folderId: string, data: Partial<Folder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  addPlaylist: (playlistUrl: string, customName?: string) => Promise<void>;
  addSingleVideo: (videoUrl: string, folderId: string) => Promise<Video>;
  updateWatchProgress: (videoId: string, percentage: number) => Promise<void>;
  toggleFavorite: (videoId: string) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  setCurrentVideo: (video: Video | null) => void;
  setFilters: (filters: any) => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  folders: [],
  currentFolder: null,
  videos: [],
  currentVideo: null,
  isLoading: false,
  filters: {},

  fetchFolders: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/folders');
      set({ folders: data.folders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchFolder: async (folderId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get(`/folders/${folderId}`);
      set({
        currentFolder: data.folder,
        videos: data.videos,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchVideos: async (filters) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/videos', { params: filters });
      set({ videos: data.videos, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createFolder: async (name: string, description?: string) => {
    try {
      const { data } = await apiClient.post('/folders', {
        name,
        description: description || '',
      });
      set((state) => ({
        folders: [...state.folders, data.folder],
      }));
      return data.folder;
    } catch (error) {
      throw error;
    }
  },

  updateFolder: async (folderId: string, folderData: Partial<Folder>) => {
    try {
      const { data } = await apiClient.put(`/folders/${folderId}`, folderData);
      set((state) => ({
        folders: state.folders.map((f) =>
          f._id === folderId ? data.folder : f
        ),
        currentFolder: state.currentFolder?._id === folderId ? data.folder : state.currentFolder,
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteFolder: async (folderId: string) => {
    try {
      await apiClient.delete(`/folders/${folderId}`);
      set((state) => ({
        folders: state.folders.filter((f) => f._id !== folderId),
        currentFolder: state.currentFolder?._id === folderId ? null : state.currentFolder,
      }));
    } catch (error) {
      throw error;
    }
  },

  addPlaylist: async (playlistUrl: string, customName?: string) => {
    try {
      await apiClient.post('/videos/add-playlist', {
        playlistUrl,
        customFolderName: customName,
      });
      // Refresh folders after adding
      await get().fetchFolders();
    } catch (error) {
      throw error;
    }
  },

  addSingleVideo: async (videoUrl: string, folderId: string) => {
    try {
      const { data } = await apiClient.post('/videos/add-single', {
        videoUrl,
        folderId,
      });
      set((state) => ({
        videos: [...state.videos, data.video],
      }));
      return data.video;
    } catch (error) {
      throw error;
    }
  },

  updateWatchProgress: async (videoId: string, percentage: number) => {
    try {
      const { data } = await apiClient.put(`/videos/${videoId}/progress`, {
        completionPercentage: percentage,
      });
      set((state) => ({
        videos: state.videos.map((v) =>
          v._id === videoId ? data.video : v
        ),
        currentVideo: state.currentVideo?._id === videoId ? data.video : state.currentVideo,
      }));
    } catch (error) {
      throw error;
    }
  },

  toggleFavorite: async (videoId: string) => {
    try {
      const { data } = await apiClient.put(`/videos/${videoId}/favorite`);
      set((state) => ({
        videos: state.videos.map((v) =>
          v._id === videoId ? data.video : v
        ),
        currentVideo: state.currentVideo?._id === videoId ? data.video : state.currentVideo,
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteVideo: async (videoId: string) => {
    try {
      await apiClient.delete(`/videos/${videoId}`);
      set((state) => ({
        videos: state.videos.filter((v) => v._id !== videoId),
      }));
    } catch (error) {
      throw error;
    }
  },

  setCurrentVideo: (video: Video | null) => {
    set({ currentVideo: video });
  },

  setFilters: (filters: any) => {
    set({ filters });
  },
}));
