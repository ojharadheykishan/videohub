import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/utils/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const store = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await store.login(email, password);
        toast.success('Login successful');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    },
    [store, router]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        await store.register(username, email, password);
        toast.success('Account created successfully');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
    [store, router]
  );

  const logout = useCallback(() => {
    store.logout();
    toast.success('Logged out');
    router.push('/login');
  }, [store, router]);

  return { ...store, login, register, logout };
};

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
