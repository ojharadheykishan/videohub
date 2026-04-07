'use client';

import React from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiHome, FiPlay, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/utils/authStore';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64`}
      >
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            📹 VideoHub
          </Link>
        </div>

        <nav className="px-4 py-8 space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={onClose}
          >
            <FiHome className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link
            href="/library"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={onClose}
          >
            <FiPlay className="w-5 h-5" />
            <span>My Videos</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={onClose}
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          <hr className="my-4 border-gray-200 dark:border-gray-800" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
