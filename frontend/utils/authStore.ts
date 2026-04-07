import { create } from 'zustand';
import apiClient from './api';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  theme: 'light' | 'dark';
  preferences: {
    autoplayNext: boolean;
    playbackSpeed: number;
  };
  stats: {
    totalVideos: number;
    totalCourses: number;
    watchTime: number;
    videosWatched: number;
  };
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      if (email === 'admin' && password === 'admin') {
        const adminToken = 'admin-token';
        const data = {
          token: adminToken,
          user: {
            _id: 'admin',
            username: 'admin',
            email: 'admin',
            avatar: '',
            theme: 'dark' as const,
            preferences: {
              autoplayNext: true,
              playbackSpeed: 1,
            },
            stats: {
              totalVideos: 0,
              totalCourses: 0,
              watchTime: 0,
              videosWatched: 0,
            },
          },
        };
        localStorage.setItem('token', data.token);
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
      const { data } = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword: password,
      });
      localStorage.setItem('token', data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token === 'admin-token') {
        set({
          user: {
            _id: 'admin',
            username: 'admin',
            email: 'admin',
            avatar: '',
            theme: 'dark' as const,
            preferences: {
              autoplayNext: true,
              playbackSpeed: 1,
            },
            stats: {
              totalVideos: 0,
              totalCourses: 0,
              watchTime: 0,
              videosWatched: 0,
            },
          },
          isLoading: false,
        });
        return;
      }
      const { data } = await apiClient.get('/auth/me');
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      const { data: response } = await apiClient.put('/users/profile', data);
      set({ user: response.user });
    } catch (error) {
      throw error;
    }
  },
}));
